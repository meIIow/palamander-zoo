import { useContext } from 'react';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';

import PrimaryFilter from '../filter/PrimaryFilter.tsx';
import { FilteredPalContext } from '../common/pal-context.ts';

type ControlsProps = {
  chosen: number;
  expand: boolean;
  setExpand: (value: React.SetStateAction<boolean>) => void;
};

function Dashboard({ chosen, expand, setExpand }: ControlsProps) {
  const pals = useContext(FilteredPalContext);
  return (
    <div className={`flex flex-col`}>
      <div className={`flex justify-evenly flex-1`}>
        <div>Specimens</div>
        <div>Chimeras</div>
      </div>
      <div className={`flex justify-stretch flex-1`}>
        <div
          className={`items-stretch grow-1`}
          onClick={() => setExpand((exp) => !exp)}
        >
          {expand ?
            <BsEyeSlashFill />
          : <BsEyeFill />}
        </div>
        <div className={`items-stretch grow-5`}>
          <PrimaryFilter active={chosen < 0 || chosen >= pals.length} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
