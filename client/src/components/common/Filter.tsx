import { ColorFilter } from './color-filter.ts';
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
      {Object.entries(filter).map(([ color, active ]) => {
        return (<FilterColor color={color} active={active} key={color} toggle={toggle}/>)
      })}
      {(!buttons.length) ? null : buttons}
    </div>
  )
}

export default Filter