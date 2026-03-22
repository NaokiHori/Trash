import { getWebGLRenderingContext } from "./webgl/context";
import { Program } from "./webgl/program";
import { IndexBufferObject } from "./webgl/indexBufferObject";
import vertexShaderSource from "../shader/vertexShader.glsl?raw";
import fragmentShaderSource from "../shader/fragmentShader.glsl?raw";

function setupRectangleDomain(
  gl: WebGLRenderingContext,
  program: Program,
): IndexBufferObject {
  const positions = [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
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

export class Simulator {
  private _gl: WebGLRenderingContext;
  private _program: Program;
  private _indexBufferObject: IndexBufferObject;

  public constructor(canvas: HTMLCanvasElement) {
    const gl: WebGLRenderingContext = getWebGLRenderingContext({
      canvas,
    });
    const program = new Program({
      gl,
      vertexShaderSource,
      fragmentShaderSource,
    });
    const indexBufferObject = setupRectangleDomain(gl, program);
    this._gl = gl;
    this._program = program;
    this._indexBufferObject = indexBufferObject;
  }

  public handleResizeEvent(canvas: HTMLCanvasElement) {
    const canvasWidth: number = canvas.width;
    const canvasHeight: number = canvas.height;
    this._program.setUniform({
      dataType: "FLOAT32",
      uniformName: "u_resolution",
      data: [canvasWidth, canvasHeight],
    });
  }

  public draw(canvas: HTMLCanvasElement) {
    const gl = this._gl;
    gl.viewport(0, 0, canvas.width, canvas.height);
    this._program.use(() => {
      this._indexBufferObject.bindAndDraw(gl.TRIANGLES);
    });
  }
}
