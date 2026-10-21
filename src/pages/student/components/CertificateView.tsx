import React from 'react';
import { Award, Printer, Lock } from 'lucide-react';
import { Student } from '../../../types';

interface CertificateViewProps {
  student: Student;
  onOpenCertModal: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({
  student,
  onOpenCertModal
}) => {
  const isCertReady = student.certificateStatus === 'Issued' || student.certificateStatus === 'Eligible';

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs text-center space-y-4">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3 shadow-sm">
          <Award className="w-8 h-8" />
        </div>

        <h3 className="text-lg font-bold text-slate-900">
          Soil Partner Completion Certificate
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Issued under the National Soil Innovation Mandate by Arkashine Innovations Pvt. Ltd.
        </p>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 my-4 text-xs space-y-2 text-left">
          <div className="flex justify-between">
            <span className="text-slate-500">Attendance Bar (≥80%):</span>
            <span className="font-bold text-emerald-700">{student.attendanceRate}% (Passed)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Modules Completed:</span>
            <span className="font-bold text-slate-800">{student.modulesCompleted} of 4 Modules</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">SoiLENZ Handheld Scans:</span>
            <span className="font-bold text-slate-800">{student.soilSamplesTestedCount} Tests Logged</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Farmer Advisory Completed:</span>
            <span className="font-bold text-slate-800">{student.outreachFarmersCount} Farmers</span>
          </div>
        </div>

        <button
          onClick={onOpenCertModal}
          disabled={!isCertReady}
          className={`w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
            isCertReady
              ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isCertReady ? (
            <>
              <Printer className="w-4 h-4" />
              View & Print Official Certificate
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Locked (Complete remaining requirements)
            </>
          )}
        </button>

        {!isCertReady && student.missingFields.length > 0 && (
          <div className="mt-3 text-left p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 space-y-1">
            <p className="font-bold">Pending Milestones:</p>
            {student.missingFields.map((m, idx) => (
              <p key={idx} className="flex items-center gap-1.5">• {m}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
