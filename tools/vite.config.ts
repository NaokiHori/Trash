import { resolve } from "path";
import { defineConfig } from "vite";

const dirName = import.meta.dirname;

const root = resolve(dirName, ".");

export default defineConfig({
  root,
  build: {
    outDir: resolve(dirName, "dist"),
    rollupOptions: {
      input: {
        main: resolve(root, ".", "index.html"),
        Advection: resolve(root, "pages/Advection", "index.html"),
        CellularAutomaton: resolve(root, "pages/CellularAutomaton", "index.html"),
        Classifier: resolve(root, "pages/Classifier", "index.html"),
        ColorMapChecker: resolve(root, "pages/ColorMapChecker", "index.html"),
        Delaunay: resolve(root, "pages/Delaunay", "index.html"),
        HIFU: resolve(root, "pages/HIFU", "index.html"),
        JuliaSetViewer: resolve(root, "pages/JuliaSetViewer", "index.html"),
        Logo: resolve(root, "pages/Logo", "index.html"),
        MiniMaze: resolve(root, "pages/MiniMaze", "index.html"),
        CartPole: resolve(root, "pages/CartPole", "index.html"),
        Roulette: resolve(root, "pages/Roulette", "index.html"),
        SudokuAssistant: resolve(root, "pages/SudokuAssistant", "index.html"),
        Truss: resolve(root, "pages/Truss", "index.html"),
      },
    },
  },
  define: {
    "import.meta.env.VITE_BUILD_DATE": JSON.stringify(new Date().toISOString()),
  },
});
