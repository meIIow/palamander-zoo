// import { Palamander } from "../../palamander/palamander";

type ColorFilter = {
  red: boolean,
  green: boolean,
  blue: boolean,
  purple: boolean,
};

type ColorFilterAction = 
  | { type: 'CLEAR' } 
  | { type: 'TOGGLE', color: string };

type PalColors = { [type: string]: ColorFilter };


function initColorFilter(): ColorFilter {
  return { red: false, green: false, blue: false, purple: false }
}

// function filterPals(pals: Palamander[], colors: PalColors, filter: ColorFilter): Palamander[] {
//   const filterIsEmpty = !(Object.values(filter).reduce((pred, val) => val || pred, false)); 
//   return pals.filter((pal) => {
//     return (filterIsEmpty || Object.entries(colors[pal.type]).reduce((acc, [ color, set ]) => {
//       return acc || (set && filter[color as keyof typeof filter])
//     }, false));
//   });
// }

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

export type { ColorFilter, ColorFilterAction, PalColors };
export { initColorFilter, reduceColorFilter };
