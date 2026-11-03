import { VertexAttribute } from "./vertexAttribute";

const BUFFER_TARGET: GLenum = WebGL2RenderingContext.ARRAY_BUFFER;

export class VertexBufferObject {
  private gl: WebGL2RenderingContext;
  private buffer: WebGLBuffer;
  private numberOfVertices: number;
  private numberOfItemsForEachVertex: number;

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
    this.gl = gl;
    this.buffer = buffer;
    // NOTE: assuming Float32Array buffer
    const size: GLsizeiptr =
      Float32Array.BYTES_PER_ELEMENT * numberOfVertices * numberOfItemsForEachVertex;
    this.bindAndExecute(() => {
      gl.bufferData(BUFFER_TARGET, size, usage);
    });
    this.numberOfVertices = numberOfVertices;
    this.numberOfItemsForEachVertex = numberOfItemsForEachVertex;
  }

  public bindAndUpdateData(data: Float32Array): void {
    const gl = this.gl;
    this.bindAndExecute(() => {
      const expectedLength: number = this.numberOfVertices * this.numberOfItemsForEachVertex;
      if (data.length !== expectedLength) {
        throw new Error(
          `data length ${data.length.toString()} does not agree with an expected value ${expectedLength.toString()}`,
        );
      }
      gl.bufferSubData(BUFFER_TARGET, 0, data);
    });
  }

  public bindAndDraw(mode: GLenum): void {
    this.bindAndExecute(() => {
      this.gl.drawArrays(mode, 0, this.numberOfVertices);
    });
  }

  public bindAndBindVertexAttribute(vertexAttribute: VertexAttribute, size: GLint): void {
    const gl = this.gl;
    this.bindAndExecute(() => {
      const attributeIndex = vertexAttribute.getAttributeIndex();
      // NOTE: assuming Float32Array buffer
      const type: GLenum = gl.FLOAT;
      // NOTE: for type = gl.FLOAT, this parameter has no effect
      const normalized = false;
      // NOTE: assuming the data is tightly packed
      const stride: GLsizei = 0;
      // NOTE: assuming the buffer points to the first item
      const offset: GLintptr = 0;
      gl.vertexAttribPointer(attributeIndex, size, type, normalized, stride, offset);
    });
  }

  private bindAndExecute(callback: () => void): void {
    const gl = this.gl;
    const currentlyBoundBuffer: WebGLBuffer | null = getCurrentlyBoundBuffer(gl);
    if (currentlyBoundBuffer !== null) {
      throw new Error(`Trying to bind a buffer with another buffer bound`);
    }
    gl.bindBuffer(BUFFER_TARGET, this.buffer);
    callback();
    gl.bindBuffer(BUFFER_TARGET, null);
  }
}

function getCurrentlyBoundBuffer(gl: WebGL2RenderingContext): WebGLBuffer | null {
  const parameter: unknown = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
  if (parameter instanceof WebGLBuffer) {
    return parameter;
  }
  if (parameter === null) {
    return null;
  }
  throw new TypeError();
}
