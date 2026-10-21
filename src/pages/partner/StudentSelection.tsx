import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  UserPlus,
  X,
  AlertTriangle
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { Student } from '../../types';
import { getInitialsAvatar } from '../../utils/avatarUtils';

export const StudentSelection: React.FC = () => {
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('SCH-01');
  const [selectedGroup, setSelectedGroup] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [candidateName, setCandidateName] = useState('');
  const [candidateRoll, setCandidateRoll] = useState('');
  const [candidateClass, setCandidateClass] = useState<'VIII' | 'IX' | 'X' | 'XI' | 'XII'>('X');
  const [candidateGender, setCandidateGender] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [candidateGroup, setCandidateGroup] = useState<number>(1);
  const [quizScore, setQuizScore] = useState<number>(85);
  const [assignmentScore, setAssignmentScore] = useState<number>(80);
  const [studentsVersion, setStudentsVersion] = useState(0);

  const schools = storageService.getSchools().filter(s => s.status === 'Running' || s.status === 'Lab_Setup');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const students = useMemo(() => storageService.getStudents(selectedSchoolId), [selectedSchoolId, studentsVersion]);

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

  // Validation
  const formErrors = useMemo(() => {
    const errs: Record<string, string> = {};
    if (!candidateName.trim() || candidateName.trim().length < 3) {
      errs.name = 'Full name is required (at least 3 letters).';
    }
    if (!candidateRoll.trim() || candidateRoll.trim().length < 2) {
      errs.rollNo = 'Valid roll number is required (min 2 characters).';
    }
    if (isNaN(quizScore) || quizScore < 0 || quizScore > 100) {
      errs.quiz = 'Quiz score must be between 0 and 100.';
    }
    if (isNaN(assignmentScore) || assignmentScore < 0 || assignmentScore > 100) {
      errs.assignment = 'Assignment score must be between 0 and 100.';
    }
    return errs;
  }, [candidateName, candidateRoll, quizScore, assignmentScore]);

  const isFormValid = Object.keys(formErrors).length === 0;

  const handleAddCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const newStudent: Student = {
      id: `${selectedSchoolId}-STU-${Date.now().toString().slice(-4)}`,
      schoolId: selectedSchoolId,
      name: candidateName.trim(),
      rollNo: candidateRoll.trim(),
      gender: candidateGender,
      classGrade: candidateClass,
      groupNumber: candidateGroup,
      avatar: getInitialsAvatar(candidateName.trim()),
      selectionStage: 'Selected',
      quizScore,
      assignmentScore,
      attendanceRate: 100,
      totalPresentDays: 20,
      totalLoggedDays: 20,
      modulesCompleted: 0,
      practicalsDone: 0,
      outreachFarmersCount: 0,
      soilSamplesTestedCount: 0,
      capstoneSubmitted: false,
      missingFields: [],
      badgeIds: [],
      certificateStatus: 'Incomplete_Data'
    };

    storageService.saveStudent(newStudent);
    setStudentsVersion(v => v + 1);
    setShowAddModal(false);
    setCandidateName('');
    setCandidateRoll('');
  };

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

        {/* School Dropdown & Add Candidate */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">School:</span>
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

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Add Candidate
          </button>
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
            <p className="text-2xl font-black text-emerald-300 mt-1">{students.length} Selected</p>
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
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              selectedGroup === 'all' ? 'bg-emerald-800 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Students ({students.length})
          </button>
          {[1, 2, 3, 4, 5].map(g => (
            <button
              key={g}
              onClick={() => setSelectedGroup(g)}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
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
            className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 w-52 focus:outline-hidden focus:border-emerald-500"
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

      {/* Add Candidate Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Add Student Candidate</h3>
                <p className="text-xs text-slate-500">Screen and enroll student into school cohort</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCandidate} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Full Name *</label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="e.g. Rahul Deshmukh"
                  className={`w-full p-2.5 bg-slate-50 border rounded-xl text-slate-900 focus:outline-hidden ${
                    formErrors.name ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-emerald-500'
                  }`}
                />
                {formErrors.name && (
                  <p className="text-rose-600 font-semibold mt-1">⚠️ {formErrors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Roll Number *</label>
                  <input
                    type="text"
                    value={candidateRoll}
                    onChange={(e) => setCandidateRoll(e.target.value)}
                    placeholder="e.g. 10-A-19"
                    className={`w-full p-2.5 bg-slate-50 border rounded-xl text-slate-900 focus:outline-hidden ${
                      formErrors.rollNo ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-emerald-500'
                    }`}
                  />
                  {formErrors.rollNo && (
                    <p className="text-rose-600 font-semibold mt-1">⚠️ {formErrors.rollNo}</p>
                  )}
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Class Grade</label>
                  <select
                    value={candidateClass}
                    onChange={(e) => setCandidateClass(e.target.value as 'VIII' | 'IX' | 'X' | 'XI' | 'XII')}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
                  >
                    <option value="VIII">Class VIII</option>
                    <option value="IX">Class IX</option>
                    <option value="X">Class X</option>
                    <option value="XI">Class XI</option>
                    <option value="XII">Class XII</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={candidateGender}
                    onChange={(e) => setCandidateGender(e.target.value as 'Female' | 'Male' | 'Other')}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Assigned Team</label>
                  <select
                    value={candidateGroup}
                    onChange={(e) => setCandidateGroup(Number(e.target.value))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold"
                  >
                    {[1, 2, 3, 4, 5].map(g => (
                      <option key={g} value={g}>Team {g}: {groupNames[g]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Quiz Score (0-100) *</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={quizScore}
                    onChange={(e) => setQuizScore(Number(e.target.value))}
                    className={`w-full p-2.5 bg-slate-50 border rounded-xl text-slate-900 font-bold focus:outline-hidden ${
                      formErrors.quiz ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-emerald-500'
                    }`}
                  />
                  {formErrors.quiz && (
                    <p className="text-rose-600 font-semibold mt-1">⚠️ {formErrors.quiz}</p>
                  )}
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Assignment Score (0-100) *</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={assignmentScore}
                    onChange={(e) => setAssignmentScore(Number(e.target.value))}
                    className={`w-full p-2.5 bg-slate-50 border rounded-xl text-slate-900 font-bold focus:outline-hidden ${
                      formErrors.assignment ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-emerald-500'
                    }`}
                  />
                  {formErrors.assignment && (
                    <p className="text-rose-600 font-semibold mt-1">⚠️ {formErrors.assignment}</p>
                  )}
                </div>
              </div>

              {!isFormValid && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Please correct errors above before submitting.</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`px-4 py-2 font-bold rounded-xl shadow-xs transition-colors ${
                    isFormValid
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white cursor-pointer'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed opacity-60'
                  }`}
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
