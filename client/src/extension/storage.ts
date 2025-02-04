import type { Dict } from '../palamander/common/types.ts';
import type { PalamanderSpec } from '../palamander/create-palamander.ts';
import type { PalModifier } from '../palamander/palamander-modifier.ts';

const SHOW_KEY = 'show';
const EXHIBIT_KEY = 'exhibit';
const PAL_MAP_KEY = 'pal-map';

type Exhibited = { type: string; mod: PalModifier }[];

const createEmptyExhibit = () => [{ type: '' }, { type: '' }, { type: '' }];

async function exhibit(pals: Exhibited): Promise<void> {
  return await chrome.storage.local.set({ [EXHIBIT_KEY]: pals });
}

async function getExhibit(): Promise<Exhibited> {
  const pals = await chrome.storage.local.get([EXHIBIT_KEY]);
  return pals[EXHIBIT_KEY as keyof typeof pals] ?? createEmptyExhibit();
}

function show(show: boolean): Promise<void> {
  return chrome.storage.local.set({ [SHOW_KEY]: show });
}

async function visible(): Promise<boolean> {
  const show = await chrome.storage.local.get([SHOW_KEY]);
  return !!show[SHOW_KEY as keyof typeof show];
}

async function syncPalMap(): Promise<void> {
  const response = await fetch('./../pals.json');
  const palMap = JSON.parse(await response.text());
  return chrome.storage.local.set({ [PAL_MAP_KEY]: palMap });
}

async function getPalMap(): Promise<Dict<PalamanderSpec>> {
  const pals = await chrome.storage.local.get([PAL_MAP_KEY]);
  return pals[PAL_MAP_KEY as keyof typeof pals];
}

function exhibitChanged(changes: {
  [key: string]: chrome.storage.StorageChange;
}): boolean {
  return SHOW_KEY in changes || EXHIBIT_KEY in changes;
}

export type { Exhibited };
export {
  show,
  visible,
  exhibit,
  getExhibit,
  syncPalMap,
  getPalMap,
  exhibitChanged,
};
