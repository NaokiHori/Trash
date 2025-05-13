// augmented vector
//   v[0] + v[1] * x + v[2] * y
// NOTE: v[0] is fixed to unity
export type Vector = [number, number, number];

export function innerProduct(
  v0: Readonly<Vector>,
  v1: Readonly<Vector>,
): number {
  return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
}
