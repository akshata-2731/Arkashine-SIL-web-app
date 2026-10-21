import { Partner } from '../../types';
import { storageCore, STORAGE_KEYS } from './storageCore';
import { SEED_PARTNERS } from '../../data/seedData';

export class PartnerStorage {
  public getPartners(): Partner[] {
    return storageCore.safeParse<Partner[]>(STORAGE_KEYS.PARTNERS, SEED_PARTNERS);
  }

  public getPartner(id: string): Partner | undefined {
    return this.getPartners().find(p => p.id === id);
  }

  public savePartner(partner: Partner): Partner {
    const list = [...this.getPartners()];
    const idx = list.findIndex(p => p.id === partner.id);
    if (idx >= 0) {
      list[idx] = partner;
    } else {
      list.push(partner);
    }
    storageCore.safeWrite(STORAGE_KEYS.PARTNERS, list);
    return partner;
  }
}

export const partnerStorage = new PartnerStorage();
