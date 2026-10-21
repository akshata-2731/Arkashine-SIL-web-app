import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, UserProfile, School } from '../types';
import { storageService } from '../services/storageService';
import { getInitialsAvatar } from '../utils/avatarUtils';

interface AuthContextType {
  currentRole: Role;
  currentUser: UserProfile;
  activeSchoolId: string;
  activePartnerId: string;
  activeStudentId: string;
  language: 'en' | 'hi';
  toggleLanguage: () => void;
  switchRole: (role: Role, schoolId?: string, studentId?: string, partnerId?: string) => void;
  setActiveSchoolId: (id: string) => void;
  schools: School[];
  refreshData: () => void;
}

const DEFAULT_USERS: Record<Role, UserProfile> = {
  arkashine: {
    id: 'USR-ARK-01',
    name: 'Dr. Sudha R. Karbari',
    email: 'sudha@arkashine.com',
    role: 'arkashine',
    title: 'Co-Founder & CEO',
    avatar: getInitialsAvatar('Dr. Sudha R. Karbari')
  },
  partner: {
    id: 'USR-PTR-01',
    name: 'Dr. Sunita Deshmukh',
    email: 'sunita.deshmukh@greenhorizon.org',
    role: 'partner',
    partnerId: 'PARTNER-01',
    title: 'State Lead, GreenHorizon AgriEd',
    avatar: getInitialsAvatar('Dr. Sunita Deshmukh')
  },
  principal: {
    id: 'USR-PRN-01',
    name: 'Fr. Thomas Matthew',
    email: 'principal@stxaviersbaramati.edu.in',
    role: 'principal',
    schoolId: 'SCH-01',
    title: "Principal, St. Xavier's Model School",
    avatar: getInitialsAvatar('Fr. Thomas Matthew')
  },
  faculty: {
    id: 'USR-FAC-01',
    name: 'Dr. Anjali Patil',
    email: 'anjali.patil@stxaviersbaramati.edu.in',
    role: 'faculty',
    schoolId: 'SCH-01',
    title: 'Senior Faculty & Innovation Coordinator',
    avatar: getInitialsAvatar('Dr. Anjali Patil')
  },
  student: {
    id: 'USR-STU-01',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@student.arkashine.org',
    role: 'student',
    schoolId: 'SCH-01',
    studentId: 'SCH-01-STU-01',
    title: 'Class X-A • Group 1 Lead (Soil Explorers)',
    avatar: getInitialsAvatar('Ananya Sharma')
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getInitialRole = (): Role => {
  if (typeof window !== 'undefined' && window.location?.pathname) {
    const path = window.location.pathname;
    if (path.startsWith('/partner')) return 'partner';
    if (path.startsWith('/principal')) return 'principal';
    if (path.startsWith('/faculty')) return 'faculty';
    if (path.startsWith('/student')) return 'student';
    if (path.startsWith('/arkashine')) return 'arkashine';
  }
  return 'arkashine';
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<Role>(getInitialRole);
  const [activeSchoolId, setActiveSchoolId] = useState<string>('SCH-01');
  const [activePartnerId, setActivePartnerId] = useState<string>('PARTNER-01');
  const [activeStudentId, setActiveStudentId] = useState<string>('SCH-01-STU-01');
  const [language, setLanguage] = useState<'en' | 'hi'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ark_sil_language');
      if (saved === 'hi' || saved === 'en') return saved;
    }
    return 'en';
  });
  const [schools, setSchools] = useState<School[]>([]);

  const refreshData = () => {
    setSchools(storageService.getSchools());
  };

  useEffect(() => {
    storageService.init();
    refreshData();
  }, []);

  const switchRole = (role: Role, schoolId?: string, studentId?: string, partnerId?: string) => {
    setCurrentRole(role);
    if (schoolId) setActiveSchoolId(schoolId);
    if (studentId) setActiveStudentId(studentId);
    if (partnerId) setActivePartnerId(partnerId);
  };

  const toggleLanguage = () => {
    setLanguage(prev => {
      const next = prev === 'en' ? 'hi' : 'en';
      if (typeof window !== 'undefined') {
        localStorage.setItem('ark_sil_language', next);
      }
      return next;
    });
  };

  const currentUser = {
    ...DEFAULT_USERS[currentRole],
    schoolId: activeSchoolId,
    partnerId: activePartnerId,
    studentId: activeStudentId
  };

  return (
    <AuthContext.Provider
      value={{
        currentRole,
        currentUser,
        activeSchoolId,
        activePartnerId,
        activeStudentId,
        language,
        toggleLanguage,
        switchRole,
        setActiveSchoolId,
        schools,
        refreshData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
