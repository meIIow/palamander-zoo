import { useState } from 'react';

import type { PalModifier } from '../../palamander/palamander-modifier.ts';

import ModifierBehavior from './ModifierBehavior.tsx';
import ModifierRender from './ModifierRender.tsx';
import ModifierColor from './ModifierColor.tsx';

type ModifierProps = {
  type: string;
  mod: PalModifier;
  customize: (modifier: PalModifier) => void;
};

enum Modification {
  Rendering = 'RENDERING',
  Image = 'IMAGE',
  Behavior = 'BEHAVIOR',
  None = 'NONE',
}

function createModificationToggle(
  modification: Modification,
  set: React.Dispatch<React.SetStateAction<Modification>>,
): JSX.Element {
  return (
    <button className="" onClick={() => set(modification)}>
      {modification}
    </button>
  );
}

function Modifier({ mod, customize }: ModifierProps) {
  const [modification, set] = useState<Modification>(Modification.None);

  let modifier = null;
  if (modification == Modification.Rendering) {
    modifier = <ModifierRender mod={mod} customize={customize} />;
  } else if (modification == Modification.Image) {
    modifier = <ModifierColor mod={mod} customize={customize} />;
  } else if (modification == Modification.Behavior) {
    modifier = <ModifierBehavior mod={mod} customize={customize} />;
  }

  return (
    <div className="flex flex-col items-stretch">
      <div className="flex justify-evenly">
        {createModificationToggle(Modification.Rendering, set)}
        {createModificationToggle(Modification.Image, set)}
        {createModificationToggle(Modification.Behavior, set)}
      </div>
      <div>{modifier}</div>
    </div>
  );
}

export default Modifier;
