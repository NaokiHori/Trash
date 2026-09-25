import {
  NDIMS,
  N_ELEMENT_NODES,
  YOUNGS_MODULUS,
  ELEMENT_AREA,
  GRAVITY,
  ELEMENT_DENSITY,
} from "./parameter";
import { TrussNode, TrussEdge } from "./truss";

function computeElementStiffnessMatrix(
  nodes: Readonly<[Readonly<TrussNode>, Readonly<TrussNode>]>,
): Float64Array {
  const vector = [nodes[1].getX() - nodes[0].getX(), nodes[1].getY() - nodes[0].getY()];
  const length = Math.hypot(vector[0], vector[1]);
  const c = vector[0] / length;
  const s = vector[1] / length;
  const elementStiffnessMatrix = new Float64Array(
    N_ELEMENT_NODES * NDIMS * N_ELEMENT_NODES * NDIMS,
  ).fill(YOUNGS_MODULUS * ELEMENT_AREA);
  elementStiffnessMatrix[0] *= c * c;
  elementStiffnessMatrix[1] *= c * s;
  elementStiffnessMatrix[2] *= -c * c;
  elementStiffnessMatrix[3] *= -c * s;
  elementStiffnessMatrix[4] *= c * s;
  elementStiffnessMatrix[5] *= s * s;
  elementStiffnessMatrix[6] *= -c * s;
  elementStiffnessMatrix[7] *= -s * s;
  elementStiffnessMatrix[8] *= -c * c;
  elementStiffnessMatrix[9] *= -c * s;
  elementStiffnessMatrix[10] *= c * c;
  elementStiffnessMatrix[11] *= c * s;
  elementStiffnessMatrix[12] *= -c * s;
  elementStiffnessMatrix[13] *= -s * s;
  elementStiffnessMatrix[14] *= c * s;
  elementStiffnessMatrix[15] *= s * s;
  return elementStiffnessMatrix;
}

function embedElementToGlobal(
  nNodes: number,
  edgeNodes: Readonly<[Readonly<TrussNode>, Readonly<TrussNode>]>,
  elementStiffnessMatrix: Readonly<Float64Array>,
  globalStiffnessMatrix: Float64Array,
): void {
  for (const [i, edgeNodeI] of edgeNodes.entries()) {
    const indexI = edgeNodeI.getIndex();
    for (const [j, edgeNodeJ] of edgeNodes.entries()) {
      const indexJ = edgeNodeJ.getIndex();
      for (let k = 0; k < NDIMS; k += 1) {
        for (let l = 0; l < NDIMS; l += 1) {
          globalStiffnessMatrix[(indexI * NDIMS + k) * (nNodes * NDIMS) + (indexJ * NDIMS + l)] +=
            elementStiffnessMatrix[(i * NDIMS + k) * (N_ELEMENT_NODES * NDIMS) + (j * NDIMS + l)];
        }
      }
    }
  }
}

function pinNode(
  nNodes: number,
  dim: number,
  index: number,
  globalStiffnessMatrix: Float64Array,
  values: Float64Array,
): void {
  const fixedValue = 0;
  const targetIndex = index * NDIMS + dim;
  const matrixSize = nNodes * NDIMS;
  for (let n = 0; n < matrixSize; n += 1) {
    globalStiffnessMatrix[n * matrixSize + targetIndex] = 0;
    globalStiffnessMatrix[targetIndex * matrixSize + n] = 0;
  }
  globalStiffnessMatrix[targetIndex * matrixSize + targetIndex] = 1;
  values[targetIndex] = fixedValue;
}

function solveLinearSystem(a: Float64Array, x: Float64Array): void {
  // modified Cholesky decomposition
  const nItems = x.length;
  for (let i = 0; i < nItems; i += 1) {
    // Lower triangular matrix
    for (let j = 0; j < i; j += 1) {
      for (let k = 0; k < j; k += 1) {
        const lik = a[i * nItems + k];
        const ljk = a[j * nItems + k];
        const dk = a[k * nItems + k];
        a[i * nItems + j] -= lik * ljk * dk;
      }
      a[i * nItems + j] /= a[j * nItems + j];
    }
    // Diagonal component
    for (let j = 0; j < i; j += 1) {
      const dj = a[j * nItems + j];
      const lij = a[i * nItems + j];
      a[i * nItems + i] -= lij * lij * dj;
    }
  }
  // L y = b
  for (let i = 0; i < nItems; i += 1) {
    for (let j = 0; j < i; j += 1) {
      x[i] -= a[i * nItems + j] * x[j];
    }
  }
  // D z = y
  for (let i = 0; i < nItems; i += 1) {
    x[i] /= a[i * nItems + i];
  }
  // LT x = z
  for (let i = nItems - 1; i >= 0; i -= 1) {
    for (let j = i + 1; j < nItems; j += 1) {
      x[i] -= a[j * nItems + i] * x[j];
    }
  }
}

export function solve(
  nodes: Readonly<Array<Readonly<TrussNode>>>,
  edges: Readonly<Array<Readonly<TrussEdge>>>,
): void {
  const values = new Float64Array(nodes.length * NDIMS);
  for (const edge of edges) {
    const length = edge.getLength();
    for (const node of edge.getNodes()) {
      values[node.getIndex() * NDIMS + 1] +=
        (1 / N_ELEMENT_NODES) * ELEMENT_DENSITY * ELEMENT_AREA * length * GRAVITY;
    }
  }
  const globalStiffnessMatrix = new Float64Array(nodes.length * NDIMS * nodes.length * NDIMS);
  for (const edge of edges) {
    const edgeNodes = edge.getNodes();
    const elementStiffnessMatrix = computeElementStiffnessMatrix(edgeNodes);
    embedElementToGlobal(nodes.length, edgeNodes, elementStiffnessMatrix, globalStiffnessMatrix);
  }
  for (const node of nodes) {
    if (node.getIsPinned()) {
      for (let dim = 0; dim < NDIMS; dim += 1) {
        pinNode(nodes.length, dim, node.getIndex(), globalStiffnessMatrix, values);
      }
    }
  }
  solveLinearSystem(globalStiffnessMatrix, values);
  for (const node of nodes) {
    node.setDx(values[node.getIndex() * NDIMS + 0]);
    node.setDy(values[node.getIndex() * NDIMS + 1]);
  }
}
