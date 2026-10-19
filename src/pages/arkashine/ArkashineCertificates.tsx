import React, { useState } from 'react';
import { 
  Award, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Printer, 
  Download, 
  ShieldCheck, 
  QrCode,
  Users,
  Sparkles
} from 'lucide-react';
import { Student, School } from '../../types';
import { storageService } from '../../services/storageService';
import { StatusChip } from '../../components/common/StatusChip';
import { CertificateModal } from '../../components/certificate/CertificateModal';

export const ArkashineCertificates: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(storageService.getStudents());
  const schools = storageService.getSchools();
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentForCert, setSelectedStudentForCert] = useState<Student | null>(null);
  const [bulkMessage, setBulkMessage] = useState<string | null>(null);

  const refreshList = () => {
    setStudents(storageService.getStudents());
  };

  const filteredStudents = students.filter(s => {
    if (selectedSchoolId !== 'all' && s.schoolId !== selectedSchoolId) return false;
    if (statusFilter !== 'all' && s.certificateStatus !== statusFilter) return false;
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase()) && !s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const eligibleCount = students.filter(s => s.certificateStatus === 'Eligible').length;
  const issuedCount = students.filter(s => s.certificateStatus === 'Issued').length;
  const incompleteCount = students.filter(s => s.certificateStatus === 'Incomplete_Data').length;

  const handleBulkIssue = () => {
    let totalIssued = 0;
    const targetSchools = selectedSchoolId === 'all' 
      ? ['SCH-01', 'SCH-02', 'SCH-03'] 
      : [selectedSchoolId];

    for (const sId of targetSchools) {
      const res = storageService.bulkIssueEligibleCertificates(sId);
      totalIssued += res.count;
    }

    refreshList();
    setBulkMessage(`Bulk issuance complete: ${totalIssued} eligible certificates issued!`);
    setTimeout(() => setBulkMessage(null), 5000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Soil Partner Certification Gate
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Strict automated validation: ≥80% attendance, 4 module passes, practicals, and field capstone required.
          </p>
        </div>

        {/* Bulk Action */}
        <div className="flex items-center gap-2">
          <button
            disabled={eligibleCount === 0}
            onClick={handleBulkIssue}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-2 transition-all shadow-xs active:scale-98"
          >
            <Sparkles className="w-4 h-4" />
            Bulk Issue All Eligible ({eligibleCount})
          </button>
        </div>
      </div>

      {bulkMessage && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-2xl text-xs font-semibold text-emerald-900 animate-in fade-in duration-200">
          {bulkMessage}
        </div>
      )}

      {/* KPI Pipeline Status Pills */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setStatusFilter(statusFilter === 'Issued' ? 'all' : 'Issued')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'Issued' ? 'bg-emerald-100 border-emerald-300 ring-2 ring-emerald-600' : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Issued & Active</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{issuedCount}</span>
          <span className="text-[11px] text-slate-500">QR-verified credentials</span>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'Eligible' ? 'all' : 'Eligible')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'Eligible' ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-600' : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">Eligible for Issuance</span>
          <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">{eligibleCount}</span>
          <span className="text-[11px] text-slate-500">All gates passed</span>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'Incomplete_Data' ? 'all' : 'Incomplete_Data')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            statusFilter === 'Incomplete_Data' ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-600' : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Incomplete Data (Blocked)</span>
          <span className="text-2xl font-extrabold text-amber-700 mt-1 block">{incompleteCount}</span>
          <span className="text-[11px] text-slate-500">Requirements pending</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 flex items-center justify-between flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-500">School:</span>
          <select
            value={selectedSchoolId}
            onChange={(e) => setSelectedSchoolId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 font-medium"
          >
            <option value="all">All Participating Schools</option>
            {schools.filter(s => s.status === 'Running').map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student or roll number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 w-56"
          />
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
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map(stu => {
                const isReady = stu.certificateStatus === 'Eligible' || stu.certificateStatus === 'Issued';
                return (
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
                      <div className="flex items-center gap-1.5">
                        <span className={`font-bold ${stu.attendanceRate >= 80 ? 'text-emerald-700' : 'text-amber-700'}`}>
                          {stu.attendanceRate}%
                        </span>
                        {stu.attendanceRate < 80 && (
                          <span className="text-[10px] text-amber-600 font-medium">(Below 80%)</span>
                        )}
                      </div>
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
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                          stu.certificateStatus === 'Issued'
                            ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900'
                            : (stu.certificateStatus === 'Eligible'
                              ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700')
                        }`}
                      >
                        {stu.certificateStatus === 'Issued' 
                          ? 'View Certificate' 
                          : (stu.certificateStatus === 'Eligible' ? 'Issue Certificate' : 'Inspect Gating')}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedStudentForCert && (
        <CertificateModal
          student={selectedStudentForCert}
          isOpen={true}
          onClose={() => setSelectedStudentForCert(null)}
          onStatusUpdated={() => {
            refreshList();
            setSelectedStudentForCert(storageService.getStudent(selectedStudentForCert.id) || null);
          }}
        />
      )}

    </div>
  );
};
