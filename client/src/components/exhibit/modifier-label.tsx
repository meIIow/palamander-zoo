function roundedFactorFromPercent(percent: number): number {
  // Round to two decimal places.
  return Math.round(percent) / 100;
}

const generateFactorLabel = (
  label: string,
  value: number,
  percent: boolean,
) => {
  if (!percent) value *= 100;
  return () => (
    <div>
      {label}: x{roundedFactorFromPercent(value)}
    </div>
  );
};

export { generateFactorLabel };
