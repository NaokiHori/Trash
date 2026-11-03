import { Program } from "../../webgl/program";
import { IndexBufferObject } from "../../webgl/indexBufferObject";
import { Uniform } from "../../webgl/uniform";
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

interface Uniforms {
  domainSize: Uniform;
  orbitType: Uniform;
  center: Uniform;
  resolution: Uniform;
  orbitTrapCenter: Uniform;
  recurrenceOffset: Uniform;
  counter: Uniform;
}

function setupDomainSizeUniform(gl: WebGL2RenderingContext, program: Program): Uniform {
  return new Uniform({
    gl,
    program,
    dataType: "FLOAT32",
    name: "u_domain_size",
    nitems: 1,
  });
}

function setupOrbitTypeUniform(gl: WebGL2RenderingContext, program: Program): Uniform {
  return new Uniform({
    gl,
    program,
    dataType: "INT32",
    name: "u_orbit_type",
    nitems: 1,
  });
}

function setupCenterUniform(gl: WebGL2RenderingContext, program: Program): Uniform {
  return new Uniform({
    gl,
    program,
    dataType: "FLOAT32",
    name: "u_center",
    nitems: 2,
  });
}

function setupResolutionUniform(gl: WebGL2RenderingContext, program: Program): Uniform {
  return new Uniform({
    gl,
    program,
    dataType: "FLOAT32",
    name: "u_resolution",
    nitems: 2,
  });
}

function setupOrbitTrapCenterUniform(gl: WebGL2RenderingContext, program: Program): Uniform {
  return new Uniform({
    gl,
    program,
    dataType: "FLOAT32",
    name: "u_orbit_trap_center",
    nitems: 2,
  });
}

function setupRecurrenceOffsetUniform(gl: WebGL2RenderingContext, program: Program): Uniform {
  return new Uniform({
    gl,
    program,
    dataType: "FLOAT32",
    name: "u_recurrence_offset",
    nitems: 2,
  });
}

function setupCounterUniform(gl: WebGL2RenderingContext, program: Program): Uniform {
  return new Uniform({
    gl,
    program,
    dataType: "INT32",
    name: "u_counter",
    nitems: 1,
  });
}

function setupUniforms(gl: WebGL2RenderingContext, program: Program): Uniforms {
  return {
    domainSize: setupDomainSizeUniform(gl, program),
    orbitType: setupOrbitTypeUniform(gl, program),
    center: setupCenterUniform(gl, program),
    resolution: setupResolutionUniform(gl, program),
    orbitTrapCenter: setupOrbitTrapCenterUniform(gl, program),
    recurrenceOffset: setupRecurrenceOffsetUniform(gl, program),
    counter: setupCounterUniform(gl, program),
  };
}

export class WebGL {
  private gl: WebGL2RenderingContext;
  private program: Program;
  private indexBufferObject: IndexBufferObject;
  private counter: number;
  private uniforms: Uniforms;

  public constructor(gl: WebGL2RenderingContext) {
    const program = new Program({
      gl,
      vertexShaderSource,
      fragmentShaderSource,
    });
    const indexBufferObject = setupRectangleDomain(gl, program);
    this.gl = gl;
    this.program = program;
    this.indexBufferObject = indexBufferObject;
    this.counter = -1;
    this.uniforms = setupUniforms(gl, program);
  }

  public updateResolution(canvasWidth: number, canvasHeight: number): void {
    const gl: WebGL2RenderingContext = this.gl;
    gl.viewport(0, 0, canvasWidth, canvasHeight);
    this.uniforms.resolution.set({ data: [canvasWidth, canvasHeight] });
  }

  public setDomainSize(value: number): void {
    this.uniforms.domainSize.set({ data: [value] });
  }

  public setOrbitType(value: number): void {
    this.uniforms.orbitType.set({ data: [value] });
  }

  public setCenter(values: [number, number]): void {
    this.uniforms.center.set({ data: values });
  }

  public setOrbitTrapCenter(values: [number, number]): void {
    console.log(`Orbit trap center: ${values.toString()}`);
    this.uniforms.orbitTrapCenter.set({ data: values });
  }

  public setRecurrenceOffset(values: [number, number]): void {
    console.log(`Recurrence offset: ${values.toString()}`);
    this.uniforms.recurrenceOffset.set({ data: values });
  }

  public incrementCounter(): void {
    this.counter += 1;
    this.uniforms.counter.set({ data: [this.counter] });
  }

  public draw(): void {
    if (
      !this.uniforms.domainSize.getIsSet() ||
      !this.uniforms.resolution.getIsSet() ||
      !this.uniforms.orbitTrapCenter.getIsSet() ||
      !this.uniforms.recurrenceOffset.getIsSet()
    ) {
      throw new TypeError("There is (are) uniform(s) unset");
    }
    const gl: WebGL2RenderingContext = this.gl;
    this.program.use(() => {
      this.indexBufferObject.bindAndDraw(gl.TRIANGLES);
    });
  }
}
