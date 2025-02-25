import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';

type ControlsProps = {
  expand: boolean;
  setExpand: (value: React.SetStateAction<boolean>) => void;
};

function VisibilityToggle({ expand, setExpand }: ControlsProps) {
  return (
    <button onClick={() => setExpand((exp) => !exp)}>
      {expand ?
        <BsEyeSlashFill />
      : <BsEyeFill />}
    </button>
  );
}

export default VisibilityToggle;
