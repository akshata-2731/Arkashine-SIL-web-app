import React, { useState, useMemo } from 'react';
import { 
  Settings2, 
  Save, 
  Download,
  AlertTriangle
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { ProgramTargets, BudgetLine, InventoryItem, AuditLog } from '../../types';

export const ArkashineSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'targets' | 'inventory' | 'budget' | 'audit'>('targets');
  const [budgetLines] = useState<BudgetLine[]>(() => storageService.getBudgetLines());
  const [inventory] = useState<InventoryItem[]>(() => storageService.getInventory('SCH-01'));
  const [targets, setTargets] = useState<ProgramTargets>(() => storageService.getProgramTargets());
  const [auditLogs] = useState<AuditLog[]>(() => storageService.getAuditLogs());
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const totalPlanned = budgetLines.reduce((acc, b) => acc + b.plannedAmount, 0);
  const totalActual = budgetLines.reduce((acc, b) => acc + b.actualAmount, 0);
  const totalVariance = totalPlanned - totalActual;

  // Validation for targets
  const targetErrors = useMemo(() => {
    const errs: Record<string, string> = {};
    if (isNaN(targets.totalHours) || targets.totalHours <= 0 || targets.totalHours > 200) {
      errs.totalHours = 'Total training hours must be between 1 and 200.';
    }
    if (isNaN(targets.weeklyHours) || targets.weeklyHours <= 0 || targets.weeklyHours > 50) {
      errs.weeklyHours = 'Weekly hours must be between 1 and 50.';
    }
    if (isNaN(targets.attendanceThreshold) || targets.attendanceThreshold < 50 || targets.attendanceThreshold > 100) {
      errs.attendanceThreshold = 'Attendance threshold must be between 50% and 100%.';
    }
    if (isNaN(targets.targetFarmersPerSchool) || targets.targetFarmersPerSchool < 10 || targets.targetFarmersPerSchool > 10000) {
      errs.targetFarmers = 'Farmer target must be between 10 and 10,000.';
    }
    if (isNaN(targets.targetSamplesPerSchool) || targets.targetSamplesPerSchool < 10 || targets.targetSamplesPerSchool > 5000) {
      errs.targetSamples = 'Soil samples target must be between 10 and 5,000.';
    }
    if (isNaN(targets.targetCampaignsPerSchool) || targets.targetCampaignsPerSchool < 1 || targets.targetCampaignsPerSchool > 200) {
      errs.targetCampaigns = 'Campaigns target must be between 1 and 200.';
    }
    return errs;
  }, [targets]);

  const isTargetsValid = Object.keys(targetErrors).length === 0;

  const handleSaveTargets = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTargetsValid) return;
    storageService.saveProgramTargets(targets);
    setSavedNotice('Program targets updated successfully!');
    setTimeout(() => setSavedNotice(null), 4000);
  };

  const handleExportCsv = () => {
    // Generate CSV string of budget lines
    const headers = ['Code', 'Category', 'Description', 'Planned (INR)', 'Actual (INR)', 'Variance (INR)', 'Status'];
    const rows = budgetLines.map(b => [
      b.code,
      `"${b.category}"`,
      `"${b.description}"`,
      b.plannedAmount,
      b.actualAmount,
      b.variance,
      b.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Arkashine_Budget_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Settings2 className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Reports, Budget & Program Governance
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Approved ceiling ₹5,00,000 per school pilot • 29 budget lines • Dynamic targets.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Export to CSV / Excel
        </button>
      </div>

      {savedNotice && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-2xl text-xs font-semibold text-emerald-900">
          {savedNotice}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('targets')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'targets' ? 'btn-theme-primary font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          🎯 Program Targets & Hours
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'inventory' ? 'btn-theme-primary font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          🔬 SoiLENZ Devices & Kits
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'audit' ? 'btn-theme-primary font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          📋 System Audit Log
        </button>
        <button
          onClick={() => setActiveTab('budget')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'budget' ? 'btn-theme-primary font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          💰 Pilot Budget (₹5L Ceiling)
        </button>
      </div>

      {/* Tab 1: Budget Tracking */}
      {activeTab === 'budget' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Approved Ceiling</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">₹{totalPlanned.toLocaleString('en-IN')}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Across 29 standard items</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Actual Disbursed</span>
              <p className="text-2xl font-bold text-emerald-700 mt-1">₹{totalActual.toLocaleString('en-IN')}</p>
              <p className="text-[11px] text-emerald-600 mt-0.5">{((totalActual / totalPlanned) * 100).toFixed(1)}% utilized</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Net Variance</span>
              <p className="text-2xl font-bold text-slate-900 mt-1">₹{totalVariance.toLocaleString('en-IN')}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Remaining unallocated headroom</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="p-3.5">Code</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Item Description</th>
                    <th className="p-3.5 text-right">Planned (₹)</th>
                    <th className="p-3.5 text-right">Actual (₹)</th>
                    <th className="p-3.5 text-right">Variance (₹)</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {budgetLines.map(line => (
                    <tr key={line.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-slate-700">{line.code}</td>
                      <td className="p-3.5 text-slate-500">{line.category}</td>
                      <td className="p-3.5 font-medium text-slate-800">{line.description}</td>
                      <td className="p-3.5 text-right font-semibold text-slate-900">{line.plannedAmount.toLocaleString('en-IN')}</td>
                      <td className="p-3.5 text-right font-semibold text-emerald-800">{line.actualAmount.toLocaleString('en-IN')}</td>
                      <td className={`p-3.5 text-right font-semibold ${line.variance >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {line.variance >= 0 ? `+${line.variance.toLocaleString('en-IN')}` : line.variance.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          line.status === 'Within_Budget' ? 'bg-emerald-100 text-emerald-800' : (line.status === 'Near_Limit' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800')
                        }`}>
                          {line.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Targets Configuration */}
      {activeTab === 'targets' && (
        <form onSubmit={handleSaveTargets} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Summer Lab Governance Key Parameters</h3>
            <p className="text-xs text-slate-500 mt-0.5">Program rules governing certification gating and delivery targets</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Total Training Hours *</label>
              <input
                type="number"
                min="1"
                max="200"
                value={targets.totalHours}
                onChange={(e) => setTargets({ ...targets, totalHours: Number(e.target.value) })}
                className={`w-full bg-slate-50 border rounded-xl p-2.5 font-bold text-slate-900 focus:outline-hidden ${
                  targetErrors.totalHours ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-emerald-500'
                }`}
              />
              {targetErrors.totalHours ? (
                <p className="text-rose-600 font-semibold mt-1">⚠️ {targetErrors.totalHours}</p>
              ) : (
                <span className="text-[11px] text-slate-400">Default: 72 training hours</span>
              )}
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Hours per Week *</label>
              <input
                type="number"
                min="1"
                max="50"
                value={targets.weeklyHours}
                onChange={(e) => setTargets({ ...targets, weeklyHours: Number(e.target.value) })}
                className={`w-full bg-slate-50 border rounded-xl p-2.5 font-bold text-slate-900 focus:outline-hidden ${
                  targetErrors.weeklyHours ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-emerald-500'
                }`}
              />
              {targetErrors.weeklyHours ? (
                <p className="text-rose-600 font-semibold mt-1">⚠️ {targetErrors.weeklyHours}</p>
              ) : (
                <span className="text-[11px] text-slate-400">Default: 18 hours/week (4 weeks)</span>
              )}
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Attendance Threshold (%) *</label>
              <input
                type="number"
                min="50"
                max="100"
                value={targets.attendanceThreshold}
                onChange={(e) => setTargets({ ...targets, attendanceThreshold: Number(e.target.value) })}
                className={`w-full bg-slate-50 border rounded-xl p-2.5 font-bold text-slate-900 focus:outline-hidden ${
                  targetErrors.attendanceThreshold ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-emerald-500'
                }`}
              />
              {targetErrors.attendanceThreshold ? (
                <p className="text-rose-600 font-semibold mt-1">⚠️ {targetErrors.attendanceThreshold}</p>
              ) : (
                <span className="text-[11px] text-slate-400">Strict gate for certificate issuance (default 80%)</span>
              )}
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Farmers Reached Target per School *</label>
              <input
                type="number"
                min="10"
                max="10000"
                value={targets.targetFarmersPerSchool}
                onChange={(e) => setTargets({ ...targets, targetFarmersPerSchool: Number(e.target.value) })}
                className={`w-full bg-slate-50 border rounded-xl p-2.5 font-bold text-slate-900 focus:outline-hidden ${
                  targetErrors.targetFarmers ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-emerald-500'
                }`}
              />
              {targetErrors.targetFarmers ? (
                <p className="text-rose-600 font-semibold mt-1">⚠️ {targetErrors.targetFarmers}</p>
              ) : (
                <span className="text-[11px] text-slate-400">Default: 1,500 farmers (50 per group)</span>
              )}
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Soil Samples Tested Target *</label>
              <input
                type="number"
                min="10"
                max="5000"
                value={targets.targetSamplesPerSchool}
                onChange={(e) => setTargets({ ...targets, targetSamplesPerSchool: Number(e.target.value) })}
                className={`w-full bg-slate-50 border rounded-xl p-2.5 font-bold text-slate-900 focus:outline-hidden ${
                  targetErrors.targetSamples ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-emerald-500'
                }`}
              />
              {targetErrors.targetSamples ? (
                <p className="text-rose-600 font-semibold mt-1">⚠️ {targetErrors.targetSamples}</p>
              ) : (
                <span className="text-[11px] text-slate-400">Default: 750 samples tested per school</span>
              )}
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Awareness Campaigns per School *</label>
              <input
                type="number"
                min="1"
                max="200"
                value={targets.targetCampaignsPerSchool}
                onChange={(e) => setTargets({ ...targets, targetCampaignsPerSchool: Number(e.target.value) })}
                className={`w-full bg-slate-50 border rounded-xl p-2.5 font-bold text-slate-900 focus:outline-hidden ${
                  targetErrors.targetCampaigns ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-emerald-500'
                }`}
              />
              {targetErrors.targetCampaigns ? (
                <p className="text-rose-600 font-semibold mt-1">⚠️ {targetErrors.targetCampaigns}</p>
              ) : (
                <span className="text-[11px] text-slate-400">Default: 30 awareness events</span>
              )}
            </div>
          </div>

          {!isTargetsValid && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Please resolve highlighted targets validation errors.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!isTargetsValid}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-xs ${
              isTargetsValid
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            <Save className="w-4 h-4" />
            Save Target Settings
          </button>
        </form>
      )}

      {/* Tab 3: Inventory */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs">
            <span className="font-bold text-slate-700">School Lab Hardware & Consumables Tracking</span>
            <span className="text-slate-500">SoiLENZ Handheld Units & Optical Reagents</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                  <th className="p-3.5">Item Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Total Deployed</th>
                  <th className="p-3.5">Consumed</th>
                  <th className="p-3.5">Remaining</th>
                  <th className="p-3.5">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventory.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-semibold text-slate-800">{item.itemName}</td>
                    <td className="p-3.5 text-slate-500">{item.category}</td>
                    <td className="p-3.5 font-bold text-slate-900">{item.totalQuantity} {item.unit}</td>
                    <td className="p-3.5 text-slate-600">{item.usedQuantity} {item.unit}</td>
                    <td className="p-3.5 font-bold text-emerald-800">{item.totalQuantity - item.usedQuantity} {item.unit}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'Adequate' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Audit Log */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700">
            Immutable Program Governance Trail
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {auditLogs.map(log => (
              <div key={log.id} className="p-4 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-semibold uppercase">
                      {log.actorRole}
                    </span>
                  </div>
                  <p className="text-slate-600">{log.details}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Actor: {log.actorName}</p>
                </div>
                <span className="text-[11px] text-slate-400 font-mono shrink-0">
                  {new Date(log.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
