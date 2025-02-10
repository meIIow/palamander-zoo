import type { PalModifier } from '../../palamander/palamander-modifier.ts';

import ModifierBehavior from './ModifierBehavior.tsx';
import ModifierRender from './ModifierRender.tsx';
import ModifierColor from './ModifierColor.tsx';

type ModifierProps = {
  type: string;
  mod: PalModifier;
  category: ModifierCategory;
  change: (modifier: ModifierCategory) => void;
  customize: (modifier: PalModifier) => void;
};

enum ModifierCategory {
  Rendering = 'RENDERING',
  Image = 'IMAGE',
  Behavior = 'BEHAVIOR',
  None = 'NONE',
}

function createModificationToggle(
  modifier: ModifierCategory,
  change: (modifier: ModifierCategory) => void,
): JSX.Element {
  return (
    <button className="" onClick={() => change(modifier)}>
      {modifier}
    </button>
  );
}

function Modifier({ mod, category, change, customize }: ModifierProps) {
  // const [modification, set] = useState<ModifierCategory>(ModifierCategory.None);

  let modifier = null;
  if (category == ModifierCategory.Rendering) {
    modifier = <ModifierRender mod={mod} customize={customize} />;
  } else if (category == ModifierCategory.Image) {
    modifier = <ModifierColor mod={mod} customize={customize} />;
  } else if (category == ModifierCategory.Behavior) {
    modifier = <ModifierBehavior mod={mod} customize={customize} />;
  }

  return (
    <div className="flex flex-col items-stretch">
      <div className="flex justify-evenly">
        {createModificationToggle(ModifierCategory.Rendering, change)}
        {createModificationToggle(ModifierCategory.Image, change)}
        {createModificationToggle(ModifierCategory.Behavior, change)}
      </div>
      <div>{modifier}</div>
    </div>
  );
}

export { ModifierCategory };
export default Modifier;
