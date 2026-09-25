import { Page, ALL_PAGES } from "./page";

function getElementByIdOrThrow(elementId: string): HTMLElement {
  const element = document.querySelector(`#${elementId}`);
  if (null === element) {
    throw new Error(`failed to get element: ${elementId}`);
  }
  if (!(element instanceof HTMLElement)) {
    throw new Error(`expected HTMLElement: ${elementId}`);
  }
  return element;
}

function getCurrentPageIndex(pages: Readonly<Array<Readonly<Page>>>): number {
  const currentPageIndex: number = pages.findIndex((page: Readonly<Page>) => page.getIsActive());
  if (currentPageIndex === -1) {
    throw new Error("No active page exists");
  }
  return currentPageIndex;
}

function switchPage(pages: Readonly<Array<Readonly<Page>>>, direction: number): number {
  const currentPageIndex: number = getCurrentPageIndex(pages);
  const newActivePageIndex: number = (currentPageIndex + direction + pages.length) % pages.length;
  for (const [index, page] of pages.entries()) {
    page.setIsActive(index === newActivePageIndex);
  }
  return newActivePageIndex;
}

function updateCarouselPagination(currentPageIndex: number, totalPages: number): void {
  const carouselPagination = getElementByIdOrThrow("carousel-pagination");
  carouselPagination.textContent = `${(currentPageIndex + 1).toString()} / ${totalPages.toString()}`;
}

function main(): void {
  updateCarouselPagination(getCurrentPageIndex(ALL_PAGES), ALL_PAGES.length);
  const carouselItems = getElementByIdOrThrow("carousel-items");
  if (!(carouselItems instanceof HTMLDivElement)) {
    throw new Error("expected HTMLDivElement");
  }
  for (const page of ALL_PAGES) {
    carouselItems.append(page.getElement());
  }
  const prevButton = getElementByIdOrThrow("carousel-button-to-prev");
  const nextButton = getElementByIdOrThrow("carousel-button-to-next");
  prevButton.addEventListener("click", () => {
    const newActivePageIndex = switchPage(ALL_PAGES, -1);
    updateCarouselPagination(newActivePageIndex, ALL_PAGES.length);
  });
  nextButton.addEventListener("click", () => {
    const newActivePageIndex = switchPage(ALL_PAGES, 1);
    updateCarouselPagination(newActivePageIndex, ALL_PAGES.length);
  });
}

window.addEventListener("load", () => {
  main();
});
