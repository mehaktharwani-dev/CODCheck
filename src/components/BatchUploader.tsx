import { useState } from 'react';
import {
  FileUp,
  X,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Building2,
} from 'lucide-react';
import { SellerOrder, CourierSettlementRecord, BankDepositRecord } from '../types/reconciliation';

interface BatchUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCustomData: (
    orders: SellerOrder[],
    settlements: CourierSettlementRecord[],
    bankDeposit: BankDepositRecord,
    batchTitle: string
  ) => void;
}

export function BatchUploader({
  isOpen,
  onClose,
  onApplyCustomData,
}: BatchUploaderProps) {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Custom data state
  const [ordersCsv, setOrdersCsv] = useState<string>(`OrderId,TrackingNumber,Courier,CustomerName,City,CODAmount,WeightKg
ORD-701,TRX-88001,Trax,Huma Naz,Karachi,3200,0.5
ORD-702,TRX-88002,Trax,Bilal Ahmed,Lahore,4500,0.5
ORD-703,TRX-88003,Trax,Sara Khan,Islamabad,2800,0.5
ORD-704,TRX-88004,Trax,Adeel Rauf,Faisalabad,3600,0.5
ORD-705,TRX-88005,Trax,Mehwish Ali,Multan,3000,0.5`);

  const [courierCsv, setCourierCsv] = useState<string>(`TrackingNumber,Status,WeightKg,CODCollected,DeliveryFee,ReturnFee,NetPayable
TRX-88001,delivered,0.5,3200,160,0,3005
TRX-88002,delivered,2.2,4500,420,0,3980
TRX-88004,returned,0.5,0,240,240,-520
TRX-88005,delivered,0.5,3000,180,0,2780`); // TRX-88003 intentionally omitted to simulate delivered & unpaid order

  const [bankName, setBankName] = useState('Meezan Bank - Karachi Gulshan Branch');
  const [refNumber, setRefNumber] = useState('FT26315582910');
  const [invoiceAmount, setInvoiceAmount] = useState<number>(9765);
  const [actualDeposit, setActualDeposit] = useState<number>(8965); // PKR 800 gap
  const [batchTitle, setBatchTitle] = useState('My Custom Weekly Batch (Karachi Store)');

  if (!isOpen) return null;

  const handleDownloadSampleSellerCsv = () => {
    const sample = `OrderId,TrackingNumber,Courier,CustomerName,City,CODAmount,WeightKg
ORD-101,TRX-77001,Trax,Ayesha Khan,Karachi,3500,0.5
ORD-102,TRX-77002,Trax,Zainab Malik,Lahore,4200,0.5
ORD-103,TRX-77003,Trax,Sadia Tariq,Islamabad,2900,0.5`;
    const blob = new Blob([sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample_seller_orders.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSampleCourierCsv = () => {
    const sample = `TrackingNumber,Status,WeightKg,CODCollected,DeliveryFee,ReturnFee,NetPayable
TRX-77001,delivered,0.5,3500,160,0,3300
TRX-77002,delivered,0.5,4200,240,0,3900`;
    const blob = new Blob([sample], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample_courier_settlement.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleProcessAndRun = () => {
    // Parse Orders
    const parsedOrders: SellerOrder[] = [];
    const orderLines = ordersCsv.trim().split('\n');
    for (let i = 1; i < orderLines.length; i++) {
      const parts = orderLines[i].split(',').map((p) => p.trim());
      if (parts.length >= 6) {
        parsedOrders.push({
          orderId: parts[0] || `ORD-${i}`,
          trackingNumber: parts[1] || `TRX-${i}`,
          courier: (parts[2] as any) || 'Trax',
          customerName: parts[3] || 'Customer',
          customerPhone: '0300-1234567',
          city: parts[4] || 'Karachi',
          destinationProvince: parts[4]?.toLowerCase().includes('karachi') ? 'Sindh' : 'Punjab',
          codAmount: Number(parts[5]) || 0,
          weightKg: Number(parts[6]) || 0.5,
          dispatchDate: new Date().toISOString().split('T')[0],
          productDescription: 'Standard Apparel Goods',
        });
      }
    }

    // Parse Courier Settlement
    const parsedSettlements: CourierSettlementRecord[] = [];
    const courierLines = courierCsv.trim().split('\n');
    for (let i = 1; i < courierLines.length; i++) {
      const parts = courierLines[i].split(',').map((p) => p.trim());
      if (parts.length >= 6) {
        const codCol = Number(parts[3]) || 0;
        const delFee = Number(parts[4]) || 0;
        const retFee = Number(parts[5]) || 0;
        const fuel = Math.round(delFee * 0.08);
        const tax = Math.round((delFee + fuel) * 0.13);
        const net = parts[6] ? Number(parts[6]) : codCol - (delFee + retFee + fuel + tax);

        parsedSettlements.push({
          trackingNumber: parts[0],
          settlementBatchId: 'CUSTOM-BATCH-01',
          settlementDate: new Date().toISOString().split('T')[0],
          courierStatus: (parts[1]?.toLowerCase() as any) || 'delivered',
          billedWeightKg: Number(parts[2]) || 0.5,
          codCollected: codCol,
          deliveryFee: delFee,
          returnFee: retFee,
          fuelSurcharge: fuel,
          taxAmount: tax,
          netPayableToSeller: net,
          courierRemarks: 'Parsed custom record',
        });
      }
    }

    const bankRecord: BankDepositRecord = {
      settlementBatchId: 'CUSTOM-BATCH-01',
      bankName,
      depositDate: new Date().toISOString().split('T')[0],
      referenceNumber: refNumber,
      courierInvoiceAmount: Number(invoiceAmount),
      actualAmountDeposited: Number(actualDeposit),
    };

    onApplyCustomData(parsedOrders, parsedSettlements, bankRecord, batchTitle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 shadow-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Upload Custom Settlement Files
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paste or import your seller order list and courier payment advice
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Steps indicator */}
        <div className="flex items-center justify-between my-4 px-2">
          <button
            onClick={() => setActiveStep(1)}
            className={`text-xs font-semibold pb-1 border-b-2 transition-colors ${
              activeStep === 1
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-400'
            }`}
          >
            Step 1: Seller Orders CSV
          </button>
          <button
            onClick={() => setActiveStep(2)}
            className={`text-xs font-semibold pb-1 border-b-2 transition-colors ${
              activeStep === 2
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-400'
            }`}
          >
            Step 2: Courier Settlement CSV
          </button>
          <button
            onClick={() => setActiveStep(3)}
            className={`text-xs font-semibold pb-1 border-b-2 transition-colors ${
              activeStep === 3
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-400'
            }`}
          >
            Step 3: Bank Deposit Check
          </button>
        </div>

        {/* Step 1: Seller Orders */}
        {activeStep === 1 && (
          <div className="space-y-3 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Seller Order Sheet (CSV format)
              </label>
              <button
                onClick={handleDownloadSampleSellerCsv}
                className="text-[11px] text-emerald-600 hover:underline flex items-center gap-1"
              >
                <Download className="w-3 h-3" /> Sample CSV
              </button>
            </div>
            <textarea
              rows={8}
              value={ordersCsv}
              onChange={(e) => setOrdersCsv(e.target.value)}
              className="w-full text-xs font-mono p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
              placeholder="OrderId,TrackingNumber,Courier,CustomerName,City,CODAmount,WeightKg"
            />
            <p className="text-[11px] text-slate-400">
              Columns required: OrderId, TrackingNumber, Courier, CustomerName, City, CODAmount, WeightKg
            </p>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveStep(2)}
                className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
              >
                Continue to Step 2 →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Courier Settlement */}
        {activeStep === 2 && (
          <div className="space-y-3 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Courier Settlement Advice (Trax / PostEx / TCS export)
              </label>
              <button
                onClick={handleDownloadSampleCourierCsv}
                className="text-[11px] text-emerald-600 hover:underline flex items-center gap-1"
              >
                <Download className="w-3 h-3" /> Sample CSV
              </button>
            </div>
            <textarea
              rows={8}
              value={courierCsv}
              onChange={(e) => setCourierCsv(e.target.value)}
              className="w-full text-xs font-mono p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none"
              placeholder="TrackingNumber,Status,WeightKg,CODCollected,DeliveryFee,ReturnFee,NetPayable"
            />
            <p className="text-[11px] text-slate-400">
              Columns: TrackingNumber, Status (delivered/returned), WeightKg, CODCollected, DeliveryFee, ReturnFee, NetPayable
            </p>
            <div className="pt-2 flex justify-between">
              <button
                onClick={() => setActiveStep(1)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                ← Back
              </button>
              <button
                onClick={() => setActiveStep(3)}
                className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
              >
                Continue to Step 3 →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Bank Deposit Check */}
        {activeStep === 3 && (
          <div className="space-y-3.5 flex-1 overflow-y-auto">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Batch Description Name
              </label>
              <input
                type="text"
                value={batchTitle}
                onChange={(e) => setBatchTitle(e.target.value)}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Bank Name & Branch
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Bank FT / Deposit Reference
                </label>
                <input
                  type="text"
                  value={refNumber}
                  onChange={(e) => setRefNumber(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Courier Net Payable Advice (PKR)
                </label>
                <input
                  type="number"
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(Number(e.target.value))}
                  className="w-full text-xs font-mono font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Actual Bank Credit Received (PKR)
                </label>
                <input
                  type="number"
                  value={actualDeposit}
                  onChange={(e) => setActualDeposit(Number(e.target.value))}
                  className="w-full text-xs font-mono font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {invoiceAmount > actualDeposit && (
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300">
                <span className="font-semibold">Shortfall Detected: </span>
                PKR {(invoiceAmount - actualDeposit).toLocaleString()} difference between courier net statement and bank credit. CODCheck will log this as an enquiry item.
              </div>
            )}

            <div className="pt-3 flex justify-between">
              <button
                onClick={() => setActiveStep(2)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                ← Back
              </button>
              <button
                onClick={handleProcessAndRun}
                className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-sm"
              >
                Run Reconciliation Audit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
