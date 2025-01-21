import PalamanderView from '../palamander/PalamanderView.tsx';
import { Palamander } from '../../palamander/palamander.ts';
import { generateBoundedDisplayRange }from '../../palamander/palamander-range.ts'

type DetailsProps = {
  pal: Palamander,
  index: number,
  count: number,
  shift: (index: number) => void,
  release: () => void;
}

function Details({ pal, index, count, shift, release } : DetailsProps) {
  const prev = (<button className="rounded-full" onClick={() => shift(index-1)}>prev</button>);
  const next = (<button className="rounded-full" onClick={() => shift(index+1)}>next</button>);
  const exit = (<button className="rounded-full" onClick={() => release()}>exit</button>);
  return (
    <div className="w-full h-full">
      {(index <= 0) ? null : prev}
      {(index >= count-1) ? null : next}
      {exit}
      <div className='flex justify-center items-center border size-80 rounded-md border-black'>
        <div className='pal-boundry'>
          <PalamanderView pal={pal} key={pal.type} display={generateBoundedDisplayRange({ x: 0.5, y: 0.5 })}/>
        </div>
      </div>
      <div className='pal-bio'>
        Lorem ipsum
      </div>
    </div>
  )
}

export default Details
