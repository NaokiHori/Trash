function buildExportSvg(svg: SVGSVGElement, size: number): string {
  const clone = svg.cloneNode(true);
  if (!(clone instanceof SVGSVGElement)) {
    throw new Error();
  }
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", size.toString());
  clone.setAttribute("height", size.toString());
  clone.removeAttribute("id");
  clone.removeAttribute("style");
  return new XMLSerializer().serializeToString(clone);
}

function triggerDownload(blob: Blob, fileName: string): void {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(a.href);
  }, 0);
}

async function downloadRaster(
  svg: SVGSVGElement,
  type: "image/jpeg" | "image/png",
  filename: string,
  size: number,
): Promise<void> {
  const svgBlob = new Blob([buildExportSvg(svg, size)], { type: "image/svg+xml" });
  const url = URL.createObjectURL(svgBlob);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (null === ctx) {
      throw new Error();
    }
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(img, 0, 0, size, size);
    new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) {
            resolve(b);
          } else {
            reject(new Error("toBlob failed"));
          }
        },
        type,
        0.95,
      );
    })
      .then((blob) => {
        triggerDownload(blob, filename);
      })
      .catch(() => {
        // NOTE: no error report for brevity
      });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function downloadSvg(svg: Readonly<SVGSVGElement>, prefix: string, size: number): void {
  const fileName = `${prefix}.svg`;
  const blob = new Blob([buildExportSvg(svg, size)], { type: "image/svg+xml" });
  triggerDownload(blob, fileName);
}

export function downloadJpg(svg: Readonly<SVGSVGElement>, prefix: string, size: number): void {
  const fileName = `${prefix}.jpg`;
  downloadRaster(svg, "image/jpeg", fileName, size).catch(() => {
    // NOTE: no error report for brevity
  });
}

export function downloadPng(svg: Readonly<SVGSVGElement>, prefix: string, size: number): void {
  const fileName = `${prefix}.png`;
  downloadRaster(svg, "image/png", fileName, size).catch(() => {
    // NOTE: no error report for brevity
  });
}
