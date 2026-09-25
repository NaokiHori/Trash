import sudokuAssistantIcon from "../SudokuAssistant/icon.jpg";
import miniMazeIcon from "../MiniMaze/icon.jpg";
import juliaSetViewerIcon from "../JuliaSetViewer/icon.jpg";
import colorMapCheckerIcon from "../ColorMapChecker/icon.jpg";
// import animatedClassifierIcon from "../Classifier/icon.jpg";
import delaynayIcon from "../Delaunay/icon.jpg";
import advectionIcon from "../Advection/icon.jpg";
import rouletteIcon from "../Roulette/icon.jpg";
import cellularAutomatonIcon from "../CellularAutomaton/icon.jpg";
import hifuIcon from "../HIFU/icon.jpg";
import trussIcon from "../Truss/icon.jpg";
import cartPoleIcon from "../CartPole/icon.jpg";
import logoIcon from "../Logo/icon.jpg";

const ROOT = ".";

export class Page {
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

export const ALL_PAGES: Array<Page> = [
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
