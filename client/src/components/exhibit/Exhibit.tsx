import { useState, useRef, useReducer, useEffect, useContext } from 'react';

import Modifier from './Modifier.tsx';
import Staging from './Staging.tsx';
import Tank from './Tank.tsx';
import DeckSelect from '../common/DeckSelect.tsx';
import FilterDash from '../filter/FilterDash.tsx';

import type { PalModifier } from '../../palamander/palamander-modifier.ts';

import {
  initStagingState,
  reduceStaging,
  exhibitedFromStaged,
} from './StagingState.ts';
import { ModifierCategory } from './Modifier.tsx';
import { PalContext } from '../common/pal-context.ts';
import { ContainerContext } from '../common/container-context.ts';
import {
  show as showPal,
  visible,
  exhibit,
  getExhibit,
} from './../../extension/storage.ts';
import { getStagingCardColor } from '../common/card-color.ts';

function Exhibit() {
  const [staging, setStaging] = useReducer(reduceStaging, initStagingState());
  const [modifier, setModifier] = useState(ModifierCategory.Image);
  const [show, setShow] = useState(false);
  const containerRef = useRef(null);
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
    : <div className="flex flex-col flex-auto gap-0 overflow-hidden">
        <div className={`w-full flex flex-col basis-1 shrink-1`}>
          <FilterDash active={true} expand={false} />
        </div>
        <div className={`flex-auto overflow-hidden`} ref={containerRef}>
          <ContainerContext.Provider value={containerRef}>
            <DeckSelect
              choose={(key: string) => setStaging({ type: 'SET', pals, key })}
            />
          </ContainerContext.Provider>
        </div>
      </div>;

  const customizer =
    isActive && !isSelected && staged[staging.active] ?
      <div className="flex-auto">
        <Modifier
          type={staging.staged[staging.active].pal?.type ?? 'empty'}
          mod={staging.staged[staging.active].mod}
          category={modifier}
          change={(category: ModifierCategory) => setModifier(category)}
          customize={(mod: PalModifier) =>
            setStaging({ type: 'MODIFY', index: staging.active, mod })
          }
          color={getStagingCardColor()[staging.active].active}
        />
      </div>
    : null;

  return (
    <div className="flex items-stretch overflow-hidden flex-col size-full gap-x-4 gap-y-2">
      <div className={`w-full flex justify-evenly basis-8 grow-0 shrink-0`}>
        <button
          className="rounded-full w-1/6 button-selected animate-pulse"
          onClick={() => toggleShow(show)}
        >
          {show ? 'hide' : 'show'}
        </button>
        <button
          className="rounded-full w-1/6 button-selected animate-pulse"
          onClick={() => syncShow()}
        >
          sync
        </button>
        <button
          title="coming soon!"
          disabled={true}
          className="cursor-not-allowed rounded-full w-1/6 button"
        >
          load
        </button>
        <button
          title="coming soon!"
          disabled={true}
          className="cursor-not-allowed rounded-full w-1/6 button"
        >
          save
        </button>
      </div>
      <div className={`flex flex-col flex-auto overflow-hidden`}>
        <div className="grow-0 grid grid-cols-1 240:grid-cols-2 360:grid-cols-3">
          {staging.staged.map(({ pal }, i) => {
            return (
              <Staging
                pal={pal ?? null}
                active={staging.active == i}
                selected={staging.selected == i}
                key={`${i}-${pal == null ? '' : pal.type}`}
                color={getStagingCardColor()[i]}
                select={() => setStaging({ type: 'TOGGLE', index: i })}
                hover={() => setStaging({ type: 'ACTIVATE', index: i })}
              />
            );
          })}
        </div>
        {selection}
        {customizer}
      </div>
    </div>
  );
}

export default Exhibit;
