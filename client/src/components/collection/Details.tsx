import { SlArrowLeft, SlArrowRight } from 'react-icons/sl';

import Button from '../common/Button.tsx';
import PalamanderView from '../palamander/PalamanderView.tsx';

import { Palamander } from '../../palamander/palamander.ts';
import { generateBoundedDisplayRange } from '../../palamander/palamander-range.ts';

type DetailsProps = {
  pal: Palamander;
  bio: string;
  index: number;
  count: number;
  shift: (index: number) => void;
  release: () => void;
};

function typeToName(type: string): string {
  return type.replace('-', ' ').toLocaleUpperCase();
}

function Details({ pal, bio, index, count, shift, release }: DetailsProps) {
  const buttonPlaceholder = <div className="h-full aspect-square" />;
  const prev =
    index <= 0 ? buttonPlaceholder : (
      <Button content={<SlArrowLeft />} onClick={() => shift(index - 1)} />
    );
  const next =
    index >= count - 1 ?
      buttonPlaceholder
    : <Button content={<SlArrowRight />} onClick={() => shift(index + 1)} />;
  return (
    <div className="flex flex-col w-full h-full bg-neutral-500/35 rounded-t-md overflow-y-auto gap-1 px-2 py-1">
      <div className="flex flex-none w-full h-8 justify-evenly content-stretch items-stretch">
        <div className="basis-1">{prev}</div>
        <div className="w-1/3 text-center">{typeToName(pal.type)}</div>
        <div className="basis-1">{next}</div>
      </div>
      <div
        className="flex justify-center items-center w-full flex-auto bg-neutral-50 rounded-md"
        onClick={() => release()}
        style={{ cursor: 'zoom-out' }}
      >
        <div className="pal-boundry">
          <PalamanderView
            pal={pal}
            key={pal.type}
            display={generateBoundedDisplayRange({ x: 0.5, y: 0.5 })}
          />
        </div>
      </div>
      <div className="pal-bio flex-none p-1 text-xs font-sans text-justify">
        {bio}
      </div>
    </div>
  );
}

export default Details;
