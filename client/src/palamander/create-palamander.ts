import { Section } from './morphology/section.ts';
import segmentate from './morphology/segmentation/segmentate.ts'
import { Palamander, PalSettings, PalamanderMap, calculatePivotIndex } from './palamander.ts';
import { generateMove } from './movement/movement.ts';
import { MovementBehavior } from './movement/behavior.ts';

type PalamanderSpec = {
  type: string,
  sectionTree: Section,
  movementBehavior: MovementBehavior,
  magnification: number,
};

interface PalamanderSpecMap {
  [key: string]: PalamanderSpec;
}

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

const defaultPalParams = {
  updateInterval: 50,
  magnification: 1,
  color: 'teal',
}

function hydrate(spec: PalamanderSpec, settings: PalSettings = defaultPalParams): Palamander {
  const body = segmentate(spec.sectionTree);
  return {
    type: spec.type,
    body,
    pivotIndex: calculatePivotIndex(body),
    override: { freeze: false, move: { linear: {}, rotational: {} } },
    move: generateMove(spec.movementBehavior),
    settings: {
      ...settings,
      magnification: spec.magnification * settings.magnification,
    },
  };
}

function createPalList(specs: PalamanderSpec[]): Palamander[] {
  return specs.map((spec) => hydrate(spec));
}

function hydratePalMap(specMap: PalamanderSpecMap): PalamanderMap {
  return Object.fromEntries(Object.entries(specMap)
    .map(([ type, spec]) => ([ type, hydrate({ ...spec, type }) ]))
    .filter(([ type, _ ]) => defaultPalList.includes(type as string))
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
    }
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
    magnification: 20
  }
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
    magnification: 20
  }
  return hydrate(palSpec);
}

async function readDefaultPalSpecMap(): Promise<PalamanderSpecMap> {
  const rawData = await fetch('./../pals.json');
  const palSpecs: PalamanderSpecMap = JSON.parse(await rawData.text());
  return palSpecs;
}

async function readDefaultPalMap(): Promise<PalamanderMap> {
  return hydratePalMap(await readDefaultPalSpecMap());
}

async function readDefaultPalList(): Promise<Palamander[]> {
  return createPalList(await readDefaultPalSpecs());
}

async function readDefaultPalSpecs(): Promise<PalamanderSpec[]> {
  const rawData = await fetch('./../pals.json');
  const palSpecs: PalamanderSpecMap = JSON.parse(await rawData.text());
  return (Object.entries(palSpecs)
    .filter(([ type, _ ]) => defaultPalList.includes(type))
    .map(([ _, spec ]) => spec ));
}

export type { PalamanderSpec }
export { createDefaultPalList, createDefaultPal, createAxolotl, hydrate, readDefaultPalList, readDefaultPalMap, readDefaultPalSpecs };