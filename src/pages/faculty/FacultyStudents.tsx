import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { Student } from '../../types';

export const FacultyStudents: React.FC = () => {
  const { activeSchoolId } = useAuth();
  const school = storageService.getSchool(activeSchoolId) || storageService.getSchools()[0];
  const [students, setStudents] = useState<Student[]>(storageService.getStudents(school.id));
  const [searchQuery, setSearchQuery] = useState('');

  const handleIncrementPractical = (stu: Student) => {
    stu.practicalsDone = Math.min(8, stu.practicalsDone + 1);
    storageService.saveStudent(stu);
    setStudents([...storageService.getStudents(school.id)]);
  };

  const handleDecrementPractical = (stu: Student) => {
    stu.practicalsDone = Math.max(0, stu.practicalsDone - 1);
    storageService.saveStudent(stu);
    setStudents([...storageService.getStudents(school.id)]);
  };

  const handleToggleCapstone = (stu: Student) => {
    stu.capstoneSubmitted = !stu.capstoneSubmitted;
    storageService.saveStudent(stu);
    setStudents([...storageService.getStudents(school.id)]);
  };

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Classroom Roster & Practical Exercises Tracker
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Log student SoiLENZ sensor practical completions, mark capstones, and track readiness for Soil Partner certification.
          </p>
        </div>

        <div className="text-xs font-bold bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200">
          Cohort: {students.length} Enrolled Students
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <input
            type="text"
            placeholder="Search student or roll number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-slate-800 w-64"
          />
          <span className="text-slate-500 font-medium">8 Mandatory Laboratory Practicals</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <th className="p-3.5">Student</th>
                <th className="p-3.5">Group</th>
                <th className="p-3.5 text-center">Attendance</th>
                <th className="p-3.5 text-center">Modules Passed</th>
                <th className="p-3.5 text-center">Practicals Done</th>
                <th className="p-3.5 text-center">Capstone Submitted</th>
                <th className="p-3.5 text-center">Cert Gating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(stu => (
                <tr key={stu.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5">
                    <p className="font-bold text-slate-900">{stu.name}</p>
                    <p className="text-[11px] text-slate-500">{stu.rollNo} • Class {stu.classGrade}</p>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                      Group {stu.groupNumber}
                    </span>
                  </td>
                  <td className="p-3.5 text-center font-bold text-slate-800">
                    {stu.attendanceRate}%
                  </td>
                  <td className="p-3.5 text-center font-bold text-emerald-800">
                    {stu.modulesCompleted} / 4
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-xl">
                      <button
                        onClick={() => handleDecrementPractical(stu)}
                        className="w-5 h-5 rounded-md bg-white hover:bg-slate-200 font-bold flex items-center justify-center text-slate-700"
                      >
                        -
                      </button>
                      <span className="font-bold text-slate-900 px-1">{stu.practicalsDone}/8</span>
                      <button
                        onClick={() => handleIncrementPractical(stu)}
                        className="w-5 h-5 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      onClick={() => handleToggleCapstone(stu)}
                      className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all ${
                        stu.capstoneSubmitted
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {stu.capstoneSubmitted ? 'Uploaded' : 'Pending'}
                    </button>
                  </td>
                  <td className="p-3.5 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      stu.certificateStatus === 'Eligible' || stu.certificateStatus === 'Issued'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {stu.certificateStatus.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
