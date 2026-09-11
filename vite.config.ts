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
        Advection: resolve(root, "Advection", "index.html"),
        CellularAutomaton: resolve(root, "CellularAutomaton", "index.html"),
        // Classifier: resolve(root, "Classifier", "index.html"),
        ColorMapChecker: resolve(root, "ColorMapChecker", "index.html"),
        Delaunay: resolve(root, "Delaunay", "index.html"),
        HIFU: resolve(root, "HIFU", "index.html"),
        JuliaSetViewer: resolve(root, "JuliaSetViewer", "index.html"),
        MiniMaze: resolve(root, "MiniMaze", "index.html"),
        Roulette: resolve(root, "Roulette", "index.html"),
        SudokuAssistant: resolve(root, "SudokuAssistant", "index.html"),
        Truss: resolve(root, "Truss", "index.html"),
      },
    },
  },
  define: {
    "import.meta.env.VITE_BUILD_DATE": JSON.stringify(new Date().toISOString()),
  },
});
