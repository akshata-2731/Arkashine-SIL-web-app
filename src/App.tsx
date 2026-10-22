import React, { lazy, Suspense, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { DayHistoryDrawer } from './components/heatmap/DayHistoryDrawer';
import { SchoolTimelineModal } from './components/heatmap/SchoolTimelineModal';
import { RoleRouteGuard, ROLE_DEFAULT_ROUTES } from './components/routing/RoleRouteGuard';
import { PageLoadingFallback } from './components/common/PageLoadingFallback';
import { AppFooter } from './components/layout/AppFooter';

// Arkashine Pages (Lazy loaded)
const ArkashineOverview = lazy(() => import('./pages/arkashine/ArkashineOverview').then(m => ({ default: m.ArkashineOverview })));
const ArkashineSchools = lazy(() => import('./pages/arkashine/ArkashineSchools').then(m => ({ default: m.ArkashineSchools })));
const ArkashineCertificates = lazy(() => import('./pages/arkashine/ArkashineCertificates').then(m => ({ default: m.ArkashineCertificates })));
const ArkashineSettings = lazy(() => import('./pages/arkashine/ArkashineSettings').then(m => ({ default: m.ArkashineSettings })));
const ArkashineVideos = lazy(() => import('./pages/arkashine/ArkashineVideos').then(m => ({ default: m.ArkashineVideos })));
const ESGView = lazy(() => import('./components/esg/ESGView').then(m => ({ default: m.ESGView })));

// Partner Pages (Lazy loaded)
const PartnerOverview = lazy(() => import('./pages/partner/PartnerOverview').then(m => ({ default: m.PartnerOverview })));
const PartnerSchools = lazy(() => import('./pages/partner/PartnerSchools').then(m => ({ default: m.PartnerSchools })));
const StudentSelection = lazy(() => import('./pages/partner/StudentSelection').then(m => ({ default: m.StudentSelection })));
const PartnerSupport = lazy(() => import('./pages/partner/PartnerSupport').then(m => ({ default: m.PartnerSupport })));

// Principal Pages (Lazy loaded)
const PrincipalOverview = lazy(() => import('./pages/principal/PrincipalOverview').then(m => ({ default: m.PrincipalOverview })));
const PrincipalDailyLog = lazy(() => import('./pages/principal/PrincipalDailyLog').then(m => ({ default: m.PrincipalDailyLog })));
const PrincipalStudents = lazy(() => import('./pages/principal/PrincipalStudents').then(m => ({ default: m.PrincipalStudents })));
const PrincipalCertificates = lazy(() => import('./pages/principal/PrincipalCertificates').then(m => ({ default: m.PrincipalCertificates })));

// Faculty Pages (Lazy loaded)
const FacultyToday = lazy(() => import('./pages/faculty/FacultyToday').then(m => ({ default: m.FacultyToday })));

// Student Pages (Lazy loaded)
const StudentJourney = lazy(() => import('./pages/student/StudentJourney').then(m => ({ default: m.StudentJourney })));

// Common Components (Lazy loaded)
const CalendarHeatmap = lazy(() => import('./components/heatmap/CalendarHeatmap').then(m => ({ default: m.CalendarHeatmap })));
const NotFoundPage = lazy(() => import('./pages/common/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

const MainLayout: React.FC = () => {
  const { currentRole, schools } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Global drawer states for heat map day inspection & timeline
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<{ schoolId: string; day: number } | null>(null);
  const [selectedSchoolTimeline, setSelectedSchoolTimeline] = useState<string | null>(null);

  const handleOpenDayHistory = (schoolId: string, day: number) => {
    setSelectedHeatmapCell({ schoolId, day });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row antialiased selection:bg-emerald-500 selection:text-white">
      {/* Sidebar */}
      <Sidebar
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
          <Suspense fallback={<PageLoadingFallback />}>
            <Routes>
              {/* Root redirect to active role default route */}
              <Route path="/" element={<Navigate to={ROLE_DEFAULT_ROUTES[currentRole]} replace />} />

              {/* Arkashine Super Admin Routes */}
              <Route path="/arkashine" element={<Navigate to="/arkashine/overview" replace />} />
              <Route
                path="/arkashine/overview"
                element={
                  <RoleRouteGuard allowedRole="arkashine">
                    <ArkashineOverview
                      onNavigateTab={(tab) => navigate(`/arkashine/${tab}`)}
                      onOpenSchoolTimeline={setSelectedSchoolTimeline}
                    />
                  </RoleRouteGuard>
                }
              />
              <Route
                path="/arkashine/schools"
                element={
                  <RoleRouteGuard allowedRole="arkashine">
                    <ArkashineSchools onOpenDayHistory={handleOpenDayHistory} />
                  </RoleRouteGuard>
                }
              />
              <Route
                path="/arkashine/heatmap"
                element={
                  <RoleRouteGuard allowedRole="arkashine">
                    <div className="space-y-4">
                      <CalendarHeatmap
                        schools={schools}
                        role="arkashine"
                        onSelectSchoolTimeline={setSelectedSchoolTimeline}
                      />
                    </div>
                  </RoleRouteGuard>
                }
              />
              <Route
                path="/arkashine/esg"
                element={
                  <RoleRouteGuard allowedRole="arkashine">
                    <ESGView />
                  </RoleRouteGuard>
                }
              />
              <Route
                path="/arkashine/certificates"
                element={
                  <RoleRouteGuard allowedRole="arkashine">
                    <ArkashineCertificates />
                  </RoleRouteGuard>
                }
              />
              <Route
                path="/arkashine/settings"
                element={
                  <RoleRouteGuard allowedRole="arkashine">
                    <ArkashineSettings />
                  </RoleRouteGuard>
                }
              />
              <Route
                path="/arkashine/videos"
                element={
                  <RoleRouteGuard allowedRole="arkashine">
                    <ArkashineVideos />
                  </RoleRouteGuard>
                }
              />

              {/* Enabling Partner Routes */}
              <Route path="/partner" element={<Navigate to="/partner/overview" replace />} />
              <Route
                path="/partner/overview"
                element={
                  <RoleRouteGuard allowedRole="partner">
                    <PartnerOverview
                      onNavigateTab={(tab) => navigate(`/partner/${tab}`)}
                      onOpenSchoolTimeline={setSelectedSchoolTimeline}
                    />
                  </RoleRouteGuard>
                }
              />
              <Route
                path="/partner/schools"
                element={
                  <RoleRouteGuard allowedRole="partner">
                    <PartnerSchools />
                  </RoleRouteGuard>
                }
              />
              <Route
                path="/partner/selection"
                element={
                  <RoleRouteGuard allowedRole="partner">
                    <StudentSelection />
                  </RoleRouteGuard>
                }
              />
              <Route
                path="/partner/heatmap"
                element={
                  <RoleRouteGuard allowedRole="partner">
                    <div className="space-y-4">
                      <CalendarHeatmap
                        schools={schools}
                        role="partner"
                        onSelectSchoolTimeline={setSelectedSchoolTimeline}
                      />
                    </div>
                  </RoleRouteGuard>
                }
              />
              <Route
                path="/partner/outreach"
                element={
                  <RoleRouteGuard allowedRole="partner">
                    <PartnerSupport />
                  </RoleRouteGuard>
                }
              />

              {/* School Principal Routes */}
              <Route path="/principal" element={<Navigate to="/principal/overview" replace />} />
              <Route
                path="/principal/overview"
                element={
                  <RoleRouteGuard allowedRole="principal">
                    <PrincipalOverview
                      onNavigateTab={(tab) => navigate(`/principal/${tab}`)}
                      onOpenDayHistory={handleOpenDayHistory}
                    />
                  </RoleRouteGuard>
                }
              />
              <Route
                path="/principal/logs"
                element={
                  <RoleRouteGuard allowedRole="principal">
                    <PrincipalDailyLog />
                  </RoleRouteGuard>
                }
              />
              <Route
                path="/principal/students"
                element={
                  <RoleRouteGuard allowedRole="principal">
                    <PrincipalStudents />
                  </RoleRouteGuard>
                }
              />
              <Route
                path="/principal/certificates"
                element={
                  <RoleRouteGuard allowedRole="principal">
                    <PrincipalCertificates />
                  </RoleRouteGuard>
                }
              />

              {/* Faculty Coordinator Routes (Single-Screen Attendance & Heatmap Console) */}
              <Route path="/faculty" element={<Navigate to="/faculty/today" replace />} />
              <Route
                path="/faculty/today"
                element={
                  <RoleRouteGuard allowedRole="faculty">
                    <FacultyToday />
                  </RoleRouteGuard>
                }
              />
              <Route path="/faculty/students" element={<Navigate to="/faculty/today" replace />} />
              <Route path="/faculty/soillab" element={<Navigate to="/faculty/today" replace />} />
              <Route path="/faculty/outreach" element={<Navigate to="/faculty/today" replace />} />

              {/* Student Portal Routes */}
              <Route path="/student" element={<Navigate to="/student/journey" replace />} />
              <Route
                path="/student/journey"
                element={
                  <RoleRouteGuard allowedRole="student">
                    <StudentJourney currentTab="journey" onTabChange={(tab) => navigate(`/student/${tab}`)} />
                  </RoleRouteGuard>
                }
              />
              <Route
                path="/student/videos"
                element={
                  <RoleRouteGuard allowedRole="student">
                    <StudentJourney currentTab="videos" onTabChange={(tab) => navigate(`/student/${tab}`)} />
                  </RoleRouteGuard>
                }
              />
              <Route
                path="/student/modules"
                element={
                  <RoleRouteGuard allowedRole="student">
                    <StudentJourney currentTab="modules" onTabChange={(tab) => navigate(`/student/${tab}`)} />
                  </RoleRouteGuard>
                }
              />
              <Route
                path="/student/diagrams"
                element={
                  <RoleRouteGuard allowedRole="student">
                    <StudentJourney currentTab="diagrams" onTabChange={(tab) => navigate(`/student/${tab}`)} />
                  </RoleRouteGuard>
                }
              />
              <Route
                path="/student/ecosystem"
                element={
                  <RoleRouteGuard allowedRole="student">
                    <StudentJourney currentTab="diagrams" onTabChange={(tab) => navigate(`/student/${tab}`)} />
                  </RoleRouteGuard>
                }
              />
              <Route
                path="/student/badges"
                element={
                  <RoleRouteGuard allowedRole="student">
                    <StudentJourney currentTab="badges" onTabChange={(tab) => navigate(`/student/${tab}`)} />
                  </RoleRouteGuard>
                }
              />
              <Route
                path="/student/certificate"
                element={
                  <RoleRouteGuard allowedRole="student">
                    <StudentJourney currentTab="certificate" onTabChange={(tab) => navigate(`/student/${tab}`)} />
                  </RoleRouteGuard>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>

        {/* Founding Team & Platform Leadership Footer */}
        <AppFooter />
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
