import { SoilSample } from '../../types';
import { storageCore, STORAGE_KEYS } from './storageCore';
import { generateSoilSamples } from '../../data/seedData';

export class SoilSampleStorage {
  public getSoilSamples(schoolId?: string): SoilSample[] {
    const list = storageCore.safeParse<SoilSample[]>(STORAGE_KEYS.SOIL_SAMPLES, generateSoilSamples());
    return schoolId ? list.filter(s => s.schoolId === schoolId) : list;
  }

  public saveSoilSample(sample: SoilSample): SoilSample {
    const list = [...this.getSoilSamples()];
    const idx = list.findIndex(s => s.id === sample.id);
    if (idx >= 0) {
      list[idx] = sample;
    } else {
      list.unshift(sample);
    }
    storageCore.safeWrite(STORAGE_KEYS.SOIL_SAMPLES, list);
    return sample;
  }
}

export const soilSampleStorage = new SoilSampleStorage();
