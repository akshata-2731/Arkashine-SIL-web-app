import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { CalendarHeatmap } from './components/heatmap/CalendarHeatmap';
import { DayHistoryDrawer } from './components/heatmap/DayHistoryDrawer';
import { SchoolTimelineModal } from './components/heatmap/SchoolTimelineModal';
import { ESGView } from './components/esg/ESGView';

// Arkashine Pages
import { ArkashineOverview } from './pages/arkashine/ArkashineOverview';
import { ArkashineSchools } from './pages/arkashine/ArkashineSchools';
import { ArkashineCertificates } from './pages/arkashine/ArkashineCertificates';
import { ArkashineSettings } from './pages/arkashine/ArkashineSettings';

// Partner Pages
import { PartnerOverview } from './pages/partner/PartnerOverview';
import { PartnerSchools } from './pages/partner/PartnerSchools';
import { StudentSelection } from './pages/partner/StudentSelection';
import { PartnerSupport } from './pages/partner/PartnerSupport';

// Principal Pages
import { PrincipalOverview } from './pages/principal/PrincipalOverview';
import { PrincipalDailyLog } from './pages/principal/PrincipalDailyLog';
import { PrincipalStudents } from './pages/principal/PrincipalStudents';

// Faculty Pages
import { FacultyToday } from './pages/faculty/FacultyToday';
import { FacultyStudents } from './pages/faculty/FacultyStudents';
import { FacultySoilLab } from './pages/faculty/FacultySoilLab';
import { FacultyOutreach } from './pages/faculty/FacultyOutreach';

// Student Pages
import { StudentJourney } from './pages/student/StudentJourney';

const MainLayout: React.FC = () => {
  const { currentRole, schools, activeSchoolId, setActiveSchoolId } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Global drawer states for heat map day inspection & timeline
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<{ schoolId: string; day: number } | null>(null);
  const [selectedSchoolTimeline, setSelectedSchoolTimeline] = useState<string | null>(null);

  // Reset tab on role switch
  useEffect(() => {
    switch (currentRole) {
      case 'arkashine':
      case 'partner':
      case 'principal':
        setCurrentTab('overview');
        break;
      case 'faculty':
        setCurrentTab('today');
        break;
      case 'student':
        setCurrentTab('journey');
        break;
    }
  }, [currentRole]);

  const handleOpenDayHistory = (schoolId: string, day: number) => {
    setSelectedHeatmapCell({ schoolId, day });
  };

  const renderActiveScreen = () => {
    // 1. Arkashine Super Admin Screens
    if (currentRole === 'arkashine') {
      switch (currentTab) {
        case 'overview':
          return (
            <ArkashineOverview
              onNavigateTab={setCurrentTab}
              onOpenSchoolTimeline={setSelectedSchoolTimeline}
            />
          );
        case 'schools':
          return <ArkashineSchools onOpenDayHistory={handleOpenDayHistory} />;
        case 'heatmap':
          return (
            <div className="space-y-4">
              <CalendarHeatmap
                schools={schools}
                role="arkashine"
                onSelectSchoolTimeline={setSelectedSchoolTimeline}
              />
            </div>
          );
        case 'esg':
          return <ESGView />;
        case 'certificates':
          return <ArkashineCertificates />;
        case 'settings':
          return <ArkashineSettings />;
        default:
          return <ArkashineOverview onNavigateTab={setCurrentTab} onOpenSchoolTimeline={setSelectedSchoolTimeline} />;
      }
    }

    // 2. Enabling Partner Screens
    if (currentRole === 'partner') {
      switch (currentTab) {
        case 'overview':
          return (
            <PartnerOverview
              onNavigateTab={setCurrentTab}
              onOpenSchoolTimeline={setSelectedSchoolTimeline}
            />
          );
        case 'schools':
          return <PartnerSchools />;
        case 'selection':
          return <StudentSelection />;
        case 'heatmap':
          return (
            <div className="space-y-4">
              <CalendarHeatmap
                schools={schools}
                role="partner"
                onSelectSchoolTimeline={setSelectedSchoolTimeline}
              />
            </div>
          );
        case 'outreach':
          return <PartnerSupport />;
        default:
          return <PartnerOverview onNavigateTab={setCurrentTab} onOpenSchoolTimeline={setSelectedSchoolTimeline} />;
      }
    }

    // 3. School Principal Screens
    if (currentRole === 'principal') {
      switch (currentTab) {
        case 'overview':
          return (
            <PrincipalOverview
              onNavigateTab={setCurrentTab}
              onOpenDayHistory={handleOpenDayHistory}
            />
          );
        case 'logs':
          return <PrincipalDailyLog />;
        case 'students':
          return <PrincipalStudents />;
        case 'certificates':
          return <ArkashineCertificates />;
        default:
          return <PrincipalOverview onNavigateTab={setCurrentTab} onOpenDayHistory={handleOpenDayHistory} />;
      }
    }

    // 4. Faculty Coordinator Screens
    if (currentRole === 'faculty') {
      switch (currentTab) {
        case 'today':
          return <FacultyToday />;
        case 'students':
          return <FacultyStudents />;
        case 'soillab':
          return <FacultySoilLab />;
        case 'outreach':
          return <FacultyOutreach />;
        default:
          return <FacultyToday />;
      }
    }

    // 5. Student Portal Screens
    if (currentRole === 'student') {
      return <StudentJourney />;
    }

    return <div>Select a role and tab</div>;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row antialiased selection:bg-emerald-500 selection:text-white">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          onOpenMobileNav={() => setMobileMenuOpen(true)}
          pageTitle="Arkashine School Innovation Lab"
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveScreen()}
        </main>
      </div>

      {/* Global Heatmap Day History Drawer */}
      {selectedHeatmapCell && (
        <DayHistoryDrawer
          isOpen={true}
          onClose={() => setSelectedHeatmapCell(null)}
          schoolId={selectedHeatmapCell.schoolId}
          dayNumber={selectedHeatmapCell.day}
          onNavigateDay={(newDay) => setSelectedHeatmapCell({ ...selectedHeatmapCell, day: newDay })}
          onOpenSchoolTimeline={(schId) => {
            setSelectedHeatmapCell(null);
            setSelectedSchoolTimeline(schId);
          }}
        />
      )}

      {/* Global School Timeline Modal */}
      {selectedSchoolTimeline && (
        <SchoolTimelineModal
          schoolId={selectedSchoolTimeline}
          onClose={() => setSelectedSchoolTimeline(null)}
          onSelectDay={(day) => {
            setSelectedHeatmapCell({ schoolId: selectedSchoolTimeline, day });
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainLayout />
      </AuthProvider>
    </ThemeProvider>
  );
}
