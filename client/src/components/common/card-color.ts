export type CardColor = {
  passive: string;
  active: string;
};

export function getStagingCardColor(): CardColor[] {
  return [
    { passive: 'bg-sky-100', active: 'bg-sky-100' },
    { passive: 'bg-sky-100', active: 'bg-sky-100' },
    { passive: 'bg-sky-100', active: 'bg-sky-100' },
  ];
}

export function getDefaultCardColor(): CardColor {
  return {
    passive: 'bg-neutral-50',
    active: 'bg-white',
  };
}
