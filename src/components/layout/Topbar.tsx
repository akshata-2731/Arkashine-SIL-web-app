import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Bell, 
  RotateCcw, 
  Globe,
  Sparkles,
  Calendar,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { Role } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { ThemeColorPicker } from '../common/ThemeColorPicker';
import { useNavigate } from 'react-router-dom';
import { ROLE_DEFAULT_ROUTES } from '../routing/RoleRouteGuard';
import { useT } from '../../i18n/useT';
import { TeamModal } from '../common/TeamModal';

interface TopbarProps {
  onOpenMobileNav: () => void;
  pageTitle?: string;
}

export const Topbar: React.FC<TopbarProps> = ({ onOpenMobileNav, pageTitle }) => {
  const { 
    currentRole, 
    switchRole, 
    language, 
    toggleLanguage,
    refreshData 
  } = useAuth();
  const navigate = useNavigate();
  const { t } = useT();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [liveTime, setLiveTime] = useState<string>(() => {
    return new Date().toLocaleTimeString('en-IN', { hour12: false });
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date().toLocaleTimeString('en-IN', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const notifications = storageService.getNotifications(currentRole);
  const unreadCount = notifications.filter(n => !n.read).length;

  const roleList: { role: Role; label: string; org: string; icon: string }[] = [
    { role: 'arkashine', label: t('role.arkashine', 'Arkashine HQ'), org: 'Super Admin', icon: '🏛️' },
    { role: 'partner', label: t('role.partner', 'Enabling Partner'), org: 'GreenHorizon AgriEd', icon: '🤝' },
    { role: 'principal', label: t('role.principal', 'School Principal'), org: "St. Xavier's Model", icon: '🏫' },
    { role: 'faculty', label: t('role.faculty', 'Faculty Coordinator'), org: 'Dr. Anjali Patil', icon: '🔬' },
    { role: 'student', label: t('role.student', 'Student Portal'), org: 'Ananya Sharma', icon: '🌱' }
  ];

  const handleRoleChange = (newRole: Role) => {
    switchRole(newRole);
    navigate(ROLE_DEFAULT_ROUTES[newRole] || '/arkashine/overview');
  };

  const handleResetData = () => {
    storageService.resetAllData();
    refreshData();
    setShowResetConfirm(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-2xs transition-colors">
      
      {/* Upper Bar: 5 Quick Role Switches + Founding Team Names */}
      <div className="bg-slate-50/90 px-4 sm:px-6 py-2 border-b border-slate-200/60 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        
        {/* 5 One-Click Logins */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-1 hidden sm:inline">
            Quick Roles:
          </span>
          {roleList.map((r, idx) => {
            const isActive = currentRole === r.role;
            return (
              <button
                key={r.role}
                onClick={() => handleRoleChange(r.role)}
                title={`Switch to ${r.org}`}
                className={`px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                  isActive
                    ? 'bg-[#5C26C0] text-white shadow-xs ring-2 ring-purple-300 scale-102'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{r.icon}</span>
                <span className="hidden md:inline font-extrabold">{idx + 1}.</span>
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Founding Team Chip */}
        <button
          onClick={() => setShowTeamModal(true)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200/80 text-[#5C26C0] font-bold text-xs transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Founding Team: Akshata Patil • Dr. Vivek • Dr. Sunita</span>
        </button>
      </div>

      {/* Main Lower Bar */}
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto w-full px-4 sm:px-6 py-3">
        
        {/* Left: Hamburger & Current View Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileNav}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 active:bg-slate-200 cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {pageTitle || 'Arkashine Innovation Lab'}
            </h2>
          </div>
        </div>

        {/* Right Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Live Clock IST */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 text-[11px] font-mono text-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold">{liveTime} IST</span>
          </div>

          {/* Program Day Chip */}
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-[#5C26C0]">
            <Calendar className="w-3.5 h-3.5 text-[#5C26C0] shrink-0" />
            <span className="text-xs font-bold whitespace-nowrap">
              Day 22 <span className="text-[11px] font-normal text-purple-700/80">of 28</span>
            </span>
          </div>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            title="Toggle Language"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{language === 'en' ? 'EN' : 'HI'}</span>
          </button>

          {/* Theme Color Customizer Pill */}
          <ThemeColorPicker />

          {/* Reset Demo Data Button */}
          <button
            onClick={() => setShowResetConfirm(true)}
            title="Reset demo data"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Reset demo data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-50 relative transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50">
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Notifications
                  </span>
                  <span className="text-[10px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                    {unreadCount} pending
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No notifications
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          storageService.markNotificationRead(n.id);
                          refreshData();
                        }}
                        className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors flex gap-2.5 ${
                          !n.read ? 'bg-purple-50/40' : ''
                        }`}
                      >
                        {n.type === 'alert' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-bold text-slate-800">{n.title}</p>
                          <p className="text-slate-500 mt-0.5 leading-snug">{n.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Confirm Reset Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900">Reset Demo Data?</h3>
            <p className="text-xs text-slate-600">
              This will restore all schools, students, daily logs, and inventory to initial seeded states.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleResetData}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Team Modal */}
      <TeamModal isOpen={showTeamModal} onClose={() => setShowTeamModal(false)} />
    </header>
  );
};
