export type CourierName = 'Trax' | 'PostEx' | 'TCS' | 'Leopards' | 'Call Courier' | 'M&P' | 'Swyft';

export type ShipmentStatus = 'delivered' | 'returned' | 'in_transit' | 'cancelled' | 'rto_in_transit' | 'fake_attempt';

export interface SellerOrder {
  orderId: string;
  trackingNumber: string;
  courier: CourierName;
  customerName: string;
  customerPhone: string;
  city: string;
  destinationProvince: 'Sindh' | 'Punjab' | 'KPK' | 'Balochistan' | 'Islamabad';
  codAmount: number; // in PKR
  weightKg: number;
  dispatchDate: string;
  productDescription: string;
}

export interface CourierSettlementRecord {
  trackingNumber: string;
  settlementBatchId: string;
  settlementDate: string;
  courierStatus: ShipmentStatus;
  billedWeightKg: number;
  codCollected: number;
  deliveryFee: number;
  returnFee: number;
  fuelSurcharge: number;
  taxAmount: number; // SRB, PRA, FED
  netPayableToSeller: number;
  courierRemarks?: string;
}

export interface BankDepositRecord {
  settlementBatchId: string;
  bankName: string;
  depositDate: string;
  referenceNumber: string;
  actualAmountDeposited: number;
  courierInvoiceAmount: number;
}

export type DiscrepancySeverity = 'critical' | 'warning' | 'info';

export type DiscrepancyType = 
  | 'delivered_unsettled'       // Marked delivered but zero payout / missing from settlement
  | 'weight_overcharge'         // Courier billed higher weight than seller dispatched
  | 'fee_overcharge'            // Shipping fee exceeds agreed tariff
  | 'bogus_rto_fee'             // Return fee deducted for delivered or seller-cancelled order
  | 'cod_amount_mismatch'       // Courier collected less than booked COD invoice
  | 'bank_deposit_shortfall'    // Courier invoice total != Actual bank account credit
  | 'unrecorded_shipment'       // Courier invoiced tracking ID not found in seller system
  | 'matched_clean';            // Perfect settlement match

export interface ReconciledItem {
  id: string;
  orderId: string;
  trackingNumber: string;
  courier: CourierName;
  customerName: string;
  city: string;
  expectedCod: number;
  actualCodCollected: number;
  expectedFees: number;
  actualFeesDeducted: number;
  expectedNet: number;
  actualNetSettled: number;
  difference: number; // positive = seller underpaid / owed money
  status: 'matched' | 'disputed' | 'under_review' | 'recovered' | 'unsettled';
  discrepancyType: DiscrepancyType;
  discrepancyReason: string;
  severity: DiscrepancySeverity;
  orderRecord?: SellerOrder;
  courierRecord?: CourierSettlementRecord;
}

export interface ReconciliationSummary {
  totalOrdersDispatched: number;
  totalDelivered: number;
  totalReturned: number;
  totalInTransit: number;
  totalCodExpected: number;
  totalCodCollected: number;
  totalFeesDeducted: number;
  expectedNetSettlement: number;
  courierSettlementInvoice: number;
  actualBankDeposit: number;
  unexplainedShortfall: number; // e.g. PKR 800 gap
  totalRecoverableAmount: number;
  discrepancyCount: number;
  cleanCount: number;
  recoveryRatePercent: number;
}

export interface CourierTariffRule {
  courier: CourierName;
  sameCityBaseFee: number; // up to 0.5kg
  interCityBaseFee: number; // up to 0.5kg
  additionalHalfKgRate: number;
  returnFeeRate: number;
  fuelSurchargePercent: number;
  taxPercent: number; // 13% for Sindh (SRB), 16% for Punjab (PRA)
}
