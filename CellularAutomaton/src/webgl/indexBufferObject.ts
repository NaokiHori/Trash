const BUFFER_TARGET: GLenum = WebGL2RenderingContext.ELEMENT_ARRAY_BUFFER;

export class IndexBufferObject {
  private _gl: WebGL2RenderingContext;
  private _buffer: WebGLBuffer;
  private _size: GLsizeiptr;
  private _usage: GLenum;

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
    this._gl = gl;
    this._buffer = buffer;
    this.bindAndExecute(() => {
      gl.bufferData(BUFFER_TARGET, size, usage);
    });
    this._size = size;
    this._usage = usage;
  }

  public bindAndUpdateData(data: Int16Array) {
    const gl = this._gl;
    this.bindAndExecute(() => {
      const size: GLsizeiptr = this._size;
      const usage: GLenum = this._usage;
      if (size !== data.length) {
        throw new Error(
          `Allocated size (${size.toString()}) does not match with the source data size: ${data.length.toString()}`,
        );
      }
      gl.bufferData(BUFFER_TARGET, data, usage);
    });
  }

  public bindAndDraw(mode: GLenum) {
    const gl = this._gl;
    this.bindAndExecute(() => {
      const size: GLsizeiptr = this._size;
      gl.drawElements(mode, size, gl.UNSIGNED_SHORT, 0);
    });
  }

  private bindAndExecute(callback: () => void) {
    const gl = this._gl;
    gl.bindBuffer(BUFFER_TARGET, this._buffer);
    callback();
    gl.bindBuffer(BUFFER_TARGET, null);
  }
}
