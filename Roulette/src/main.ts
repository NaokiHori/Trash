import { RouletteState, RouletteView } from "./roulette";

function getMembers(): Readonly<Array<string>> {
  const urlParams = new URLSearchParams(window.location.search);
  const members = urlParams.get("members");
  if (members === null) {
    return [];
  }
  return members.split(",");
}

function update(
  step: number,
  rouletteState: RouletteState,
  rouletteView: RouletteView,
) {
  rouletteState.update();
  const isFinalized = rouletteState.isFinalized();
  rouletteView.draw(rouletteState.getSelectedIndex(), isFinalized);
  if (isFinalized) {
    return;
  }
  requestAnimationFrame(() => {
    update(step + 1, rouletteState, rouletteView);
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
  update(0, rouletteState, rouletteView);
}

window.addEventListener("load", () => {
  main();
});
