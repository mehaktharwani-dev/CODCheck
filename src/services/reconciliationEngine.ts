import {
  SellerOrder,
  CourierSettlementRecord,
  BankDepositRecord,
  ReconciledItem,
  ReconciliationSummary,
  CourierTariffRule,
  DiscrepancyType,
  DiscrepancySeverity,
} from '../types/reconciliation';
import { DEFAULT_TARIFF_RULES } from '../data/sampleData';

export function runReconciliation(
  orders: SellerOrder[],
  settlements: CourierSettlementRecord[],
  bankDeposit?: BankDepositRecord,
  customRules: Record<string, CourierTariffRule> = DEFAULT_TARIFF_RULES
): { items: ReconciledItem[]; summary: ReconciliationSummary } {
  const settlementMap = new Map<string, CourierSettlementRecord>();
  settlements.forEach((s) => {
    settlementMap.set(s.trackingNumber.trim().toUpperCase(), s);
  });

  const reconciledItems: ReconciledItem[] = [];
  const processedTrackingSet = new Set<string>();

  let totalDelivered = 0;
  let totalReturned = 0;
  let totalInTransit = 0;
  let totalCodExpected = 0;
  let totalCodCollected = 0;
  let totalFeesDeducted = 0;
  let expectedNetSettlement = 0;
  let courierSettlementInvoice = 0;
  let totalRecoverable = 0;
  let discrepancyCount = 0;
  let cleanCount = 0;

  // 1. Process all seller orders
  orders.forEach((order) => {
    const trackingKey = order.trackingNumber.trim().toUpperCase();
    processedTrackingSet.add(trackingKey);

    const settlement = settlementMap.get(trackingKey);
    const rule = customRules[order.courier] || DEFAULT_TARIFF_RULES.Trax;
    const isSameCity = order.city.toLowerCase().includes('karachi'); // seller base is Karachi
    const expectedBaseFee = isSameCity ? rule.sameCityBaseFee : rule.interCityBaseFee;
    const extraWeight = Math.max(0, Math.ceil((order.weightKg - 0.5) / 0.5));
    const expectedWeightFee = expectedBaseFee + extraWeight * rule.additionalHalfKgRate;
    const expectedFuel = Math.round(expectedWeightFee * (rule.fuelSurchargePercent / 100));
    const expectedTax = Math.round((expectedWeightFee + expectedFuel) * (rule.taxPercent / 100));
    const expectedDeliveryTotalFee = expectedWeightFee + expectedFuel + expectedTax;

    totalCodExpected += order.codAmount;

    // Case A: Order completely missing from courier settlement
    if (!settlement) {
      totalRecoverable += order.codAmount;
      discrepancyCount++;
      totalInTransit++;

      reconciledItems.push({
        id: `REC-${order.orderId}`,
        orderId: order.orderId,
        trackingNumber: order.trackingNumber,
        courier: order.courier,
        customerName: order.customerName,
        city: order.city,
        expectedCod: order.codAmount,
        actualCodCollected: 0,
        expectedFees: expectedDeliveryTotalFee,
        actualFeesDeducted: 0,
        expectedNet: order.codAmount - expectedDeliveryTotalFee,
        actualNetSettled: 0,
        difference: order.codAmount,
        status: 'unsettled',
        discrepancyType: 'delivered_unsettled',
        discrepancyReason: `Missing from courier settlement invoice. Parcel dispatched on ${order.dispatchDate} for PKR ${order.codAmount.toLocaleString()}. Customer reports delivered or pending payout.`,
        severity: 'critical',
        orderRecord: order,
      });
      return;
    }

    // Courier record exists
    const actualCod = settlement.codCollected;
    const actualFees = settlement.deliveryFee + settlement.returnFee + settlement.fuelSurcharge + settlement.taxAmount;
    const actualNet = settlement.netPayableToSeller;

    totalCodCollected += actualCod;
    totalFeesDeducted += actualFees;
    courierSettlementInvoice += actualNet;

    if (settlement.courierStatus === 'delivered') totalDelivered++;
    else if (settlement.courierStatus === 'returned') totalReturned++;
    else totalInTransit++;

    // Check discrepancy scenarios
    let discrepancyType: DiscrepancyType = 'matched_clean';
    let discrepancyReason = 'Matched with zero variance. Tariff, weight, and COD align with booking.';
    let severity: DiscrepancySeverity = 'info';
    let difference = 0;

    // Discrepancy 1: Short COD collected
    if (settlement.courierStatus === 'delivered' && actualCod < order.codAmount) {
      discrepancyType = 'cod_amount_mismatch';
      difference = order.codAmount - actualCod;
      discrepancyReason = `Short cash collection: Courier collected PKR ${actualCod.toLocaleString()} instead of booked invoice amount PKR ${order.codAmount.toLocaleString()} (Shortfall: PKR ${difference.toLocaleString()}).`;
      severity = 'critical';
      totalRecoverable += difference;
      discrepancyCount++;
    }
    // Discrepancy 2: Weight Overcharge
    else if (settlement.billedWeightKg > order.weightKg + 0.3) {
      discrepancyType = 'weight_overcharge';
      const excessFee = Math.max(0, settlement.deliveryFee - expectedBaseFee);
      difference = excessFee;
      discrepancyReason = `Volumetric weight overcharge: Dispatched as ${order.weightKg} kg, billed by courier as ${settlement.billedWeightKg} kg. Additional fee deducted: PKR ${excessFee.toLocaleString()}.`;
      severity = 'warning';
      totalRecoverable += excessFee;
      discrepancyCount++;
    }
    // Discrepancy 3: Bogus or inflated return fee
    else if (settlement.courierStatus === 'returned' && settlement.returnFee > rule.returnFeeRate + 20) {
      discrepancyType = 'bogus_rto_fee';
      difference = settlement.returnFee - rule.returnFeeRate;
      discrepancyReason = `Excessive return charge: Courier deducted PKR ${settlement.returnFee.toLocaleString()} for RTO. Agreed tariff is PKR ${rule.returnFeeRate.toLocaleString()} (Overcharge: PKR ${difference.toLocaleString()}).`;
      severity = 'warning';
      totalRecoverable += difference;
      discrepancyCount++;
    }
    // Discrepancy 4: General delivery fee higher than agreed tariff
    else if (settlement.deliveryFee > expectedWeightFee + 30) {
      discrepancyType = 'fee_overcharge';
      difference = settlement.deliveryFee - expectedWeightFee;
      discrepancyReason = `Base delivery fee PKR ${settlement.deliveryFee.toLocaleString()} exceeds agreed contracted tariff of PKR ${expectedWeightFee.toLocaleString()}.`;
      severity = 'warning';
      totalRecoverable += difference;
      discrepancyCount++;
    } else {
      cleanCount++;
    }

    const expectedNet = order.codAmount - expectedDeliveryTotalFee;
    expectedNetSettlement += (settlement.courierStatus === 'delivered' ? expectedNet : -settlement.returnFee);

    reconciledItems.push({
      id: `REC-${order.orderId}`,
      orderId: order.orderId,
      trackingNumber: order.trackingNumber,
      courier: order.courier,
      customerName: order.customerName,
      city: order.city,
      expectedCod: order.codAmount,
      actualCodCollected: actualCod,
      expectedFees: expectedDeliveryTotalFee,
      actualFeesDeducted: actualFees,
      expectedNet,
      actualNetSettled: actualNet,
      difference,
      status: discrepancyType === 'matched_clean' ? 'matched' : 'disputed',
      discrepancyType,
      discrepancyReason,
      severity,
      orderRecord: order,
      courierRecord: settlement,
    });
  });

  // 2. Identify unrecorded shipments (in courier invoice but seller has no record)
  settlements.forEach((s) => {
    const trackingKey = s.trackingNumber.trim().toUpperCase();
    if (!processedTrackingSet.has(trackingKey)) {
      discrepancyCount++;
      reconciledItems.push({
        id: `REC-GHOST-${s.trackingNumber}`,
        orderId: 'UNKNOWN',
        trackingNumber: s.trackingNumber,
        courier: 'Trax',
        customerName: 'Unrecorded',
        city: 'Unknown',
        expectedCod: 0,
        actualCodCollected: s.codCollected,
        expectedFees: 0,
        actualFeesDeducted: s.deliveryFee + s.returnFee,
        expectedNet: 0,
        actualNetSettled: s.netPayableToSeller,
        difference: s.deliveryFee + s.returnFee,
        status: 'under_review',
        discrepancyType: 'unrecorded_shipment',
        discrepancyReason: `Courier billed CN ${s.trackingNumber} on settlement, but no matching order exists in seller records.`,
        severity: 'warning',
        courierRecord: s,
      });
    }
  });

  // 3. Bank deposit reconciliation calculation
  const actualDeposit = bankDeposit ? bankDeposit.actualAmountDeposited : courierSettlementInvoice;
  const invoiceNet = bankDeposit ? bankDeposit.courierInvoiceAmount : courierSettlementInvoice;
  const unexplainedShortfall = Math.max(0, invoiceNet - actualDeposit);

  if (unexplainedShortfall > 0) {
    totalRecoverable += unexplainedShortfall;
  }

  const summary: ReconciliationSummary = {
    totalOrdersDispatched: orders.length,
    totalDelivered,
    totalReturned,
    totalInTransit,
    totalCodExpected,
    totalCodCollected,
    totalFeesDeducted,
    expectedNetSettlement,
    courierSettlementInvoice,
    actualBankDeposit: actualDeposit,
    unexplainedShortfall,
    totalRecoverableAmount: totalRecoverable,
    discrepancyCount,
    cleanCount,
    recoveryRatePercent: totalCodExpected > 0 ? Math.round(((totalCodExpected - totalRecoverable) / totalCodExpected) * 100) : 100,
  };

  return { items: reconciledItems, summary };
}

// Generate an official Dispute Email & Claim Packet for the Courier claims desk
export function generateDisputeLetter(
  sellerBrand: string,
  courierName: string,
  batchId: string,
  items: ReconciledItem[],
  bankDeposit?: BankDepositRecord
): { subject: string; body: string; csvContent: string } {
  const disputedItems = items.filter((i) => i.status === 'disputed' || i.discrepancyType !== 'matched_clean');
  const totalClaim = disputedItems.reduce((acc, curr) => acc + (curr.difference > 0 ? curr.difference : 0), 0);
  const bankGap = bankDeposit ? Math.max(0, bankDeposit.courierInvoiceAmount - bankDeposit.actualAmountDeposited) : 0;
  const grandTotal = totalClaim + bankGap;

  const subject = `[DISPUTE CLAIM] ${sellerBrand} — Payment Discrepancy & Missing Settlements — Batch ${batchId}`;

  const rowsText = disputedItems
    .slice(0, 8)
    .map(
      (item) =>
        `- CN #${item.trackingNumber} (Order ${item.orderId}): ${item.discrepancyReason} | Claim: PKR ${item.difference.toLocaleString()}`
    )
    .join('\n');

  const bankSection = bankGap > 0
    ? `\nBANK DEPOSIT SHORTFALL NOTICE:
Settlement Advice Net Payable: PKR ${bankDeposit?.courierInvoiceAmount.toLocaleString()}
Actual Deposit in ${bankDeposit?.bankName}: PKR ${bankDeposit?.actualAmountDeposited.toLocaleString()}
Ref/FT: ${bankDeposit?.referenceNumber}
Unexplained Bank Shortfall: PKR ${bankGap.toLocaleString()} (Please furnish bank credit confirmation or reversal receipt).\n`
    : '';

  const body = `Dear ${courierName} Merchant Support / Finance Team,

I am writing on behalf of ${sellerBrand} regarding our recent COD settlement batch (${batchId}). 

Following our internal automated audit via CODCheck reconciliation software, we have identified discrepancies totaling PKR ${grandTotal.toLocaleString()} requiring immediate review, rectification, and credit adjustment.

SUMMARY OF EXCEPTIONS:
- Total Disputed Consignments: ${disputedItems.length}
- Missing / Unsettled Delivered Orders: ${disputedItems.filter((i) => i.discrepancyType === 'delivered_unsettled').length}
- Weight / Rate Overcharges: ${disputedItems.filter((i) => i.discrepancyType === 'weight_overcharge' || i.discrepancyType === 'fee_overcharge').length}
- Return / Shortfall Exceptions: ${disputedItems.filter((i) => i.discrepancyType === 'bogus_rto_fee' || i.discrepancyType === 'cod_amount_mismatch').length}
${bankSection}
SPECIFIC ITEM DETAILS:
${rowsText}
${disputedItems.length > 8 ? `...and ${disputedItems.length - 8} additional consignments itemized in the attached CSV claim sheet.` : ''}

REQUIRED ACTION:
1. Provide proof of delivery / uncredited cash status for the missing CNs listed above.
2. Re-rate volumetric calculations to agreed contracted tare weights.
3. Credit the total discrepancy amount of PKR ${grandTotal.toLocaleString()} into our upcoming weekly settlement cycle.

Please confirm receipt of this claim and provide your dispute ticket number within 48 hours.

Sincerely,
Finance & Operations Desk
${sellerBrand}
Karachi, Pakistan`;

  // CSV Generator
  const csvHeaders = ['Tracking_CN', 'Order_ID', 'Customer', 'City', 'Discrepancy_Type', 'Expected_PKR', 'Settled_PKR', 'Claim_Difference_PKR', 'Reason'];
  const csvRows = disputedItems.map((i) => [
    `"${i.trackingNumber}"`,
    `"${i.orderId}"`,
    `"${i.customerName}"`,
    `"${i.city}"`,
    `"${i.discrepancyType}"`,
    i.expectedCod || i.expectedFees,
    i.actualCodCollected || i.actualFeesDeducted,
    i.difference,
    `"${i.discrepancyReason.replace(/"/g, '""')}"`,
  ]);

  const csvContent = [csvHeaders.join(','), ...csvRows.map((r) => r.join(','))].join('\n');

  return { subject, body, csvContent };
}
