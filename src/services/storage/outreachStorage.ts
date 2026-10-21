import { FarmerOutreach, Campaign } from '../../types';
import { storageCore, STORAGE_KEYS } from './storageCore';
import { generateFarmerOutreach, generateCampaigns } from '../../data/seedData';

export class OutreachStorage {
  public getFarmerOutreach(schoolId?: string): FarmerOutreach[] {
    const list = storageCore.safeParse<FarmerOutreach[]>(STORAGE_KEYS.OUTREACH, generateFarmerOutreach());
    return schoolId ? list.filter(o => o.schoolId === schoolId) : list;
  }

  public saveFarmerOutreach(item: FarmerOutreach): FarmerOutreach {
    const list = [...this.getFarmerOutreach()];
    const idx = list.findIndex(o => o.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.unshift(item);
    }
    storageCore.safeWrite(STORAGE_KEYS.OUTREACH, list);
    return item;
  }

  public getCampaigns(schoolId?: string): Campaign[] {
    const list = storageCore.safeParse<Campaign[]>(STORAGE_KEYS.CAMPAIGNS, generateCampaigns());
    return schoolId ? list.filter(c => c.schoolId === schoolId) : list;
  }

  public saveCampaign(item: Campaign): Campaign {
    const list = [...this.getCampaigns()];
    const idx = list.findIndex(c => c.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.unshift(item);
    }
    storageCore.safeWrite(STORAGE_KEYS.CAMPAIGNS, list);
    return item;
  }
}

export const outreachStorage = new OutreachStorage();
