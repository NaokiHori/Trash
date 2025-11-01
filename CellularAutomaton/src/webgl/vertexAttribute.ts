export class VertexAttribute {
  private _attributeIndex: GLuint;

  public constructor({
    gl,
    program,
    attributeName,
  }: {
    gl: WebGL2RenderingContext;
    program: WebGLProgram;
    attributeName: string;
  }) {
    const attributeIndex: GLint = gl.getAttribLocation(program, attributeName);
    if (-1 === attributeIndex) {
      throw new Error(`Attribute ${attributeName} is not found`);
    }
    // NOTE: enable on creating it
    gl.enableVertexAttribArray(attributeIndex);
    this._attributeIndex = attributeIndex;
  }

  public get attributeIndex(): GLuint {
    return this._attributeIndex;
  }
}
