import { useState } from 'react';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';

type ControlsProps = {
  expand: boolean;
  setExpand: (value: React.SetStateAction<boolean>) => void;
};

function VisibilityToggle({ expand, setExpand }: ControlsProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      className={`flex aspect-square justify-center items-center ${hovered ? 'button-hover' : 'button'}`}
      onClick={() => setExpand((exp) => !exp)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {(
        hovered ? expand : !expand
      ) ?
        <BsEyeSlashFill />
      : <BsEyeFill />}
    </button>
  );
}

export default VisibilityToggle;
