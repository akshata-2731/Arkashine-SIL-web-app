import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ArrowRight, 
  CheckCircle2, 
  Award, 
  Layers, 
  ChevronDown,
  UserPlus
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { Student } from '../../types';

export const StudentSelection: React.FC = () => {
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('SCH-01');
  const [selectedGroup, setSelectedGroup] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const schools = storageService.getSchools().filter(s => s.status === 'Running' || s.status === 'Lab_Setup');
  const students = storageService.getStudents(selectedSchoolId);

  // Group definitions
  const groupNames: Record<number, string> = {
    1: 'Soil Explorers',
    2: 'Earth Guardians',
    3: 'Carbon Trackers',
    4: 'Bio Innovators',
    5: 'Agro Scientists'
  };

  const filteredStudents = students.filter(s => {
    if (selectedGroup !== 'all' && s.groupNumber !== selectedGroup) return false;
    if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Student Screening & Cohort Selection Funnel
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Rigorous merit screening: 80-150 registered → Innovation Quiz → Practical assignment → Final 18 selected (5 groups of 4).
          </p>
        </div>

        {/* School Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Select School:</span>
          <select
            value={selectedSchoolId}
            onChange={(e) => setSelectedSchoolId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800"
          >
            {schools.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Visual Selection Funnel Graphic */}
      <div className="bg-gradient-to-br from-emerald-900 to-[#143D30] rounded-3xl p-6 text-white shadow-md">
        <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300 mb-4">
          Selection Funnel Architecture
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
          
          {/* Stage 1: Registered */}
          <div className="bg-white/10 rounded-2xl p-4 border border-white/10 relative">
            <span className="text-[10px] uppercase font-bold text-emerald-300">Stage 1</span>
            <p className="text-2xl font-black mt-1">118</p>
            <p className="text-xs font-semibold text-white/90">Registrations</p>
            <p className="text-[10px] text-emerald-200/70 mt-1">Classes VIII to XII</p>
            <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-emerald-400">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Stage 2: Innovation Quiz */}
          <div className="bg-white/10 rounded-2xl p-4 border border-white/10 relative">
            <span className="text-[10px] uppercase font-bold text-emerald-300">Stage 2</span>
            <p className="text-2xl font-black mt-1">64</p>
            <p className="text-xs font-semibold text-white/90">Quiz Screened</p>
            <p className="text-[10px] text-emerald-200/70 mt-1">Cut-off score ≥65%</p>
            <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-emerald-400">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Stage 3: Assignment */}
          <div className="bg-white/10 rounded-2xl p-4 border border-white/10 relative">
            <span className="text-[10px] uppercase font-bold text-emerald-300">Stage 3</span>
            <p className="text-2xl font-black mt-1">32</p>
            <p className="text-xs font-semibold text-white/90">Hands-on Tasks</p>
            <p className="text-[10px] text-emerald-200/70 mt-1">Evaluated by Partner</p>
            <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-emerald-400">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Stage 4: Selected Cohort */}
          <div className="bg-emerald-500/30 rounded-2xl p-4 border-2 border-emerald-400 shadow-inner">
            <span className="text-[10px] uppercase font-bold text-emerald-200">Final Cohort</span>
            <p className="text-2xl font-black text-emerald-300 mt-1">18 Selected</p>
            <p className="text-xs font-bold text-white">5 Micro-Teams</p>
            <p className="text-[10px] text-emerald-200/80 mt-1">3-4 students per team</p>
          </div>

        </div>
      </div>

      {/* Filter Row: Team Buttons & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 flex items-center justify-between flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-slate-500 mr-1">Filter Team:</span>
          <button
            onClick={() => setSelectedGroup('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              selectedGroup === 'all' ? 'bg-emerald-800 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All 18 Students
          </button>
          {[1, 2, 3, 4, 5].map(g => (
            <button
              key={g}
              onClick={() => setSelectedGroup(g)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                selectedGroup === g ? 'bg-emerald-800 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Team {g}: {groupNames[g]}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 w-52"
          />
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <th className="p-3.5">Student Details</th>
                <th className="p-3.5">Assigned Group</th>
                <th className="p-3.5">Quiz Score</th>
                <th className="p-3.5">Assignment Score</th>
                <th className="p-3.5">Attendance</th>
                <th className="p-3.5">Selection Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={s.avatar}
                        alt={s.name}
                        className="w-8 h-8 rounded-full border border-slate-200 bg-slate-100"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{s.name}</p>
                        <p className="text-[11px] text-slate-500">{s.rollNo} • Class {s.classGrade} ({s.gender})</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-100">
                      Team {s.groupNumber}: {groupNames[s.groupNumber]}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-slate-800">
                    {s.quizScore} / 100
                  </td>
                  <td className="p-3.5 font-bold text-emerald-800">
                    {s.assignmentScore} / 100
                  </td>
                  <td className="p-3.5 font-bold text-slate-800">
                    {s.attendanceRate}%
                  </td>
                  <td className="p-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                      <CheckCircle2 className="w-3 h-3" /> Selected Cohort
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
