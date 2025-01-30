// WIP Storage Schema
// roam: bool // whether to render the chosen palamanders or not
// pal-{id}: nested segment config json, or maybe object with this as head plus other data (color, opacity, mov't bahavior, etc)
// favorites: { fav-type: [pal-id] }
// favorites-invers: { [pal-id]: fav-type }
// 
// chosen: [pal-ids]
// magnification: number
// frametime: number (0.05 - 1)s
// playspeed: number (0.2 - 1 - 5)x
// behavior?: string or enum, mellow, squirlly, speedy

const SHOW_KEY = 'show';
// const EXHIBIT_KEY = 'exhibit';

// async function exhibit(pals: string[]): Promise<void> {
//   return await chrome.storage.local.set({ EXHIBIT_KEY: pals });
// }

function show(show: boolean): Promise<void> {
  return chrome.storage.local.set({ [SHOW_KEY]: show });
}

async function visible(): Promise<boolean> {
  const show = await chrome.storage.local.get([ SHOW_KEY ])
  return !!(show[SHOW_KEY as keyof typeof show]);
}

export { show, visible }