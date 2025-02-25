import { Palamander } from '../../palamander/palamander.ts';
import storage from '../../utilities/storage.ts';

enum FilterColor {
  Red,
  Green,
  Blue,
  Purple,
}

type ColorFilter = Record<FilterColor, boolean>;
type ColorFilterAction =
  | { type: 'CLEAR' }
  | { type: 'TOGGLE'; color: FilterColor };
type PalamanderFilters = { [type: string]: ColorFilter };
type ColorToggle = (type: string, color: FilterColor) => void;

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

function styleColor(color: FilterColor): string {
  // Cannot construct Tailwind style programatically - must enumerate fully.
  switch (color) {
    case FilterColor.Red:
      return 'ring-red-500 peer-checked:bg-red-500';
    case FilterColor.Green:
      return 'ring-green-500 peer-checked:bg-green-500';
    case FilterColor.Blue:
      return 'ring-blue-500 peer-checked:bg-blue-500';
    case FilterColor.Purple:
      return 'ring-purple-500 peer-checked:bg-purple-500';
    default:
      return 'ring-black peer-checked:bg-black';
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
