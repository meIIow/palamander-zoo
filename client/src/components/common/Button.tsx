type ButtonProps = {
  content: JSX.Element;
  onClick: () => void;
};

function Button({ content, onClick }: ButtonProps) {
  return (
    <button
      className="flex justify-center items-center rounded-full aspect-square bg-red-300"
      onClick={onClick}
    >
      {content}
    </button>
  );
}

export default Button;
