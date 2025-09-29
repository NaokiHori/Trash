export function getBackground(
  nColors: number,
  isFinalized: boolean,
  selectedIndex: number,
) {
  const slices = Array.from({ length: nColors }, (_, index) => {
    const start = index / nColors;
    const end = (index + 1) / nColors;
    const color = getColor(
      nColors,
      isFinalized,
      index === selectedIndex,
      index,
    );
    return `${color} ${start.toString()}turn ${end.toString()}turn`;
  });
  return `conic-gradient(${slices.join(", ")})`;
}

export function getColor(
  nColors: number,
  isFinalized: boolean,
  isHighlighted: boolean,
  index: number,
): string {
  return `hsl(${((360 * index) / nColors).toString()}deg, 100%, ${isHighlighted ? "60%" : isFinalized ? "0%" : "90%"})`;
}

export function getSelectedIndex(nColors: number, position: number) {
  return Math.floor(nColors * position);
}
