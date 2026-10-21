import React from 'react';
import { Compass, Film, Microscope, BookOpen, Award, FileText } from 'lucide-react';

export type StudentNavTab = 'journey' | 'videos' | 'diagrams' | 'modules' | 'badges' | 'certificate';

interface StudentBottomNavProps {
  activeTab: StudentNavTab;
  onTabChange: (tab: StudentNavTab) => void;
  language: 'en' | 'hi';
}

export const StudentBottomNav: React.FC<StudentBottomNavProps> = ({
  activeTab,
  onTabChange,
  language
}) => {
  const navItems: { id: StudentNavTab; label: { en: string; hi: string }; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      id: 'journey',
      label: { en: 'Trail', hi: 'सफ़र' },
      icon: Compass
    },
    {
      id: 'videos',
      label: { en: 'Videos', hi: 'वीडियो' },
      icon: Film
    },
    {
      id: 'diagrams',
      label: { en: 'Explore', hi: 'मिट्टी' },
      icon: Microscope
    },
    {
      id: 'modules',
      label: { en: 'Lessons', hi: 'पाठ' },
      icon: BookOpen
    },
    {
      id: 'badges',
      label: { en: 'Badges', hi: 'बैज' },
      icon: Award
    },
    {
      id: 'certificate',
      label: { en: 'Cert', hi: 'प्रमाण' },
      icon: FileText
    }
  ];

  return (
    <nav
      aria-label="Student mobile navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg"
    >
      <div className="grid grid-cols-6 items-center justify-around max-w-lg mx-auto">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`min-h-[50px] flex flex-col items-center justify-center py-1 px-1 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'text-emerald-700 font-extrabold bg-emerald-50/80 scale-105'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className={`w-5 h-5 mb-0.5 transition-transform ${isActive ? 'scale-110 text-emerald-600' : ''}`} />
              <span className="text-[10px] leading-tight font-bold tracking-tight">
                {language === 'hi' ? item.label.hi : item.label.en}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
