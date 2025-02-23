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
      console.log(style);
      return [s, style];
    }),
  );

  return (
    <div className={`size-full flex shade border-b-teal-950`}>
      <div
        className={`flex-1 text-center ${styler[Section.Collection]}`}
        onClick={() => set((_) => Section.Collection)}
      >
        Collection
      </div>
      <div
        className={`flex-1 text-center ${styler[Section.Exhibit]}`}
        onClick={() => set((_) => Section.Exhibit)}
      >
        Exhibit
      </div>
      <div
        className={`flex-1 text-center ${styler[Section.Hatchery]}`}
        onClick={() => set((_) => Section.Hatchery)}
      >
        Hatchery
      </div>
    </div>
  );
}

export type { TabProps };
export default Tab;
export { Section };
