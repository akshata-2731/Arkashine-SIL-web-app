import React, { useState } from 'react';
import { 
  Award, 
  Search, 
  ShieldCheck, 
  Printer
} from 'lucide-react';
import { Student } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { StatusChip } from '../../components/common/StatusChip';
import { CertificateModal } from '../../components/certificate/CertificateModal';

export const PrincipalCertificates: React.FC = () => {
  const { activeSchoolId } = useAuth();
  const school = storageService.getSchool(activeSchoolId) || storageService.getSchools()[0];
  const [students, setStudents] = useState<Student[]>(() => storageService.getStudents(school.id));
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentForCert, setSelectedStudentForCert] = useState<Student | null>(null);

  const refreshList = () => {
    setStudents(storageService.getStudents(school.id));
  };

  const filteredStudents = students.filter(s => {
    if (statusFilter !== 'all' && s.certificateStatus !== statusFilter) return false;
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase()) && !s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const eligibleCount = students.filter(s => s.certificateStatus === 'Eligible').length;
  const issuedCount = students.filter(s => s.certificateStatus === 'Issued').length;
  const incompleteCount = students.filter(s => s.certificateStatus === 'Incomplete_Data').length;

  return (
    <div className="space-y-6">
      {/* Principal Certificates Header (Read-Only Variant) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              School Student Certificates
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] uppercase">
              Principal View (Read-Only)
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {school.name} • Official Soil Partner completion records and verification credentials
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-900 text-center min-w-[90px]">
            <span className="text-lg font-bold block">{issuedCount}</span>
            <span className="text-[10px] text-emerald-700 font-semibold">Issued</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-sky-50 border border-sky-100 text-sky-900 text-center min-w-[90px]">
            <span className="text-lg font-bold block">{eligibleCount}</span>
            <span className="text-[10px] text-sky-700 font-semibold">Ready for HQ</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-amber-50 border border-amber-100 text-amber-900 text-center min-w-[90px]">
            <span className="text-lg font-bold block">{incompleteCount}</span>
            <span className="text-[10px] text-amber-700 font-semibold">In Progress</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search student by name or roll number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-slate-500 font-medium shrink-0">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-emerald-500"
          >
            <option value="all">All Statuses ({students.length})</option>
            <option value="Issued">Issued ({issuedCount})</option>
            <option value="Eligible">Eligible ({eligibleCount})</option>
            <option value="Incomplete_Data">Incomplete ({incompleteCount})</option>
          </select>
        </div>
      </div>

      {/* Student Certification Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="p-3.5">Student & Roll No</th>
                <th className="p-3.5">Group</th>
                <th className="p-3.5">Attendance</th>
                <th className="p-3.5">Modules & Practicals</th>
                <th className="p-3.5">Outreach</th>
                <th className="p-3.5">Gate Status</th>
                <th className="p-3.5 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map(stu => (
                <tr key={stu.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={stu.avatar}
                        alt={stu.name}
                        className="w-8 h-8 rounded-full border border-slate-200 bg-slate-100"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{stu.name}</p>
                        <p className="text-[11px] text-slate-500">{stu.rollNo} • Class {stu.classGrade}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                      Team {stu.groupNumber}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className={`font-bold ${stu.attendanceRate >= 80 ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {stu.attendanceRate}%
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div>
                      <span className="font-semibold text-slate-800">{stu.modulesCompleted}/4 Modules</span>
                      <p className="text-[10px] text-slate-500">{stu.practicalsDone}/8 Practicals Done</p>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="font-semibold text-slate-800">{stu.outreachFarmersCount} Farmers</span>
                  </td>
                  <td className="p-3.5">
                    <StatusChip status={stu.certificateStatus} size="sm" />
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedStudentForCert(stu)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ml-auto ${
                        stu.certificateStatus === 'Issued'
                          ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {stu.certificateStatus === 'Issued' ? (
                        <>
                          <Printer className="w-3.5 h-3.5" />
                          View / Print
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3.5 h-3.5" />
                          View Criteria
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No student records matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedStudentForCert && (
        <CertificateModal
          student={selectedStudentForCert}
          isOpen={!!selectedStudentForCert}
          onClose={() => setSelectedStudentForCert(null)}
          onStatusUpdated={refreshList}
        />
      )}
    </div>
  );
};
