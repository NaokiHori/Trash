import { Program } from "./webgl/program";
import { VertexAttribute } from "./webgl/vertexAttribute";
import { VertexBufferObject } from "./webgl/vertexBufferObject";
import { IndexBufferObject } from "./webgl/indexBufferObject";
import { Uniform } from "./webgl/uniform";
import vertexShaderSource from "./webgl/vertexShader.glsl?raw";
import fragmentShaderSource from "./webgl/fragmentShader.glsl?raw";

export class WebGL {
  private _gl: WebGLRenderingContext;
  private _program: Program;
  private _indexBufferObject: IndexBufferObject;
  private _counter: number;
  private _uniforms: {
    domainSize: Uniform;
    orbitType: Uniform;
    center: Uniform;
    resolution: Uniform;
    orbitTrapCenter: Uniform;
    recurrenceOffset: Uniform;
    counter: Uniform;
  };

  public constructor(gl: WebGLRenderingContext) {
    const program = new Program({
      gl,
      vertexShaderSource,
      fragmentShaderSource,
    });
    const indexBufferObject: IndexBufferObject = program.use({
      gl,
      callback: () => {
        // set-up rectangle domain
        const positions = [
          [-1, -1],
          [1, -1],
          [-1, 1],
          [1, 1],
        ];
        const indices = [0, 1, 2, 1, 3, 2];
        // create a vertex buffer object
        const attribute = new VertexAttribute({
          gl,
          program,
          attributeName: "a_position",
        });
        new VertexBufferObject({
          gl,
          numberOfVertices: positions.length,
          numberOfItemsForEachVertex: positions[0].length,
          usage: gl.STATIC_DRAW,
        }).bindAndExecute({
          gl,
          callback: (boundBuffer: VertexBufferObject) => {
            attribute.bindWithArrayBuffer({
              gl,
              program,
              size: positions[0].length,
              vertexBufferObject: boundBuffer,
            });
            boundBuffer.updateData({
              gl,
              data: new Float32Array(positions.flat()),
            });
          },
        });
        // create an index buffer object and return it
        return new IndexBufferObject({
          gl,
          size: indices.length,
          usage: gl.STATIC_DRAW,
        }).bindAndExecute({
          gl,
          callback: (boundBuffer: IndexBufferObject) => {
            boundBuffer.updateData({ gl, data: new Int16Array(indices) });
          },
        });
      },
    });
    this._gl = gl;
    this._program = program;
    this._indexBufferObject = indexBufferObject;
    this._counter = -1;
    this._uniforms = {
      domainSize: new Uniform({
        gl,
        program,
        dataType: "FLOAT32",
        name: "u_domain_size",
        nitems: 1,
      }),
      orbitType: new Uniform({
        gl,
        program,
        dataType: "INT32",
        name: "u_orbit_type",
        nitems: 1,
      }),
      center: new Uniform({
        gl,
        program,
        dataType: "FLOAT32",
        name: "u_center",
        nitems: 2,
      }),
      resolution: new Uniform({
        gl,
        program,
        dataType: "FLOAT32",
        name: "u_resolution",
        nitems: 2,
      }),
      orbitTrapCenter: new Uniform({
        gl,
        program,
        dataType: "FLOAT32",
        name: "u_orbit_trap_center",
        nitems: 2,
      }),
      recurrenceOffset: new Uniform({
        gl,
        program,
        dataType: "FLOAT32",
        name: "u_recurrence_offset",
        nitems: 2,
      }),
      counter: new Uniform({
        gl,
        program,
        dataType: "INT32",
        name: "u_counter",
        nitems: 1,
      }),
    };
  }

  public updateResolution(canvasWidth: number, canvasHeight: number) {
    const gl: WebGLRenderingContext = this._gl;
    gl.viewport(0, 0, canvasWidth, canvasHeight);
    this._uniforms.resolution.set({ data: [canvasWidth, canvasHeight] });
  }

  public set domainSize(value: number) {
    this._uniforms.domainSize.set({ data: [value] });
  }

  public set orbitType(value: number) {
    this._uniforms.orbitType.set({ data: [value] });
  }

  public set center(values: [number, number]) {
    this._uniforms.center.set({ data: values });
  }

  public set orbitTrapCenter(values: [number, number]) {
    console.log(`Orbit trap center: ${values.toString()}`);
    this._uniforms.orbitTrapCenter.set({ data: values });
  }

  public set recurrenceOffset(values: [number, number]) {
    console.log(`Recurrence offset: ${values.toString()}`);
    this._uniforms.recurrenceOffset.set({ data: values });
  }

  public incrementCounter() {
    this._counter += 1;
    this._uniforms.counter.set({ data: [this._counter] });
  }

  public draw() {
    if (
      !this._uniforms.domainSize.isSet ||
      !this._uniforms.resolution.isSet ||
      !this._uniforms.orbitTrapCenter.isSet ||
      !this._uniforms.recurrenceOffset.isSet
    ) {
      throw new Error("There is (are) uniform(s) unset");
    }
    const gl: WebGLRenderingContext = this._gl;
    const program: Program = this._program;
    const indexBufferObject: IndexBufferObject = this._indexBufferObject;
    program.use({
      gl,
      callback: () => {
        indexBufferObject.bindAndExecute({
          gl,
          callback: (boundBuffer: IndexBufferObject) => {
            boundBuffer.draw({ gl, mode: gl.TRIANGLES });
          },
        });
      },
    });
  }
}
