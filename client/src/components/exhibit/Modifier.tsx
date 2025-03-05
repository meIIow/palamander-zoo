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
  active: boolean,
): JSX.Element {
  const underlined = active ? 'underline' : '';
  return (
    <button className={underlined} onClick={() => change(modifier)}>
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
    <div
      className={`h-28 flex flex-col items-stretch text-neutral-500/60 rounded-b-md`}
    >
      <div className="flex justify-evenly text-lg">
        {Object.values(ModifierCategory).map((cat) => {
          if (cat == ModifierCategory.None) return null;
          return createModificationToggle(cat, change, cat == category);
        })}
      </div>
      <div>{modifier}</div>
    </div>
  );
}

export { ModifierCategory };
export default Modifier;
