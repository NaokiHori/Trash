import { NDIMS, N_ELEMENT_NODES, YOUNGS_MODULUS, THICKNESS, GRAVITY } from "./parameter";
import { TrussNode, TrussEdge } from "./truss";

function computeElementStiffnessMatrix(nodes: [TrussNode, TrussNode]): Float64Array {
  const vector = [nodes[1].x - nodes[0].x, nodes[1].y - nodes[0].y];
  const length = Math.hypot(vector[0], vector[1]);
  const c = vector[0] / length;
  const s = vector[1] / length;
  const elementStiffnessMatrix = new Float64Array(
    N_ELEMENT_NODES * NDIMS * N_ELEMENT_NODES * NDIMS,
  ).fill(YOUNGS_MODULUS * THICKNESS);
  elementStiffnessMatrix[0] *= +c * c;
  elementStiffnessMatrix[1] *= +c * s;
  elementStiffnessMatrix[2] *= -c * c;
  elementStiffnessMatrix[3] *= -c * s;
  elementStiffnessMatrix[4] *= +c * s;
  elementStiffnessMatrix[5] *= +s * s;
  elementStiffnessMatrix[6] *= -c * s;
  elementStiffnessMatrix[7] *= -s * s;
  elementStiffnessMatrix[8] *= -c * c;
  elementStiffnessMatrix[9] *= -c * s;
  elementStiffnessMatrix[10] *= +c * c;
  elementStiffnessMatrix[11] *= +c * s;
  elementStiffnessMatrix[12] *= -c * s;
  elementStiffnessMatrix[13] *= -s * s;
  elementStiffnessMatrix[14] *= +c * s;
  elementStiffnessMatrix[15] *= +s * s;
  return elementStiffnessMatrix;
}

function pinNode(
  nNodes: number,
  dim: number,
  index: number,
  globalStiffnessMatrix: Float64Array,
  values: Float64Array,
) {
  const fixedValue = 0;
  for (let n = 0; n < nNodes; n++) {
    globalStiffnessMatrix[(n * NDIMS + dim) * (nNodes * NDIMS) + (index * NDIMS + dim)] = 0;
    globalStiffnessMatrix[(index * NDIMS + dim) * (nNodes * NDIMS) + (n * NDIMS + dim)] = 0;
  }
  globalStiffnessMatrix[(index * NDIMS + dim) * (nNodes * NDIMS) + (index * NDIMS + dim)] = 1;
  values[NDIMS * index + dim] = fixedValue;
}

function solveLinearSystem(a: Float64Array, x: Float64Array): void {
  // modified Cholesky decomposition
  const nItems = x.length;
  for (let i = 0; i < nItems; i++) {
    // Lower triangular matrix
    for (let j = 0; j < i; j++) {
      for (let k = 0; k < j; k++) {
        const lik = a[i * nItems + k];
        const ljk = a[j * nItems + k];
        const dk = a[k * nItems + k];
        a[i * nItems + j] -= lik * ljk * dk;
      }
      a[i * nItems + j] /= a[j * nItems + j];
    }
    // Diagonal component
    for (let j = 0; j < i; j++) {
      const dj = a[j * nItems + j];
      const lij = a[i * nItems + j];
      a[i * nItems + i] -= lij * lij * dj;
    }
  }
  // L y = b
  for (let i = 0; i < nItems; i++) {
    for (let j = 0; j < i; j++) {
      x[i] -= a[i * nItems + j] * x[j];
    }
  }
  // D z = y
  for (let i = 0; i < nItems; i++) {
    x[i] /= a[i * nItems + i];
  }
  // LT x = z
  for (let i = nItems - 1; i >= 0; i--) {
    for (let j = i + 1; j < nItems; j++) {
      x[i] -= a[j * nItems + i] * x[j];
    }
  }
}

export function solve(nodes: Readonly<Array<TrussNode>>, edges: Readonly<Array<TrussEdge>>) {
  const values = new Float64Array(nodes.length * NDIMS);
  for (const edge of edges) {
    const length = edge.getLength();
    const nodes = edge.nodes;
    for (const node of nodes) {
      values[node.index * NDIMS + 1] += (1 / N_ELEMENT_NODES) * THICKNESS * length * GRAVITY;
    }
  }
  const globalStiffnessMatrix = new Float64Array(nodes.length * NDIMS * nodes.length * NDIMS);
  for (const edge of edges) {
    const edgeNodes = edge.nodes;
    const elementStiffnessMatrix = computeElementStiffnessMatrix(edgeNodes);
    for (const [i, edgeNodeI] of edgeNodes.entries()) {
      const indexI = edgeNodeI.index;
      for (const [j, edgeNodeJ] of edgeNodes.entries()) {
        const indexJ = edgeNodeJ.index;
        for (let k = 0; k < NDIMS; k++) {
          for (let l = 0; l < NDIMS; l++) {
            globalStiffnessMatrix[
              (indexI * NDIMS + k) * (nodes.length * NDIMS) + (indexJ * NDIMS + l)
            ] +=
              elementStiffnessMatrix[(i * NDIMS + k) * (N_ELEMENT_NODES * NDIMS) + (j * NDIMS + l)];
          }
        }
      }
    }
  }
  for (const node of nodes) {
    if (node.isPinned) {
      for (let dim = 0; dim < NDIMS; dim++) {
        pinNode(nodes.length, dim, node.index, globalStiffnessMatrix, values);
      }
    }
  }
  solveLinearSystem(globalStiffnessMatrix, values);
  for (const node of nodes) {
    node.dx = values[node.index * NDIMS + 0];
    node.dy = values[node.index * NDIMS + 1];
  }
}
