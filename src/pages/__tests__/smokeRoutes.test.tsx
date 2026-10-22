import { describe, it, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { storageService } from '../../services/storageService';
import { ArkashineOverview } from '../arkashine/ArkashineOverview';
import { PartnerOverview } from '../partner/PartnerOverview';
import { PrincipalOverview } from '../principal/PrincipalOverview';
import { FacultyToday } from '../faculty/FacultyToday';
import { StudentJourney } from '../student/StudentJourney';

describe('Role Home Views Smoke Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    storageService.resetAllData();
  });

  it('renders ArkashineOverview without crashing', () => {
    window.history.pushState({}, '', '/arkashine/overview');
    render(
      <MemoryRouter initialEntries={['/arkashine/overview']}>
        <AuthProvider>
          <ArkashineOverview onNavigateTab={() => {}} onOpenSchoolTimeline={() => {}} />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Program Overview/i)).toBeInTheDocument();
  });

  it('renders PartnerOverview without crashing', () => {
    window.history.pushState({}, '', '/partner/overview');
    render(
      <MemoryRouter initialEntries={['/partner/overview']}>
        <AuthProvider>
          <PartnerOverview onNavigateTab={() => {}} onOpenSchoolTimeline={() => {}} />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/GreenHorizon AgriEd/i)).toBeInTheDocument();
  });

  it('renders PrincipalOverview without crashing', () => {
    window.history.pushState({}, '', '/principal/overview');
    render(
      <MemoryRouter initialEntries={['/principal/overview']}>
        <AuthProvider>
          <PrincipalOverview onNavigateTab={() => {}} onOpenDayHistory={() => {}} />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getAllByText(/St\. Xavier/i).length).toBeGreaterThan(0);
  });

  it('renders FacultyToday form without crashing', () => {
    window.history.pushState({}, '', '/faculty/today');
    render(
      <MemoryRouter initialEntries={['/faculty/today']}>
        <AuthProvider>
          <FacultyToday />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Daily Attendance & 28-Day Heatmap/i)).toBeInTheDocument();
  });

  it('renders StudentJourney without crashing', () => {
    window.history.pushState({}, '', '/student/journey');
    render(
      <MemoryRouter initialEntries={['/student/journey']}>
        <AuthProvider>
          <StudentJourney />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/Your Soil Health Journey/i)).toBeInTheDocument();
  });
});
