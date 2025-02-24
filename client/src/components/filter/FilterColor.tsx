import { FilterColor as FilterColorEnum, styleColor } from './color-filter.ts';

type FilterProps = {
  color: FilterColorEnum;
  active: boolean;
  toggle: (color: FilterColorEnum) => void;
};

function generateEmptyGradient(color: string): string {
  const transparent = 'rgba(0, 0, 0, 0)';
  return `radial-gradient(circle at 50% 50%, ${transparent} 0%, ${transparent} 35%, ${color} 40%, ${color} 100%)`;
}

function FilterColor({ color, active, toggle }: FilterProps) {
  const bg = styleColor(color).bg;
  const filled: React.CSSProperties = { backgroundColor: bg };
  const empty: React.CSSProperties = {
    background: generateEmptyGradient(bg),
  };

  const style = active ? filled : empty;
  return (
    <div className="flex h-full max-w-full aspect-square bg-yellow-300 justify-center items-center">
      <button
        className="rounded-full aspect-square size-11/12"
        style={style}
        onClick={(event) => {
          event.stopPropagation();
          toggle(color);
        }}
      ></button>
    </div>
  );
}

export default FilterColor;
