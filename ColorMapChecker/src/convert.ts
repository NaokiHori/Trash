// convert HSV value [0:1] to RGB value [0:1]
// ref: https://github.com/python/cpython/blob/3.11/Lib/colorsys.py
export function hsvToRgb(hsv: [number, number, number]): [number, number, number] {
  const h = hsv[0];
  const s = hsv[1];
  const v = hsv[2];
  if (0 === s) {
    return [v, v, v];
  }
  const f = 6 * h - Math.trunc(6 * h);
  const p = v * (1 - s);
  const q = v * (1 - s * f);
  const t = v * (1 - s * (1 - f));
  if (h < 1 / 6) {
    return [v, t, p];
  } else if (h < 2 / 6) {
    return [q, v, p];
  } else if (h < 3 / 6) {
    return [p, v, t];
  } else if (h < 4 / 6) {
    return [p, q, v];
  } else if (h < 5 / 6) {
    return [t, p, v];
  }
  return [v, p, q];
}

function getH(rgb: [number, number, number]): number {
  const r = rgb[0];
  const g = rgb[1];
  const b = rgb[2];
  const min = Math.min(r, Math.min(g, b));
  const max = Math.max(r, Math.max(g, b));
  if (min === max) {
    return 0;
  } else if (r === max) {
    const h = (g - b) / (max - min) / 6;
    return h + (h < 0 ? 1 : 0);
  } else if (g === max) {
    const h = (b - r) / (max - min) / 6 + 1 / 3;
    return h + (h < 0 ? 1 : 0);
  }
  const h = (r - g) / (max - min) / 6 + 2 / 3;
  return h + (h < 0 ? 1 : 0);
}

function getS(rgb: [number, number, number]): number {
  const r = rgb[0];
  const g = rgb[1];
  const b = rgb[2];
  const min = Math.min(r, Math.min(g, b));
  const max = Math.max(r, Math.max(g, b));
  return 0 === max ? 0 : (max - min) / max;
}

function getV(rgb: [number, number, number]): number {
  const r = rgb[0];
  const g = rgb[1];
  const b = rgb[2];
  const max = Math.max(r, Math.max(g, b));
  return max;
}

// convert RGB value [0:1] to HSV value [0:1]
// ref: https://github.com/python/cpython/blob/3.11/Lib/colorsys.py
export function rgbToHsv(rgb: [number, number, number]): [number, number, number] {
  const h = getH(rgb);
  const s = getS(rgb);
  const v = getV(rgb);
  return [h, s, v];
}
