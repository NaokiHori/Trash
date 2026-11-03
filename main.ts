import sudokuAssistantIcon from "./pages/SudokuAssistant/icon.jpg";
import miniMazeIcon from "./pages/MiniMaze/icon.jpg";
import juliaSetViewerIcon from "./pages/JuliaSetViewer/icon.jpg";
import classifierIcon from "./pages/Classifier/icon.jpg";
import colorMapCheckerIcon from "./pages/ColorMapChecker/icon.jpg";
import delaynayIcon from "./pages/Delaunay/icon.jpg";
import advectionIcon from "./pages/Advection/icon.jpg";
import rouletteIcon from "./pages/Roulette/icon.jpg";
import cellularAutomatonIcon from "./pages/CellularAutomaton/icon.jpg";
import hifuIcon from "./pages/HIFU/icon.jpg";
import trussIcon from "./pages/Truss/icon.jpg";
import cartPoleIcon from "./pages/CartPole/icon.jpg";
import logoIcon from "./pages/Logo/icon.jpg";

class Page {
  private element: HTMLDivElement;
  private isActive: boolean;

  public constructor({
    isActive,
    title,
    href,
    imageSource,
  }: Readonly<{
    isActive: boolean;
    title: string;
    href: string;
    imageSource: string;
  }>) {
    const element = document.createElement("div");
    element.classList.add("carousel-item");
    const titleAnchor = document.createElement("a");
    titleAnchor.textContent = title;
    titleAnchor.setAttribute("href", href);
    const imageAnchor = document.createElement("a");
    imageAnchor.setAttribute("href", href);
    const image = document.createElement("img");
    image.classList.add("carousel-image");
    image.setAttribute("src", imageSource);
    imageAnchor.append(image);
    element.append(titleAnchor);
    element.append(imageAnchor);
    this.element = element;
    this.isActive = isActive;
    this.setDisplayStatus();
  }

  public getElement(): HTMLDivElement {
    return this.element;
  }

  public getIsActive(): boolean {
    return this.isActive;
  }

  public setIsActive(flag: boolean): void {
    this.isActive = flag;
    this.setDisplayStatus();
  }

  private setDisplayStatus(): void {
    const activeClass = "carousel-item-active";
    const inactiveClass = "carousel-item-inactive";
    if (this.getIsActive()) {
      this.element.classList.remove(inactiveClass);
      this.element.classList.add(activeClass);
    } else {
      this.element.classList.remove(activeClass);
      this.element.classList.add(inactiveClass);
    }
  }
}

const ROOT = "pages";

const ALL_PAGES: Array<Page> = [
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
  new Page({
    isActive: false,
    title: "Classifier",
    href: `${ROOT}/Classifier/index.html`,
    imageSource: classifierIcon,
  }),
  new Page({
    isActive: false,
    title: "Triangulator",
    href: `${ROOT}/Delaunay/index.html`,
    imageSource: delaynayIcon,
  }),
  new Page({
    isActive: false,
    title: "Advection",
    href: `${ROOT}/Advection/index.html`,
    imageSource: advectionIcon,
  }),
  new Page({
    isActive: false,
    title: "Roulette",
    href: `${ROOT}/Roulette/index.html?members=Alice,Bob,Charlie,David,Eve,Frank,George`,
    imageSource: rouletteIcon,
  }),
  new Page({
    isActive: false,
    title: "Cellular Automaton",
    href: `${ROOT}/CellularAutomaton/index.html`,
    imageSource: cellularAutomatonIcon,
  }),
  new Page({
    isActive: false,
    title: "HIFU",
    href: `${ROOT}/HIFU/index.html`,
    imageSource: hifuIcon,
  }),
  new Page({
    isActive: false,
    title: "Truss",
    href: `${ROOT}/Truss/index.html`,
    imageSource: trussIcon,
  }),
  new Page({
    isActive: false,
    title: "Cart Pole",
    href: `${ROOT}/CartPole/index.html`,
    imageSource: cartPoleIcon,
  }),
  new Page({
    isActive: false,
    title: "Logo",
    href: `${ROOT}/Logo/index.html`,
    imageSource: logoIcon,
  }),
];

function getElementByIdOrThrow(elementId: string): HTMLElement {
  const element = document.querySelector(`#${elementId}`);
  if (null === element) {
    throw new Error(`failed to get element: ${elementId}`);
  }
  if (!(element instanceof HTMLElement)) {
    throw new TypeError(`expected HTMLElement: ${elementId}`);
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
    throw new TypeError("expected HTMLDivElement");
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
