export type CardColor = {
  passive: string;
  active: string;
};

export function getStagingCardColor(): CardColor[] {
  return [
    { passive: 'bg-teal-50', active: 'bg-teal-100' },
    { passive: 'bg-cyan-50', active: 'bg-cyan-100' },
    { passive: 'bg-sky-50', active: 'bg-sky-100' },
  ];
}

export function getDefaultCardColor(): CardColor {
  return {
    passive: 'bg-neutral-50',
    active: 'bg-white',
  };
}
