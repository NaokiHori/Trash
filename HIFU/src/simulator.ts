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
  private _sourceArgument: number;
  private _isAnimated: boolean;

  public constructor(canvas: HTMLCanvasElement, isAnimated: boolean) {
    const gl: WebGLRenderingContext = getWebGLRenderingContext({
      canvas,
    });
    const program = new Program({
      gl,
      vertexShaderSource,
      fragmentShaderSource,
    });
    const sourceArgument = 0;
    const indexBufferObject = setupRectangleDomain(gl, program);
    this._gl = gl;
    this._program = program;
    this._indexBufferObject = indexBufferObject;
    this._sourceArgument = sourceArgument;
    this._isAnimated = isAnimated;
    Simulator.setSourceArgument(program, sourceArgument);
    Simulator.setIsAnimated(program, isAnimated);
    Simulator.setColorExponents(program);
  }

  public handleResizeEvent(canvas: HTMLCanvasElement) {
    const gl = this._gl;
    const rect: DOMRect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    this._program.setUniform({
      dataType: "FLOAT32",
      uniformName: "u_resolution",
      data: [width, height],
    });
  }

  public update() {
    const TWO_PI = 2 * Math.PI;
    this._sourceArgument += 0.1 * TWO_PI;
    Simulator.setSourceArgument(this._program, this._sourceArgument);
    if (TWO_PI < this._sourceArgument) {
      this._sourceArgument -= TWO_PI;
    }
  }

  public flipIsAnimated() {
    this._isAnimated = !this._isAnimated;
    Simulator.setIsAnimated(this._program, this._isAnimated);
    Simulator.setColorExponents(this._program);
  }

  private static setSourceArgument(program: Program, sourceArgument: number) {
    program.setUniform({
      dataType: "FLOAT32",
      uniformName: "u_source_argument",
      data: [sourceArgument],
    });
  }

  private static setIsAnimated(program: Program, isAnimated: boolean) {
    program.setUniform({
      dataType: "INT32",
      uniformName: "u_is_animated",
      data: [isAnimated ? 1 : 0],
    });
  }

  private static setColorExponents(program: Program) {
    function shuffle(array: Array<number>) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
    const colorExponents = shuffle([1, 2, 4]);
    program.setUniform({
      dataType: "FLOAT32",
      uniformName: "u_color_exponents",
      data: colorExponents,
    });
  }

  public draw() {
    const gl = this._gl;
    this._program.use(() => {
      this._indexBufferObject.bindAndDraw(gl.TRIANGLES);
    });
  }
}
