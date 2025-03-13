import Deck from './Deck.tsx';

type SelectDeckProps = {
  choose: (type: string) => void;
};

function DeckSelect({ choose }: SelectDeckProps) {
  return (
    <div className="size-full overflow-y-auto rounded-b-md">
      <Deck choose={choose} blank={true} expand={false} />
    </div>
  );
}

export default DeckSelect;
