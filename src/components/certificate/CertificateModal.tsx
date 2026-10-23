import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle, 
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student } from '../../types';
import { storageService } from '../../services/storageService';
import { QrVerificationModal } from './QrVerificationModal';
import { useModalA11y } from '../../hooks/useModalA11y';

interface CertificateModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated?: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  student,
  isOpen,
  onClose,
  onStatusUpdated
}) => {
  const [showQrVerify, setShowQrVerify] = useState(false);
  const [issueError, setIssueError] = useState<string | null>(null);
  const { containerRef } = useModalA11y({ isOpen, onClose });

  if (!isOpen || !student) return null;

  const school = storageService.getSchool(student.schoolId);
  const isIssued = student.certificateStatus === 'Issued';
  const isEligible = student.certificateStatus === 'Eligible';
  const isIncomplete = student.certificateStatus === 'Incomplete_Data';

  const handleIssueCertificate = () => {
    const res = storageService.issueCertificate(student.id);
    if (!res.success) {
      setIssueError(res.message);
    } else {
      setIssueError(null);
      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      if (onStatusUpdated) onStatusUpdated();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cert-modal-title"
      >
        <div 
          ref={containerRef}
          tabIndex={-1}
          className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] focus:outline-hidden"
        >
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between no-print">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 id="cert-modal-title" className="text-base font-bold text-slate-900">
                  Young Scientist Certificate
                </h3>
                <p className="text-xs text-slate-500">
                  Student: {student.name} ({student.rollNo}) • {school?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isIssued && (
                <>
                  <button
                    onClick={() => setShowQrVerify(true)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-white text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <QrCode className="w-4 h-4 text-emerald-700" />
                    Verify Authenticity
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Printer className="w-4 h-4" />
                    Print / Download PDF
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* If Incomplete: Show Gating Alert and List of Missing Fields */}
            {isIncomplete && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  <span>Strict Certification Gate: Requirements Incomplete</span>
                </div>
                <p className="leading-relaxed">
                  Arkashine certification protocol strictly prohibits issuing credentials until all pedagogy, attendance, and field data are verified.
                </p>
                <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60 mt-2">
                  <p className="font-semibold mb-1">Required Items Pending Completion:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-amber-800">
                    {student.missingFields.map((field, idx) => (
                      <li key={idx}>{field}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* If Eligible but not yet issued */}
            {isEligible && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">All Requirements Completed!</h4>
                    <p className="text-emerald-700 text-xs">
                      Attendance: {student.attendanceRate}% • 4/4 Modules Passed • Practicals Verified. Ready for issuance.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleIssueCertificate}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-98"
                >
                  Issue Official Certificate Now
                </button>
              </div>
            )}

            {issueError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
                {issueError}
              </div>
            )}

            {/* Branded Certificate Preview Canvas */}
            <div className="relative mx-auto w-full max-w-2xl bg-amber-50/20 border-8 border-[#1B4D3E]/90 rounded-2xl p-6 sm:p-10 shadow-lg certificate-print-page overflow-hidden">
              
              {/* Background watermark leaf motif */}
              <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
                <img
                  src="/assets/images/certificate-bg.webp"
                  alt="Decorative watermark background pattern"
                  width={800}
                  height={560}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Certificate Inner Frame */}
              <div className="relative border-2 border-[#1B4D3E]/30 rounded-xl p-6 text-center space-y-4">
                
                {/* Certificate Header */}
                <div className="space-y-1">
                  <div className="flex items-center justify-center gap-2 text-emerald-800 font-bold text-sm uppercase tracking-widest">
                    <span>Arkashine Innovations</span>
                    <span>•</span>
                    <span>School Innovation Lab</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#143D30] tracking-tight font-serif">
                    YOUNG SCIENTIST CERTIFICATE
                  </h1>
                  <p className="text-xs uppercase tracking-wider text-amber-800 font-semibold">
                    Summer Innovation Program • 72 Hours Pedagogy & Fieldwork
                  </p>
                </div>

                {/* Recipient */}
                <div className="py-2">
                  <p className="text-xs text-slate-500 italic">This certifies that</p>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 border-b-2 border-emerald-800/20 inline-block px-8 py-1 mt-1 font-serif">
                    {student.name}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1.5 font-medium">
                    of <strong>{school?.name}</strong> (Class {student.classGrade})
                  </p>
                </div>

                {/* Statement of Achievement */}
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                  has successfully mastered the comprehensive 8-step soil testing curriculum, completed <strong>{student.practicalsDone} laboratory practicals</strong> utilizing the <strong>SoiLENZ Handheld Digital Sensor</strong>, and provided precision soil health advisory to <strong>{student.outreachFarmersCount} farming families</strong>.
                </p>

                {/* Signatures & QR Section */}
                <div className="pt-6 mt-4 border-t border-slate-200/80 grid grid-cols-3 items-end text-xs">
                  {/* Left Signature: Faculty */}
                  <div className="text-center">
                    <p className="font-serif italic text-slate-800 text-sm">Dr. Anjali Patil</p>
                    <div className="w-24 h-0.5 bg-slate-300 mx-auto my-1" />
                    <p className="text-[10px] uppercase font-bold text-slate-500">Faculty Coordinator</p>
                  </div>

                  {/* Center: Unique ID & QR Stamp */}
                  <div className="text-center space-y-1">
                    <div className="w-14 h-14 bg-white p-1 rounded-lg border border-slate-300 mx-auto shadow-2xs flex items-center justify-center">
                      <QrCode className="w-10 h-10 text-slate-800" />
                    </div>
                    <p className="text-[10px] font-mono font-bold text-slate-700">
                      {student.certificateId || 'CERT-PENDING-APPROVAL'}
                    </p>
                  </div>

                  {/* Right Signature: Arkashine Co-Founder & CEO */}
                  <div className="text-center">
                    <p className="font-serif italic text-slate-800 text-sm">Dr. Sudha R. Karbari</p>
                    <div className="w-24 h-0.5 bg-slate-300 mx-auto my-1" />
                    <p className="text-[10px] uppercase font-bold text-slate-500">Co-Founder & CEO, Arkashine</p>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Footer Close */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 text-right no-print">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl"
            >
              Close Preview
            </button>
          </div>

        </div>
      </div>

      {/* Public QR Verification Modal */}
      {showQrVerify && (
        <QrVerificationModal
          student={student}
          school={school}
          isOpen={true}
          onClose={() => setShowQrVerify(false)}
        />
      )}
    </>
  );
};
