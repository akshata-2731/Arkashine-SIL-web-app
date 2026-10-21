import { School, ChecklistItem } from '../../types';
import { storageCore, STORAGE_KEYS } from './storageCore';
import { SEED_SCHOOLS } from '../../data/seedData';

export class SchoolStorage {
  public getSchools(): School[] {
    return storageCore.safeParse<School[]>(STORAGE_KEYS.SCHOOLS, SEED_SCHOOLS);
  }

  public getSchool(id: string): School | undefined {
    return this.getSchools().find(s => s.id === id);
  }

  public saveSchool(school: School): School {
    const list = [...this.getSchools()];
    const idx = list.findIndex(s => s.id === school.id);
    if (idx >= 0) {
      list[idx] = school;
    } else {
      list.push(school);
    }
    storageCore.safeWrite(STORAGE_KEYS.SCHOOLS, list);
    return school;
  }

  public updateSchoolEligibilityCheck(schoolId: string, items: ChecklistItem[], evaluator: string): School {
    const school = this.getSchool(schoolId);
    if (!school) throw new Error(`School not found: ${schoolId}`);

    const total = items.length;
    const yesCount = items.filter(i => i.status === 'yes').length;
    const needsFixCount = items.filter(i => i.status === 'needs_fix').length;
    const noCount = items.filter(i => i.status === 'no').length;

    // Weight score: Yes = 100%, Needs Fix = 50%, No = 0%
    const score = Math.round(((yesCount * 1.0 + needsFixCount * 0.5) / (total || 1)) * 100);

    let result: 'Eligible' | 'Eligible_With_Conditions' | 'Not_Eligible' = 'Eligible';
    const conditions: string[] = [];
    const rejections: string[] = [];

    if (noCount > 0 || score < 60) {
      result = 'Not_Eligible';
      items.filter(i => i.status === 'no').forEach(i => rejections.push(`${i.category}: ${i.label} - ${i.notes || 'Unsatisfied'}`));
    } else if (needsFixCount > 0 || score < 85) {
      result = 'Eligible_With_Conditions';
      items.filter(i => i.status === 'needs_fix').forEach(i => conditions.push(`${i.label} (Deadline: ${i.fixDeadline || 'Before Day 1'})`));
    }

    school.eligibility = {
      score,
      result,
      evaluatedAt: new Date().toISOString().split('T')[0],
      evaluatedBy: evaluator,
      conditionsList: conditions,
      rejectionReasons: rejections,
      items
    };

    if (result === 'Eligible' && school.status === 'Eligibility_Check') {
      school.status = 'Approved';
    } else if (result === 'Not_Eligible') {
      school.status = 'Not_Eligible';
    }

    this.saveSchool(school);
    return school;
  }
}

export const schoolStorage = new SchoolStorage();
