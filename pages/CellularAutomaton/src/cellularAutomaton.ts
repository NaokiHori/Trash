import { getWebGL2RenderingContext } from "./webgl/context";
import { Program } from "./webgl/program";
import { IndexBufferObject } from "./webgl/indexBufferObject";
import { PingPongBuffers } from "./pingPongBuffers";
import vertexShaderSource from "../shader/visualize.vs.glsl?raw";
import fragmentShaderSource from "../shader/visualize.fs.glsl?raw";

// two triangles to paste a texture
function setupRectangleDomain(
  gl: WebGL2RenderingContext,
  program: Program,
  aspectRatio: number,
): IndexBufferObject {
  const positions = [
    [-aspectRatio, -1],
    [aspectRatio, -1],
    [-aspectRatio, 1],
    [aspectRatio, 1],
  ];
  const indices = [0, 1, 2, 1, 3, 2];
  program.setVertexBufferObject({
    attributeName: "a_position",
    numberOfVertices: positions.length,
    numberOfItemsForEachVertex: "xy".length,
    data: new Float32Array(positions.flat()),
  });
  const indexBufferObject = new IndexBufferObject({
    gl,
    size: indices.length,
    usage: gl.STATIC_DRAW,
  });
  indexBufferObject.bindAndUpdateData(new Int16Array(indices));
  return indexBufferObject;
}

export class CellularAutomaton {
  private gl: WebGL2RenderingContext;
  private program: Program;
  private pingPongBuffers: PingPongBuffers;
  private indexBufferObject: IndexBufferObject;
  private width: number;
  private height: number;

  public constructor(canvas: HTMLCanvasElement) {
    const gl: WebGL2RenderingContext = getWebGL2RenderingContext({
      canvas,
    });
    const program = new Program({
      gl,
      vertexShaderSource,
      fragmentShaderSource,
    });
    const width = canvas.width;
    const height = canvas.height;
    const pingPongBuffers = new PingPongBuffers(gl, width, height);
    (function () {
      const data = new Uint8Array("RGBA".length * width * height);
      for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
          for (let n = 0; n < "RGBA".length; n++) {
            const randomValue = Math.random();
            const denominator = Math.max(4, Math.min(width, height));
            data["RGBA".length * (j * width + i) + n] =
              randomValue < (denominator - 2) / denominator
                ? 0
                : randomValue < (denominator - 1) / denominator
                  ? 1
                  : 2;
          }
        }
      }
      pingPongBuffers.setData(data);
    })();
    const indexBufferObject = setupRectangleDomain(gl, program, width / height);
    this.gl = gl;
    this.program = program;
    this.pingPongBuffers = pingPongBuffers;
    this.indexBufferObject = indexBufferObject;
    this.width = width;
    this.height = height;
  }

  public handleResizeEvent(canvas: HTMLCanvasElement) {
    const canvasWidth: number = canvas.width;
    const canvasHeight: number = canvas.height;
    const scalarWidth = this.width;
    const scalarHeight = this.height;
    const scale = (function computeScale() {
      const canvasAspectRatio: number = canvasWidth / canvasHeight;
      const scalarAspectRatio: number = scalarWidth / scalarHeight;
      return canvasAspectRatio < scalarAspectRatio
        ? [1 / scalarAspectRatio, canvasAspectRatio / scalarAspectRatio]
        : [1 / canvasAspectRatio, 1];
    })();
    this.program.setUniform({
      dataType: "FLOAT32",
      uniformName: "u_scale",
      data: scale,
    });
  }

  public update() {
    this.pingPongBuffers.update();
  }

  public draw(canvas: HTMLCanvasElement) {
    const gl = this.gl;
    const pingPongBuffer = this.pingPongBuffers.getCurrentBuffer();
    gl.viewport(0, 0, canvas.width, canvas.height);
    this.program.use(() => {
      pingPongBuffer.getTexture().bindAndExecute(() => {
        this.indexBufferObject.bindAndDraw(gl.TRIANGLES);
      });
    });
  }
}
