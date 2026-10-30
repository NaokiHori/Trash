import { X_LIMITS, Y_LIMITS } from "./param";
import { Category, Vector } from "./dataset";

type Kernel = (vector0: Vector, vector1: Vector) => number;
type Pattern = [(position: Vector) => Category, (vector0: Vector, vector1: Vector) => number];

const INNER_PRODUCT: Kernel = (vector0, vector1) =>
  vector0[0] * vector1[0] + vector0[1] * vector1[1];
const GAUSSIAN_RBF: Kernel = (vector0, vector1) => {
  const GAMMA = 2;
  const dif: Vector = [vector1[0] - vector0[0], vector1[1] - vector0[1]];
  const innerProductValue = dif[0] * dif[0] + dif[1] * dif[1];
  return Math.exp(-GAMMA * innerProductValue);
};

const ANNULUS: Pattern = [
  (position: Vector): Category => {
    const center: Vector = [
      0.5 * X_LIMITS[0] + 0.5 * X_LIMITS[1],
      0.5 * Y_LIMITS[0] + 0.5 * Y_LIMITS[1],
    ];
    const maxRadius = 0.4 * Math.min(X_LIMITS[1] - X_LIMITS[0], Y_LIMITS[1] - Y_LIMITS[0]);
    const innerRadius = 0.4 * maxRadius;
    const outerRadius = 0.8 * maxRadius;
    const distance = Math.hypot(position[0] - center[0], position[1] - center[1]);
    return innerRadius < distance && distance < outerRadius ? 1 : -1;
  },
  GAUSSIAN_RBF,
];
const BLOBS: Pattern = [
  (position: Vector): Category => {
    const class1Centers: Vector[] = [
      [0.25 * X_LIMITS[1] + 0.75 * X_LIMITS[0], 0.25 * Y_LIMITS[1] + 0.75 * Y_LIMITS[0]],
      [0.75 * X_LIMITS[1] + 0.25 * X_LIMITS[0], 0.75 * Y_LIMITS[1] + 0.25 * Y_LIMITS[0]],
      [0.75 * X_LIMITS[1] + 0.25 * X_LIMITS[0], 0.25 * Y_LIMITS[1] + 0.75 * Y_LIMITS[0]],
    ];
    const islandRadius = 0.12 * Math.min(X_LIMITS[1] - X_LIMITS[0], Y_LIMITS[1] - Y_LIMITS[0]);
    const insideAnyIsland = class1Centers.some(
      (center) => Math.hypot(position[0] - center[0], position[1] - center[1]) < islandRadius,
    );
    return insideAnyIsland ? 1 : -1;
  },
  GAUSSIAN_RBF,
];
const CIRCLE: Pattern = [
  (position: Vector): Category => {
    const center: Vector = [
      0.5 * X_LIMITS[0] + 0.5 * X_LIMITS[1],
      0.5 * Y_LIMITS[0] + 0.5 * Y_LIMITS[1],
    ];
    const radius = 0.25 * Math.min(X_LIMITS[1] - X_LIMITS[0], Y_LIMITS[1] - Y_LIMITS[0]);
    const distance = Math.hypot(position[0] - center[0], position[1] - center[1]);
    return distance < radius ? 1 : -1;
  },
  GAUSSIAN_RBF,
];
const ELLIPSE: Pattern = [
  (position: Vector): Category => {
    const center: Vector = [
      0.5 * X_LIMITS[0] + 0.5 * X_LIMITS[1],
      0.5 * Y_LIMITS[0] + 0.5 * Y_LIMITS[1],
    ];
    const dx = position[0] - center[0];
    const dy = position[1] - center[1];
    const angle = Math.PI / 4;
    const rotX = dx * Math.cos(angle) + dy * Math.sin(angle);
    const rotY = -dx * Math.sin(angle) + dy * Math.cos(angle);
    const a = 0.3 * (X_LIMITS[1] - X_LIMITS[0]);
    const b = 0.1 * (Y_LIMITS[1] - Y_LIMITS[0]);
    return rotX ** 2 / a ** 2 + rotY ** 2 / b ** 2 <= 1 ? 1 : -1;
  },
  GAUSSIAN_RBF,
];
const HALF_MOONS: Pattern = [
  (position: Vector): Category => {
    const centerX = 0.5 * (X_LIMITS[0] + X_LIMITS[1]);
    const centerY = 0.5 * (Y_LIMITS[0] + Y_LIMITS[1]);
    const r = 0.2 * Math.min(X_LIMITS[1] - X_LIMITS[0], Y_LIMITS[1] - Y_LIMITS[0]);
    const distUpper = Math.hypot(position[0] - (centerX - r / 2), position[1] - centerY);
    const inUpperMoon = distUpper <= r && position[1] >= centerY;
    const distLower = Math.hypot(position[0] - (centerX + r / 2), position[1] - (centerY - r / 2));
    const inLowerMoon = distLower <= r && position[1] <= centerY - r / 2;
    return inUpperMoon || inLowerMoon ? 1 : -1;
  },
  GAUSSIAN_RBF,
];
const LINE: Pattern = [
  (position: Vector): Category => {
    return ((Y_LIMITS[1] - Y_LIMITS[0]) / (X_LIMITS[1] - X_LIMITS[0])) *
      (position[0] - X_LIMITS[0]) +
      Y_LIMITS[0] -
      position[1] <
      0
      ? 1
      : -1;
  },
  INNER_PRODUCT,
];
const RECTANGLE: Pattern = [
  (position: Vector): Category => {
    const center: Vector = [
      0.5 * X_LIMITS[0] + 0.5 * X_LIMITS[1],
      0.5 * Y_LIMITS[0] + 0.5 * Y_LIMITS[1],
    ];
    const halfWidth = 0.2 * (X_LIMITS[1] - X_LIMITS[0]);
    const halfHeight = 0.2 * (Y_LIMITS[1] - Y_LIMITS[0]);
    const insideX = Math.abs(position[0] - center[0]) < halfWidth;
    const insideY = Math.abs(position[1] - center[1]) < halfHeight;
    return insideX && insideY ? 1 : -1;
  },
  GAUSSIAN_RBF,
];
const STAR: Pattern = [
  (position: Vector): Category => {
    const center: Vector = [
      0.5 * X_LIMITS[0] + 0.5 * X_LIMITS[1],
      0.5 * Y_LIMITS[0] + 0.5 * Y_LIMITS[1],
    ];
    const dx = position[0] - center[0];
    const dy = position[1] - center[1];
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    const baseRadius = 0.2 * Math.min(X_LIMITS[1] - X_LIMITS[0], Y_LIMITS[1] - Y_LIMITS[0]);
    const amplitude = 0.08 * Math.min(X_LIMITS[1] - X_LIMITS[0], Y_LIMITS[1] - Y_LIMITS[0]);
    const numPetals = 5;
    const dynamicRadius = baseRadius + amplitude * Math.cos(numPetals * angle);
    return dist < dynamicRadius ? 1 : -1;
  },
  GAUSSIAN_RBF,
];

const PATTERNS: Array<Pattern> = [
  ANNULUS,
  BLOBS,
  CIRCLE,
  ELLIPSE,
  HALF_MOONS,
  LINE,
  RECTANGLE,
  STAR,
];

export function getPattern(): [
  (position: Vector) => Category,
  (vector0: Vector, vector1: Vector) => number,
] {
  return PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
}
