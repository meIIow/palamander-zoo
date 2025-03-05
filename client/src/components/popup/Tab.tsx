type TabProps = {
  section: Section;
  set: (value: React.SetStateAction<Section>) => void;
};

enum Section {
  Collection,
  Exhibit,
  Hatchery,
}

function Tab({ section, set }: TabProps) {
  const styler = Object.fromEntries(
    Object.values(Section).map((s) => {
      const style = section == s ? 'underline' : '';
      return [s, style];
    }),
  );

  return (
    <div
      className={`size-full flex bg-gradient-to-b from-neutral-500/25 to-neutral-500/35 text-white text-xl`}
    >
      <button
        className={`flex-1 text-center ${styler[Section.Collection]}`}
        onClick={() => set((_) => Section.Collection)}
      >
        Collection
      </button>
      <button
        className={`flex-1 text-center ${styler[Section.Exhibit]}`}
        onClick={() => set((_) => Section.Exhibit)}
      >
        Exhibit
      </button>
      <button
        className={`flex-1 text-center ${styler[Section.Hatchery]} cursor-not-allowed`}
        disabled={true}
        title="coming soon!"
        onClick={() => set((_) => Section.Hatchery)}
      >
        Hatchery
      </button>
    </div>
  );
}

export type { TabProps };
export default Tab;
export { Section };
