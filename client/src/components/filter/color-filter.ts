import { Palamander } from '../../palamander/palamander.ts';
import storage from '../../utilities/storage.ts';

enum FilterColor {
  Red,
  Green,
  Blue,
  Purple,
}

// const FILTER_COLORS = ['red', 'green', 'blue', 'purple'] as const;
// type FilterColors = (typeof FILTER_COLORS)[number];
type ColorFilter = Record<FilterColor, boolean>;
type ColorFilterAction =
  | { type: 'CLEAR' }
  | { type: 'TOGGLE'; color: FilterColor };
type PalamanderFilters = { [type: string]: ColorFilter };
type ColorToggle = (type: string, color: FilterColor) => void;
type ColorStyle = {
  bg: string;
};

async function pullPalamanderFilters(): Promise<PalamanderFilters> {
  const saved: PalamanderFilters =
    (await storage.sync.get(['pal-filters']))['pal-filters'] ?? {};
  return Object.fromEntries(
    Object.entries(saved).map(([type, filter]) => [
      type,
      asColorFilter(filter),
    ]),
  );
}

async function syncPalamanderFilters(
  filters: PalamanderFilters,
): Promise<void> {
  const storedFilters = await pullPalamanderFilters();
  const combinedFilters = { ...storedFilters, ...filters };
  await storage.sync.set({ 'pal-filters': combinedFilters });
}

function initColorFilter(): ColorFilter {
  return {
    [FilterColor.Red]: false,
    [FilterColor.Green]: false,
    [FilterColor.Blue]: false,
    [FilterColor.Purple]: false,
  };
}

function enumerateColors(): FilterColor[] {
  return Object.values(FilterColor).filter(
    (color) => typeof color !== 'string',
  );
}

function asColorFilter(filter: Object): ColorFilter {
  return Object.fromEntries(
    Object.entries({ ...initColorFilter(), ...filter }).filter(
      ([color, _]) => color in FilterColor,
    ),
  ) as ColorFilter;
}

function styleColor(color: FilterColor): ColorStyle {
  switch (color) {
    case FilterColor.Red:
      return { bg: 'red' };
    case FilterColor.Green:
      return { bg: 'green' };
    case FilterColor.Blue:
      return { bg: 'blue' };
    case FilterColor.Purple:
      return { bg: 'purple' };
    default:
      return { bg: 'black' };
  }
}

function filterPals(
  pals: Palamander[],
  filters: PalamanderFilters,
  filter: ColorFilter,
): Palamander[] {
  // Do not filter if all colors are inactive.
  if (!Object.values(filter).reduce((p, v) => v || p, false)) return pals;
  // Include pals that match any active filters.
  return pals.filter((pal) => {
    if (!(pal.type in filters)) return false;
    const palFilter = filters[pal.type];
    return enumerateColors().reduce((acc, color) => {
      if (!(color in filter) || !(color in palFilter)) return acc;
      return acc || (palFilter[color] && filter[color]);
    }, false);
  });
}

export type { ColorFilter, ColorFilterAction, PalamanderFilters, ColorToggle };
export {
  FilterColor,
  enumerateColors,
  filterPals,
  initColorFilter,
  pullPalamanderFilters,
  styleColor,
  syncPalamanderFilters,
};
