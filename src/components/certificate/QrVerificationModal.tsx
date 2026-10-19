import React from 'react';
import { X, ShieldCheck, CheckCircle2, Award, Calendar, School as SchoolIcon, UserCheck, ExternalLink } from 'lucide-react';
import { Student, School } from '../../types';

interface QrVerificationModalProps {
  student: Student;
  school?: School;
  isOpen: boolean;
  onClose: () => void;
}

export const QrVerificationModal: React.FC<QrVerificationModalProps> = ({
  student,
  school,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Verification Banner */}
        <div className="bg-emerald-800 text-white p-6 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-emerald-900/60 hover:bg-emerald-900 text-emerald-100"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="w-16 h-16 rounded-2xl bg-white text-emerald-800 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-700/80 text-emerald-100 text-xs font-bold uppercase tracking-wider mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Official Verification
          </span>
          <h3 className="text-lg font-bold">Certificate Authenticated</h3>
          <p className="text-xs text-emerald-100/80 mt-1">
            Arkashine School Innovation Lab Registry
          </p>
        </div>

        {/* Verification Credentials */}
        <div className="p-6 space-y-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex justify-between text-slate-500">
              <span>Certificate ID:</span>
              <span className="font-mono font-bold text-slate-800">{student.certificateId || 'CERT-STX-101'}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Verification Hash:</span>
              <span className="font-mono text-emerald-700">{student.verifiedQrHash || 'ark-sil-sch01-101'}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Registry Status:</span>
              <span className="font-bold text-emerald-700">Active & Tamper-Proof</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Certified Student</span>
              <p className="text-base font-bold text-slate-900">{student.name}</p>
              <p className="text-slate-500">Roll: {student.rollNo} • Class {student.classGrade}</p>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Institution</span>
              <p className="font-semibold text-slate-800">{school?.name || 'St. Xavier’s Model School'}</p>
              <p className="text-slate-500">{school?.city}, {school?.state}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-900">
                <span className="font-bold text-sm block">72 Hours</span>
                <span className="text-[10px] text-emerald-700">Curriculum Completed</span>
              </div>
              <div className="p-2.5 rounded-lg bg-sky-50 text-sky-900">
                <span className="font-bold text-sm block">{student.attendanceRate}%</span>
                <span className="text-[10px] text-sky-700">Lab Attendance</span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center pt-2">
            Issued by Arkashine Innovations Pvt. Ltd. under the National Soil Innovation Mandate.
          </p>

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
