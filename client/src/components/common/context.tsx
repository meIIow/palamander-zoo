import { createContext } from 'react';
import { ColorFilter, ColorFilterAction, initColorFilter } from './color-filter';
import { Palamander } from '../../palamander/palamander';

type FilterContextValue = { filter: ColorFilter, dispatch: React.Dispatch<ColorFilterAction> }
const filterContextDefault = { filter: initColorFilter(), dispatch: (_: ColorFilterAction) => {} }
export const FilterContext = createContext<FilterContextValue>(filterContextDefault);
export const PalContext = createContext<Palamander[]>([]);
export const FilteredPalContext = createContext<Palamander[]>([]);