import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Award, 
  FlaskConical, 
  FileCheck2, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight,
  X,
  CalendarCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { Student } from '../../types';

export const FacultyStudents: React.FC = () => {
  const { activeSchoolId } = useAuth();
  const school = storageService.getSchool(activeSchoolId) || storageService.getSchools()[0];
  const [students, setStudents] = useState<Student[]>(() => storageService.getStudents(school.id));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<number | 'all'>('all');
  const [attendanceFilter, setAttendanceFilter] = useState<'all' | 'safe' | 'warning' | 'risk'>('all');
  const [certFilter, setCertFilter] = useState<'all' | 'eligible' | 'pending'>('all');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);

  const refreshStudents = () => {
    setStudents([...storageService.getStudents(school.id)]);
  };

  const handleIncrementPractical = (stu: Student) => {
    stu.practicalsDone = Math.min(8, stu.practicalsDone + 1);
    // Auto-update certificate eligibility
    if (stu.practicalsDone >= 6 && stu.attendanceRate >= 75 && stu.modulesCompleted >= 4 && stu.capstoneSubmitted) {
      if (stu.certificateStatus !== 'Issued') stu.certificateStatus = 'Eligible';
    }
    storageService.saveStudent(stu);
    refreshStudents();
  };

  const handleDecrementPractical = (stu: Student) => {
    stu.practicalsDone = Math.max(0, stu.practicalsDone - 1);
    if (stu.practicalsDone < 6 && stu.certificateStatus === 'Eligible') {
      stu.certificateStatus = 'Incomplete_Data';
    }
    storageService.saveStudent(stu);
    refreshStudents();
  };

  const handleToggleCapstone = (stu: Student) => {
    stu.capstoneSubmitted = !stu.capstoneSubmitted;
    if (stu.capstoneSubmitted && stu.practicalsDone >= 6 && stu.attendanceRate >= 75 && stu.modulesCompleted >= 4) {
      if (stu.certificateStatus !== 'Issued') stu.certificateStatus = 'Eligible';
    } else if (!stu.capstoneSubmitted && stu.certificateStatus === 'Eligible') {
      stu.certificateStatus = 'Incomplete_Data';
    }
    storageService.saveStudent(stu);
    refreshStudents();
  };

  const handleQuickMarkAttendance = (stu: Student, status: 'present' | 'late' | 'absent') => {
    const totalLogged = (stu.totalLoggedDays || 20) + 1;
    let presentDays = stu.totalPresentDays || 19;
    if (status === 'present' || status === 'late') {
      presentDays += 1;
    }
    stu.totalLoggedDays = totalLogged;
    stu.totalPresentDays = presentDays;
    stu.attendanceRate = Math.min(100, Math.round((presentDays / totalLogged) * 100));
    storageService.saveStudent(stu);
    refreshStudents();
  };

  // KPI Calculations
  const totalStudents = students.length;
  const avgAttendance = useMemo(() => {
    if (totalStudents === 0) return 0;
    const sum = students.reduce((acc, s) => acc + (s.attendanceRate || 0), 0);
    return Math.round(sum / totalStudents);
  }, [students, totalStudents]);

  const totalPracticalsDone = useMemo(() => {
    return students.reduce((acc, s) => acc + (s.practicalsDone || 0), 0);
  }, [students]);

  const capstoneSubmittedCount = useMemo(() => {
    return students.filter(s => s.capstoneSubmitted).length;
  }, [students]);

  const eligibleCertCount = useMemo(() => {
    return students.filter(s => s.certificateStatus === 'Eligible' || s.certificateStatus === 'Issued').length;
  }, [students]);

  // Filtering
  const filtered = useMemo(() => {
    return students.filter(s => {
      const matchesSearch = 
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.rollNo.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGroup = selectedGroup === 'all' || s.groupNumber === selectedGroup;

      let matchesAttendance = true;
      if (attendanceFilter === 'safe') matchesAttendance = s.attendanceRate >= 85;
      else if (attendanceFilter === 'warning') matchesAttendance = s.attendanceRate >= 75 && s.attendanceRate < 85;
      else if (attendanceFilter === 'risk') matchesAttendance = s.attendanceRate < 75;

      let matchesCert = true;
      if (certFilter === 'eligible') matchesCert = s.certificateStatus === 'Eligible' || s.certificateStatus === 'Issued';
      else if (certFilter === 'pending') matchesCert = s.certificateStatus !== 'Eligible' && s.certificateStatus !== 'Issued';

      return matchesSearch && matchesGroup && matchesAttendance && matchesCert;
    });
  }, [students, searchQuery, selectedGroup, attendanceFilter, certFilter]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 font-black text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-700" />
              <span>Faculty Academic Console</span>
            </span>
            <span className="text-xs font-bold text-slate-400">Class 8–10 Soil Partners</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Student Roster, Attendance & Laboratory Tracker
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {school.name} • {school.code} • Teacher Coordinator: <strong className="text-slate-700">{school.facultyName}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Cohort</span>
            <span className="text-sm font-black text-slate-900">{totalStudents} Certified Trainees</span>
          </div>
        </div>
      </div>

      {/* 5 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Enrolled Students</span>
            <Users className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalStudents}</div>
          <p className="text-[11px] text-slate-400">5 Micro-field groups</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Avg Attendance</span>
            <CalendarCheck className="w-4 h-4 text-purple-700" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{avgAttendance}%</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              {avgAttendance >= 75 ? 'Healthy' : 'At Risk'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Target: ≥75% threshold</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Practicals Done</span>
            <FlaskConical className="w-4 h-4 text-teal-700" />
          </div>
          <div className="text-2xl font-black text-teal-900">
            {totalPracticalsDone} <span className="text-xs font-normal text-slate-400">/ {totalStudents * 8}</span>
          </div>
          <p className="text-[11px] text-slate-400">Avg: {(totalPracticalsDone / (totalStudents || 1)).toFixed(1)} / 8 per student</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Capstones Done</span>
            <FileCheck2 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-900">
            {capstoneSubmittedCount} <span className="text-xs font-normal text-slate-400">/ {totalStudents}</span>
          </div>
          <p className="text-[11px] text-slate-400">{Math.round((capstoneSubmittedCount / (totalStudents || 1)) * 100)}% Submitted</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Certificate Ready</span>
            <Award className="w-4 h-4 text-[#5C26C0]" />
          </div>
          <div className="text-2xl font-black text-[#5C26C0]">
            {eligibleCertCount} <span className="text-xs font-normal text-slate-400">/ {totalStudents}</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold">{totalStudents - eligibleCertCount} In Progress</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
          
          {/* Search */}
          <div className="relative w-full lg:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student name or roll..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          {/* Group Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full lg:w-auto p-1 bg-slate-100 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setSelectedGroup('all')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedGroup === 'all' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Groups ({totalStudents})
            </button>
            {[1, 2, 3, 4, 5].map(grp => {
              const count = students.filter(s => s.groupNumber === grp).length;
              return (
                <button
                  key={grp}
                  onClick={() => setSelectedGroup(grp)}
                  className={`px-2.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    selectedGroup === grp ? 'bg-emerald-800 text-white shadow-2xs font-extrabold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Group {grp} ({count})
                </button>
              );
            })}
          </div>

          {/* Attendance Risk & Cert Status Dropdowns */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <select
              value={attendanceFilter}
              onChange={(e) => setAttendanceFilter(e.target.value as 'all' | 'safe' | 'warning' | 'risk')}
              className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer focus:outline-hidden"
              aria-label="Filter by attendance status"
            >
              <option value="all">All Attendance</option>
              <option value="safe">Safe (≥85%)</option>
              <option value="warning">Warning (75-84%)</option>
              <option value="risk">At Risk (&lt;75%)</option>
            </select>

            <select
              value={certFilter}
              onChange={(e) => setCertFilter(e.target.value as 'all' | 'eligible' | 'pending')}
              className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer focus:outline-hidden"
              aria-label="Filter by certificate readiness"
            >
              <option value="all">All Readiness</option>
              <option value="eligible">Eligible / Ready</option>
              <option value="pending">Action Required</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Roster Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <span>Showing {filtered.length} of {totalStudents} Student Scientists</span>
          </div>
          <span className="text-slate-500 font-medium">
            Requirements: 8 Practicals • 4 Modules • ≥75% Attendance • Capstone Submitted
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="p-3.5">Student Profile</th>
                <th className="p-3.5">Group</th>
                <th className="p-3.5">Attendance Rate</th>
                <th className="p-3.5 text-center">Modules Passed</th>
                <th className="p-3.5 text-center">SoiLENZ Practicals</th>
                <th className="p-3.5 text-center">Capstone Status</th>
                <th className="p-3.5 text-center">Soil Partner Gating</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(stu => {
                const initials = stu.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                const isAttendanceLow = stu.attendanceRate < 75;
                const isReady = stu.certificateStatus === 'Eligible' || stu.certificateStatus === 'Issued';

                return (
                  <tr key={stu.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Student Profile */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 text-[#5C26C0] font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          {initials}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 text-xs sm:text-sm hover:text-emerald-700 cursor-pointer" onClick={() => setSelectedStudentForModal(stu)}>
                            {stu.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {stu.rollNo} • Class {stu.classGrade} ({stu.gender})
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Group Badge */}
                    <td className="p-3.5">
                      <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-800 font-extrabold text-[11px] border border-slate-200 inline-block">
                        Group {stu.groupNumber}
                      </span>
                    </td>

                    {/* Attendance Rate with Bar */}
                    <td className="p-3.5">
                      <div className="space-y-1 w-32">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className={`font-black ${isAttendanceLow ? 'text-rose-600' : 'text-slate-800'}`}>
                            {stu.attendanceRate}%
                          </span>
                          <span className="text-slate-400 text-[10px]">
                            {stu.totalPresentDays}/{stu.totalLoggedDays || 20}d
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div 
                            style={{ width: `${stu.attendanceRate}%` }}
                            className={`h-full rounded-full ${
                              isAttendanceLow ? 'bg-rose-500' : stu.attendanceRate >= 85 ? 'bg-emerald-500' : 'bg-amber-400'
                            }`}
                          />
                        </div>
                        {/* Quick Mark Attendance for Today */}
                        <div className="flex items-center gap-1 pt-0.5">
                          <button
                            type="button"
                            onClick={() => handleQuickMarkAttendance(stu, 'present')}
                            className="px-1.5 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[9px] border border-emerald-200 cursor-pointer"
                            title="Mark present today"
                          >
                            +Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickMarkAttendance(stu, 'absent')}
                            className="px-1.5 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[9px] border border-rose-200 cursor-pointer"
                            title="Mark absent today"
                          >
                            +Absent
                          </button>
                        </div>
                      </div>
                    </td>

                    {/* Modules Passed */}
                    <td className="p-3.5 text-center">
                      <span className={`px-2.5 py-1 rounded-xl font-black text-xs ${
                        stu.modulesCompleted >= 4
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {stu.modulesCompleted} / 4
                      </span>
                    </td>

                    {/* Practicals Done Stepper */}
                    <td className="p-3.5 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => handleDecrementPractical(stu)}
                          className="w-6 h-6 rounded-xl bg-white hover:bg-slate-200 font-black text-slate-700 flex items-center justify-center cursor-pointer shadow-2xs border border-slate-200 transition-colors"
                          title="Decrease practical count"
                        >
                          -
                        </button>
                        <span className="font-extrabold text-slate-900 px-1 text-xs">
                          {stu.practicalsDone} <span className="text-[10px] text-slate-400">/ 8</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleIncrementPractical(stu)}
                          className="w-6 h-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black flex items-center justify-center cursor-pointer shadow-2xs transition-colors"
                          title="Increment completed practical"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Capstone Status */}
                    <td className="p-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleCapstone(stu)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 mx-auto shadow-2xs ${
                          stu.capstoneSubmitted
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {stu.capstoneSubmitted ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Submitted</span>
                          </>
                        ) : (
                          <span>Pending</span>
                        )}
                      </button>
                    </td>

                    {/* Certificate Gating */}
                    <td className="p-3.5 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-black inline-flex items-center gap-1 ${
                        isReady
                          ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                          : 'bg-amber-100 text-amber-950 border border-amber-300'
                      }`}>
                        {isReady ? <CheckCircle2 className="w-3 h-3 text-emerald-700" /> : <AlertTriangle className="w-3 h-3 text-amber-600" />}
                        <span>{stu.certificateStatus.replace(/_/g, ' ')}</span>
                      </span>
                    </td>

                    {/* View Details */}
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedStudentForModal(stu)}
                        className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                        title="View Full Student Record"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No students match the selected filter or search term.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Profile Quick Drawer / Modal */}
      {selectedStudentForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#5C26C0] text-white flex items-center justify-center font-black text-lg">
                  {selectedStudentForModal.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {selectedStudentForModal.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Roll: {selectedStudentForModal.rollNo} • Group {selectedStudentForModal.groupNumber} • Class {selectedStudentForModal.classGrade}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentForModal(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Statistics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Attendance Rate</span>
                <span className="text-lg font-black text-slate-900">{selectedStudentForModal.attendanceRate}%</span>
                <p className="text-[10px] text-slate-500 mt-0.5">{selectedStudentForModal.totalPresentDays} present / {selectedStudentForModal.totalLoggedDays || 20} days</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Field Outreach</span>
                <span className="text-lg font-black text-emerald-800">{selectedStudentForModal.outreachFarmersCount} Farmers</span>
                <p className="text-[10px] text-slate-500 mt-0.5">{selectedStudentForModal.soilSamplesTestedCount} soil samples tested</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Academic Quizzes</span>
                <span className="text-lg font-black text-purple-900">{selectedStudentForModal.quizScore} / 100</span>
                <p className="text-[10px] text-slate-500 mt-0.5">Assignment: {selectedStudentForModal.assignmentScore}/100</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Certificate Gating</span>
                <span className="text-sm font-black text-emerald-800">{selectedStudentForModal.certificateStatus}</span>
                <p className="text-[10px] text-slate-500 mt-0.5">Capstone: {selectedStudentForModal.capstoneSubmitted ? 'Approved' : 'Pending'}</p>
              </div>
            </div>

            {/* Badges Earned */}
            <div>
              <span className="text-xs font-bold text-slate-700 block mb-2">Unlocked Badges ({selectedStudentForModal.badgeIds.length})</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedStudentForModal.badgeIds.map(b => (
                  <span key={b} className="px-2.5 py-1 rounded-xl bg-purple-50 text-[#5C26C0] border border-purple-200 text-xs font-bold">
                    🏅 {b.replace('badge-', '').replace('-', ' ').toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedStudentForModal(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
