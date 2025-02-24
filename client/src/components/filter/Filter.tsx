import type { ColorFilter } from './color-filter.ts';
import type { FilterColor as FilterColorEnum } from './color-filter.ts';

import { enumerateColors } from './color-filter.ts';
import FilterColor from './FilterColor.tsx';

type FiltersProps = {
  filter: ColorFilter;
  toggle: (color: FilterColorEnum) => void;
  extras: { [text: string]: () => void };
};

function Filter({ filter, toggle, extras }: FiltersProps) {
  const buttons = Object.entries(extras).map(([text, onClick]) => {
    return (
      <button className="rounded-full" key={text} onClick={onClick}>
        {text}
      </button>
    );
  });
  return (
    <div className="flex size-full justify-evenly items-stretch bg-blue-500">
      {enumerateColors().map((color) => {
        return (
          <div className="flex bg-red-500 flex-1 justify-center items-center">
            <FilterColor
              color={color}
              active={filter[color]}
              key={color}
              toggle={toggle}
            />
          </div>
        );
      })}
      {!buttons.length ? null : buttons}
    </div>
  );
}

export default Filter;
