type TabStyler = {
  background: string;
  sliver: string;
  backgroundCol: string;
  backgroundExh: string;
  borderCol: string;
  borderExh: string;
};

type TabProps = {
  styler: TabStyler;
  set: (value: React.SetStateAction<boolean>) => void;
};

function Tab({ styler, set }: TabProps) {
  return (
    <div className={`size-full flex ${styler.sliver}`}>
      <div
        className={`flex-1 ${styler.backgroundCol} text-center border-r-cyan-700 border-b-teal-700 ${styler.borderCol} rounded-tr-2xl`}
        onClick={() => set((_) => true)}
      >
        Collection
      </div>
      <div
        className={`flex-1 ${styler.backgroundExh} text-center border-l-teal-700 border-b-cyan-700 ${styler.borderExh} rounded-tl-2xl`}
        onClick={() => set((_) => false)}
      >
        Exhibit
      </div>
    </div>
  );
}

export type { TabStyler, TabProps };
export default Tab;
