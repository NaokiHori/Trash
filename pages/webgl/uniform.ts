import { Program } from "./program";

type DataType = "FLOAT32" | "INT32" | "UNSUPPORTED";

function throwUniformNotFoundException(name: string): never {
  throw new Error(`Uniform ${name} is not found`);
}

function throwInvalidNumberOfItemsException(nitems: number): never {
  throw new Error(`Invalid number of items to register as a uniform: ${nitems.toString()}`);
}

export class Uniform {
  private gl: WebGLRenderingContext;
  private program: Program;
  private dataType: DataType;
  private nitems: number;
  private uniformLocation: WebGLUniformLocation;
  private isSet: boolean;

  public constructor({
    gl,
    program,
    dataType,
    name,
    nitems,
  }: {
    gl: WebGLRenderingContext;
    program: Program;
    dataType: DataType;
    name: string;
    nitems: number;
  }) {
    const uniformLocation: WebGLUniformLocation | null = program.use((webGLProgram: WebGLProgram) =>
      gl.getUniformLocation(webGLProgram, name),
    );
    if (uniformLocation === null) {
      throwUniformNotFoundException(name);
    }
    this.gl = gl;
    this.program = program;
    this.dataType = dataType;
    this.nitems = nitems;
    this.uniformLocation = uniformLocation;
    this.isSet = false;
  }

  public set({ data }: { data: Array<number> }) {
    // NOTE: assuming the program is used when invoking this method
    const gl = this.gl;
    const nitems = this.nitems;
    if (nitems !== data.length) {
      throw new Error(
        `Data size mismatch, expected: ${nitems.toString()}, obtained: ${data.length.toString()}`,
      );
    }
    const uniformLocation = this.uniformLocation;
    this.program.use(() => {
      if (this.dataType === "FLOAT32") {
        const typedData = new Float32Array(data);
        if (nitems === 1) {
          gl.uniform1fv(uniformLocation, typedData);
        } else if (nitems === 2) {
          gl.uniform2fv(uniformLocation, typedData);
        } else if (nitems === 3) {
          gl.uniform3fv(uniformLocation, typedData);
        } else if (nitems === 4) {
          gl.uniform4fv(uniformLocation, typedData);
        } else {
          throwInvalidNumberOfItemsException(nitems);
        }
      } else {
        const typedData = new Int32Array(data);
        if (nitems === 1) {
          gl.uniform1iv(uniformLocation, typedData);
        } else if (nitems === 2) {
          gl.uniform2iv(uniformLocation, typedData);
        } else if (nitems === 3) {
          gl.uniform3iv(uniformLocation, typedData);
        } else if (nitems === 4) {
          gl.uniform4iv(uniformLocation, typedData);
        } else {
          throwInvalidNumberOfItemsException(nitems);
        }
      }
    });
    this.isSet = true;
  }

  public getIsSet(): boolean {
    return this.isSet;
  }
}
