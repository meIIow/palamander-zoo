import Deck from './Deck.tsx';

type SelectDeckProps = {
  choose: (type: string) => void;
};

function DeckSelect({ choose }: SelectDeckProps) {
  const cursor = 'pointer';
  return (
    <div className="size-full overflow-y-auto rounded-b-md">
      <Deck choose={choose} blank={true} expand={false} cursor={cursor} />
    </div>
  );
}

export default DeckSelect;
