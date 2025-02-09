import type { PalModifier } from '../../palamander/palamander-modifier.ts';

import ModifierBehavior from './ModifierBehavior.tsx';
import ModifierRender from './ModifierRender.tsx';
import ModifierColor from './ModifierColor.tsx';

type ModifierProps = {
  type: string;
  mod: PalModifier;
  customize: (modifier: PalModifier) => void;
};

function Modifier({ type, mod, customize }: ModifierProps) {
  return (
    <div>
      Customize this {type}
      <div className="flex">
        <ModifierRender mod={mod} customize={customize} />
        <ModifierColor mod={mod} customize={customize} />
        <ModifierBehavior mod={mod} customize={customize} />
      </div>
    </div>
  );
}

export default Modifier;
