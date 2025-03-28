export function getNitems(defaultNitems: number): number {
  // check if URL param is given
  const urlParams = new URLSearchParams(window.location.search);
  const minNitems = 2;
  const maxNitems = 1024;
  if (urlParams.has("nitems")) {
    // if given, use after sanitised
    let nitems: number | null = Number(urlParams.get("nitems"));
    if (nitems) {
      nitems = Math.round(nitems);
      nitems = nitems < maxNitems ? nitems : maxNitems;
      nitems = minNitems < nitems ? nitems : minNitems;
      return nitems;
    } else {
      // decide randomly if the input is invalid
      return Math.floor((maxNitems - 1) * Math.random() + minNitems);
    }
  } else {
    // use default value
    return defaultNitems;
  }
}
