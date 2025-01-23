import { Palamander } from "../../palamander/palamander";
import storage from '../../utilities/storage.ts';

const FILTER_COLORS = [ 'red', 'green', 'blue', 'purple' ] as const;
type FilterColors = typeof FILTER_COLORS[number];
type ColorFilter = {
  [color in FilterColors]: boolean;
};

type ColorFilterAction = 
  | { type: 'CLEAR' } 
  | { type: 'TOGGLE', color: string };

type PalamanderFilters = { [type: string]: ColorFilter };
type ColorToggle = (type: string, color: string) => void;

async function pullPalamanderFilters(): Promise<PalamanderFilters> {
  return (await storage.sync.get(['pal-filters']))['pal-filters'] ?? {};
}

async function syncPalamanderFilters(filters: PalamanderFilters): Promise<void> {
  const storedFilters = await pullPalamanderFilters();
  const combinedFilters = { ...storedFilters, ...filters };
  await storage.sync.set({ 'pal-filters': combinedFilters });
}

function initColorFilter(): ColorFilter {
  return { red: false, green: false, blue: false, purple: false }
}

function filterPals(pals: Palamander[], filters: PalamanderFilters, filter: ColorFilter): Palamander[] {
  if (!(Object.values(filter).reduce((pred, val) => val || pred, false))) return pals;
  return pals.filter((pal) => {
    if (!(pal.type in filters)) return false;
    return Object.entries(filters[pal.type]).reduce((acc, [ color, set ]) => {
      if (!(color in filter)) return acc;
      return acc || (set && filter[color as keyof typeof filter])
    }, false);
  });
}

export type { ColorFilter, ColorFilterAction, PalamanderFilters, ColorToggle };
export { FILTER_COLORS, initColorFilter, filterPals, syncPalamanderFilters, pullPalamanderFilters };
