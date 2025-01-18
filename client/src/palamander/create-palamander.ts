import { Section } from './morphology/section.ts';
import segmentate from './morphology/segmentation/segmentate.ts'
import { Palamander, PalamanderMap, calculatePivotIndex } from './palamander.ts';
import { createMovementAgent } from './movement/movement-agent.ts';
import { BehaviorInput } from './movement/behavior.ts';

type PalamanderSpec = {
  type: string,
  sectionTree: Section,
  movementBehavior: BehaviorInput,
  updateInterval: number,
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

function hydrate(spec: PalamanderSpec): Palamander {
  const body = segmentate(spec.sectionTree);
  return {
    type: spec.type,
    body,
    pivotIndex: calculatePivotIndex(body),
    updateInterval: spec.updateInterval,
    magnificaiton: spec.magnification,
    override: { freeze: false, move: {} },
    movementAgent: createMovementAgent(spec.movementBehavior),
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
        linear: { id: '', velocity: 0, interval: 0 },
        angular: { id: '', velocity: 0, interval: 0 },
      },
      updateInterval: 50,
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
      linear: { id: '', velocity: 0, interval: 0 },
      angular: { id: '', velocity: 0, interval: 0 },
    },
    suppressMove: { turn: false, speed: false },
    updateInterval: 50,
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
      linear: { id: '', velocity: 0, interval: 0 },
      angular: { id: '', velocity: 0, interval: 0 },
    },
    suppressMove: { turn: false, speed: false },
    updateInterval: 50,
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