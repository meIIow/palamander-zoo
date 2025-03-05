import type { ColorFilter } from './color-filter.ts';
import type { FilterColor } from './color-filter.ts';

import { enumerateColors, styleColor } from './color-filter.ts';

type ColorTogglesProps = {
  filter: ColorFilter;
  spec: ColorToggleSpec;
  toggle: (color: FilterColor) => void;
};

enum ColorToggleSpec {
  Small = 'w-7 h-4 after:h-3 after:w-3',
  Medium = 'w-9 h-5 after:h-4 after:w-4',
}

function ColorToggles({ filter, spec, toggle }: ColorTogglesProps) {
  return (
    <div className="flex size-full justify-between items-stretch">
      {enumerateColors().map((color) => {
        return (
          <div className="flex flex-1 justify-center items-center m-1">
            <label
              className="inline-flex items-center cursor-pointer"
              onClick={(event) => event.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={filter[color]}
                className="sr-only peer"
                onChange={() => toggle(color)}
              />
              <div
                className={`${spec} ${styleColor(color)} relative bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white ring-2 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:transition-all`}
              ></div>
            </label>
          </div>
        );
      })}
    </div>
  );
}

export default ColorToggles;
export { ColorToggleSpec };
