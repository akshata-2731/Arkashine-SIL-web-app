import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldCheck, 
  FileText, 
  ArrowRight,
  Lock
} from 'lucide-react';
import { School, ChecklistItem } from '../../types';
import { ScoreRing } from '../common/ScoreRing';
import { storageService } from '../../services/storageService';
import { useAuth } from '../../context/AuthContext';
import { useModalA11y } from '../../hooks/useModalA11y';

interface EligibilityModalProps {
  school: School | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const EligibilityModal: React.FC<EligibilityModalProps> = ({
  school,
  isOpen,
  onClose,
  onSaved
}) => {
  const { currentUser } = useAuth();
  const [items, setItems] = useState<ChecklistItem[]>(() => school?.eligibility.items || []);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [enrollMessage, setEnrollMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const { containerRef } = useModalA11y({ isOpen, onClose });

  // Sync items when school changes
  const prevSchoolIdRef = React.useRef(school?.id);
  React.useEffect(() => {
    if (school?.id !== prevSchoolIdRef.current) {
      prevSchoolIdRef.current = school?.id;
      if (school?.eligibility.items) {
        setItems(school.eligibility.items);
      }
    }
  }, [school?.id, school?.eligibility.items]);

  if (!isOpen || !school) return null;

  const categories = ['All', 'Space', 'Infrastructure', 'Safety', 'People', 'Students', 'Agreement'];

  // Recalculate score live
  const yesCount = items.filter(i => i.status === 'yes').length;
  const needsFixCount = items.filter(i => i.status === 'needs_fix').length;
  const noCount = items.filter(i => i.status === 'no').length;
  const total = items.length;
  const liveScore = Math.round(((yesCount * 1.0 + needsFixCount * 0.5) / (total || 1)) * 100);

  const liveResult = noCount > 0 || liveScore < 60 
    ? 'Not_Eligible' 
    : (needsFixCount > 0 || liveScore < 85 ? 'Eligible_With_Conditions' : 'Eligible');

  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(i => i.category === activeCategory);

  const handleStatusChange = (itemId: string, newStatus: 'yes' | 'no' | 'needs_fix') => {
    setItems(prev => prev.map(item => item.id === itemId ? { ...item, status: newStatus } : item));
    setEnrollMessage(null);
  };

  const handleNotesChange = (itemId: string, notes: string) => {
    setItems(prev => prev.map(item => item.id === itemId ? { ...item, notes } : item));
    setEnrollMessage(null);
  };

  // Validation: any item flagged needs_fix or no must have notes describing the issue
  const invalidItems = items.filter(i => (i.status === 'needs_fix' || i.status === 'no') && (!i.notes || !i.notes.trim()));
  const isChecklistValid = invalidItems.length === 0;

  const handleSaveEvaluation = () => {
    if (!isChecklistValid) {
      setEnrollMessage({ type: 'error', text: `Please add verification notes explaining issues for ${invalidItems.length} flagged item(s).` });
      return;
    }
    storageService.updateSchoolEligibilityCheck(school.id, items, currentUser.name);
    onSaved();
    setEnrollMessage({ type: 'success', text: `Eligibility evaluation saved! Status: ${liveResult.replace(/_/g, ' ')} (${liveScore}%)` });
  };

  const handleEnrollSchool = () => {
    // Save current items first
    storageService.updateSchoolEligibilityCheck(school.id, items, currentUser.name);
    const res = storageService.enrollSchool(school.id, currentUser.name);
    if (!res.success) {
      setEnrollMessage({ type: 'error', text: res.message });
    } else {
      setEnrollMessage({ type: 'success', text: res.message });
      onSaved();
    }
  };

  const pipelineStages: { stage: string; label: string }[] = [
    { stage: 'Identified', label: '1. Identified' },
    { stage: 'Eligibility_Check', label: '2. Eligibility Check' },
    { stage: 'Approved', label: '3. Approved' },
    { stage: 'Lab_Setup', label: '4. Lab Setup' },
    { stage: 'Enrolled', label: '5. Enrolled' },
    { stage: 'Running', label: '6. Running' },
    { stage: 'Completed', label: '7. Completed' }
  ];

  const currentStageIndex = pipelineStages.findIndex(p => p.stage === school.status);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="eligibility-modal-title"
    >
      <div 
        ref={containerRef}
        tabIndex={-1}
        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] focus:outline-hidden"
      >
        
        {/* Header with Pipeline Bar */}
        <div className="p-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 id="eligibility-modal-title" className="text-base font-bold text-slate-900">
                  School Enrollment Gate: {school.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Code: {school.code} • {school.city}, {school.state} • Partner: {school.partnerId}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              aria-label="Close eligibility dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Pipeline Ribbon */}
          <div className="overflow-x-auto pb-1">
            <div className="flex items-center min-w-max gap-1">
              {pipelineStages.map((stg, idx) => {
                const isPassed = currentStageIndex >= idx;
                const isCurrent = currentStageIndex === idx;
                return (
                  <div
                    key={stg.stage}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${
                      isCurrent
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : isPassed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200/70 text-slate-500'
                    }`}
                  >
                    <span>{stg.label}</span>
                    {idx < pipelineStages.length - 1 && (
                      <ArrowRight className="w-3 h-3 text-slate-400 inline ml-1" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Main Content: Left Checklist, Right Score Ring & Gate Details */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left 2 Cols: Interactive Checklist */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Checklist items */}
            <div className="space-y-3">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all text-xs"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">
                        [{item.category}]
                      </span>
                      <p className="font-semibold text-slate-800 mt-0.5 leading-snug">
                        {item.label}
                      </p>
                    </div>

                    {/* Yes / Needs Fix / No Buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleStatusChange(item.id, 'yes')}
                        className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-colors ${
                          item.status === 'yes'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Yes
                      </button>
                      <button
                        onClick={() => handleStatusChange(item.id, 'needs_fix')}
                        className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-colors ${
                          item.status === 'needs_fix'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <AlertTriangle className="w-3 h-3" />
                        Needs Fix
                      </button>
                      <button
                        onClick={() => handleStatusChange(item.id, 'no')}
                        className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-colors ${
                          item.status === 'no'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <XCircle className="w-3 h-3" />
                        No
                      </button>
                    </div>
                  </div>

                  {/* Verification Notes / Proof */}
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item.notes || ''}
                        onChange={(e) => handleNotesChange(item.id, e.target.value)}
                        placeholder={(item.status === 'needs_fix' || item.status === 'no') ? "Required: explain required condition or cause..." : "Add verification notes, photo link or inspector remark..."}
                        className={`flex-1 border rounded-lg px-2.5 py-1 text-xs text-slate-700 focus:outline-hidden ${
                          (item.status === 'needs_fix' || item.status === 'no') && (!item.notes || !item.notes.trim())
                            ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500'
                            : 'bg-slate-50 border-slate-200 focus:border-emerald-500'
                        }`}
                      />
                      {item.proofDocumentUrl && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <FileText className="w-3 h-3" /> Doc Attached
                        </span>
                      )}
                    </div>
                    {(item.status === 'needs_fix' || item.status === 'no') && (!item.notes || !item.notes.trim()) && (
                      <p className="text-[11px] text-rose-600 font-medium mt-1">
                        ⚠️ Please add note explaining the required remedy or defect.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Col: Score Ring & Enrollment Gate Rule */}
          <div className="space-y-4">
            
            {/* Score Ring Card */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Eligibility Assessment Score
              </h4>
              <ScoreRing
                score={liveScore}
                size={120}
                strokeWidth={12}
                label={liveResult.replace(/_/g, ' ')}
                sublabel="Rating"
              />

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-around text-xs">
                <div>
                  <span className="font-bold text-emerald-700 text-base">{yesCount}</span>
                  <p className="text-[10px] text-slate-500">Verified</p>
                </div>
                <div>
                  <span className="font-bold text-amber-700 text-base">{needsFixCount}</span>
                  <p className="text-[10px] text-slate-500">Needs Fix</p>
                </div>
                <div>
                  <span className="font-bold text-rose-700 text-base">{noCount}</span>
                  <p className="text-[10px] text-slate-500">Failed</p>
                </div>
              </div>
            </div>

            {/* Strict Gating Explanation */}
            <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
              liveResult === 'Eligible'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : liveResult === 'Eligible_With_Conditions'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}>
              <div className="flex items-center gap-1.5 font-bold mb-1">
                {liveResult === 'Eligible' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Eligible for Program Enrollment</span>
                  </>
                ) : liveResult === 'Eligible_With_Conditions' ? (
                  <>
                    <AlertTriangle className="w-4 h-4 text-amber-700" />
                    <span>Conditional Eligibility</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-rose-700" />
                    <span>Strict Gate: Enrollment Blocked</span>
                  </>
                )}
              </div>
              <p>
                {liveResult === 'Eligible'
                  ? 'All core lab space, electrical safety, student interest, and MoU requirements have been certified.'
                  : liveResult === 'Eligible_With_Conditions'
                  ? 'School can proceed to Lab Setup once specified safety / Wi-Fi improvements are completed before cohort start.'
                  : 'Enrollment cannot proceed. Resolve all "No" flags and safety compliance hazards before re-evaluation.'}
              </p>
            </div>

            {/* Notification message if blocked */}
            {enrollMessage && (
              <div className={`p-3 rounded-xl text-xs font-medium border ${
                enrollMessage.type === 'error'
                  ? 'bg-rose-100 text-rose-900 border-rose-300'
                  : 'bg-emerald-100 text-emerald-900 border-emerald-300'
              }`}>
                {enrollMessage.text}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                disabled={!isChecklistValid}
                onClick={handleSaveEvaluation}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
              >
                Save Evaluation Checklist
              </button>

              <button
                disabled={!isChecklistValid || liveResult === 'Not_Eligible'}
                onClick={handleEnrollSchool}
                className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
              >
                {school.status === 'Lab_Setup' || school.status === 'Approved'
                  ? 'Advance to Enrolled Status'
                  : 'Enroll & Initialize Cohort'}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
