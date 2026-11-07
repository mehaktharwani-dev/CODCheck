import { useState, useMemo, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { ReconciliationWorkspace } from './components/ReconciliationWorkspace';
import { DisputeGenerator } from './components/DisputeGenerator';
import { RateAuditorModal } from './components/RateAuditorModal';
import { StartupPlaybook } from './components/StartupPlaybook';
import { BatchUploader } from './components/BatchUploader';
import {
  KARACHI_APPAREL_ORDERS,
  KARACHI_APPAREL_COURIER_RECORDS,
  KARACHI_APPAREL_BANK_DEPOSIT,
  DEFAULT_TARIFF_RULES,
} from './data/sampleData';
import { runReconciliation } from './services/reconciliationEngine';
import {
  SellerOrder,
  CourierSettlementRecord,
  BankDepositRecord,
  CourierTariffRule,
} from './types/reconciliation';
import { ArrowRight, Sparkles, Building, AlertCircle, FileCheck2, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'reconcile' | 'disputes' | 'tariffs' | 'playbook'>('reconcile');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Active dataset state
  const [activeBatchKey, setActiveBatchKey] = useState<string>('karachi_full');
  const [orders, setOrders] = useState<SellerOrder[]>(KARACHI_APPAREL_ORDERS);
  const [settlements, setSettlements] = useState<CourierSettlementRecord[]>(KARACHI_APPAREL_COURIER_RECORDS);
  const [bankDeposit, setBankDeposit] = useState<BankDepositRecord | undefined>(KARACHI_APPAREL_BANK_DEPOSIT);
  const [tariffRules, setTariffRules] = useState<Record<string, CourierTariffRule>>(DEFAULT_TARIFF_RULES);

  // Disputed Item IDs set
  const [disputedItemIds, setDisputedItemIds] = useState<Set<string>>(new Set());

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Batch switching logic
  const handleSelectBatch = (key: string) => {
    setActiveBatchKey(key);
    if (key === 'prompt_5_case') {
      // The exact 5-order case study from prompt
      const fiveOrders = KARACHI_APPAREL_ORDERS.slice(0, 5);
      const fiveSettlements = KARACHI_APPAREL_COURIER_RECORDS.slice(0, 5);
      setOrders(fiveOrders);
      setSettlements(fiveSettlements);
      setBankDeposit({
        settlementBatchId: 'SB-TRX-2026-W44',
        bankName: 'Habib Bank Limited (HBL) - Karachi Cloth Market',
        depositDate: '2026-11-05',
        referenceNumber: 'FT263109924155',
        courierInvoiceAmount: 13700,
        actualAmountDeposited: 12900, // PKR 800 gap
      });
    } else if (key === 'lahore_tcs') {
      // TCS Batch
      const tcsOrders: SellerOrder[] = Array.from({ length: 45 }, (_, i) => ({
        orderId: `LHR-${500 + i}`,
        trackingNumber: `TCS-9900${10 + i}`,
        courier: 'TCS',
        customerName: `Customer ${i + 1}`,
        customerPhone: '0321-5550000',
        city: i % 2 === 0 ? 'Lahore' : 'Islamabad',
        destinationProvince: 'Punjab',
        codAmount: 3800,
        weightKg: 0.8,
        dispatchDate: '2026-11-01',
        productDescription: 'Handcrafted Leather Loafers',
      }));

      // TCS records with 2 missing orders and 3 weight creeps
      const tcsSettlements: CourierSettlementRecord[] = tcsOrders.slice(2).map((o, idx) => ({
        trackingNumber: o.trackingNumber,
        settlementBatchId: 'SB-TCS-LHR-91',
        settlementDate: '2026-11-05',
        courierStatus: 'delivered',
        billedWeightKg: idx < 3 ? 2.5 : 0.8, // 3 overcharges
        codCollected: 3800,
        deliveryFee: idx < 3 ? 480 : 320,
        returnFee: 0,
        fuelSurcharge: 30,
        taxAmount: 50,
        netPayableToSeller: 3800 - (idx < 3 ? 480 + 30 + 50 : 320 + 30 + 50),
        courierRemarks: 'Standard TCS disbursement',
      }));

      setOrders(tcsOrders);
      setSettlements(tcsSettlements);
      setBankDeposit({
        settlementBatchId: 'SB-TCS-LHR-91',
        bankName: 'Meezan Bank - Lahore DHA Branch',
        depositDate: '2026-11-06',
        referenceNumber: 'MZ26309811',
        courierInvoiceAmount: 142000,
        actualAmountDeposited: 140500, // PKR 1,500 difference
      });
    } else {
      // Default: Karachi full 100-order case
      setOrders(KARACHI_APPAREL_ORDERS);
      setSettlements(KARACHI_APPAREL_COURIER_RECORDS);
      setBankDeposit(KARACHI_APPAREL_BANK_DEPOSIT);
    }
  };

  // Run reconciliation calculation
  const { items, summary } = useMemo(() => {
    return runReconciliation(orders, settlements, bankDeposit, tariffRules);
  }, [orders, settlements, bankDeposit, tariffRules]);

  // Handle toggling items in dispute
  const handleToggleDisputeItem = (itemId: string) => {
    setDisputedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const handleUpdateRule = (courier: string, updated: CourierTariffRule) => {
    setTariffRules((prev) => ({
      ...prev,
      [courier]: updated,
    }));
  };

  const handleResetTariffDefaults = () => {
    setTariffRules(DEFAULT_TARIFF_RULES);
  };

  const handleApplyCustomData = (
    newOrders: SellerOrder[],
    newSettlements: CourierSettlementRecord[],
    newBankDeposit: BankDepositRecord,
    batchTitle: string
  ) => {
    setOrders(newOrders);
    setSettlements(newSettlements);
    setBankDeposit(newBankDeposit);
    setActiveBatchKey('custom_user');
    setActiveTab('reconcile');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* 3-Zone Top Bar */}
      <TopBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        disputeCount={summary.discrepancyCount}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onNewReconciliationClick={() => setIsUploadModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Context Hero Card (Shown only on Reconcile view) */}
        {activeTab === 'reconcile' && (
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Text side */}
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <span>Hawa Pret Karachi</span>
                    <span aria-hidden="true">·</span>
                    <span>100 Instagram Orders Reconciled</span>
                    <span aria-hidden="true">·</span>
                    <span>Trax & PostEx</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Recover Unpaid COD & Audit Courier Settlement Deductions
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                    Designed for Pakistani online and social-commerce sellers. CODCheck automatically cross-matches your dispatched orders against weekly courier settlement advice and bank deposits—pinpointing uncredited cash, inflated weight charges, and unrecorded deductions without needing Shopify or complex accounting ERPs.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <FileCheck2 className="w-4 h-4 text-emerald-600" />
                    <span>Exact CN Matching</span>
                  </div>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Bank Deposit Gap Audit</span>
                  </div>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>1-Click Trax & PostEx Dispute Letters</span>
                  </div>
                </div>
              </div>

              {/* Image side */}
              <div className="lg:col-span-5 relative min-h-[200px] lg:min-h-full overflow-hidden border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800">
                <img
                  src="/src/assets/images/hero_apparel_karachi_1794078943952.jpg"
                  alt="Packaging desk of an online apparel boutique in Karachi Pakistan with stacked parcel boxes and courier tracking receipts"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                  <p className="text-white text-xs font-medium">
                    Karachi apparel merchant packaging workstation · Weekly settlement cycle audit
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Routing */}
        {activeTab === 'reconcile' && (
          <ReconciliationWorkspace
            items={items}
            summary={summary}
            bankDeposit={bankDeposit}
            activeBatchName={activeBatchKey}
            onSelectBatch={handleSelectBatch}
            onOpenDisputePack={() => setActiveTab('disputes')}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            onToggleDisputeItem={handleToggleDisputeItem}
            disputedItemIds={disputedItemIds}
          />
        )}

        {activeTab === 'disputes' && (
          <DisputeGenerator
            items={items}
            bankDeposit={bankDeposit}
            disputedItemIds={disputedItemIds}
            onBackToReconciliation={() => setActiveTab('reconcile')}
            brandName="Hawa Pret Karachi"
          />
        )}

        {activeTab === 'tariffs' && (
          <RateAuditorModal
            tariffRules={tariffRules}
            onUpdateRule={handleUpdateRule}
            onResetDefaults={handleResetTariffDefaults}
          />
        )}

        {activeTab === 'playbook' && <StartupPlaybook />}
      </main>

      {/* Batch Upload Modal */}
      <BatchUploader
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onApplyCustomData={handleApplyCustomData}
      />

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800 dark:text-slate-200">CODCheck Pakistan</span>
            <span aria-hidden="true">·</span>
            <span>Courier Payment Reconciliation & Dispute Intelligence</span>
          </div>
          <div>
            Built for Pakistani social commerce merchants shipping with Trax, PostEx, TCS, and Leopards.
          </div>
        </div>
      </footer>
    </div>
  );
}
