import { VertexAttribute } from "./vertexAttribute";

const BUFFER_TARGET: GLenum = WebGL2RenderingContext.ARRAY_BUFFER;

export class VertexBufferObject {
  private _gl: WebGL2RenderingContext;
  private _buffer: WebGLBuffer;
  private _numberOfVertices: number;
  private _numberOfItemsForEachVertex: number;

  public constructor({
    gl,
    numberOfVertices,
    numberOfItemsForEachVertex,
    usage,
  }: {
    gl: WebGL2RenderingContext;
    numberOfVertices: number;
    numberOfItemsForEachVertex: number;
    usage: GLenum;
  }) {
    const buffer: WebGLBuffer = gl.createBuffer();
    this._gl = gl;
    this._buffer = buffer;
    // TODO: assuming Float32Array buffer
    const size: GLsizeiptr =
      Float32Array.BYTES_PER_ELEMENT *
      numberOfVertices *
      numberOfItemsForEachVertex;
    this.bindAndExecute(() => {
      gl.bufferData(BUFFER_TARGET, size, usage);
    });
    this._numberOfVertices = numberOfVertices;
    this._numberOfItemsForEachVertex = numberOfItemsForEachVertex;
  }

  public bindAndUpdateData(data: Float32Array) {
    const gl = this._gl;
    this.bindAndExecute(() => {
      const expectedLength: number =
        this._numberOfVertices * this._numberOfItemsForEachVertex;
      if (data.length !== expectedLength) {
        throw new Error(
          `data length ${data.length.toString()} does not agree with an expected value ${expectedLength.toString()}`,
        );
      }
      gl.bufferSubData(BUFFER_TARGET, 0, data);
    });
  }

  public bindAndDraw(mode: GLenum) {
    this.bindAndExecute(() =>
      { this._gl.drawArrays(mode, 0, this._numberOfVertices); },
    );
  }

  public bindAndBindVertexAttribute(
    vertexAttribute: VertexAttribute,
    size: GLint,
  ) {
    const gl = this._gl;
    this.bindAndExecute(() => {
      const attributeIndex = vertexAttribute.attributeIndex;
      // TODO: for now the data is assumed to be a Float32Array buffer
      const type: GLenum = gl.FLOAT;
      // TODO: for type = gl.FLOAT, this parameter has no effect
      const normalized = false;
      // TODO: assuming the data is tightly packed
      const stride: GLsizei = 0;
      // TODO: assuming the buffer points to the first item
      const offset: GLintptr = 0;
      gl.vertexAttribPointer(
        attributeIndex,
        size,
        type,
        normalized,
        stride,
        offset,
      );
    });
  }

  public get buffer(): WebGLBuffer {
    return this._buffer;
  }

  public get numberOfItemsForEachVertex(): number {
    return this._numberOfItemsForEachVertex;
  }

  private bindAndExecute(callback: () => void) {
    const gl = this._gl;
    const currentlyBoundBuffer: WebGLBuffer | null =
      getCurrentlyBoundBuffer(gl);
    if (currentlyBoundBuffer !== null) {
      throw new Error(`Trying to bind a buffer with another buffer bound`);
    }
    gl.bindBuffer(BUFFER_TARGET, this._buffer);
    callback();
    gl.bindBuffer(BUFFER_TARGET, null);
  }
}

function getCurrentlyBoundBuffer(
  gl: WebGL2RenderingContext,
): WebGLBuffer | null {
  // NOTE: gl.getParameter inherently returns any-typed variable
  return gl.getParameter(gl.ARRAY_BUFFER_BINDING) as WebGLBuffer | null;
}
