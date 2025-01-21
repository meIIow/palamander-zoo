type FilterProps = {
  color: string,
  active: boolean,
  toggle: (color: string) => void, 
}

function FilterColor({ color, active, toggle }: FilterProps) {
  const style: React.CSSProperties = { borderColor: color }
  if (active) style.backgroundColor = color;
  return (
    <div className='rounded-full border-8 size-8' style={style} onClick={() => toggle(color)}></div>
  )
}

export default FilterColor