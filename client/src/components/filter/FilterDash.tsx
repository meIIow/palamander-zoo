import FilterClear from './FilterClear.tsx';
import PrimaryFilter from '../filter/PrimaryFilter.tsx';
import VisibilityToggle from './VisibilityToggle.tsx';

type FilterDashProps = {
  active: boolean;
  expand: boolean;
  setExpand?: (value: React.SetStateAction<boolean>) => void;
};

function Dashboard({ active, expand, setExpand }: FilterDashProps) {
  const visibilityToggle =
    setExpand == undefined ? null : (
      <div className={`flex basis-6 aspect-square justify-center items-center`}>
        <VisibilityToggle expand={expand} setExpand={setExpand} />
      </div>
    );
  return (
    <div
      className={`rounded-md flex shade ${active ? '' : 'pointer-events-none opacity-75'}`}
    >
      <div className={`flex flex-col gap-2 flex-auto justify-evenly`}>
        <div className={`flex flex-row justify-evenly`}>
          <div className={`flex flex-row justify-evenly flex-auto`}>
            <button className="underline">Specimens</button>
            <button
              title="coming soon!"
              disabled={true}
              className="cursor-not-allowed"
            >
              Chimeras
            </button>
          </div>
          {visibilityToggle}
        </div>
        <div className={`items-stretch flex-auto`}>
          <PrimaryFilter active={active} />
        </div>
      </div>
      <div className={`flex aspect-square justify-center items-center`}>
        <FilterClear />
      </div>
    </div>
  );
}

export default Dashboard;
