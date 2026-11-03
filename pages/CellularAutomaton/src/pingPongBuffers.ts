import { Program } from "../..//webgl/program";
import { Texture } from "../..//webgl/texture";
import { VertexBufferObject } from "../../webgl/vertexBufferObject";
import { PingPongBuffer } from "./pingPongBuffers/pingPongBuffer";
import { TEXTURE_CONFIG } from "./pingPongBuffers/textureConfig";
import vertexShaderSource from "../shader/calculate.vs.glsl?raw";
import fragmentShaderSource from "../shader/calculate.fs.glsl?raw";

export class PingPongBuffers {
  private gl: WebGL2RenderingContext;
  private program: Program;
  private buffers: [PingPongBuffer, PingPongBuffer];
  private isFlipped: boolean;
  private vertexBufferObject: VertexBufferObject;
  private width: number;
  private height: number;

  public constructor(gl: WebGL2RenderingContext, width: number, height: number) {
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
    this.gl = gl;
    this.program = program;
    this.buffers = buffers;
    this.isFlipped = false;
    this.vertexBufferObject = vertexBufferObject;
    this.width = width;
    this.height = height;
  }

  public setData(data: Uint8Array): void {
    const gl = this.gl;
    const framebuffer = this.buffers[0].getFramebuffer();
    const texture = this.buffers[0].getTexture();
    framebuffer.bindAndExecute(() => {
      texture.bindAndExecute((boundTexture: Texture) => {
        gl.texSubImage2D(
          boundTexture.getTarget(),
          0,
          0,
          0,
          this.width,
          this.height,
          TEXTURE_CONFIG.format,
          TEXTURE_CONFIG.type,
          data,
        );
      });
    });
  }

  public update(): void {
    const gl = this.gl;
    const buffers = this.buffers;
    const isFlipped: boolean = this.isFlipped;
    const inputBuffer = buffers[isFlipped ? 1 : 0];
    const outputBuffer = buffers[isFlipped ? 0 : 1];
    const vertexBufferObject = this.vertexBufferObject;
    gl.viewport(0, 0, this.width, this.height);
    this.program.use(() => {
      outputBuffer.getFramebuffer().bindAndExecute(() => {
        inputBuffer.getTexture().bindAndExecute(() => {
          vertexBufferObject.bindAndDraw(gl.TRIANGLES);
        });
      });
    });
    this.isFlipped = !isFlipped;
  }

  public getCurrentBuffer(): PingPongBuffer {
    return this.buffers[this.isFlipped ? 0 : 1];
  }
}
