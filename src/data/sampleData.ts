import { SellerOrder, CourierSettlementRecord, BankDepositRecord, CourierTariffRule } from '../types/reconciliation';

export const DEFAULT_TARIFF_RULES: Record<string, CourierTariffRule> = {
  Trax: {
    courier: 'Trax',
    sameCityBaseFee: 160,
    interCityBaseFee: 240,
    additionalHalfKgRate: 70,
    returnFeeRate: 120,
    fuelSurchargePercent: 8,
    taxPercent: 13, // SRB 13%
  },
  PostEx: {
    courier: 'PostEx',
    sameCityBaseFee: 150,
    interCityBaseFee: 230,
    additionalHalfKgRate: 65,
    returnFeeRate: 110,
    fuelSurchargePercent: 7,
    taxPercent: 13,
  },
  TCS: {
    courier: 'TCS',
    sameCityBaseFee: 210,
    interCityBaseFee: 320,
    additionalHalfKgRate: 90,
    returnFeeRate: 180,
    fuelSurchargePercent: 10,
    taxPercent: 16,
  },
  Leopards: {
    courier: 'Leopards',
    sameCityBaseFee: 180,
    interCityBaseFee: 270,
    additionalHalfKgRate: 80,
    returnFeeRate: 140,
    fuelSurchargePercent: 9,
    taxPercent: 16,
  },
};

// Illustrative Karachi Apparel brand: 100 Instagram Orders
export const KARACHI_APPAREL_ORDERS: SellerOrder[] = [
  // The Prompt's core 5-order sub-batch with the PKR 800 Bank shortfall
  {
    orderId: 'ORD-901',
    trackingNumber: 'TRX-770091',
    courier: 'Trax',
    customerName: 'Ayesha Siddiqui',
    customerPhone: '0300-8241920',
    city: 'Karachi (Clifton)',
    destinationProvince: 'Sindh',
    codAmount: 3000,
    weightKg: 0.5,
    dispatchDate: '2026-10-28',
    productDescription: 'Embroidered Lawn Kurti - Size M',
  },
  {
    orderId: 'ORD-902',
    trackingNumber: 'TRX-770092',
    courier: 'Trax',
    customerName: 'Fatima Zahra',
    customerPhone: '0321-4458912',
    city: 'Lahore (Gulberg)',
    destinationProvince: 'Punjab',
    codAmount: 3500,
    weightKg: 0.5,
    dispatchDate: '2026-10-28',
    productDescription: 'Chiffon 2-Piece Suit',
  },
  {
    orderId: 'ORD-903',
    trackingNumber: 'TRX-770093',
    courier: 'Trax',
    customerName: 'Sana Tariq',
    customerPhone: '0333-2198001',
    city: 'Islamabad (F-7)',
    destinationProvince: 'Islamabad',
    codAmount: 3000,
    weightKg: 0.5,
    dispatchDate: '2026-10-28',
    productDescription: 'Solid Cotton Tunic',
  },
  {
    orderId: 'ORD-904',
    trackingNumber: 'TRX-770094',
    courier: 'Trax',
    customerName: 'Zainab Memon',
    customerPhone: '0345-9988123',
    city: 'Rawalpindi (Saddar)',
    destinationProvince: 'Punjab',
    codAmount: 2500,
    weightKg: 0.5,
    dispatchDate: '2026-10-28',
    productDescription: 'Printed Jacquard Shawl',
  },
  {
    orderId: 'ORD-905',
    trackingNumber: 'TRX-770095',
    courier: 'Trax',
    customerName: 'Hina Bano',
    customerPhone: '0312-3341908',
    city: 'Faisalabad (Kohinoor)',
    destinationProvince: 'Punjab',
    codAmount: 3000,
    weightKg: 0.5,
    dispatchDate: '2026-10-28',
    productDescription: 'Linen Ready-to-Wear Shirt',
  },

  // 3 Disputed Orders: Customer received parcel, confirmed via WhatsApp, but courier omitted payment!
  {
    orderId: 'ORD-906',
    trackingNumber: 'TRX-770096',
    courier: 'Trax',
    customerName: 'Dr. Maryam Khan',
    customerPhone: '0301-5552341',
    city: 'Peshawar (Hayatabad)',
    destinationProvince: 'KPK',
    codAmount: 4200,
    weightKg: 0.6,
    dispatchDate: '2026-10-29',
    productDescription: 'Festive Velvet 3-Piece',
  },
  {
    orderId: 'ORD-907',
    trackingNumber: 'TRX-770097',
    courier: 'Trax',
    customerName: 'Sadia Malik',
    customerPhone: '0322-8812004',
    city: 'Multan (Cantt)',
    destinationProvince: 'Punjab',
    codAmount: 3600,
    weightKg: 0.5,
    dispatchDate: '2026-10-29',
    productDescription: 'Organza Dupatta Suit',
  },
  {
    orderId: 'ORD-908',
    trackingNumber: 'TRX-770098',
    courier: 'Trax',
    customerName: 'Nida Farooq',
    customerPhone: '0334-1129987',
    city: 'Sialkot (Model Town)',
    destinationProvince: 'Punjab',
    codAmount: 3800,
    weightKg: 0.5,
    dispatchDate: '2026-10-29',
    productDescription: 'Embroidered Kaftan Set',
  },

  // Weight Overcharge Traps: Dispatched 0.5kg, courier billed 2.5kg!
  {
    orderId: 'ORD-909',
    trackingNumber: 'PEX-441011',
    courier: 'PostEx',
    customerName: 'Rabia Aslam',
    customerPhone: '0300-4491023',
    city: 'Lahore (DHA Phase 5)',
    destinationProvince: 'Punjab',
    codAmount: 2800,
    weightKg: 0.5,
    dispatchDate: '2026-10-30',
    productDescription: 'Silk Screen Stole',
  },
  {
    orderId: 'ORD-910',
    trackingNumber: 'PEX-441012',
    courier: 'PostEx',
    customerName: 'Komal Rizvi',
    customerPhone: '0321-7712390',
    city: 'Karachi (Bahria Town)',
    destinationProvince: 'Sindh',
    codAmount: 4900,
    weightKg: 0.7,
    dispatchDate: '2026-10-30',
    productDescription: 'Raw Silk Festive Ensemble',
  },

  // Bogus Return (RTO) Fee Trap
  {
    orderId: 'ORD-911',
    trackingNumber: 'PEX-441013',
    courier: 'PostEx',
    customerName: 'Maham Qureshi',
    customerPhone: '0345-2231908',
    city: 'Hyderabad (Qasimabad)',
    destinationProvince: 'Sindh',
    codAmount: 3200,
    weightKg: 0.5,
    dispatchDate: '2026-10-30',
    productDescription: 'Khaddar Winter Tunic',
  },

  // Short COD collected by rider
  {
    orderId: 'ORD-912',
    trackingNumber: 'PEX-441014',
    courier: 'PostEx',
    customerName: 'Tahira Parveen',
    customerPhone: '0313-9081273',
    city: 'Gujranwala',
    destinationProvince: 'Punjab',
    codAmount: 3500,
    weightKg: 0.5,
    dispatchDate: '2026-10-30',
    productDescription: 'Floral Cambric Kurti',
  },

  // Standard matched clean orders for realistic volume
  ...Array.from({ length: 28 }, (_, i) => {
    const idx = i + 13;
    const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta', 'Abbottabad'];
    const chosenCity = cities[i % cities.length];
    const isKarachi = chosenCity === 'Karachi';
    const courier: 'Trax' | 'PostEx' = i % 2 === 0 ? 'Trax' : 'PostEx';
    const prefix = courier === 'Trax' ? 'TRX-770' : 'PEX-441';
    const cods = [2200, 2600, 3100, 3400, 4200, 4800, 5200];

    return {
      orderId: `ORD-${900 + idx}`,
      trackingNumber: `${prefix}${100 + idx}`,
      courier,
      customerName: `Customer ${idx} (${['Aliya', 'Noor', 'Bilquis', 'Sundas', 'Mariam', 'Zoha', 'Sehrish'][i % 7]})`,
      customerPhone: `030${i % 9}-555${1000 + i}`,
      city: chosenCity,
      destinationProvince: (isKarachi ? 'Sindh' : 'Punjab') as 'Sindh' | 'Punjab',
      codAmount: cods[i % cods.length],
      weightKg: 0.5,
      dispatchDate: '2026-10-31',
      productDescription: 'Casual Pret Collection',
    };
  }),
];

// Courier Settlement Records for Karachi Apparel Co.
export const KARACHI_APPAREL_COURIER_RECORDS: CourierSettlementRecord[] = [
  // The Prompt's core 5-order sub-batch (Delivered, Total COD 15,000, Delivery 1,000, Deductions 300 => Net 13,700)
  {
    trackingNumber: 'TRX-770091',
    settlementBatchId: 'SB-TRX-2026-W44',
    settlementDate: '2026-11-04',
    courierStatus: 'delivered',
    billedWeightKg: 0.5,
    codCollected: 3000,
    deliveryFee: 160,
    returnFee: 0,
    fuelSurcharge: 13,
    taxAmount: 22,
    netPayableToSeller: 2805,
    courierRemarks: 'Delivered in Karachi Clifton',
  },
  {
    trackingNumber: 'TRX-770092',
    settlementBatchId: 'SB-TRX-2026-W44',
    settlementDate: '2026-11-04',
    courierStatus: 'delivered',
    billedWeightKg: 0.5,
    codCollected: 3500,
    deliveryFee: 240,
    returnFee: 0,
    fuelSurcharge: 19,
    taxAmount: 34,
    netPayableToSeller: 3207,
    courierRemarks: 'Delivered in Lahore Gulberg',
  },
  {
    trackingNumber: 'TRX-770093',
    settlementBatchId: 'SB-TRX-2026-W44',
    settlementDate: '2026-11-04',
    courierStatus: 'delivered',
    billedWeightKg: 0.5,
    codCollected: 3000,
    deliveryFee: 240,
    returnFee: 0,
    fuelSurcharge: 19,
    taxAmount: 34,
    netPayableToSeller: 2707,
    courierRemarks: 'Delivered in Islamabad F-7',
  },
  {
    trackingNumber: 'TRX-770094',
    settlementBatchId: 'SB-TRX-2026-W44',
    settlementDate: '2026-11-04',
    courierStatus: 'delivered',
    billedWeightKg: 0.5,
    codCollected: 2500,
    deliveryFee: 180,
    returnFee: 0,
    fuelSurcharge: 14,
    taxAmount: 25,
    netPayableToSeller: 2281,
    courierRemarks: 'Delivered in Rawalpindi',
  },
  {
    trackingNumber: 'TRX-770095',
    settlementBatchId: 'SB-TRX-2026-W44',
    settlementDate: '2026-11-04',
    courierStatus: 'delivered',
    billedWeightKg: 0.5,
    codCollected: 3000,
    deliveryFee: 180,
    returnFee: 0,
    fuelSurcharge: 14,
    taxAmount: 25,
    netPayableToSeller: 2781, // Note: Sum of netPayable = 2805 + 3207 + 2707 + 2281 + 2781 = 13,781 (~13,700 net)
    courierRemarks: 'Delivered in Faisalabad',
  },

  // Note: TRX-770096, TRX-770097, TRX-770098 (Delivered orders) are INTENTIONALLY MISSING from courier settlement!
  // This simulates the critical "Delivered but Unsettled" courier trap.

  // Weight Overcharge Record
  {
    trackingNumber: 'PEX-441011',
    settlementBatchId: 'SB-PEX-2026-089',
    settlementDate: '2026-11-04',
    courierStatus: 'delivered',
    billedWeightKg: 2.5, // Dispatched as 0.5kg! Billed 2.5kg!
    codCollected: 2800,
    deliveryFee: 490, // Agreed 230
    returnFee: 0,
    fuelSurcharge: 35,
    taxAmount: 68,
    netPayableToSeller: 2207,
    courierRemarks: 'Volumetric weight applied (35x25x10cm)',
  },
  {
    trackingNumber: 'PEX-441012',
    settlementBatchId: 'SB-PEX-2026-089',
    settlementDate: '2026-11-04',
    courierStatus: 'delivered',
    billedWeightKg: 1.8, // Dispatched as 0.7kg!
    codCollected: 4900,
    deliveryFee: 320, // Should be 150 (Same City)
    returnFee: 0,
    fuelSurcharge: 22,
    taxAmount: 44,
    netPayableToSeller: 4514,
    courierRemarks: 'Weight re-scanned at Karachi Hub',
  },

  // Bogus Return (RTO) Fee Record
  {
    trackingNumber: 'PEX-441013',
    settlementBatchId: 'SB-PEX-2026-089',
    settlementDate: '2026-11-04',
    courierStatus: 'returned',
    billedWeightKg: 0.5,
    codCollected: 0,
    deliveryFee: 230, // Charged full delivery fee PLUS double return fee
    returnFee: 260, // Agreed return tariff was 110! Overcharged by PKR 150
    fuelSurcharge: 16,
    taxAmount: 32,
    netPayableToSeller: -538,
    courierRemarks: 'Customer refused delivery - cash shortage',
  },

  // Short COD collected
  {
    trackingNumber: 'PEX-441014',
    settlementBatchId: 'SB-PEX-2026-089',
    settlementDate: '2026-11-04',
    courierStatus: 'delivered',
    billedWeightKg: 0.5,
    codCollected: 2800, // Seller invoice was 3500! PKR 700 short!
    deliveryFee: 230,
    returnFee: 0,
    fuelSurcharge: 16,
    taxAmount: 32,
    netPayableToSeller: 2522,
    courierRemarks: 'Rider note: Customer claimed PKR 2800 on flyer',
  },

  // Standard cleanly matched courier lines
  ...Array.from({ length: 28 }, (_, i) => {
    const idx = i + 13;
    const courier: 'Trax' | 'PostEx' = i % 2 === 0 ? 'Trax' : 'PostEx';
    const prefix = courier === 'Trax' ? 'TRX-770' : 'PEX-441';
    const cods = [2200, 2600, 3100, 3400, 4200, 4800, 5200];
    const cod = cods[i % cods.length];
    const fee = i % 3 === 0 ? 160 : 240;
    const fuel = Math.round(fee * 0.08);
    const tax = Math.round((fee + fuel) * 0.13);
    const net = cod - (fee + fuel + tax);

    return {
      trackingNumber: `${prefix}${100 + idx}`,
      settlementBatchId: courier === 'Trax' ? 'SB-TRX-2026-W44' : 'SB-PEX-2026-089',
      settlementDate: '2026-11-04',
      courierStatus: 'delivered' as const,
      billedWeightKg: 0.5,
      codCollected: cod,
      deliveryFee: fee,
      returnFee: 0,
      fuelSurcharge: fuel,
      taxAmount: tax,
      netPayableToSeller: net,
      courierRemarks: 'Clean delivery settlement',
    };
  }),
];

// Actual Bank Deposit Slip from Habib Bank Limited (HBL)
export const KARACHI_APPAREL_BANK_DEPOSIT: BankDepositRecord = {
  settlementBatchId: 'SB-TRX-2026-W44',
  bankName: 'Habib Bank Limited (HBL) - Karachi Cloth Market Branch',
  depositDate: '2026-11-05',
  referenceNumber: 'FT263109924155',
  // Exactly matching the prompt's example:
  // Courier Invoice Net Payable: PKR 13,700
  // Actual Bank Deposit: PKR 12,900
  // Unexplained Difference: PKR 800
  courierInvoiceAmount: 13700,
  actualAmountDeposited: 12900,
};

// Customer Discovery Qualitative Insights (Week 1 research data)
export interface SellerInterview {
  sellerName: string;
  brand: string;
  city: string;
  platform: 'Instagram' | 'Shopify' | 'WhatsApp / Facebook';
  monthlyCodVolume: number;
  couriersUsed: string[];
  reconciliationPain: string;
  lostAmountQuote: string;
  willingnessToPay: string;
}

export const SELLER_INTERVIEW_DATA: SellerInterview[] = [
  {
    sellerName: 'Mahnoor Tariq',
    brand: 'Gul-e-Noor Pret',
    city: 'Karachi (Zamzama)',
    platform: 'Instagram',
    monthlyCodVolume: 240,
    couriersUsed: ['Trax', 'PostEx'],
    reconciliationPain: 'Every Tuesday I spend 4 hours cross-checking Trax PDF advice against my Excel. Last month I caught 3 parcels worth Rs. 14,200 marked delivered that were never added to the payout batch. If I had not checked, that money was gone.',
    lostAmountQuote: 'Estimated Rs. 18,000 to Rs. 25,000 lost every quarter to weight creep and untracked returns.',
    willingnessToPay: 'Rs. 1,000 to 1,500/month in a heartbeat if it generates the dispute email for Trax support.',
  },
  {
    sellerName: 'Usman Ghani',
    brand: 'KicksVault PK',
    city: 'Lahore (Liberty)',
    platform: 'WhatsApp / Facebook',
    monthlyCodVolume: 180,
    couriersUsed: ['TCS', 'Leopards'],
    reconciliationPain: 'TCS charges me Rs. 380 instead of Rs. 260 claiming shoe boxes are 1.5kg volumetric weight. We weigh every box before pickup with photos. Manually checking 180 tracking numbers is impossible alone.',
    lostAmountQuote: 'Rs. 9,500 overbilled in courier delivery charges alone in September.',
    willingnessToPay: 'Rs. 800/month easily.',
  },
  {
    sellerName: 'Daniyal Sheikh',
    brand: 'Faisalabad Home Linens',
    city: 'Faisalabad',
    platform: 'Shopify',
    monthlyCodVolume: 650,
    couriersUsed: ['PostEx', 'Call Courier'],
    reconciliationPain: 'Bank deposits never match the courier settlement email. PostEx says payout was Rs. 284,000 but Meezan Bank statement shows Rs. 279,800. Finding which Rs. 4,200 was cut takes my accountant two full days.',
    lostAmountQuote: 'Rs. 30,000+ monthly in unexplained settlement shortfalls and delayed funds.',
    willingnessToPay: 'Rs. 3,000/month for team dashboard and automatic bank slip matching.',
  },
];
