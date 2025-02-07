type NookProps = {
  content: JSX.Element | JSX.Element[];
  corner: string;
  expand: boolean;
  set: (expand: boolean) => void;
};

const nookStyle = 'absolute h-6 rounded-sm bg-green-500';

function Nook({ content, corner, expand, set }: NookProps) {
  const expansionStyle = expand ? 'z-20 w-full' : 'w-6';
  return (
    <div
      className={`${nookStyle} ${corner} ${expansionStyle}`}
      onMouseEnter={() => set(true)}
      onMouseLeave={() => set(false)}
    >
      {expand ? content : null}
    </div>
  );
}

export type { NookProps };
export default Nook;
