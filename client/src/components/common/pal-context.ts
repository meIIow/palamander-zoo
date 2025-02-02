import { createContext } from 'react';
import { Palamander } from '../../palamander/palamander';

const PalContext = createContext<Palamander[]>([]);
const FilteredPalContext = createContext<Palamander[]>([]);

export { PalContext, FilteredPalContext };
