import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, Search } from 'lucide-react';
import { Student, School } from '../../types';
import { storageService } from '../../services/storageService';
import { useModalA11y } from '../../hooks/useModalA11y';

interface QrVerificationModalProps {
  student?: Student | null;
  school?: School | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QrVerificationModal: React.FC<QrVerificationModalProps> = ({
  student,
  school,
  isOpen,
  onClose
}) => {
  const [customHash, setCustomHash] = useState<string>('');
  const [activeHash, setActiveHash] = useState<string | null>(null);
  const { containerRef } = useModalA11y({ isOpen, onClose });

  if (!isOpen) return null;

  // Determine which hash to check: custom searched hash or student's hash
  const hashToCheck = activeHash ?? (student?.verifiedQrHash || '');
  
  // Look up in registry
  const lookupResult = hashToCheck ? storageService.getStudentByVerificationHash(hashToCheck) : null;
  
  // Fallback to student prop if it is issued and matches
  const verifiedStudent = lookupResult?.student || 
    (student && student.certificateStatus === 'Issued' && student.verifiedQrHash && student.verifiedQrHash === hashToCheck ? student : null);
  const verifiedSchool = lookupResult?.school || school || (verifiedStudent ? storageService.getSchool(verifiedStudent.schoolId) : undefined);

  const isValid = Boolean(verifiedStudent && verifiedStudent.certificateStatus === 'Issued' && hashToCheck);

  const handleSearchHash = (e: React.FormEvent) => {
    e.preventDefault();
    if (customHash.trim()) {
      setActiveHash(customHash.trim());
    }
  };

  const handleResetToStudent = () => {
    setActiveHash(null);
    setCustomHash('');
  };

  return (
    <div 
      className="fixed inset-0 z-60 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-verification-title"
    >
      <div 
        ref={containerRef}
        tabIndex={-1}
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200 focus:outline-hidden"
      >
        
        {/* Verification Banner */}
        <div className={`p-6 text-center relative ${isValid ? 'bg-emerald-800 text-white' : 'bg-rose-900 text-white'}`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
            aria-label="Close verification modal"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg ${
            isValid ? 'bg-white text-emerald-800' : 'bg-white text-rose-700'
          }`}>
            {isValid ? (
              <ShieldCheck className="w-10 h-10" />
            ) : (
              <AlertTriangle className="w-10 h-10" />
            )}
          </div>
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-1 ${
            isValid ? 'bg-emerald-700/80 text-emerald-100' : 'bg-rose-800 text-rose-100'
          }`}>
            {isValid ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" /> Official Verification
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" /> Verification Failed
              </>
            )}
          </span>
          <h3 id="qr-verification-title" className="text-lg font-bold">
            {isValid ? 'Certificate Authenticated' : 'Invalid / Not Found'}
          </h3>
          <p className="text-xs text-white/80 mt-1">
            Arkashine School Innovation Lab Registry
          </p>
        </div>

        {/* Verification Credentials or Invalid State */}
        <div className="p-6 space-y-4 text-xs">
          {/* Quick Hash Search Form */}
          <form onSubmit={handleSearchHash} className="flex gap-2">
            <input
              type="text"
              placeholder="Verify another hash (ark-sil-...)"
              value={customHash}
              onChange={(e) => setCustomHash(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-xs font-mono text-slate-800 placeholder:font-sans focus:outline-hidden focus:border-emerald-600"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold text-xs flex items-center gap-1 transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              Check
            </button>
          </form>

          {activeHash && (
            <div className="flex justify-between items-center text-[11px] text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
              <span>Checking custom hash query</span>
              <button 
                type="button" 
                onClick={handleResetToStudent}
                className="text-emerald-700 hover:underline font-semibold"
              >
                Reset to current student
              </button>
            </div>
          )}

          {isValid && verifiedStudent ? (
            <>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex justify-between text-slate-500">
                  <span>Certificate ID:</span>
                  <span className="font-mono font-bold text-slate-800">{verifiedStudent.certificateId}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Verification Hash:</span>
                  <span className="font-mono text-emerald-700 break-all text-[11px] font-semibold">{verifiedStudent.verifiedQrHash}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Registry Status:</span>
                  <span className="font-bold text-emerald-700">Active & Tamper-Proof</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Certified Student</span>
                  <p className="text-base font-bold text-slate-900">{verifiedStudent.name}</p>
                  <p className="text-slate-500">Roll: {verifiedStudent.rollNo} • Class {verifiedStudent.classGrade}</p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Institution</span>
                  <p className="font-semibold text-slate-800">{verifiedSchool?.name || 'School Innovation Lab'}</p>
                  <p className="text-slate-500">{verifiedSchool?.city}, {verifiedSchool?.state}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-900">
                    <span className="font-bold text-sm block">72 Hours</span>
                    <span className="text-[10px] text-emerald-700">Curriculum Completed</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-sky-50 text-sky-900">
                    <span className="font-bold text-sm block">{verifiedStudent.attendanceRate}%</span>
                    <span className="text-[10px] text-sky-700">Lab Attendance</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 text-center pt-2">
                Issued by Arkashine Innovations Pvt. Ltd. under the National Soil Innovation Mandate.
              </p>
            </>
          ) : (
            <div className="py-6 text-center space-y-3">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900">
                <p className="font-bold text-sm">Certificate Record Not Verified</p>
                <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                  No issued certificate matching verification hash <span className="font-mono font-semibold break-all">{hashToCheck || '(none)'}</span> was found in the official registry.
                </p>
                <p className="text-[11px] text-rose-600 mt-2">
                  Certificates must satisfy all 72-hour curriculum, practical, attendance, and capstone milestones before being authenticated.
                </p>
              </div>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold text-xs transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
