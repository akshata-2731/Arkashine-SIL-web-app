import { BudgetLine, InventoryItem, ProgramTargets } from '../../types';
import { storageCore, STORAGE_KEYS } from './storageCore';
import { generateInventory, DEFAULT_PROGRAM_TARGETS } from '../../data/seedData';
import { INITIAL_BUDGET_LINES } from '../../data/budgetData';

export class BudgetInventoryStorage {
  public getBudgetLines(): BudgetLine[] {
    return storageCore.safeParse<BudgetLine[]>(STORAGE_KEYS.BUDGET, INITIAL_BUDGET_LINES);
  }

  public saveBudgetLine(line: BudgetLine): BudgetLine {
    const list = [...this.getBudgetLines()];
    const idx = list.findIndex(b => b.id === line.id);
    if (idx >= 0) {
      list[idx] = line;
    } else {
      list.push(line);
    }
    storageCore.safeWrite(STORAGE_KEYS.BUDGET, list);
    return line;
  }

  public getInventory(schoolId?: string): InventoryItem[] {
    const list = storageCore.safeParse<InventoryItem[]>(STORAGE_KEYS.INVENTORY, generateInventory());
    return schoolId ? list.filter(i => i.schoolId === schoolId) : list;
  }

  public saveInventory(item: InventoryItem): InventoryItem {
    const list = [...this.getInventory()];
    const idx = list.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.push(item);
    }
    storageCore.safeWrite(STORAGE_KEYS.INVENTORY, list);
    return item;
  }

  public getProgramTargets(): ProgramTargets {
    return storageCore.safeParse<ProgramTargets>(STORAGE_KEYS.TARGETS, DEFAULT_PROGRAM_TARGETS);
  }

  public saveProgramTargets(targets: ProgramTargets): ProgramTargets {
    storageCore.safeWrite(STORAGE_KEYS.TARGETS, targets);
    return targets;
  }
}

export const budgetInventoryStorage = new BudgetInventoryStorage();
