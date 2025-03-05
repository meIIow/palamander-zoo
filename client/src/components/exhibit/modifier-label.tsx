function roundedFactorFromPercent(percent: number): number {
  // Round to two decimal places.
  return Math.round(percent) / 100;
}

const generateFactorLabel = (
  label: string,
  value: number,
  percent: boolean,
  center: boolean = false,
) => {
  if (!percent) value *= 100;
  const tailwind = 'text-base' + (center ? ' text-center' : ' text-left');
  return () => (
    <div className={tailwind}>
      {label}: x{roundedFactorFromPercent(value)}
    </div>
  );
};

export { generateFactorLabel };
