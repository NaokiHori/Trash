import { resolve } from "path";
import { defineConfig } from "vite";

const root = resolve(__dirname, ".");
const outDir = resolve(__dirname, "dist");

export default defineConfig({
  root,
  build: {
    outDir,
    rollupOptions: {
      input: {
        main: resolve(root, ".", "index.html"),
        AnimatedClassifier: resolve(root, "AnimatedClassifier", "index.html"),
        ColorMapChecker: resolve(root, "ColorMapChecker", "index.html"),
        JuliaSetViewer: resolve(root, "JuliaSetViewer", "index.html"),
        MiniMaze: resolve(root, "MiniMaze", "index.html"),
        SudokuAssistant: resolve(root, "SudokuAssistant", "index.html"),
      },
    },
  },
});
