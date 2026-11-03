import { Framebuffer } from "../../../webgl/framebuffer";
import { Program } from "../../../webgl/program";
import { Texture } from "../../../webgl/texture";
import { TEXTURE_CONFIG } from "./textureConfig";

export class PingPongBuffer {
  private framebuffer: Framebuffer;
  private texture: Texture;

  public constructor(gl: WebGL2RenderingContext, program: Program, width: number, height: number) {
    const artifacts = program.use(() => {
      const framebuffer = new Framebuffer({ gl });
      const texture = new Texture({ gl });
      texture.bindAndExecute((boundTexture: Texture) => {
        const target = boundTexture.getTarget();
        gl.texStorage2D(target, 1, TEXTURE_CONFIG.internalFormat, width, height);
        gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      });
      framebuffer.bindAndExecute((boundFramebuffer: Framebuffer) => {
        const attachment: GLenum = gl.COLOR_ATTACHMENT0;
        const level: GLint = 0;
        gl.framebufferTexture2D(
          boundFramebuffer.getTarget(),
          attachment,
          texture.getTarget(),
          texture.getWebGLTexture(),
          level,
        );
      });
      const framebufferStatus: GLenum = gl.checkFramebufferStatus(framebuffer.getTarget());
      if (gl.FRAMEBUFFER_COMPLETE !== framebufferStatus) {
        throw new Error(`Failed to create a framebuffer: ${framebufferStatus.toString()}`);
      }
      return { framebuffer, texture };
    });
    this.framebuffer = artifacts.framebuffer;
    this.texture = artifacts.texture;
  }

  public getFramebuffer(): Framebuffer {
    return this.framebuffer;
  }

  public getTexture(): Texture {
    return this.texture;
  }
}
