export const FRAMEBUFFER_TARGET: GLenum = WebGL2RenderingContext.FRAMEBUFFER;

export class Framebuffer {
  private _gl: WebGL2RenderingContext;
  private _webGLFramebuffer: WebGLFramebuffer;

  constructor({ gl }: { gl: WebGL2RenderingContext }) {
    this._webGLFramebuffer = gl.createFramebuffer();
    this._gl = gl;
  }

  public bindAndExecute(callback: (boundFramebuffer: Framebuffer) => void) {
    this._gl.bindFramebuffer(FRAMEBUFFER_TARGET, this._webGLFramebuffer);
    callback(this);
    this._gl.bindFramebuffer(FRAMEBUFFER_TARGET, null);
  }

  public get target(): GLenum {
    return FRAMEBUFFER_TARGET;
  }
}
