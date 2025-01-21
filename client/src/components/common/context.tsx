import { createContext } from 'react';
import { ColorFilter, ColorFilterAction, initColorFilter, PalColorFilters } from './color-filter';
import { Palamander } from '../../palamander/palamander';

type FilterContextValue = { filter: ColorFilter, dispatch: React.Dispatch<ColorFilterAction> }
const filterContextDefault = { filter: initColorFilter(), dispatch: (_: ColorFilterAction) => {} }
type PalFiltersContextValue = { filters: PalColorFilters, set: (type: string, color: string) => void }
const palFiltersContextDefault = { filters: {}, set: (_: string, __: string) => {} }
export const FilterContext = createContext<FilterContextValue>(filterContextDefault);
export const PalFiltersContext = createContext<PalFiltersContextValue>(palFiltersContextDefault);
export const PalContext = createContext<Palamander[]>([]);
export const FilteredPalContext = createContext<Palamander[]>([]);