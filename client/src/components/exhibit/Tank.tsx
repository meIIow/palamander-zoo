import { Palamander } from '../../palamander/palamander.ts';
import { generateBoundedDisplayRange } from '../../palamander/palamander-range.ts';
import PalamanderView from '../palamander/PalamanderView.tsx';

function Tank({ pals }: { pals: (Palamander | null)[] }) {
  const palContent = pals.map((pal, i) => {
    return pal == null ? null : (
        <PalamanderView
          pal={{ ...pal }}
          key={`${i}-${pal.type}`}
          display={generateBoundedDisplayRange({ x: 0.5, y: 0.5 })}
        />
      );
  });

  return (
    <div className="w-full flex-auto bg-neutral-50 rounded-md">
      {<div className="pal-boundry">{palContent}</div>}
    </div>
  );
}

export default Tank;
