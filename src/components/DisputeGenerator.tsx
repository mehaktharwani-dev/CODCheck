import { useState, useMemo } from 'react';
import {
  Check,
  Copy,
  Download,
  FileText,
  Mail,
  Printer,
  ShieldAlert,
  ArrowLeft,
  Building,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { ReconciledItem, BankDepositRecord } from '../types/reconciliation';
import { generateDisputeLetter } from '../services/reconciliationEngine';

interface DisputeGeneratorProps {
  items: ReconciledItem[];
  bankDeposit?: BankDepositRecord;
  disputedItemIds: Set<string>;
  onBackToReconciliation: () => void;
  brandName: string;
}

export function DisputeGenerator({
  items,
  bankDeposit,
  disputedItemIds,
  onBackToReconciliation,
  brandName,
}: DisputeGeneratorProps) {
  const [copied, setCopied] = useState(false);
  const [ticketStatus, setTicketStatus] = useState<'draft' | 'submitted' | 'investigating' | 'resolved'>('draft');
  const [ticketNumber, setTicketNumber] = useState('TRX-CLM-2026-9041');
  const [selectedCourier, setSelectedCourier] = useState('Trax Logistics');

  // Filter items in dispute
  const itemsForDispute = useMemo(() => {
    return items.filter((i) => disputedItemIds.has(i.id) || i.discrepancyType !== 'matched_clean');
  }, [items, disputedItemIds]);

  const { subject, body, csvContent } = useMemo(() => {
    return generateDisputeLetter(brandName, selectedCourier, 'SB-2026-W44', itemsForDispute, bankDeposit);
  }, [brandName, selectedCourier, itemsForDispute, bankDeposit]);

  const totalClaimAmount = useMemo(() => {
    const itemClaim = itemsForDispute.reduce((acc, curr) => acc + (curr.difference > 0 ? curr.difference : 0), 0);
    const bankGap = bankDeposit ? Math.max(0, bankDeposit.courierInvoiceAmount - bankDeposit.actualAmountDeposited) : 0;
    return itemClaim + bankGap;
  }, [itemsForDispute, bankDeposit]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(`SUBJECT: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const downloadDisputeCsv = () => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Courier_Dispute_Claim_${brandName.replace(/\s+/g, '_')}_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header with back link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToReconciliation}
            className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Return to Reconciliation Ledger"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Dispute Pack</span>
              <span aria-hidden="true">·</span>
              <span>Merchant Recovery</span>
              <span aria-hidden="true">·</span>
              <span className="font-semibold text-rose-600 dark:text-rose-400">
                PKR {totalClaimAmount.toLocaleString()} Claimed
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Courier Payment Enquiry & Claim Generator
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={downloadDisputeCsv}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV Claim</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleCopyEmail}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Claim!' : 'Copy Claim Email'}</span>
          </button>
        </div>
      </div>

      {/* Grid: Claim Details & Email Draft */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Claim Status & Items breakdown */}
        <div className="space-y-5">
          {/* Status Tracker */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
              Claim Lifecycle Status
            </h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Current Phase:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                  {ticketStatus}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Claim Reference:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">
                  {ticketNumber}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Total Under Recovery:</span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                  PKR {totalClaimAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
              {(['draft', 'submitted', 'investigating', 'resolved'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setTicketStatus(st)}
                  className={`flex-1 py-1 text-[11px] font-medium rounded capitalize transition-colors ${
                    ticketStatus === st
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Courier Support Contacts in Pakistan */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Courier Claims Desks (Pakistan)
            </h2>
            <div className="space-y-2 text-xs">
              <div
                onClick={() => setSelectedCourier('Trax Logistics')}
                className={`p-2.5 rounded-lg border cursor-pointer transition-colors ${
                  selectedCourier.includes('Trax')
                    ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                  <span>Trax Logistics</span>
                  <span className="text-[11px] text-slate-500">merchantcare@trax.pk</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Phone: 021-111-118-729 · COD Payout: Every Tue / Fri
                </p>
              </div>

              <div
                onClick={() => setSelectedCourier('PostEx')}
                className={`p-2.5 rounded-lg border cursor-pointer transition-colors ${
                  selectedCourier.includes('PostEx')
                    ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                  <span>PostEx</span>
                  <span className="text-[11px] text-slate-500">merchants@postex.pk</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Phone: 042-111-767-839 · Upfront COD Financing
                </p>
              </div>

              <div
                onClick={() => setSelectedCourier('TCS Courier')}
                className={`p-2.5 rounded-lg border cursor-pointer transition-colors ${
                  selectedCourier.includes('TCS')
                    ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                  <span>TCS Express</span>
                  <span className="text-[11px] text-slate-500">cod.support@tcs.com.pk</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Phone: 021-111-123-456 · Weekly reconciliation cycle
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats of Disputed Consignments */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Claim Composition
            </h2>
            <div className="space-y-2 text-xs divide-y divide-slate-100 dark:divide-slate-800">
              <div className="pt-1 flex items-center justify-between">
                <span className="text-slate-500">Missing Delivered Payouts:</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400">
                  {itemsForDispute.filter((i) => i.discrepancyType === 'delivered_unsettled').length} parcels
                </span>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-slate-500">Weight & Rate Creep:</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {itemsForDispute.filter((i) => i.discrepancyType === 'weight_overcharge' || i.discrepancyType === 'fee_overcharge').length} parcels
                </span>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-slate-500">Return Fee Overcharges:</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {itemsForDispute.filter((i) => i.discrepancyType === 'bogus_rto_fee').length} parcels
                </span>
              </div>
              {bankDeposit && (
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-slate-500">Unexplained Bank Gap:</span>
                  <span className="font-semibold text-rose-600 dark:text-rose-400 font-mono-numbers">
                    PKR {(bankDeposit.courierInvoiceAmount - bankDeposit.actualAmountDeposited).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Email Preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  Formal Dispute Letter Draft
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Ready for Trax / PostEx Claims
              </span>
            </div>

            {/* Subject Line */}
            <div className="py-3 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Subject: </span>
              <span className="font-mono text-slate-900 dark:text-slate-100 font-medium">
                {subject}
              </span>
            </div>

            {/* Body */}
            <div className="py-3">
              <textarea
                readOnly
                value={body}
                rows={18}
                className="w-full text-xs font-mono leading-relaxed bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 p-3 rounded-lg border border-slate-200 dark:border-slate-700 focus:outline-none resize-none"
              />
            </div>

            {/* Copy CTA */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                Attaches complete CN audit trail with customer contact details and dispatch weights.
              </span>
              <button
                onClick={handleCopyEmail}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Email Body'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
