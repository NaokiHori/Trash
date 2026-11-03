const BUFFER_TARGET: GLenum = WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER;

export class IndexBufferObject {
  private gl: WebGL2RenderingContext;
  private buffer: WebGLBuffer;
  private size: GLsizeiptr;
  private usage: GLenum;

  public constructor({
    gl,
    size,
    usage,
  }: {
    gl: WebGL2RenderingContext;
    size: GLsizeiptr;
    usage: GLenum;
  }) {
    const buffer: WebGLBuffer = gl.createBuffer();
    this.gl = gl;
    this.buffer = buffer;
    this.bindAndExecute(() => {
      gl.bufferData(BUFFER_TARGET, size, usage);
    });
    this.size = size;
    this.usage = usage;
  }

  public bindAndUpdateData(data: Int16Array): void {
    const gl = this.gl;
    this.bindAndExecute(() => {
      const size: GLsizeiptr = this.size;
      const usage: GLenum = this.usage;
      if (size !== data.length) {
        throw new Error(
          `Allocated size (${size.toString()}) does not match with the source data size: ${data.length.toString()}`,
        );
      }
      gl.bufferData(BUFFER_TARGET, data, usage);
    });
  }

  public bindAndDraw(mode: GLenum): void {
    const gl = this.gl;
    this.bindAndExecute(() => {
      const size: GLsizeiptr = this.size;
      gl.drawElements(mode, size, gl.UNSIGNED_SHORT, 0);
    });
  }

  private bindAndExecute(callback: () => void): void {
    const gl = this.gl;
    gl.bindBuffer(BUFFER_TARGET, this.buffer);
    callback();
    gl.bindBuffer(BUFFER_TARGET, null);
  }
}
