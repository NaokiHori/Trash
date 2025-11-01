import { getWebGL2RenderingContext } from "./webgl/context";
import { Program } from "./webgl/program";
import { IndexBufferObject } from "./webgl/indexBufferObject";
import { PingPongBuffers } from "./pingPongBuffers";
import vertexShaderSource from "../shader/visualize.vs.glsl?raw";
import fragmentShaderSource from "../shader/visualize.fs.glsl?raw";

// two triangles to paste a texture
function setupRectangleDomain(
  gl: WebGL2RenderingContext,
  program: Program,
  aspectRatio: number,
): IndexBufferObject {
  const positions = [
    [-aspectRatio, -1],
    [aspectRatio, -1],
    [-aspectRatio, 1],
    [aspectRatio, 1],
  ];
  const indices = [0, 1, 2, 1, 3, 2];
  program.setVertexBufferObject({
    attributeName: "a_position",
    numberOfVertices: positions.length,
    numberOfItemsForEachVertex: "xy".length,
    data: new Float32Array(positions.flat()),
  });
  const indexBufferObject = new IndexBufferObject({
    gl,
    size: indices.length,
    usage: gl.STATIC_DRAW,
  });
  indexBufferObject.bindAndUpdateData(new Int16Array(indices));
  return indexBufferObject;
}

export class CellularAutomaton {
  private _gl: WebGL2RenderingContext;
  private _program: Program;
  private _pingPongBuffers: PingPongBuffers;
  private _indexBufferObject: IndexBufferObject;
  private _width: number;
  private _height: number;

  public constructor(canvas: HTMLCanvasElement) {
    const gl: WebGL2RenderingContext = getWebGL2RenderingContext({
      canvas,
    });
    const program = new Program({
      gl,
      vertexShaderSource,
      fragmentShaderSource,
    });
    const width = canvas.width;
    const height = canvas.height;
    const pingPongBuffers = new PingPongBuffers(gl, width, height);
    (function () {
      const data = new Uint8Array("RGBA".length * width * height);
      for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
          for (let n = 0; n < "RGBA".length; n++) {
            const randomValue = Math.random();
            const denominator = Math.max(4, Math.min(width, height));
            data["RGBA".length * (j * width + i) + n] =
              randomValue < (denominator - 2) / denominator
                ? 0
                : randomValue < (denominator - 1) / denominator
                  ? 1
                  : 2;
          }
        }
      }
      pingPongBuffers.setData(data);
    })();
    const indexBufferObject = setupRectangleDomain(gl, program, width / height);
    this._gl = gl;
    this._program = program;
    this._pingPongBuffers = pingPongBuffers;
    this._indexBufferObject = indexBufferObject;
    this._width = width;
    this._height = height;
  }

  public handleResizeEvent(canvas: HTMLCanvasElement) {
    const canvasWidth: number = canvas.width;
    const canvasHeight: number = canvas.height;
    const scalarWidth = this._width;
    const scalarHeight = this._height;
    const scale = (function computeScale() {
      const canvasAspectRatio: number = canvasWidth / canvasHeight;
      const scalarAspectRatio: number = scalarWidth / scalarHeight;
      return canvasAspectRatio < scalarAspectRatio
        ? [1 / scalarAspectRatio, canvasAspectRatio / scalarAspectRatio]
        : [1 / canvasAspectRatio, 1];
    })();
    this._program.setUniform({
      dataType: "FLOAT32",
      uniformName: "u_scale",
      data: scale,
    });
  }

  public update() {
    this._pingPongBuffers.update();
  }

  public draw(canvas: HTMLCanvasElement) {
    const gl = this._gl;
    const pingPongBuffer = this._pingPongBuffers.getCurrentBuffer();
    gl.viewport(0, 0, canvas.width, canvas.height);
    this._program.use(() => {
      pingPongBuffer.texture.bindAndExecute(() => {
        this._indexBufferObject.bindAndDraw(gl.TRIANGLES);
      });
    });
  }
}
