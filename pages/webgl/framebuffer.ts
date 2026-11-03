export const FRAMEBUFFER_TARGET: GLenum = WebGL2RenderingContext.FRAMEBUFFER;

export class Framebuffer {
  private gl: WebGL2RenderingContext;
  private webGLFramebuffer: WebGLFramebuffer;

  public constructor({ gl }: { gl: WebGL2RenderingContext }) {
    this.webGLFramebuffer = gl.createFramebuffer();
    this.gl = gl;
  }

  public bindAndExecute(callback: (boundFramebuffer: Framebuffer) => void): void {
    this.gl.bindFramebuffer(FRAMEBUFFER_TARGET, this.webGLFramebuffer);
    callback(this);
    this.gl.bindFramebuffer(FRAMEBUFFER_TARGET, null);
  }

  public getTarget(): GLenum {
    return FRAMEBUFFER_TARGET;
  }
}
