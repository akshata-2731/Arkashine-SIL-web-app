import { useSyncExternalStore, useCallback } from 'react';
import { storageCore } from './storageCore';
import { storageService, StorageService } from '../storageService';
import { 
  School, Partner, Student, DailyLog, SoilSample, 
  FarmerOutreach, Campaign, BudgetLine, InventoryItem, 
  NotificationItem, ProgramTargets, Role 
} from '../../types';

let stateVersion = 0;
storageCore.subscribe(() => {
  stateVersion++;
});

export function useStorageSelector<T>(selector: (service: StorageService) => T): T {
  const subscribe = useCallback((onStoreChange: () => void) => {
    return storageCore.subscribe(onStoreChange);
  }, []);

  const getSnapshot = useCallback(() => {
    // Reference stateVersion to ensure re-evaluation when storage updates
    void stateVersion;
    return selector(storageService);
  }, [selector]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useSchools(): School[] {
  return useStorageSelector(useCallback(s => s.getSchools(), []));
}

export function useSchool(id: string): School | undefined {
  return useStorageSelector(useCallback(s => s.getSchool(id), [id]));
}

export function usePartners(): Partner[] {
  return useStorageSelector(useCallback(s => s.getPartners(), []));
}

export function useStudents(schoolId?: string): Student[] {
  return useStorageSelector(useCallback(s => s.getStudents(schoolId), [schoolId]));
}

export function useStudent(id: string): Student | undefined {
  return useStorageSelector(useCallback(s => s.getStudent(id), [id]));
}

export function useDailyLogs(schoolId?: string): DailyLog[] {
  return useStorageSelector(useCallback(s => s.getDailyLogs(schoolId), [schoolId]));
}

export function useSoilSamples(schoolId?: string): SoilSample[] {
  return useStorageSelector(useCallback(s => s.getSoilSamples(schoolId), [schoolId]));
}

export function useFarmerOutreach(schoolId?: string): FarmerOutreach[] {
  return useStorageSelector(useCallback(s => s.getFarmerOutreach(schoolId), [schoolId]));
}

export function useCampaigns(schoolId?: string): Campaign[] {
  return useStorageSelector(useCallback(s => s.getCampaigns(schoolId), [schoolId]));
}

export function useBudgetLines(): BudgetLine[] {
  return useStorageSelector(useCallback(s => s.getBudgetLines(), []));
}

export function useInventory(schoolId?: string): InventoryItem[] {
  return useStorageSelector(useCallback(s => s.getInventory(schoolId), [schoolId]));
}

export function useNotifications(role?: Role): NotificationItem[] {
  return useStorageSelector(useCallback(s => s.getNotifications(role), [role]));
}

export function useProgramTargets(): ProgramTargets {
  return useStorageSelector(useCallback(s => s.getProgramTargets(), []));
}
