import React from 'react';
import { 
  LayoutDashboard, 
  School as SchoolIcon, 
  CalendarDays, 
  FileCheck2, 
  Settings2, 
  Users, 
  Sprout, 
  ClipboardCheck, 
  Award, 
  HelpCircle, 
  FlaskConical, 
  TrendingUp,
  MapPin,
  Compass,
  X
} from 'lucide-react';
import { Role } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  isOpenMobile,
  onCloseMobile
}) => {
  const { currentRole, currentUser } = useAuth();

  const getNavItems = (role: Role): NavItem[] => {
    switch (role) {
      case 'arkashine':
        return [
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'schools', label: 'Schools & Partners', icon: SchoolIcon },
          { id: 'heatmap', label: 'Program Heat Map', icon: CalendarDays },
          { id: 'esg', label: 'Impact & ESG', icon: TrendingUp },
          { id: 'certificates', label: 'Certificates', icon: Award },
          { id: 'settings', label: 'Reports & Settings', icon: Settings2 }
        ];
      case 'partner':
        return [
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'schools', label: 'My Schools & Lab Setup', icon: SchoolIcon },
          { id: 'selection', label: 'Student Selection', icon: Users },
          { id: 'heatmap', label: 'Daily Updates & Heat Map', icon: CalendarDays },
          { id: 'outreach', label: 'Outreach & Support', icon: Sprout }
        ];
      case 'principal':
        return [
          { id: 'overview', label: 'My School', icon: LayoutDashboard },
          { id: 'logs', label: 'Daily Log & Remarks', icon: ClipboardCheck },
          { id: 'students', label: 'Students & Risk', icon: Users },
          { id: 'certificates', label: 'Certificates', icon: Award }
        ];
      case 'faculty':
        return [
          { id: 'today', label: "Today's Update", icon: ClipboardCheck, badge: 'Daily' },
          { id: 'students', label: 'Students & Attendance', icon: Users },
          { id: 'soillab', label: 'Soil Lab (SoiLENZ)', icon: FlaskConical },
          { id: 'outreach', label: 'Outreach & Campaigns', icon: MapPin }
        ];
      case 'student':
        return [
          { id: 'journey', label: 'My Soil Journey', icon: Compass },
          { id: 'modules', label: 'Modules & Quizzes', icon: FlaskConical },
          { id: 'badges', label: 'Badges & Rewards', icon: Award },
          { id: 'certificate', label: 'Soil Partner Certificate', icon: FileCheck2 }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems(currentRole);

  const roleLabels: Record<Role, string> = {
    arkashine: 'Arkashine HQ',
    partner: 'Enabling Partner',
    principal: 'School Principal',
    faculty: 'Faculty Coordinator',
    student: 'Student Portal'
  };

  const navContent = (
    <div 
      className="flex flex-col h-full text-slate-100 select-none transition-colors duration-200"
      style={{ backgroundColor: 'var(--theme-primary, #143D30)' }}
    >
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md transition-colors"
            style={{ backgroundColor: 'var(--theme-accent, #10B981)' }}
          >
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              Arkashine <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-white/15 text-white/90 border border-white/20">SIL</span>
            </h1>
            <p className="text-[11px] text-white/70 font-medium">
              School Innovation Lab
            </p>
          </div>
        </div>
        <button
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-lg text-white/80 hover:bg-white/10"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Role Badge Indicator */}
      <div 
        className="px-5 py-3 border-b border-white/10 flex items-center justify-between"
        style={{ backgroundColor: 'var(--theme-primary-dark, #0E2C23)' }}
      >
        <span className="text-[11px] uppercase tracking-wider font-semibold text-white/70">
          Role Scope
        </span>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/15 text-white border border-white/20">
          {roleLabels[currentRole]}
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                onCloseMobile();
              }}
              style={isActive ? {
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                borderLeftColor: 'var(--theme-accent, #10B981)'
              } : undefined}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all group cursor-pointer ${
                isActive
                  ? 'text-white font-semibold border-l-4 pl-3 shadow-inner'
                  : 'text-white/75 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  style={isActive ? { color: 'var(--theme-accent, #10B981)' } : undefined}
                  className={`w-5 h-5 transition-colors ${
                    isActive ? '' : 'text-white/60 group-hover:text-white'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span 
                  style={{ backgroundColor: 'var(--theme-accent, #10B981)' }}
                  className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full text-white shadow-2xs"
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Footer Card */}
      <div 
        className="p-4 border-t border-white/10"
        style={{ backgroundColor: 'var(--theme-primary-dark, #0E2C23)' }}
      >
        <div className="flex items-center gap-3">
          <img
            src={currentUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.name}`}
            alt={currentUser.name}
            className="w-9 h-9 rounded-xl border border-white/20 bg-white/10 object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
            <p className="text-[11px] text-white/60 truncate">{currentUser.title || currentUser.role}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-emerald-950/20 z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
