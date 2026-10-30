#version 300 es

precision mediump float;
precision highp usampler2D;

uniform usampler2D u_texture;

in vec2 v_texture_coordinates;

out vec4 frag_color;

const vec3 R = vec3(1.0, 0.6, 0.6);
const vec3 G = vec3(0.6, 1.0, 0.6);
const vec3 B = vec3(0.6, 0.6, 1.0);

void main(void) {
  uvec4 value = texture(u_texture, v_texture_coordinates);
  vec3 color = vec3(0);
  color += uint(0) < value.r ? R : vec3(0);
  color += uint(0) < value.g ? G : vec3(0);
  color += uint(0) < value.b ? B : vec3(0);
  frag_color = vec4(color, 1.);
}

