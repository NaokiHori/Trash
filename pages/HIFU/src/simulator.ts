import { getWebGL2RenderingContext } from "../../webgl/context";
import { Program } from "../../webgl/program";
import { IndexBufferObject } from "../../webgl/indexBufferObject";
import vertexShaderSource from "../shader/vertexShader.glsl?raw";
import fragmentShaderSource from "../shader/fragmentShader.glsl?raw";

function setupRectangleDomain(gl: WebGL2RenderingContext, program: Program): IndexBufferObject {
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
  private gl: WebGL2RenderingContext;
  private program: Program;
  private indexBufferObject: IndexBufferObject;
  private sourceArgument: number;
  private isAnimated: boolean;

  public constructor(canvas: HTMLCanvasElement, isAnimated: boolean) {
    const gl: WebGL2RenderingContext = getWebGL2RenderingContext({
      canvas,
    });
    const program = new Program({
      gl,
      vertexShaderSource,
      fragmentShaderSource,
    });
    const sourceArgument = 0;
    const indexBufferObject = setupRectangleDomain(gl, program);
    this.gl = gl;
    this.program = program;
    this.indexBufferObject = indexBufferObject;
    this.sourceArgument = sourceArgument;
    this.isAnimated = isAnimated;
    Simulator.setSourceArgument(program, sourceArgument);
    Simulator.setIsAnimated(program, isAnimated);
    Simulator.setColorExponents(program);
  }

  public handleResizeEvent(canvas: HTMLCanvasElement): void {
    const gl = this.gl;
    const rect: DOMRect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
    this.program.setUniform({
      dataType: "FLOAT32",
      uniformName: "u_resolution",
      data: [width, height],
    });
  }

  public update(): void {
    const TWO_PI = 2 * Math.PI;
    this.sourceArgument += 0.1 * TWO_PI;
    Simulator.setSourceArgument(this.program, this.sourceArgument);
    if (TWO_PI < this.sourceArgument) {
      this.sourceArgument -= TWO_PI;
    }
  }

  public flipIsAnimated(): void {
    this.isAnimated = !this.isAnimated;
    Simulator.setIsAnimated(this.program, this.isAnimated);
    Simulator.setColorExponents(this.program);
  }

  public draw(): void {
    const gl = this.gl;
    this.program.use(() => {
      this.indexBufferObject.bindAndDraw(gl.TRIANGLES);
    });
  }

  private static setSourceArgument(program: Program, sourceArgument: number): void {
    program.setUniform({
      dataType: "FLOAT32",
      uniformName: "u_source_argument",
      data: [sourceArgument],
    });
  }

  private static setIsAnimated(program: Program, isAnimated: boolean): void {
    program.setUniform({
      dataType: "INT32",
      uniformName: "u_is_animated",
      data: [isAnimated ? 1 : 0],
    });
  }

  private static setColorExponents(program: Program): void {
    const colorExponents = Simulator.shuffle([1, 2, 4]);
    program.setUniform({
      dataType: "FLOAT32",
      uniformName: "u_color_exponents",
      data: colorExponents,
    });
  }

  private static shuffle(array: Array<number>): Array<number> {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
