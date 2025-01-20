import Filter from './Filter.tsx';

type FilterState = {
  red: boolean,
  green: boolean,
  blue: boolean,
  purple: boolean,
}

type FiltersProps = {
  filters: FilterState,
  set: (setFilters: (filters: FilterState) => FilterState) => void,
}

function resetFilters(): FilterState {
  return {red: false, green: false, blue: false, purple: false }
}

function Filters({ filters, set }: FiltersProps) {

  const toggle = (color: string) => set((filters) => {
    return { ...filters, [color]: !filters[color as keyof typeof filters] as boolean }
  });
  return (
    <div>
      {Object.entries(filters).map(([ color, active ]) => {
        return (<Filter color={color} active={active} key={color} toggle={toggle}/>)
      })}
      <button className="rounded-full" onClick={() => set((_) => resetFilters())}>reset</button>
    </div>
  )
}

export type { FilterState }
export default Filters
export { resetFilters };