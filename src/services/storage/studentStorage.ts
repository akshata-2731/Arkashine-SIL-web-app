import { Student, School, ProgramTargets } from '../../types';
import { storageCore, STORAGE_KEYS } from './storageCore';
import { generateStudentsForSchool, DEFAULT_PROGRAM_TARGETS } from '../../data/seedData';
import { generateCertificateHash } from '../../utils/certificateUtils';
import { schoolStorage } from './schoolStorage';

export class StudentStorage {
  private getInitialStudents(): Student[] {
    const list: Student[] = [];
    ['SCH-01', 'SCH-02', 'SCH-03'].forEach(sId => {
      list.push(...generateStudentsForSchool(sId, 18));
    });
    return list;
  }

  public getStudents(schoolId?: string): Student[] {
    const list = storageCore.safeParse<Student[]>(STORAGE_KEYS.STUDENTS, this.getInitialStudents());
    return schoolId ? list.filter(s => s.schoolId === schoolId) : list;
  }

  public getStudent(id: string): Student | undefined {
    return this.getStudents().find(s => s.id === id);
  }

  public saveStudent(student: Student): Student {
    const list = [...this.getStudents()];
    const idx = list.findIndex(s => s.id === student.id);
    if (idx >= 0) {
      list[idx] = student;
    } else {
      list.push(student);
    }
    storageCore.safeWrite(STORAGE_KEYS.STUDENTS, list);
    return student;
  }

  public issueCertificate(
    studentId: string, 
    _actorName: string = 'Arkashine Super Admin'
  ): { success: boolean; message: string; student?: Student } {
    const student = this.getStudent(studentId);
    if (!student) return { success: false, message: 'Student record not found' };

    const targets = storageCore.safeParse<ProgramTargets>(STORAGE_KEYS.TARGETS, DEFAULT_PROGRAM_TARGETS);
    const missing: string[] = [];

    if (student.attendanceRate < targets.attendanceThreshold) {
      missing.push(`Attendance rate of ${student.attendanceRate}% is below the required ${targets.attendanceThreshold}%`);
    }
    if (student.modulesCompleted < 4) {
      missing.push(`Has completed only ${student.modulesCompleted}/4 curriculum modules`);
    }
    if (student.practicalsDone < 6) {
      missing.push(`Has completed only ${student.practicalsDone}/6 mandatory SoiLENZ laboratory practicals`);
    }
    if (!student.capstoneSubmitted) {
      missing.push('Capstone soil health presentation has not been submitted or approved');
    }

    if (missing.length > 0) {
      student.certificateStatus = 'Incomplete_Data';
      student.missingFields = missing;
      this.saveStudent(student);
      return { 
        success: false, 
        message: `Certificate blocked due to incomplete requirements:\n• ${missing.join('\n• ')}` 
      };
    }

    student.certificateStatus = 'Issued';
    student.certificateId = `CERT-${student.schoolId}-${student.rollNo.replace('SIL-2026-', '')}`;
    student.verifiedQrHash = generateCertificateHash(student.id, student.schoolId, student.rollNo);
    if (!student.badgeIds.includes('badge-ambassador')) {
      student.badgeIds.push('badge-ambassador');
    }

    this.saveStudent(student);
    return { 
      success: true, 
      message: `Certificate ${student.certificateId} successfully issued for ${student.name}!`,
      student 
    };
  }

  public bulkIssueEligibleCertificates(
    schoolId: string, 
    actorName: string = 'Arkashine Super Admin'
  ): { count: number; message: string } {
    const students = this.getStudents(schoolId);
    let count = 0;

    for (const stu of students) {
      if (stu.certificateStatus === 'Eligible') {
        const res = this.issueCertificate(stu.id, actorName);
        if (res.success) count++;
      }
    }

    return { 
      count, 
      message: `Successfully issued certificates for ${count} eligible students.` 
    };
  }

  public getStudentByVerificationHash(hash: string): { student: Student; school?: School } | null {
    if (!hash) return null;
    const cleanHash = hash.trim();
    const students = this.getStudents();
    const found = students.find(s => s.verifiedQrHash === cleanHash && s.certificateStatus === 'Issued');
    if (!found) return null;
    return {
      student: found,
      school: schoolStorage.getSchool(found.schoolId)
    };
  }
}

export const studentStorage = new StudentStorage();
