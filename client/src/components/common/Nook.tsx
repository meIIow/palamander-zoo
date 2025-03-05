type NookProps = {
  content: JSX.Element | JSX.Element[];
  corner: string;
  expand: boolean;
  set: (expand: boolean) => void;
};

const nookStyle = 'absolute h-6 bg-sky-200';

function Nook({ content, corner, expand, set }: NookProps) {
  const expansionStyle = expand ? 'z-20 w-full' : 'w-6';
  return (
    <div
      className={`${nookStyle} ${corner} ${expansionStyle}`}
      onMouseEnter={() => set(true)}
      onMouseLeave={() => set(false)}
    >
      <div className="bg-neutral-500/40 size-full text-center">
        {expand ? content : null}
      </div>
    </div>
  );
}

export type { NookProps };
export default Nook;
