import React, { useState } from 'react';
import { 
  Users, 
  AlertTriangle, 
  Search,
  FlaskConical,
  ShieldCheck,
  Award,
  CheckCircle2,
  FileCheck2,
  Filter
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
  const [filterMode, setFilterMode] = useState<'all' | 'under70' | 'borderline' | 'safe'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentForCert, setSelectedStudentForCert] = useState<Student | null>(null);

  // 70% Compulsory Attendance Gate logic
  const under70Students = students.filter(s => s.attendanceRate < 70);
  const borderlineStudents = students.filter(s => s.attendanceRate >= 70 && s.attendanceRate < 75);
  const safeStudents = students.filter(s => s.attendanceRate >= 75);
  const parentConsentVerifiedCount = students.filter(s => s.parentConsentSigned !== false).length;

  const displayedStudents = students.filter(s => {
    if (filterMode === 'under70' && s.attendanceRate >= 70) return false;
    if (filterMode === 'borderline' && (s.attendanceRate < 70 || s.attendanceRate >= 75)) return false;
    if (filterMode === 'safe' && s.attendanceRate < 75) return false;
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase()) && !s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Lab Image */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch justify-between">
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <Users className="w-3 h-3 text-emerald-700" />
                Student Cohort & Laboratory Risk Roster
              </span>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-700" />
                70% Attendance Gate Enforced
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              {school.name} — Student Cohort Progress
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Monitoring 18 enrolled students across laboratory practicals, SoiLENZ handheld device usage, and village farmer outreach. Verify chemical reagent safety permissions and track certification eligibility thresholds in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
            <span className="flex items-center gap-1.5 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {parentConsentVerifiedCount}/{students.length} Parental Permission Slips Verified
            </span>
            <span className="flex items-center gap-1.5 font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-100">
              <Award className="w-3.5 h-3.5 text-sky-600" />
              {students.length - under70Students.length}/{students.length} Eligible on 70% Attendance Rule
            </span>
            {under70Students.length > 0 && (
              <span className="flex items-center gap-1.5 font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                {under70Students.length} Student Below 70% (Ineligible)
              </span>
            )}
          </div>
        </div>

        <div className="w-full md:w-64 h-40 md:h-auto bg-slate-100 overflow-hidden shrink-0 border-t md:border-t-0 md:border-l border-slate-100 relative group">
          <img
            src="/assets/images/student-lab-discovery.webp"
            alt="Student lab discovery"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent flex items-end p-3">
            <span className="text-[11px] font-semibold text-white">
              Cohort Laboratory Testing
            </span>
          </div>
        </div>
      </div>

      {/* Mandatory Chemical Reagent & 70% Attendance Compliance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Card 1: Chemical Safety & Parental Permission Mandate */}
        <div className="bg-amber-50/70 rounded-2xl p-5 border border-amber-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-950 font-bold text-xs uppercase tracking-wider">
              <FlaskConical className="w-4 h-4 text-amber-700" />
              <span>Lab Chemical Reagents Mandate</span>
            </div>
            <span className="bg-amber-200 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
              Compulsory Permission
            </span>
          </div>
          <h3 className="font-extrabold text-sm text-slate-900">
            Need Permission from Parents (Chemical Reagents Used)
          </h3>
          <p className="text-xs text-amber-900/90 leading-relaxed">
            Soil testing practicals require students to handle chemical reagents, extraction buffer solutions, and colorimetric indicators during SoiLENZ sensor calibration and nutrient analysis. <strong>Signed parental permission is compulsory</strong> prior to participating in chemical testing.
          </p>
          <div className="bg-white/80 p-3 rounded-xl border border-amber-200 text-[11px] flex items-center justify-between text-slate-700">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-800">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
              100% Parental Consent Slips Signed & Filed
            </span>
            <span className="text-slate-500 font-medium">PPE Kits Issued</span>
          </div>
        </div>

        {/* Card 2: 70% Compulsory Attendance Gate */}
        <div className="bg-emerald-50/70 rounded-2xl p-5 border border-emerald-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs uppercase tracking-wider">
              <Award className="w-4 h-4 text-emerald-700" />
              <span>Certification Policy Gate</span>
            </div>
            <span className="bg-emerald-200 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
              70% Min Compulsory
            </span>
          </div>
          <h3 className="font-extrabold text-sm text-slate-900">
            70% Attendance is Compulsory for Certificate Eligibility
          </h3>
          <p className="text-xs text-emerald-950/90 leading-relaxed">
            <strong>70% attendance is strictly compulsory</strong>; students will only get the certificates if they meet or exceed 70% attendance. <strong>Otherwise, the student is strictly not eligible to receive the certificate</strong> and must complete mandatory compensatory lab practicals.
          </p>
          <div className="bg-white/80 p-3 rounded-xl border border-emerald-200 text-[11px] flex items-center justify-between text-slate-700">
            <span className="font-semibold text-slate-800">
              {students.length - under70Students.length} of {students.length} Students Qualified for Issuance
            </span>
            <span className="text-rose-700 font-bold">
              {under70Students.length} Blocked (&lt;70%)
            </span>
          </div>
        </div>

      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student by name or roll number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 text-slate-800"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" />
            Filter:
          </span>
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterMode === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({students.length})
          </button>
          <button
            onClick={() => setFilterMode('under70')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              filterMode === 'under70'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            Below 70% Ineligible ({under70Students.length})
          </button>
          <button
            onClick={() => setFilterMode('borderline')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterMode === 'borderline'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            70–74% Borderline ({borderlineStudents.length})
          </button>
          <button
            onClick={() => setFilterMode('safe')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterMode === 'safe'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            ≥75% Safe ({safeStudents.length})
          </button>
        </div>
      </div>

      {/* Student Cards Grid with Progress Rings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedStudents.map(student => {
          const isUnder70 = student.attendanceRate < 70;
          const isBorderline = student.attendanceRate >= 70 && student.attendanceRate < 75;

          return (
            <div
              key={student.id}
              className={`p-5 rounded-3xl border bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                isUnder70
                  ? 'border-rose-300 ring-2 ring-rose-100 bg-rose-50/10'
                  : (isBorderline ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200/90')
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-11 h-11 rounded-2xl border border-slate-200 bg-slate-100 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{student.name}</h4>
                      <p className="text-[11px] text-slate-500">Roll: {student.rollNo} • Class {student.classGrade}</p>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          Team {student.groupNumber}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          Parent Consent Signed
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Attendance Progress Ring */}
                  <div className="shrink-0 flex flex-col items-center">
                    <ScoreRing
                      score={student.attendanceRate}
                      size={54}
                      strokeWidth={6}
                      showPercent={true}
                    />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                      Attendance
                    </span>
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
                  <div className="flex justify-between">
                    <span>Chemical Safety Slip:</span>
                    <span className="font-bold text-emerald-700">✓ On Record</span>
                  </div>
                </div>

                {/* Critical Risk / Borderline Notification Alert */}
                {isUnder70 ? (
                  <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-rose-800">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                      <span>Not Eligible for Certificate (&lt;70% Attendance)</span>
                    </div>
                    <p className="text-[10px] text-rose-700 leading-tight">
                      Attendance at {student.attendanceRate}% is strictly below the compulsory 70% bar. Student is not eligible for certificate until compensatory lab practicals are completed.
                    </p>
                  </div>
                ) : isBorderline ? (
                  <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span>Attendance at {student.attendanceRate}% meets the 70% bar but requires close monitoring to avoid falling behind.</span>
                  </div>
                ) : (
                  <div className="mt-3 p-2 rounded-xl bg-emerald-50/60 border border-emerald-100 text-[10px] text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>Eligible for certificate: Attendance exceeds the compulsory 70% threshold.</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <StatusChip status={student.certificateStatus} size="sm" />
                <button
                  onClick={() => setSelectedStudentForCert(student)}
                  className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 hover:underline cursor-pointer"
                >
                  View Dossier →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {displayedStudents.length === 0 && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-slate-500">
          No students match the selected filter criteria.
        </div>
      )}

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
