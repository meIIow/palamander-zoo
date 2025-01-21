import Filter from './Filter.tsx';

type FilterState = {
  red: boolean,
  green: boolean,
  blue: boolean,
  purple: boolean,
}

type FiltersProps = {
  filters: FilterState,
  display: boolean,
  set: (setFilters: (filters: FilterState) => FilterState) => void,
}

function resetFilters(): FilterState {
  return { red: false, green: false, blue: false, purple: false }
}

function CardFilters({ filters, display, set }: FiltersProps) {
  const toggle = (display) ? (_: string) => {} : (color: string) => set((filters) => {
    return { ...filters, [color]: !filters[color as keyof typeof filters] as boolean }
  });
  const reset = (display) ? () => {} : () => set((_) => resetFilters());
  return (
    <div>
      {Object.entries(filters).map(([ color, active ]) => {
        return (<Filter color={color} active={active} key={color} toggle={toggle}/>)
      })}
      <button className="rounded-full" onClick={reset}>reset</button>
    </div>
  )
}

export type { FilterState }
export default CardFilters
export { resetFilters };