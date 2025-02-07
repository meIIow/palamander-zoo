import { useState, useReducer, useEffect, useContext } from 'react';

import Modifier from './Modifier.tsx';
import Staging from './Staging.tsx';
import Tank from './Tank.tsx';
import CardMatrix from '../common/CardMatrix.tsx';
import PrimaryFilter from './../common/PrimaryFilter.tsx';

import type { PalModifier } from '../../palamander/palamander-modifier.ts';

import {
  initStagingState,
  reduceStaging,
  exhibitedFromStaged,
} from './StagingState.ts';
import { PalContext } from '../common/pal-context.ts';
import {
  show as showPal,
  visible,
  exhibit,
  getExhibit,
} from './../../extension/storage.ts';

function Exhibit() {
  const [staging, setStaging] = useReducer(reduceStaging, initStagingState());
  const [show, setShow] = useState(false);
  const pals = useContext(PalContext);

  useEffect(() => {
    (async () => {
      // Sync staging with persistant data
      const exhibited = await getExhibit();
      console.log(pals, exhibited);
      setStaging({ type: 'OVERWRITE', pals, exhibited });

      // Sync visibility with persistant data
      const isVisible = await visible();
      setShow(isVisible);
    })();
  }, []);

  const toggleShow = async (show: boolean) => {
    await showPal(!show);
    await exhibit(exhibitedFromStaged(staging.staged));
    setShow(!show);
  };

  const syncShow = async () => {
    await exhibit(exhibitedFromStaged(staging.staged));
  };

  const isSelected = !(staging.selected < 0 || staging.selected > 2);
  const isActive = !(staging.active < 0 || staging.active > 2);
  const staged = staging.staged.map(({ pal, mod }) => {
    return pal ? { ...pal, mod } : null;
  });

  const selection =
    !isSelected ?
      <Tank pals={staged} />
    : <div>
        <PrimaryFilter active={true} />
        <CardMatrix
          choose={(key: string) => setStaging({ type: 'SET', pals, key })}
          expand={false}
        />
      </div>;

  const customizer =
    isActive && !isSelected && staged[staging.active] ?
      <Modifier
        mod={staging.staged[staging.active].mod}
        customize={(mod: PalModifier) =>
          setStaging({ type: 'MODIFY', index: staging.active, mod })
        }
      />
    : null;

  return (
    <div>
      <button className="rounded-full" onClick={() => toggleShow(show)}>
        {show ? 'hide' : 'show'}
      </button>
      ;
      <button className="rounded-full" onClick={() => syncShow()}>
        sync
      </button>
      ;
      <div className="grid gap-3 grid-cols-1 240:grid-cols-2 360:grid-cols-3">
        {staging.staged.map(({ pal }, i) => {
          return (
            <Staging
              pal={pal ?? null}
              active={staging.active == i}
              selected={staging.selected == i}
              key={`${i}-${pal == null ? '' : pal.type}`}
              select={() => setStaging({ type: 'TOGGLE', index: i })}
              hover={() => setStaging({ type: 'ACTIVATE', index: i })}
            />
          );
        })}
      </div>
      {selection}
      {customizer}
    </div>
  );
}

export default Exhibit;
