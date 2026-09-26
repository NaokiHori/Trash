import { RouletteState, RouletteView } from "./roulette";

function shuffleArray<T>(array: Array<Readonly<T>>): Array<T> {
  // Fisher–Yates shuffle
  // https://en.wikipedia.org/wiki/Fisher–Yates_shuffle
  const nItems = array.length;
  for (let i = nItems - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getMembers(): Readonly<Array<string>> {
  const urlParams = new URLSearchParams(window.location.search);
  const members = urlParams.get("members");
  if (members === null) {
    return [];
  }
  return shuffleArray<string>(members.split(","));
}

function update(
  rouletteState: Readonly<RouletteState>,
  rouletteView: Readonly<RouletteView>,
): void {
  rouletteState.update();
  const isFinalized = rouletteState.isFinalized();
  rouletteView.draw(rouletteState.getSelectedIndex(), isFinalized);
  if (isFinalized) {
    return;
  }
  requestAnimationFrame(() => {
    update(rouletteState, rouletteView);
  });
}

function main(): void {
  const members = getMembers();
  if (members.length < 2) {
    const message = "give more than one comma-delimited values";
    throw new Error(message);
  }
  const rouletteState = new RouletteState(members);
  const rouletteView = new RouletteView(members);
  update(rouletteState, rouletteView);
}

window.addEventListener("load", () => {
  main();
});
