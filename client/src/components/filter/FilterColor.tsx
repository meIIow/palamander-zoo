type FilterProps = {
  color: string;
  active: boolean;
  toggle: (color: string) => void;
};

function generateEmptyGradient(color: string): string {
  const transparent = 'rgba(0, 0, 0, 0)';
  return `radial-gradient(circle at 50% 50%, ${transparent} 0%, ${transparent} 35%, ${color} 40%, ${color} 100%)`;
}

function FilterColor({ color, active, toggle }: FilterProps) {
  const filled: React.CSSProperties = { backgroundColor: color };
  const empty: React.CSSProperties = {
    background: generateEmptyGradient(color),
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
