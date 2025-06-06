import sudokuAssistantIcon from "../SudokuAssistant/icon.jpg";
import miniMazeIcon from "../MiniMaze/icon.jpg";
import juliaSetViewerIcon from "../JuliaSetViewer/icon.jpg";
import colorMapCheckerIcon from "../ColorMapChecker/icon.jpg";
// import animatedClassifierIcon from "../Classifier/icon.jpg";
import delaynayIcon from "../Delaunay/icon.jpg";

function getElementById(elementId: string): HTMLElement {
  const element: HTMLElement | null = document.getElementById(elementId);
  if (null === element) {
    throw new Error(`failed to get element: ${elementId}`);
  }
  return element;
}

class Page {
  private _element: HTMLDivElement;
  private _isActive: boolean;

  public constructor({
    isActive,
    title,
    href,
    imageSource,
  }: {
    isActive: boolean;
    title: string;
    href: string;
    imageSource: string;
  }) {
    const element = document.createElement("div");
    element.classList.add("carousel-item");
    const anchor = document.createElement("a");
    anchor.textContent = title;
    anchor.setAttribute("href", href);
    const image = document.createElement("img");
    image.classList.add("carousel-image");
    image.setAttribute("src", imageSource);
    element.appendChild(anchor);
    element.appendChild(image);
    this._element = element;
    this._isActive = isActive;
    this.setDisplayStatus();
  }

  public linkWithParent(parentElement: HTMLDivElement) {
    parentElement.appendChild(this._element);
  }

  public get isActive(): boolean {
    return this._isActive;
  }

  public set isActive(flag: boolean) {
    this._isActive = flag;
    this.setDisplayStatus();
  }

  private setDisplayStatus() {
    const activeClass = "carousel-item-active";
    const inactiveClass = "carousel-item-inactive";
    if (this._isActive) {
      this._element.classList.remove(inactiveClass);
      this._element.classList.add(activeClass);
    } else {
      this._element.classList.remove(activeClass);
      this._element.classList.add(inactiveClass);
    }
  }
}

function getCurrentPageIndex(pages: Array<Page>): number {
  const currentPageIndex: number = pages.findIndex(
    (page: Page) => page.isActive,
  );
  if (currentPageIndex === -1) {
    throw new Error("No active page exists");
  }
  return currentPageIndex;
}

function switchPage(pages: Array<Page>, direction: number): number {
  const currentPageIndex: number = getCurrentPageIndex(pages);
  const newActivePageIndex: number =
    (currentPageIndex + direction + pages.length) % pages.length;
  pages.forEach((page: Page, index: number) => {
    page.isActive = index === newActivePageIndex;
  });
  return newActivePageIndex;
}

function updateCarouselPagination(
  currentPageIndex: number,
  totalPages: number,
) {
  const carouselPagination = getElementById("carousel-pagination");
  carouselPagination.textContent = `${(currentPageIndex + 1).toString()} / ${totalPages.toString()}`;
}

const ROOT = ".";

function main() {
  const pages: Array<Page> = [
    new Page({
      isActive: true,
      title: "Sudoku Assistant",
      href: `${ROOT}/SudokuAssistant/index.html`,
      imageSource: sudokuAssistantIcon,
    }),
    new Page({
      isActive: false,
      title: "Mini Maze",
      href: `${ROOT}/MiniMaze/index.html`,
      imageSource: miniMazeIcon,
    }),
    new Page({
      isActive: false,
      title: "Julia Set Viewer",
      href: `${ROOT}/JuliaSetViewer/index.html`,
      imageSource: juliaSetViewerIcon,
    }),
    new Page({
      isActive: false,
      title: "Color Map Checker",
      href: `${ROOT}/ColorMapChecker/index.html`,
      imageSource: colorMapCheckerIcon,
    }),
    // new Page({
    //   isActive: false,
    //   title: "Classifier",
    //   href: `${ROOT}/Classifier/index.html`,
    //   imageSource: animatedClassifierIcon,
    // }),
    new Page({
      isActive: false,
      title: "Delaunay triangulator",
      href: `${ROOT}/Delaunay/index.html`,
      imageSource: delaynayIcon,
    }),
  ];
  updateCarouselPagination(getCurrentPageIndex(pages), pages.length);
  const carouselItems = getElementById("carousel-items") as HTMLDivElement;
  for (const page of pages) {
    page.linkWithParent(carouselItems);
  }
  const prevButton = getElementById(
    "carousel-button-to-prev",
  ) as HTMLButtonElement;
  const nextButton = getElementById(
    "carousel-button-to-next",
  ) as HTMLButtonElement;
  prevButton.addEventListener("click", () => {
    const newActivePageIndex = switchPage(pages, -1);
    updateCarouselPagination(newActivePageIndex, pages.length);
  });
  nextButton.addEventListener("click", () => {
    const newActivePageIndex = switchPage(pages, 1);
    updateCarouselPagination(newActivePageIndex, pages.length);
  });
}

window.addEventListener("load", () => {
  main();
});
