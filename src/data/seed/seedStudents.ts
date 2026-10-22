import { Student } from '../../types';
import { generateCertificateHash } from '../../utils/certificateUtils';
import { getInitialsAvatar } from '../../utils/avatarUtils';

const FIRST_NAMES_FEMALE = [
  'Aaradhya', 'Ananya', 'Diya', 'Isha', 'Kavya', 'Meera', 'Pooja', 'Riya', 'Sanvi', 'Sneha',
  'Tanvi', 'Vidya', 'Avani', 'Gayatri', 'Shruti', 'Bhavna', 'Nikita', 'Pallavi'
];

const FIRST_NAMES_MALE = [
  'Aarav', 'Aditya', 'Arjun', 'Dhruv', 'Ishaan', 'Kabir', 'Manav', 'Pranav', 'Rahul', 'Rohan',
  'Sai', 'Varun', 'Yash', 'Siddharth', 'Tejas', 'Omkar', 'Atharva', 'Mayank'
];

const LAST_NAMES = [
  'Patil', 'Deshmukh', 'Kulkarni', 'Jadhav', 'Pawar', 'Shinde', 'Chavan', 'More', 
  'Gaikwad', 'Bhatt', 'Patel', 'Shah', 'Mehta', 'Sharma', 'Verma', 'Singh', 'Yadav', 'Rao'
];

export function generateStudentsForSchool(schoolId: string, count: number = 18): Student[] {
  const students: Student[] = [];
  const grades: ('VIII' | 'IX' | 'X' | 'XI' | 'XII')[] = ['VIII', 'IX', 'X', 'XI', 'XII'];

  for (let i = 0; i < count; i++) {
    const isFemale = i % 2 === 0;
    const firstName = isFemale 
      ? FIRST_NAMES_FEMALE[i % FIRST_NAMES_FEMALE.length] 
      : FIRST_NAMES_MALE[i % FIRST_NAMES_MALE.length];
    const lastName = LAST_NAMES[(i * 3 + (schoolId.charCodeAt(schoolId.length - 1))) % LAST_NAMES.length];
    const fullName = `${firstName} ${lastName}`;
    const groupNumber = (i % 5) + 1;
    const classGrade = grades[i % grades.length];

    // Believable realistic metrics
    const isAtRisk = (schoolId === 'SCH-02' && (i === 4 || i === 9)) || (schoolId === 'SCH-01' && i === 15);
    const attendanceRate = isAtRisk ? (68 + (i % 9)) : (84 + (i % 15));
    const totalLogged = 20;
    const presentDays = Math.round((attendanceRate / 100) * totalLogged);

    const modulesCompleted = isAtRisk ? 2 : (i % 5 === 0 ? 4 : 3);
    const practicalsDone = isAtRisk ? 4 : Math.min(8, 6 + (i % 3));
    const soilSamplesTestedCount = 12 + (i * 2);
    const outreachFarmersCount = 28 + (i * 4);
    const capstoneSubmitted = !isAtRisk && (i < 12);

    // Gating check for certificate
    let certStatus: 'Eligible' | 'Incomplete_Data' | 'Issued' | 'Not_Eligible' = 'Incomplete_Data';
    const missing: string[] = [];

    if (attendanceRate < 70) {
      missing.push(`Attendance at ${attendanceRate}% is strictly below the compulsory 70% threshold. Student is not eligible for certificate.`);
    }
    const parentConsentSigned = true; // All students signed parental consent for chemical reagents
    if (!parentConsentSigned) {
      missing.push('Parental permission slip pending signature (Mandatory due to chemical testing reagents)');
    }
    if (modulesCompleted < 4) {
      missing.push(`Module 4 assessment pending (currently at Module ${modulesCompleted})`);
    }
    if (practicalsDone < 6) {
      missing.push(`Completed only ${practicalsDone}/6 mandatory laboratory practicals`);
    }
    if (!capstoneSubmitted) {
      missing.push('Final Soil Health Capstone presentation not uploaded');
    }

    if (missing.length === 0) {
      certStatus = i < 6 ? 'Issued' : 'Eligible';
    } else if (attendanceRate < 70) {
      certStatus = 'Not_Eligible';
    } else {
      certStatus = 'Incomplete_Data';
    }

    const badgeIds: string[] = ['badge-sampler'];
    if (soilSamplesTestedCount >= 20) badgeIds.push('badge-tester');
    if (outreachFarmersCount >= 50) badgeIds.push('badge-farmer-friend');
    if (capstoneSubmitted) badgeIds.push('badge-reporter');
    if (certStatus === 'Issued') badgeIds.push('badge-ambassador');

    const rollNo = `SIL-2026-${String(i + 101)}`;
    const studentId = `${schoolId}-STU-${String(i + 1).padStart(2, '0')}`;
    const certId = certStatus === 'Issued' ? `CERT-${schoolId}-${String(i + 1).padStart(2, '0')}` : undefined;
    const verifiedHash = certStatus === 'Issued' 
      ? generateCertificateHash(studentId, schoolId, rollNo, '2026-06-15')
      : undefined;

    students.push({
      id: studentId,
      schoolId,
      name: fullName,
      rollNo,
      gender: isFemale ? 'Female' : 'Male',
      classGrade,
      groupNumber,
      avatar: getInitialsAvatar(fullName),
      selectionStage: 'Selected',
      quizScore: 78 + (i % 21),
      assignmentScore: 82 + (i % 17),
      attendanceRate,
      totalPresentDays: presentDays,
      totalLoggedDays: totalLogged,
      modulesCompleted,
      practicalsDone,
      outreachFarmersCount,
      soilSamplesTestedCount,
      capstoneSubmitted,
      certificateStatus: certStatus,
      missingFields: missing,
      badgeIds,
      certificateId: certId,
      verifiedQrHash: verifiedHash,
      parentConsentSigned: true,
      parentConsentDate: '2026-05-28'
    });
  }

  return students;
}
