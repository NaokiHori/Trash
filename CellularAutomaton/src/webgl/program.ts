import { VertexBufferObject } from "./vertexBufferObject";
import { VertexAttribute } from "./vertexAttribute";

function initShader(
  gl: WebGL2RenderingContext,
  type:
    | WebGL2RenderingContext["FRAGMENT_SHADER"]
    | WebGL2RenderingContext["VERTEX_SHADER"],
  source: string,
): WebGLShader {
  // creates a shader of the given type
  const shader: WebGLShader | null = gl.createShader(type);
  if (null === shader) {
    throw new Error("gl.createShader failed");
  }
  // compile source
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  // check if shader being successfully compiled
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info: string = gl.getShaderInfoLog(shader) ?? "unknown message";
    gl.deleteShader(shader);
    throw new Error(`gl.compileShader failed: ${info}`);
  }
  return shader;
}

export class Program {
  private _gl: WebGL2RenderingContext;
  private _webGLProgram: WebGLProgram;

  public constructor({
    gl,
    vertexShaderSource,
    fragmentShaderSource,
  }: {
    gl: WebGL2RenderingContext;
    vertexShaderSource: string;
    fragmentShaderSource: string;
  }) {
    const vertexShader: WebGLShader = initShader(
      gl,
      gl.VERTEX_SHADER,
      vertexShaderSource,
    );
    const fragmentShader: WebGLShader = initShader(
      gl,
      gl.FRAGMENT_SHADER,
      fragmentShaderSource,
    );
    const webGLProgram = gl.createProgram();
    gl.attachShader(webGLProgram, vertexShader);
    gl.attachShader(webGLProgram, fragmentShader);
    gl.linkProgram(webGLProgram);
    if (!gl.getProgramParameter(webGLProgram, gl.LINK_STATUS)) {
      const info: string =
        gl.getProgramInfoLog(webGLProgram) ?? "unknown message";
      gl.deleteProgram(webGLProgram);
      throw new Error(`Failed to link program: ${info}`);
    }
    this._gl = gl;
    this._webGLProgram = webGLProgram;
  }

  public use<T>(callback: (webGLProgram: WebGLProgram) => T): T {
    this._gl.useProgram(this._webGLProgram);
    const resultOfCallback: T = callback(this._webGLProgram);
    this._gl.useProgram(null);
    return resultOfCallback;
  }

  public setUniform({
    dataType,
    uniformName,
    data,
  }: {
    dataType: "FLOAT32" | "INT32" | "UNSUPPORTED";
    uniformName: string;
    data: Array<number>;
  }) {
    this.use((webGLProgram: WebGLProgram) => {
      const location: WebGLUniformLocation | null = this._gl.getUniformLocation(
        webGLProgram,
        uniformName,
      );
      if (location === null) {
        throwUniformNotFoundException(uniformName);
      }
      const nitems: number = data.length;
      if (dataType === "FLOAT32") {
        const typedData = new Float32Array(data);
        if (nitems === 1) {
          this._gl.uniform1fv(location, typedData);
        } else if (nitems === 2) {
          this._gl.uniform2fv(location, typedData);
        } else if (nitems === 3) {
          this._gl.uniform3fv(location, typedData);
        } else if (nitems === 4) {
          this._gl.uniform4fv(location, typedData);
        } else {
          throwInvalidNumberOfItemsException(nitems);
        }
      } else if (dataType === "INT32") {
        const typedData = new Int32Array(data);
        if (nitems === 1) {
          this._gl.uniform1iv(location, typedData);
        } else if (nitems === 2) {
          this._gl.uniform2iv(location, typedData);
        } else if (nitems === 3) {
          this._gl.uniform3iv(location, typedData);
        } else if (nitems === 4) {
          this._gl.uniform4iv(location, typedData);
        } else {
          throwInvalidNumberOfItemsException(nitems);
        }
      } else {
        throwUnsupportedDataTypeException(dataType);
      }
    });
  }

  // do the following at once
  // - create and allocate vbo
  // - create attribute
  // - bind them
  // - push data (because the vertex information will not be altered)
  public setVertexBufferObject({
    attributeName,
    numberOfVertices,
    numberOfItemsForEachVertex,
    data,
  }: {
    attributeName: string;
    numberOfVertices: number;
    numberOfItemsForEachVertex: number;
    // TODO: for now assuming float32 buffer
    data: Float32Array;
  }): VertexBufferObject {
    const gl = this._gl;
    const webGLProgram = this._webGLProgram;
    const vertexBufferObject = new VertexBufferObject({
      gl,
      numberOfVertices,
      numberOfItemsForEachVertex,
      usage: gl.STATIC_DRAW,
    });
    const vertexAttribute = new VertexAttribute({
      gl,
      program: webGLProgram,
      attributeName,
    });
    vertexBufferObject.bindAndBindVertexAttribute(
      vertexAttribute,
      numberOfItemsForEachVertex,
    );
    vertexBufferObject.bindAndUpdateData(data);
    return vertexBufferObject;
  }
}

function throwUniformNotFoundException(uniformName: string): never {
  throw new Error(`Uniform ${uniformName} is not found`);
}

function throwInvalidNumberOfItemsException(nitems: number): never {
  throw new Error(
    `Invalid number of items to register as a uniform: ${nitems.toString()}`,
  );
}

function throwUnsupportedDataTypeException(dataType: string): never {
  throw new Error(`Unsupported data type: ${dataType}`);
}
