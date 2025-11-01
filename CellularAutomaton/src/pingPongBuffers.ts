import { Framebuffer } from "./webgl/framebuffer";
import { Program } from "./webgl/program";
import { Texture } from "./webgl/texture";
import { VertexBufferObject } from "./webgl/vertexBufferObject";
import vertexShaderSource from "../shader/calculate.vs.glsl?raw";
import fragmentShaderSource from "../shader/calculate.fs.glsl?raw";

const TEXTURE_CONFIG = {
  internalFormat: WebGL2RenderingContext.RGBA8UI,
  format: WebGL2RenderingContext.RGBA_INTEGER,
  type: WebGL2RenderingContext.UNSIGNED_BYTE,
};

class PingPongBuffer {
  private _framebuffer: Framebuffer;
  private _texture: Texture;

  constructor(
    gl: WebGL2RenderingContext,
    program: Program,
    width: number,
    height: number,
  ) {
    const { framebuffer, texture } = program.use(() => {
      const framebuffer = new Framebuffer({ gl });
      const texture = new Texture({ gl });
      texture.bindAndExecute((boundTexture: Texture) => {
        const target = boundTexture.target;
        gl.texStorage2D(
          target,
          1,
          TEXTURE_CONFIG.internalFormat,
          width,
          height,
        );
        gl.texParameteri(target, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(target, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      });
      framebuffer.bindAndExecute((boundFramebuffer: Framebuffer) => {
        const attachment: GLenum = gl.COLOR_ATTACHMENT0;
        const level: GLint = 0;
        gl.framebufferTexture2D(
          boundFramebuffer.target,
          attachment,
          texture.target,
          texture.webGLTexture,
          level,
        );
      });
      const framebufferStatus: GLenum = gl.checkFramebufferStatus(
        framebuffer.target,
      );
      if (gl.FRAMEBUFFER_COMPLETE !== framebufferStatus) {
        throw new Error(
          `Failed to create a framebuffer: ${framebufferStatus.toString()}`,
        );
      }
      return { framebuffer, texture };
    });
    this._framebuffer = framebuffer;
    this._texture = texture;
  }

  public get framebuffer(): Framebuffer {
    return this._framebuffer;
  }

  public get texture(): Texture {
    return this._texture;
  }
}

export class PingPongBuffers {
  private _gl: WebGL2RenderingContext;
  private _program: Program;
  private _buffers: [PingPongBuffer, PingPongBuffer];
  private _isFlipped: boolean;
  private _vertexBufferObject: VertexBufferObject;
  private _width: number;
  private _height: number;

  constructor(gl: WebGL2RenderingContext, width: number, height: number) {
    const program = new Program({
      gl,
      vertexShaderSource,
      fragmentShaderSource,
    });
    const buffers: [PingPongBuffer, PingPongBuffer] = [
      new PingPongBuffer(gl, program, width, height),
      new PingPongBuffer(gl, program, width, height),
    ];
    program.setUniform({
      dataType: "INT32",
      uniformName: "u_resolution",
      data: [width, height],
    });
    // should agree with the variable defined in the vertex shader
    const numberOfVertices = 3;
    const numberOfItemsForEachVertex = 2;
    const vertexBufferObject = program.setVertexBufferObject({
      attributeName: "a_position",
      numberOfVertices,
      numberOfItemsForEachVertex,
      data: new Float32Array(numberOfVertices * numberOfItemsForEachVertex),
    });
    this._gl = gl;
    this._program = program;
    this._buffers = buffers;
    this._isFlipped = false;
    this._vertexBufferObject = vertexBufferObject;
    this._width = width;
    this._height = height;
  }

  public setData(data: Uint8Array) {
    const gl = this._gl;
    const framebuffer = this._buffers[0].framebuffer;
    const texture = this._buffers[0].texture;
    framebuffer.bindAndExecute(() => {
      texture.bindAndExecute((boundTexture: Texture) => {
        gl.texSubImage2D(
          boundTexture.target,
          0,
          0,
          0,
          this._width,
          this._height,
          TEXTURE_CONFIG.format,
          TEXTURE_CONFIG.type,
          data,
        );
      });
    });
  }

  public update() {
    const gl = this._gl;
    const buffers = this._buffers;
    const isFlipped: boolean = this._isFlipped;
    const inputBuffer = buffers[isFlipped ? 1 : 0];
    const outputBuffer = buffers[isFlipped ? 0 : 1];
    const vertexBufferObject = this._vertexBufferObject;
    gl.viewport(0, 0, this._width, this._height);
    this._program.use(() => {
      outputBuffer.framebuffer.bindAndExecute(() => {
        inputBuffer.texture.bindAndExecute(() => {
          vertexBufferObject.bindAndDraw(gl.TRIANGLES);
        });
      });
    });
    this._isFlipped = !isFlipped;
  }

  public getCurrentBuffer(): PingPongBuffer {
    return this._buffers[this._isFlipped ? 0 : 1];
  }
}
