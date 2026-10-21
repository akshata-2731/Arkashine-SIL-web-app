import React, { useState } from 'react';
import { 
  Menu, 
  Bell, 
  RotateCcw, 
  UserCheck,
  ChevronDown,
  Globe
} from 'lucide-react';
import { Role } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { ThemeColorPicker } from '../common/ThemeColorPicker';
import { useNavigate } from 'react-router-dom';
import { ROLE_DEFAULT_ROUTES } from '../routing/RoleRouteGuard';
import { useT } from '../../i18n/useT';

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

  const notifications = storageService.getNotifications(currentRole);
  const unreadCount = notifications.filter(n => !n.read).length;

  const roleOptions: { role: Role; label: string; org: string }[] = [
    { role: 'arkashine', label: t('role.arkashine', 'Arkashine HQ'), org: 'Super Admin' },
    { role: 'partner', label: t('role.partner', 'Enabling Partner'), org: 'GreenHorizon AgriEd' },
    { role: 'principal', label: t('role.principal', 'School Principal'), org: "St. Xavier's Model" },
    { role: 'faculty', label: t('role.faculty', 'Faculty Coordinator'), org: 'Dr. Anjali Patil' },
    { role: 'student', label: t('role.student', 'Student Portal'), org: 'Ananya Sharma (Class X)' }
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
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3 transition-all">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        
        {/* Left: Hamburger & Current View Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileNav}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 active:bg-slate-200"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-semibold text-slate-900 tracking-tight">
              {pageTitle || 'Arkashine Innovation Lab'}
            </h2>
          </div>
        </div>

        {/* Right: Sleek Role Picker & Minimal Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Elegant Single Role Switcher Dropdown Pill */}
          <div className="relative">
            <select
              value={currentRole}
              onChange={(e) => handleRoleChange(e.target.value as Role)}
              aria-label="Select user role"
              className="appearance-none pl-8 pr-8 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 cursor-pointer focus:outline-hidden transition-colors"
            >
              {roleOptions.map(r => (
                <option key={r.role} value={r.role}>
                  {r.label} ({r.org})
                </option>
              ))}
            </select>
            <UserCheck className="w-3.5 h-3.5 text-emerald-700 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            title="Toggle Language"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>{language === 'en' ? 'EN' : 'HI'}</span>
          </button>

          {/* Theme Color Customizer Pill */}
          <ThemeColorPicker />

          {/* Reset Demo Data Button */}
          <button
            onClick={() => setShowResetConfirm(true)}
            title="Reset demo data"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            aria-label="Reset demo data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-50 relative transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white" />
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50">
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Notifications
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
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
                        className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${
                          !n.read ? 'bg-emerald-50/20' : ''
                        }`}
                      >
                        <p className="font-semibold text-slate-800">{n.title}</p>
                        <p className="text-slate-500 mt-0.5 leading-snug">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1.5">Reset Demo Data?</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              This will restore all 6 schools, 28 days of daily logs, soil samples, and candidate lists to the initial seed state.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                {t('action.cancel', 'Cancel')}
              </button>
              <button
                onClick={handleResetData}
                className="px-3.5 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs"
              >
                {t('action.reset', 'Reset All')}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
