import { ColorFilter, FILTER_COLORS } from './color-filter.ts';
import FilterColor from './FilterColor.tsx'

type FiltersProps = {
  filter: ColorFilter
  toggle: (color: string) => void,
  extras: { [text: string]: () => void }
}

function Filter({ filter, toggle, extras }: FiltersProps) {
  const buttons = Object.entries(extras).map(([ text, onClick ]) => {
    return (<button className="rounded-full" key={text} onClick={onClick}>{text}</button>)
  })
  return (
    <div>
      {FILTER_COLORS.map((color) => {
        return (<FilterColor color={color} active={filter[color]} key={color} toggle={toggle}/>)
      })}
      {(!buttons.length) ? null : buttons}
    </div>
  )
}

export default Filter