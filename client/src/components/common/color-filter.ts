import { Palamander } from "../../palamander/palamander";
import storage from '../../utilities/storage.ts';

type ColorFilter = {
  red: boolean,
  green: boolean,
  blue: boolean,
  purple: boolean,
};

type ColorFilterAction = 
  | { type: 'CLEAR' } 
  | { type: 'TOGGLE', color: string };

type PalColorFilters = { [type: string]: ColorFilter };

type ColorToggle = (type: string, color: string) => void;

async function pullPalamanderFilters(): Promise<PalColorFilters> {
  return (await storage.sync.get(['pal-filters']))['pal-filters'] ?? {};
}

async function syncPalamanderFilters(filters: PalColorFilters): Promise<void> {
  const storedFilters = await pullPalamanderFilters();
  const combinedFilters = { ...storedFilters, ...filters };
  await storage.sync.set({ 'pal-filters': combinedFilters });
}

function initColorFilter(): ColorFilter {
  return { red: false, green: false, blue: false, purple: false }
}

function filterPals(pals: Palamander[], filters: PalColorFilters, filter: ColorFilter): Palamander[] {
  if (!(Object.values(filter).reduce((pred, val) => val || pred, false))) return pals;
  return pals.filter((pal) => {
    if (!(pal.type in filters)) return false;
    return Object.entries(filters[pal.type]).reduce((acc, [ color, set ]) => {
      if (!(color in filter)) return acc;
      return acc || (set && filter[color as keyof typeof filter])
    }, false);
  });
}

const reduceColorFilter = (filters: ColorFilter, action: ColorFilterAction): ColorFilter => {
  switch (action.type) {
    case 'CLEAR':
      return initColorFilter();
    case 'TOGGLE':
      return { ...filters, [action.color]: !filters[action.color as keyof typeof filters] }
    default:
      return { ...filters };
  }
};

export type { ColorFilter, ColorFilterAction, PalColorFilters, ColorToggle };
export { initColorFilter, filterPals, reduceColorFilter, syncPalamanderFilters, pullPalamanderFilters };
