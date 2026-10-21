import React, { useState } from 'react';
import { 
  Users, 
  AlertTriangle, 
  Search
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { ScoreRing } from '../../components/common/ScoreRing';
import { StatusChip } from '../../components/common/StatusChip';
import { Student } from '../../types';
import { CertificateModal } from '../../components/certificate/CertificateModal';

export const PrincipalStudents: React.FC = () => {
  const { activeSchoolId } = useAuth();
  const school = storageService.getSchool(activeSchoolId) || storageService.getSchools()[0];
  const students = storageService.getStudents(school.id);
  const [filterAtRisk, setFilterAtRisk] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentForCert, setSelectedStudentForCert] = useState<Student | null>(null);

  const atRiskStudents = students.filter(s => s.attendanceRate < 80 || s.certificateStatus === 'Incomplete_Data');

  const displayedStudents = students.filter(s => {
    if (filterAtRisk && s.attendanceRate >= 80) return false;
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Student Cohort Progress & At-Risk Monitoring
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Attendance threshold is set at 80% for certificate eligibility. Monitor student laboratory progress in real-time.
          </p>
        </div>

        {/* Controls: Search + At-risk toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
            />
          </div>

          <button
            onClick={() => setFilterAtRisk(!filterAtRisk)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-xs ${
              filterAtRisk
                ? 'bg-rose-600 text-white'
                : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            {filterAtRisk ? 'Showing At-Risk Only' : `Highlight At-Risk Students (${atRiskStudents.length})`}
          </button>
        </div>
      </div>

      {/* Student Cards Grid with Progress Rings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedStudents.map(student => {
          const isAtRisk = student.attendanceRate < 80;

          return (
            <div
              key={student.id}
              className={`p-5 rounded-3xl border bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                isAtRisk ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200/90'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-11 h-11 rounded-2xl border border-slate-200 bg-slate-100"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{student.name}</h4>
                      <p className="text-[11px] text-slate-500">Roll: {student.rollNo} • Class {student.classGrade}</p>
                      <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        Team {student.groupNumber}
                      </span>
                    </div>
                  </div>

                  {/* Attendance Progress Ring */}
                  <div className="shrink-0">
                    <ScoreRing
                      score={student.attendanceRate}
                      size={54}
                      strokeWidth={6}
                      showPercent={true}
                    />
                  </div>
                </div>

                {/* Progress Stats */}
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 space-y-1.5 text-xs text-slate-600 mt-2">
                  <div className="flex justify-between">
                    <span>Curriculum Modules:</span>
                    <span className="font-bold text-slate-800">{student.modulesCompleted} / 4 Passed</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SoiLENZ Practicals:</span>
                    <span className="font-bold text-emerald-700">{student.practicalsDone} / 8 Completed</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Farmers Advised:</span>
                    <span className="font-bold text-slate-800">{student.outreachFarmersCount} Farmers</span>
                  </div>
                </div>

                {isAtRisk && (
                  <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span>Attendance at {student.attendanceRate}% is below the 80% certification bar. Faculty outreach required.</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <StatusChip status={student.certificateStatus} size="sm" />
                <button
                  onClick={() => setSelectedStudentForCert(student)}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 hover:underline"
                >
                  View Dossier →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedStudentForCert && (
        <CertificateModal
          student={selectedStudentForCert}
          isOpen={true}
          onClose={() => setSelectedStudentForCert(null)}
        />
      )}

    </div>
  );
};
