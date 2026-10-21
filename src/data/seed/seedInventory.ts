import { InventoryItem } from '../../types';

export function generateInventory(): InventoryItem[] {
  const items: InventoryItem[] = [];
  const schools = ['SCH-01', 'SCH-02', 'SCH-03', 'SCH-04'];

  for (const schoolId of schools) {
    items.push(
      {
        id: `INV-${schoolId}-01`,
        schoolId,
        itemName: 'SoiLENZ Digital Soil Testing Handheld Units',
        category: 'Device',
        totalQuantity: 2,
        usedQuantity: 2,
        unit: 'units',
        reorderLevel: 1,
        status: 'Adequate'
      },
      {
        id: `INV-${schoolId}-02`,
        schoolId,
        itemName: 'Standard Rapid Extraction Reagent Bottles (500ml)',
        category: 'Reagent',
        totalQuantity: 20,
        usedQuantity: 14,
        unit: 'bottles',
        reorderLevel: 5,
        status: 'Adequate'
      },
      {
        id: `INV-${schoolId}-03`,
        schoolId,
        itemName: 'Nitrile Protective Gloves (Box of 100)',
        category: 'Safety',
        totalQuantity: 10,
        usedQuantity: 7,
        unit: 'boxes',
        reorderLevel: 3,
        status: 'Adequate'
      },
      {
        id: `INV-${schoolId}-04`,
        schoolId,
        itemName: 'Core Stainless Soil Sampling Augers',
        category: 'Sampling_Kit',
        totalQuantity: 5,
        usedQuantity: 5,
        unit: 'units',
        reorderLevel: 2,
        status: 'Adequate'
      },
      {
        id: `INV-${schoolId}-05`,
        schoolId,
        itemName: 'Barcoded Soil Specimen Pouches (Pack of 200)',
        category: 'Sampling_Kit',
        totalQuantity: 5,
        usedQuantity: 4,
        unit: 'packs',
        reorderLevel: 2,
        status: 'Low'
      }
    );
  }

  return items;
}
