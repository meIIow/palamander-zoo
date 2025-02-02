import { createContext } from 'react';
import {
  ColorFilter,
  initColorFilter,
  PalamanderFilters,
} from './color-filter.ts';

type ColorFilterAction = { type: 'CLEAR' } | { type: 'TOGGLE'; color: string };

type FilterContextValue = {
  filter: ColorFilter;
  dispatch: React.Dispatch<ColorFilterAction>;
};
const filterContextDefault = {
  filter: initColorFilter(),
  dispatch: (_: ColorFilterAction) => {},
};
const FilterContext = createContext<FilterContextValue>(filterContextDefault);

type PalFiltersContextValue = {
  filters: PalamanderFilters;
  set: (type: string, color: string) => void;
};
const palFiltersContextDefault = {
  filters: {},
  set: (_: string, __: string) => {},
};
const PalFiltersContext = createContext<PalFiltersContextValue>(
  palFiltersContextDefault,
);

function reduceColorFilter(
  filters: ColorFilter,
  action: ColorFilterAction,
): ColorFilter {
  switch (action.type) {
    case 'CLEAR':
      return initColorFilter();
    case 'TOGGLE':
      return {
        ...filters,
        [action.color]: !filters[action.color as keyof typeof filters],
      };
    default:
      return { ...filters };
  }
}

export type { ColorFilterAction };
export { FilterContext, PalFiltersContext, reduceColorFilter };
