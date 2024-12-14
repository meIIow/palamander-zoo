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


async function showPals(): Promise<boolean> {
  return !!((await chrome.storage.local.get({ 'roam': true })).roam);
}

export { showPals }