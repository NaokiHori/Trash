const TEXTURE_TARGET: GLenum = WebGL2RenderingContext.TEXTURE_2D;

export class Texture {
  private gl: WebGL2RenderingContext;
  private webGLTexture: WebGLTexture;

  public constructor({ gl }: { gl: WebGL2RenderingContext }) {
    const webGLTexture: WebGLTexture = gl.createTexture();
    this.gl = gl;
    this.webGLTexture = webGLTexture;
  }

  public bindAndExecute(callback: (boundTexture: Texture) => void): void {
    const webGLTexture = this.webGLTexture;
    this.gl.bindTexture(TEXTURE_TARGET, webGLTexture);
    callback(this);
    this.gl.bindTexture(TEXTURE_TARGET, null);
  }

  public getTarget(): GLenum {
    return TEXTURE_TARGET;
  }

  public getWebGLTexture(): WebGLTexture {
    return this.webGLTexture;
  }
}
