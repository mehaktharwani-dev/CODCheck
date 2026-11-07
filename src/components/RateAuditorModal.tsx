import { useState } from 'react';
import { CourierTariffRule } from '../types/reconciliation';
import { Check, RotateCcw, ShieldCheck, Scale, Info } from 'lucide-react';
import { DEFAULT_TARIFF_RULES } from '../data/sampleData';

interface RateAuditorModalProps {
  tariffRules: Record<string, CourierTariffRule>;
  onUpdateRule: (courier: string, updated: CourierTariffRule) => void;
  onResetDefaults: () => void;
}

export function RateAuditorModal({
  tariffRules,
  onUpdateRule,
  onResetDefaults,
}: RateAuditorModalProps) {
  const [selectedCourier, setSelectedCourier] = useState<string>('Trax');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentRule = tariffRules[selectedCourier] || DEFAULT_TARIFF_RULES.Trax;

  const handleFieldChange = (field: keyof CourierTariffRule, val: number) => {
    onUpdateRule(selectedCourier, {
      ...currentRule,
      [field]: val,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Contracted Tariffs</span>
            <span aria-hidden="true">·</span>
            <span>Fee Auditing Rules</span>
            <span aria-hidden="true">·</span>
            <span>Pakistan Couriers</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Courier Contracted Rate Cards & Fee Audit Rules
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
            CODCheck compares every billed consignment against your negotiated corporate tariff. If a courier bills an inter-city parcel at PKR 340 instead of your agreed PKR 240, it is flagged as an exception.
          </p>
        </div>

        <button
          onClick={onResetDefaults}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Standard Pakistan Rates</span>
        </button>
      </div>

      {/* Courier Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.keys(tariffRules).map((cName) => (
          <button
            key={cName}
            onClick={() => setSelectedCourier(cName)}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              selectedCourier === cName
                ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-xs ring-1 ring-emerald-500'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white text-sm">{cName}</span>
              {selectedCourier === cName && <Check className="w-4 h-4 text-emerald-600" />}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Base: PKR {tariffRules[cName].interCityBaseFee} (Inter-city 0.5kg)
            </p>
          </button>
        ))}
      </div>

      {/* Active Rate Card Form */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              {selectedCourier} Negotiated Rate Sheet
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Values used by the audit engine to calculate expected shipping and deduction fees.
            </p>
          </div>
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Rule updated & active!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Same-City Base Rate (PKR, up to 0.5 kg)
            </label>
            <input
              type="number"
              value={currentRule.sameCityBaseFee}
              onChange={(e) => handleFieldChange('sameCityBaseFee', Number(e.target.value))}
              className="w-full text-xs font-mono font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              e.g. Karachi-to-Karachi dispatch (standard: PKR 150–180)
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Inter-City Base Rate (PKR, up to 0.5 kg)
            </label>
            <input
              type="number"
              value={currentRule.interCityBaseFee}
              onChange={(e) => handleFieldChange('interCityBaseFee', Number(e.target.value))}
              className="w-full text-xs font-mono font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              e.g. Karachi to Lahore/Islamabad (standard: PKR 230–280)
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Additional Weight Surcharge (PKR / 0.5 kg)
            </label>
            <input
              type="number"
              value={currentRule.additionalHalfKgRate}
              onChange={(e) => handleFieldChange('additionalHalfKgRate', Number(e.target.value))}
              className="w-full text-xs font-mono font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Applied for packages exceeding 0.5 kg tare weight
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Return (RTO) Fee Tariff (PKR)
            </label>
            <input
              type="number"
              value={currentRule.returnFeeRate}
              onChange={(e) => handleFieldChange('returnFeeRate', Number(e.target.value))}
              className="w-full text-xs font-mono font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Fee charged when customer rejects parcel (PKR 110–140)
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Fuel Surcharge (%)
            </label>
            <input
              type="number"
              value={currentRule.fuelSurchargePercent}
              onChange={(e) => handleFieldChange('fuelSurchargePercent', Number(e.target.value))}
              className="w-full text-xs font-mono font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Fluctuating courier fuel adjustment (standard: 7%–10%)
            </span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Provincial Sales Tax / SRB / PRA (%)
            </label>
            <input
              type="number"
              value={currentRule.taxPercent}
              onChange={(e) => handleFieldChange('taxPercent', Number(e.target.value))}
              className="w-full text-xs font-mono font-medium bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Sindh SRB is 13%, Punjab PRA is 16%
            </span>
          </div>
        </div>
      </div>

      {/* Pakistan Courier Industry Benchmark Table */}
      <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
          2026 Pakistan Courier Rate Benchmarks (0.5 kg standard apparel)
        </h2>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-500 dark:text-slate-400">
                <th className="py-2.5 px-3">Courier</th>
                <th className="py-2.5 px-3">Same City (0.5kg)</th>
                <th className="py-2.5 px-3">Inter-City (0.5kg)</th>
                <th className="py-2.5 px-3">Return (RTO) Fee</th>
                <th className="py-2.5 px-3">Settlement Cadence</th>
                <th className="py-2.5 px-3">COD Financing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Trax Logistics</td>
                <td className="py-2.5 px-3 font-mono">PKR 150 - 170</td>
                <td className="py-2.5 px-3 font-mono">PKR 230 - 250</td>
                <td className="py-2.5 px-3 font-mono">PKR 120</td>
                <td className="py-2.5 px-3">Twice weekly (Tue / Fri)</td>
                <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">Trax Advance Payouts</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">PostEx</td>
                <td className="py-2.5 px-3 font-mono">PKR 140 - 160</td>
                <td className="py-2.5 px-3 font-mono">PKR 220 - 240</td>
                <td className="py-2.5 px-3 font-mono">PKR 110</td>
                <td className="py-2.5 px-3">Upfront booking disbursement</td>
                <td className="py-2.5 px-3 text-emerald-600 font-medium">Instant COD loan product</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">TCS Express</td>
                <td className="py-2.5 px-3 font-mono">PKR 190 - 220</td>
                <td className="py-2.5 px-3 font-mono">PKR 300 - 340</td>
                <td className="py-2.5 px-3 font-mono">PKR 160 - 180</td>
                <td className="py-2.5 px-3">Weekly statement</td>
                <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">Standard COD</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Leopards Courier</td>
                <td className="py-2.5 px-3 font-mono">PKR 170 - 190</td>
                <td className="py-2.5 px-3 font-mono">PKR 260 - 280</td>
                <td className="py-2.5 px-3 font-mono">PKR 140</td>
                <td className="py-2.5 px-3">Weekly bank transfer</td>
                <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">Leopards Direct</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
