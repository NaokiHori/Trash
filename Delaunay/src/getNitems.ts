export function getNitems(): number {
  const defaultNitems = 256;
  const minNitems = 3;
  const maxNitems = 4096;
  const urlParams = new URLSearchParams(window.location.search);
  const nitemsStr: string | null = urlParams.get("nitems");
  if (!nitemsStr) {
    return defaultNitems;
  }
  let nitems = Number(nitemsStr);
  if (Number.isNaN(nitems)) {
    return defaultNitems;
  }
  nitems = Math.round(nitems);
  nitems = nitems < maxNitems ? nitems : maxNitems;
  nitems = minNitems < nitems ? nitems : minNitems;
  return nitems;
}
