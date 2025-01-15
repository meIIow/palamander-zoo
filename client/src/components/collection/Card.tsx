import './Card.css'
import PalamanderView from '../palamander/PalamanderView.tsx';
import { Palamander } from '../../palamander/palamander.ts';
import { generateBoundedDisplayRange }from '../../palamander/palamander-range.ts'

type CardProps = {
  pal: Palamander,
}

function Card({ pal } : CardProps) {
  console.log(pal);
  return (
    <div>
      <div className=" border size-32 border-black">
        <div className='card'>
          <PalamanderView pal={pal} display={generateBoundedDisplayRange({ x: 0.5, y: 0.5 })}/>
        </div>
      </div>
    </div>
  )
}

export default Card
