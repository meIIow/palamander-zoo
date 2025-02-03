import type { Dict } from './common/types.ts';
import type { Section } from './morphology/section.ts';
import type { MovementBehavior } from './movement/behavior.ts';
import type { Palamander } from './palamander.ts';
import type { PalModifier } from './palamander-modifier.ts';

import segmentate from './morphology/segmentation/segmentate.ts';
import { calculatePivotIndex } from './palamander.ts';
import { createFallbackMod } from './palamander-modifier.ts';

type PalamanderSpec = {
  type: string;
  sectionTree: Section;
  movementBehavior: MovementBehavior;
  magnification: number;
};

const defaultPalList = [
  'axolotl',
  'newt',
  'frog',
  'centipede',
  'sea-monkey',
  'sea-lion',
  'starfish',
  'octopus',
  'crawdad',
  'horshoe-crab',
  'caterpillar',
  'tadpole',
  'newt-king',
  // 'jelly'
];

function hydrate(
  spec: PalamanderSpec,
  mod: PalModifier = createFallbackMod(),
): Palamander {
  const body = segmentate(spec.sectionTree);
  return {
    type: spec.type,
    behavior: spec.movementBehavior,
    size: spec.magnification,
    body,
    pivotIndex: calculatePivotIndex(body),
    mod,
  };
}

function createPalList(specs: PalamanderSpec[]): Palamander[] {
  return specs.map((spec) => hydrate(spec));
}

function hydratePalMap(specMap: Dict<PalamanderSpec>): Dict<Palamander> {
  return Object.fromEntries(
    Object.entries(specMap)
      .map(([type, spec]) => [type, hydrate({ ...spec, type })])
      .filter(([type, _]) => defaultPalList.includes(type as string)),
  );
}

async function createDefaultPalList(): Promise<Palamander[]> {
  const specs: PalamanderSpec[] = defaultPalList.map((type) => {
    return {
      type,
      sectionTree: {
        type,
        count: type == 'axolotl' ? 15 : 10,
        index: 0,
        size: 100,
        angle: 0,
        offset: 0,
        mirror: false,
        next: null,
        branches: [],
      },
      movementBehavior: {
        linear: '',
        rotational: '',
      },
      magnification: (type == 'crawdad' ? 10 : 20) / 2,
    };
  });
  return createPalList(specs);
}

function createDefaultPal(): Palamander {
  const palSpec = {
    type: 'sea-lion',
    sectionTree: {
      type: 'sea-lion',
      count: 10,
      index: 0,
      size: 100,
      angle: 0,
      offset: 0,
      mirror: false,
      next: null,
      branches: [],
    },
    movementBehavior: {
      linear: '',
      rotational: '',
    },
    suppressMove: { turn: false, speed: false },
    magnification: 20,
  };
  return hydrate(palSpec);
}

function createAxolotl(): Palamander {
  const palSpec = {
    type: 'axolotl',
    sectionTree: {
      type: 'axolotl',
      count: 15,
      index: 0,
      size: 100,
      angle: 0,
      offset: 0,
      mirror: false,
      next: null,
      branches: [],
    },
    movementBehavior: {
      linear: '',
      rotational: '',
    },
    suppressMove: { turn: false, speed: false },
    magnification: 20,
  };
  return hydrate(palSpec);
}

async function readDefaultPalSpecMap(): Promise<Dict<PalamanderSpec>> {
  const rawData = await fetch('./../pals.json');
  const palSpecs: Dict<PalamanderSpec> = JSON.parse(await rawData.text());
  return palSpecs;
}

async function readDefaultPalMap(): Promise<Dict<Palamander>> {
  return hydratePalMap(await readDefaultPalSpecMap());
}

async function readDefaultPalList(): Promise<Palamander[]> {
  return createPalList(await readDefaultPalSpecs());
}

async function readDefaultPalSpecs(): Promise<PalamanderSpec[]> {
  const rawData = await fetch('./../pals.json');
  const palSpecs: Dict<PalamanderSpec> = JSON.parse(await rawData.text());
  return Object.entries(palSpecs)
    .filter(([type, _]) => defaultPalList.includes(type))
    .map(([_, spec]) => spec);
}

export type { PalamanderSpec };
export {
  createDefaultPalList,
  createDefaultPal,
  createAxolotl,
  hydrate,
  readDefaultPalList,
  readDefaultPalMap,
  readDefaultPalSpecMap,
  readDefaultPalSpecs,
};
