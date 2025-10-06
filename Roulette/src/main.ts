import { RouletteState, RouletteView } from "./roulette";

function shuffleArray<T>(array: Array<T>): Array<T> {
  return array.sort(() => Math.random() - 0.5);
}

function getMembers(): Readonly<Array<string>> {
  const urlParams = new URLSearchParams(window.location.search);
  const members = urlParams.get("members");
  if (members === null) {
    return [];
  }
  return shuffleArray<string>(members.split(","));
}

function update(rouletteState: RouletteState, rouletteView: RouletteView) {
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

function main() {
  const members = getMembers();
  if (members.length < 2) {
    const message = "give more than one comma-delimited values";
    alert(message);
    throw new Error(message);
  }
  const rouletteState = new RouletteState(members);
  const rouletteView = new RouletteView(members);
  update(rouletteState, rouletteView);
}

window.addEventListener("load", () => {
  main();
});
