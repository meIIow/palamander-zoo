export type CardColor = {
  passive: string;
  active: string;
};

export function getStagingCardColor(): CardColor[] {
  return [
    { passive: 'bg-teal-100', active: 'bg-teal-200' },
    { passive: 'bg-cyan-100', active: 'bg-cyan-200' },
    { passive: 'bg-sky-100', active: 'bg-sky-200' },
  ];
}

export function getDefaultCardColor(): CardColor {
  return {
    passive: 'bg-neutral-50',
    active: 'bg-white',
  };
}
