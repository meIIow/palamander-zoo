import { Palamander } from "../../palamander/palamander";

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

const dummyPalcolors = {
  'axolotl': { red: true, green: true, blue: true, purple: true },
  'newt': { red: false, green: false, blue: false, purple: false },
  'octopus': { red: true, green: false, blue: true, purple: false },
  'frog': { red: false, green: true, blue: false, purple: true },
  'asdfsdkja': { red: true, green: true, blue: true, purple: true },
}


function initColorFilter(): ColorFilter {
  return { red: false, green: false, blue: false, purple: false }
}

function filterPals(pals: Palamander[], colors: PalColors, filter: ColorFilter): Palamander[] {
  if (!(Object.values(filter).reduce((pred, val) => val || pred, false))) return pals;
  return pals.filter((pal) => {
    if (!(pal.type in colors)) return false;
    return Object.entries(colors[pal.type]).reduce((acc, [ color, set ]) => {
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

export type { ColorFilter, ColorFilterAction, PalColors };
export { initColorFilter, filterPals, reduceColorFilter, dummyPalcolors };
