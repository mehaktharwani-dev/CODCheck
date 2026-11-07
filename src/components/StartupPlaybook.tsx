import { useState } from 'react';
import {
  Users,
  Target,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Calculator,
} from 'lucide-react';
import { SELLER_INTERVIEW_DATA, SellerInterview } from '../data/sampleData';

export function StartupPlaybook() {
  const [activeTab, setActiveTab] = useState<'interview' | 'competitors' | 'pricing' | 'roadmap'>('interview');

  // Interactive Pricing Simulator state
  const [customerCount, setCustomerCount] = useState<number>(50);
  const [averageMonthlyFee, setAverageMonthlyFee] = useState<number>(1000);
  const [estimatedLostRecoveryPerSeller, setEstimatedLostRecoveryPerSeller] = useState<number>(12000);

  // Dynamic calculations
  const monthlyRecurringRevenue = customerCount * averageMonthlyFee;
  const annualRecurringRevenue = monthlyRecurringRevenue * 12;
  const totalSellerValueCreated = customerCount * estimatedLostRecoveryPerSeller;
  const roiMultiplier = Math.round(estimatedLostRecoveryPerSeller / averageMonthlyFee);

  // New Interview Form state
  const [interviews, setInterviews] = useState<SellerInterview[]>(SELLER_INTERVIEW_DATA);
  const [newSellerName, setNewSellerName] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newCity, setNewCity] = useState('Karachi');
  const [newPlatform, setNewPlatform] = useState<'Instagram' | 'Shopify' | 'WhatsApp / Facebook'>('Instagram');
  const [newVolume, setNewVolume] = useState<number>(150);
  const [newCouriers, setNewCouriers] = useState('Trax, PostEx');
  const [newPain, setNewPain] = useState('');
  const [newQuote, setNewQuote] = useState('');
  const [newWtp, setNewWtp] = useState('PKR 1,000 / month');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSellerName.trim() || !newBrand.trim()) return;

    const record: SellerInterview = {
      sellerName: newSellerName,
      brand: newBrand,
      city: newCity,
      platform: newPlatform,
      monthlyCodVolume: Number(newVolume),
      couriersUsed: newCouriers.split(',').map((c) => c.trim()),
      reconciliationPain: newPain || 'Spends 3+ hours weekly tracking courier invoices manually.',
      lostAmountQuote: newQuote || 'Estimated PKR 8,000 to PKR 15,000 lost per quarter.',
      willingnessToPay: newWtp,
    };

    setInterviews([record, ...interviews]);
    setShowAddModal(false);
    setNewSellerName('');
    setNewBrand('');
    setNewPain('');
    setNewQuote('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>CODCheck Startup Concept</span>
          <span aria-hidden="true">·</span>
          <span>Pakistan E-Commerce 2026</span>
          <span aria-hidden="true">·</span>
          <span>Founder Playbook</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
          Market Validation, Unit Economics & 30-Day Launch Blueprint
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
          Pakistan's e-commerce market processes millions of Cash-on-Delivery parcels monthly. CODCheck empowers Instagram and social-commerce sellers to verify courier payouts, identify missing cash, and eliminate manual spreadsheet reconciliation.
        </p>
      </div>

      {/* Internal Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
        <button
          onClick={() => setActiveTab('interview')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'interview'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Customer Discovery (3 Questions)
        </button>
        <button
          onClick={() => setActiveTab('competitors')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'competitors'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Competitors & Wedge USP
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'pricing'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          SaaS Pricing & ROI Simulator
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
            activeTab === 'roadmap'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          30-Day Launch Roadmap
        </button>
      </div>

      {/* Tab 1: Customer Discovery Interview Guide */}
      {activeTab === 'interview' && (
        <div className="space-y-6">
          {/* The 3 Core Questions from Prompt */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
              Customer Discovery Interview Framework
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Before pitching the product, ask these 3 non-leading questions to uncover the seller's actual workflow:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
                  Question 1: Payout Verification
                </span>
                <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
                  “How do you currently check whether your courier has paid you for every delivered COD order?”
                </p>
                <p className="text-[11px] text-slate-500 mt-2">
                  Goal: Uncover if they rely on trust, gut feel, or tedious VLOOKUP spreadsheets.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
                  Question 2: Bank Statement Matching
                </span>
                <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
                  “Do you compare courier payment reports with your own orders and bank deposits? If yes, how do you do it?”
                </p>
                <p className="text-[11px] text-slate-500 mt-2">
                  Goal: Probe whether they catch bank transfer shortfalls (e.g. the PKR 800 gap).
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
                  Question 3: Discrepancy Cost
                </span>
                <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
                  “What happens when the numbers don't match, and how much time does it take you to investigate?”
                </p>
                <p className="text-[11px] text-slate-500 mt-2">
                  Goal: Gauge quantified financial pain, lost hours, and willingness to pay.
                </p>
              </div>
            </div>
          </div>

          {/* Seller Interview Log */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Seller Interview Log ({interviews.length} Completed Interviews)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Insights from Karachi, Lahore, and Faisalabad merchant interviews
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 py-1.5 text-xs font-medium text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 rounded-lg transition-colors"
              >
                + Log New Interview
              </button>
            </div>

            <div className="space-y-4">
              {interviews.map((iv, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white text-xs">
                        {iv.sellerName}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        ({iv.brand} · {iv.city})
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {iv.platform}
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                      ~{iv.monthlyCodVolume} orders/mo · Couriers: {iv.couriersUsed.join(', ')}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                    "{iv.reconciliationPain}"
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                    <div>
                      <span className="font-semibold text-rose-700 dark:text-rose-400">Estimated Loss: </span>
                      <span className="text-slate-600 dark:text-slate-300">{iv.lostAmountQuote}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">Willingness to Pay: </span>
                      <span className="text-slate-600 dark:text-slate-300">{iv.willingnessToPay}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Competitors & Wedge USP */}
      {activeTab === 'competitors' && (
        <div className="space-y-6">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Pakistan Courier Reconciliation Competitive Matrix
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Why building another generic "Shopify courier matcher" is a mistake, and why CODCheck targets the underserved Instagram & WhatsApp seller tier.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-600 dark:text-slate-300">
                    <th className="py-2.5 px-3">Product</th>
                    <th className="py-2.5 px-3">Primary Target</th>
                    <th className="py-2.5 px-3">Shopify Required?</th>
                    <th className="py-2.5 px-3">Setup Complexity</th>
                    <th className="py-2.5 px-3">Dispute Automation</th>
                    <th className="py-2.5 px-3">Weakness / Gap</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">Parcelo (parcelo.pk)</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">Shopify E-Commerce Stores</td>
                    <td className="py-3 px-3 text-amber-600 font-medium">Yes (Heavy Shopify focus)</td>
                    <td className="py-3 px-3">Medium (API tokens, store connect)</td>
                    <td className="py-3 px-3">Basic flagging</td>
                    <td className="py-3 px-3 text-slate-500">Ignores non-Shopify Instagram & WhatsApp merchants.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">ShipFox (shipfox.pk)</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">Growing D2C Brands</td>
                    <td className="py-3 px-3 text-slate-600">Yes / Custom ERP</td>
                    <td className="py-3 px-3">High (Integration setup)</td>
                    <td className="py-3 px-3">Settlement tracking</td>
                    <td className="py-3 px-3 text-slate-500">Too expensive & complex for 50-200 order/month boutique sellers.</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">Kaarobar (kaarobarapp.com)</td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">E-commerce Businesses</td>
                    <td className="py-3 px-3 text-slate-600">Mixed</td>
                    <td className="py-3 px-3">Medium</td>
                    <td className="py-3 px-3">Unpaid shipment alerts</td>
                    <td className="py-3 px-3 text-slate-500">Does not parse bank transfer shortfall gaps or draft courier dispute letters.</td>
                  </tr>
                  <tr className="bg-emerald-50/50 dark:bg-emerald-950/20 font-medium">
                    <td className="py-3 px-3 font-bold text-emerald-800 dark:text-emerald-300">CODCheck (Your Startup)</td>
                    <td className="py-3 px-3 text-slate-900 dark:text-white font-semibold">Instagram & WhatsApp Sellers</td>
                    <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400 font-bold">NO (Zero store needed)</td>
                    <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400">Zero (Drop 2 spreadsheets)</td>
                    <td className="py-3 px-3 text-emerald-600 dark:text-emerald-400 font-bold">1-Click Trax/PostEx claim pack</td>
                    <td className="py-3 px-3 text-emerald-700 dark:text-emerald-300">Simple wedge with immediate demonstrable ROI.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Differentiators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                CODCheck Core Differentiators
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Zero-Setup Onboarding:</strong> Sellers simply drop their Google Sheets / Excel order tracker and Trax/PostEx settlement sheet. No technical API keys.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Actionable Follow-up:</strong> Does not just show numbers. Generates an email draft pre-filled with CNs, customer details, and proof to send directly to courier account managers.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Plain Urdu & English Explanations:</strong> Explains reasons (e.g. volumetric re-weighting, 1-Link inter-bank transfer deductions) rather than blaming couriers blindly.</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                Initial Go-to-Market: Reconciliation as a Service (RaaS)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                Before spending months building automated software, offer manual audits:
              </p>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-lg text-xs space-y-1 text-slate-700 dark:text-slate-300">
                <p><strong>The Pitch:</strong> “Send us your last 3 courier payout files. If we find you over PKR 5,000 in uncredited payouts or overcharges, we take a 20% success fee. If we find nothing, it's 100% free.”</p>
                <p className="text-[11px] text-slate-500 pt-1">This validates the pain, gets you real courier files to train your parser, and generates revenue on Day 14!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: SaaS Pricing & ROI Simulator */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          {/* Interactive Calculator */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                SaaS Unit Economics & Revenue Forecast Simulator
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Adjust paying customer counts and plan tiers to model CODCheck's revenue potential in the Pakistani social-commerce market.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sliders */}
              <div className="md:col-span-2 space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Active Paying Sellers:</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{customerCount} merchants</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="500"
                    step="5"
                    value={customerCount}
                    onChange={(e) => setCustomerCount(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>5 (Pilot)</span>
                    <span>100 (Early Traction)</span>
                    <span>500 (Established SaaS)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Monthly Subscription Fee (PKR):</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">PKR {averageMonthlyFee.toLocaleString()} / mo</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="3500"
                    step="100"
                    value={averageMonthlyFee}
                    onChange={(e) => setAverageMonthlyFee(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>PKR 500 (Starter)</span>
                    <span>PKR 1,500 (Growth)</span>
                    <span>PKR 3,500 (Pro)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Avg. Recovered Losses / Seller (PKR):</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">PKR {estimatedLostRecoveryPerSeller.toLocaleString()} / mo</span>
                  </div>
                  <input
                    type="range"
                    min="3000"
                    max="40000"
                    step="1000"
                    value={estimatedLostRecoveryPerSeller}
                    onChange={(e) => setEstimatedLostRecoveryPerSeller(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-400">
                    Typical recovery rate from courier weight creeps, missing COD, and bank shortfalls.
                  </span>
                </div>
              </div>

              {/* Forecast Output Card */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Financial Projection
                  </span>
                  <div className="mt-3 space-y-3">
                    <div>
                      <span className="text-xs text-slate-500">Monthly Recurring Revenue (MRR):</span>
                      <p className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-0.5">
                        PKR {monthlyRecurringRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500">Annual Run-Rate (ARR):</span>
                      <p className="text-lg font-bold font-mono text-slate-700 dark:text-slate-300 mt-0.5">
                        PKR {annualRecurringRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                      <span className="text-xs text-slate-500">Total Merchant Money Protected:</span>
                      <p className="text-base font-semibold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                        PKR {totalSellerValueCreated.toLocaleString()} / mo
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-emerald-600">{roiMultiplier}x ROI: </span>
                  For every PKR 1,000 paid to CODCheck, the seller saves ~PKR {(roiMultiplier * 1000).toLocaleString()} in lost courier settlements.
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Tiers Table */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500">Free Tier</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">PKR 0</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">For brand new sellers</p>
                <ul className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <li>· Up to 30 parcels/month</li>
                  <li>· 1 Courier support</li>
                  <li>· Basic summary report</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-emerald-300 dark:border-emerald-800 shadow-xs flex flex-col justify-between relative">
              <span className="absolute -top-2.5 right-3 px-2 py-0.5 text-[10px] font-bold bg-emerald-600 text-white rounded-full">
                Most Popular
              </span>
              <div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Starter</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">PKR 799 <span className="text-xs font-normal text-slate-400">/ mo</span></h3>
                <p className="text-[11px] text-slate-400 mt-0.5">For Instagram boutiques</p>
                <ul className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <li>· Up to 250 parcels/month</li>
                  <li>· All Pakistani couriers</li>
                  <li>· Bank shortfall detector</li>
                  <li>· 1-Click dispute generator</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500">Growth</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">PKR 1,999 <span className="text-xs font-normal text-slate-400">/ mo</span></h3>
                <p className="text-[11px] text-slate-400 mt-0.5">For established brands</p>
                <ul className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <li>· Up to 1,500 parcels/month</li>
                  <li>· Multi-courier comparison</li>
                  <li>· Priority claim templates</li>
                  <li>· WhatsApp alerts</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500">Agency / Scale</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">PKR 4,999 <span className="text-xs font-normal text-slate-400">/ mo</span></h3>
                <p className="text-[11px] text-slate-400 mt-0.5">For multi-brand agencies</p>
                <ul className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <li>· Unlimited parcels</li>
                  <li>· Multi-brand client accounts</li>
                  <li>· Dedicated account audit</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: 30-Day Launch Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
              The Practical 30-Day Launch Plan
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              The goal of Month 1 is not to build a huge platform. It's to prove sellers have the problem, recover real cash for them, and validate willingness to pay.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <span className="text-xs font-mono font-semibold text-slate-500">Days 1–7</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 mb-2">
                  Week 1: Customer Research
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
                  Interview 10 online sellers in Karachi and Lahore. Ask how they track COD payouts, frequency, and pain points.
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] font-medium text-emerald-600">
                  Deliverable: 10 verified pain sheets & sample settlement files.
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <span className="text-xs font-mono font-semibold text-slate-500">Days 8–14</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 mb-2">
                  Week 2: Build Engine
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
                  Write matching algorithms in Python or TypeScript. Handle Trax and PostEx CSV formats and calculate variances.
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] font-medium text-emerald-600">
                  Deliverable: Working engine script & sample audit report.
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <span className="text-xs font-mono font-semibold text-slate-500">Days 15–21</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 mb-2">
                  Week 3: Build Prototype
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
                  Add clean upload screen, matched orders table, exception filters, and exportable dispute letter.
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] font-medium text-emerald-600">
                  Deliverable: Working web demo a non-technical seller can use.
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <span className="text-xs font-mono font-semibold text-slate-500">Days 22–30</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-1 mb-2">
                  Week 4: Run Merchant Pilot
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
                  Onboard 2–3 live sellers. Audit their recent weekly settlements, measure time saved, and file dispute claims.
                </p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] font-medium text-emerald-600">
                  Deliverable: Verified recovered cash & first paying customer conversion.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Interview Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
              Log Seller Interview
            </h3>
            <form onSubmit={handleAddInterview} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Seller Name</label>
                  <input
                    required
                    type="text"
                    value={newSellerName}
                    onChange={(e) => setNewSellerName(e.target.value)}
                    placeholder="e.g. Ayesha Khan"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Brand Name</label>
                  <input
                    required
                    type="text"
                    value={newBrand}
                    onChange={(e) => setNewBrand(e.target.value)}
                    placeholder="e.g. Lawn Studio Karachi"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">City</label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Karachi">Karachi</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Platform</label>
                  <select
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value as any)}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="Shopify">Shopify</option>
                    <option value="WhatsApp / Facebook">WhatsApp / Facebook</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Monthly Orders</label>
                  <input
                    type="number"
                    value={newVolume}
                    onChange={(e) => setNewVolume(Number(e.target.value))}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Primary Reconciliation Pain</label>
                <textarea
                  rows={2}
                  value={newPain}
                  onChange={(e) => setNewPain(e.target.value)}
                  placeholder="How they reconcile today, what breaks, hours spent..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Estimated Lost Amount</label>
                  <input
                    type="text"
                    value={newQuote}
                    onChange={(e) => setNewQuote(e.target.value)}
                    placeholder="e.g. Rs. 15,000 / month"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Willingness to Pay</label>
                  <input
                    type="text"
                    value={newWtp}
                    onChange={(e) => setNewWtp(e.target.value)}
                    placeholder="e.g. Rs. 1,000/mo"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Save Interview
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
