const TEXTURE_TARGET: GLenum = WebGL2RenderingContext.TEXTURE_2D;

export class Texture {
  private _gl: WebGL2RenderingContext;
  private _webGLTexture: WebGLTexture;

  public constructor({ gl }: { gl: WebGL2RenderingContext }) {
    const webGLTexture: WebGLTexture = gl.createTexture();
    this._gl = gl;
    this._webGLTexture = webGLTexture;
  }

  public bindAndExecute(callback: (boundTexture: Texture) => void) {
    const webGLTexture = this._webGLTexture;
    this._gl.bindTexture(TEXTURE_TARGET, webGLTexture);
    callback(this);
    this._gl.bindTexture(TEXTURE_TARGET, null);
  }

  public get target(): GLenum {
    return TEXTURE_TARGET;
  }

  public get webGLTexture(): WebGLTexture {
    return this._webGLTexture;
  }
}
