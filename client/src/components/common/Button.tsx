type ButtonProps = {
  content: JSX.Element;
  onClick: () => void;
};

function Button({ content, onClick }: ButtonProps) {
  return (
    <button
      className="flex size-full justify-center items-center rounded-full aspect-square hover:bg-sky-200"
      onClick={onClick}
    >
      {content}
    </button>
  );
}

export default Button;
