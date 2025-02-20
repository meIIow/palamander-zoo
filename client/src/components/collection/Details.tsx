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

function Details({ pal, bio, index, count, shift, release }: DetailsProps) {
  console.log('bio', bio);
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
    <div className="w-full h-full">
      <div className="flex w-full h-8 justify-evenly">
        {prev}
        <div className="w-1/3 text-center">{pal.type}</div>
        {next}
      </div>
      <div
        className="flex justify-center items-center w-full aspect-square rounded-md bg-yellow-100"
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
      <div className="pal-bio p-1 text-xs font-sans text-justify">{bio}</div>
    </div>
  );
}

export default Details;
