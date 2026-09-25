const SCREEN_SIZE = 100;

export function xFromSimulatorToScreen(x: number): number {
  // assume center of the both domains is 0
  return SCREEN_SIZE * x;
}

export function yFromSimulatorToScreen(y: number): number {
  // assume center of the both domains is 0
  return -SCREEN_SIZE * y;
}
