import { describe, it, expect, beforeEach } from 'vitest';
import { storageService } from '../../storageService';
import { STORAGE_KEYS, CURRENT_SCHEMA_VERSION } from '../storageCore';
import { School, Student, BudgetLine } from '../../../types';

describe('storageService', () => {
  beforeEach(() => {
    localStorage.clear();
    storageService.resetAllData();
  });

  describe('Upsert operations', () => {
    it('saves a new student and updates an existing student', () => {
      const newStudent: Student = {
        id: 'STU-TEST-001',
        name: 'Test Student',
        rollNo: 'TEST-99',
        schoolId: 'SCH-01',
        classGrade: 'IX',
        gender: 'Female',
        groupNumber: 1,
        avatar: '',
        selectionStage: 'Selected',
        quizScore: 90,
        assignmentScore: 85,
        attendanceRate: 95,
        totalPresentDays: 19,
        totalLoggedDays: 20,
        modulesCompleted: 3,
        practicalsDone: 6,
        outreachFarmersCount: 5,
        soilSamplesTestedCount: 4,
        capstoneSubmitted: true,
        certificateStatus: 'Eligible',
        missingFields: [],
        badgeIds: ['badge-01'],
      };

      // Insert
      const saved = storageService.saveStudent(newStudent);
      expect(saved.id).toBe('STU-TEST-001');
      expect(saved.name).toBe('Test Student');

      const retrieved = storageService.getStudent('STU-TEST-001');
      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe('Test Student');

      // Update
      const updatedStudent: Student = { ...saved, name: 'Test Student Updated', attendanceRate: 100 };
      const savedUpdate = storageService.saveStudent(updatedStudent);
      expect(savedUpdate.name).toBe('Test Student Updated');
      expect(savedUpdate.attendanceRate).toBe(100);

      const retrievedAfter = storageService.getStudent('STU-TEST-001');
      expect(retrievedAfter?.name).toBe('Test Student Updated');
      expect(retrievedAfter?.attendanceRate).toBe(100);
    });

    it('upserts school correctly and returns the school', () => {
      const schools = storageService.getSchools();
      const first = schools[0];
      const updated: School = {
        ...first,
        name: 'Updated School Name',
        currentDay: 22,
      };

      const result = storageService.saveSchool(updated);
      expect(result.name).toBe('Updated School Name');
      expect(result.currentDay).toBe(22);

      const found = storageService.getSchool(first.id);
      expect(found?.name).toBe('Updated School Name');
    });

    it('upserts budget line correctly', () => {
      const budgetLine: BudgetLine = {
        id: 'BL-TEST-1',
        code: 'BL-01',
        category: 'Travel & Field Kits',
        description: 'Soil test chemical reagents refill',
        plannedAmount: 15000,
        actualAmount: 12000,
        variance: 3000,
        status: 'Within_Budget',
      };

      const saved = storageService.saveBudgetLine(budgetLine);
      expect(saved.id).toBe('BL-TEST-1');
      expect(saved.actualAmount).toBe(12000);

      const updated = storageService.saveBudgetLine({ ...saved, actualAmount: 14000 });
      expect(updated.actualAmount).toBe(14000);
    });
  });

  describe('Schema migration', () => {
    it('sets current schema version on initial check', () => {
      storageService.runMigrations();
      const version = localStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION);
      expect(version).toBe(CURRENT_SCHEMA_VERSION);
    });

    it('migrates Issued students without verifiedQrHash when version differs', () => {
      localStorage.setItem(STORAGE_KEYS.SCHEMA_VERSION, '1.0.0');
      const oldStudents: Partial<Student>[] = [
        {
          id: 'STU-OLD-01',
          schoolId: 'SCH-01',
          rollNo: 'R-101',
          name: 'Old Student',
          certificateStatus: 'Issued',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(oldStudents));

      storageService.runMigrations();

      const studentsRaw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      expect(studentsRaw).toBeDefined();
      const parsed = JSON.parse(studentsRaw!);
      expect(parsed[0].verifiedQrHash.toLowerCase()).toContain('ark-sil-sch-01-r101');
      expect(localStorage.getItem(STORAGE_KEYS.SCHEMA_VERSION)).toBe(CURRENT_SCHEMA_VERSION);
    });
  });

  describe('Corrupted data fallback', () => {
    it('safely handles invalid JSON in localStorage and returns fallback', () => {
      localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, '{corrupted-json: invalid]');
      storageService.clearCache();

      // Should not throw and should return fallback (empty array or seeded logs)
      expect(() => {
        const logs = storageService.getDailyLogs();
        expect(Array.isArray(logs)).toBe(true);
      }).not.toThrow();
    });

    it('safely handles invalid JSON for students without crashing', () => {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, '[[[Malformed JSON');
      storageService.clearCache();

      expect(() => {
        const students = storageService.getStudents();
        expect(Array.isArray(students)).toBe(true);
      }).not.toThrow();
    });
  });
});
