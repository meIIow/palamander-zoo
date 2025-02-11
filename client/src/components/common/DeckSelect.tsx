import Deck from './Deck.tsx';

type SelectDeckProps = {
  choose: (type: string) => void;
};

function DeckSelect({ choose }: SelectDeckProps) {
  const cursor = 'pointer';
  return (
    <div>
      <Deck choose={choose} blank={true} expand={false} cursor={cursor} />
    </div>
  );
}

export default DeckSelect;
