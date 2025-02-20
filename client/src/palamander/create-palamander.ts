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
  'axolittl',
  'munchkin',
  'decipede',
  'crawpa',
  'prince',
  'bocce-crab',
  'jelly',
  'wyrm',
  'nautilus',
  'palamander',
  'newt-king',
  'hexapus',
  'sea-monkey',
  'sea-lion',
  'serpent',
  'pollywog',
  'novafish',
];

function hydrate(spec: PalamanderSpec, mod?: PalModifier): Palamander {
  const body = segmentate(spec.sectionTree);
  mod = { ...createFallbackMod(), ...mod };
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

function hydratePalMap(
  specMap: Dict<PalamanderSpec>,
  modMap?: Dict<PalModifier>,
): Dict<Palamander> {
  return Object.fromEntries(
    Object.entries(specMap)
      .map(([type, spec]) => [type, hydrate({ ...spec, type }, modMap?.[type])])
      .filter(([type, _]) => defaultPalList.includes(type as string)),
  );
}

async function createDefaultPalList(): Promise<Palamander[]> {
  const specs: PalamanderSpec[] = defaultPalList.map((type) => {
    return {
      type,
      sectionTree: {
        type,
        count: type == 'axolittl' ? 15 : 10,
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
      magnification: (type == 'crawdpa' ? 10 : 20) / 2,
    };
  });
  return createPalList(specs);
}

function createDefaultPal(): Palamander {
  const palSpec = {
    type: 'nautilus',
    sectionTree: {
      type: 'nautilus',
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
      linear: 'flitting',
      rotational: 'curious',
    },
    suppressMove: { turn: false, speed: false },
    magnification: 20,
  };
  return hydrate(palSpec);
}

function createAxolotl(): Palamander {
  const palSpec = {
    type: 'axolittl',
    sectionTree: {
      type: 'axolittl',
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

async function readDefaultPalModMap(): Promise<Dict<PalModifier>> {
  const rawData = await fetch('./../mods.json');
  const palMods: Dict<PalModifier> = JSON.parse(await rawData.text());
  return palMods;
}

async function readDefaultPalMap(): Promise<Dict<Palamander>> {
  return hydratePalMap(
    await readDefaultPalSpecMap(),
    await readDefaultPalModMap(),
  );
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
