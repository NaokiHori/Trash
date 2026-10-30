#version 300 es

#define OFF 0u
#define DYING 1u
#define ON 2u

uniform highp usampler2D state;

uniform ivec2 u_resolution;

out uvec4 new_state;

ivec2 getCoord(ivec2 center, ivec2 disp) {
  return ivec2(
      (center.x + u_resolution.x + disp.x) % u_resolution.x,
      (center.y + u_resolution.y + disp.y) % u_resolution.y
  );
}

uint calcNew(uint value, uint n_survival) {
  if (ON == value) {
    return DYING;
  } else if (OFF == value && 2u == n_survival) {
    return ON;
  } else {
    return OFF;
  }
}

void main(void) {
  uvec4 uvec4_on = uvec4(ON);
  ivec2 frag_coord = ivec2(gl_FragCoord.xy);
  uvec4 state_mm = texelFetch(state, getCoord(frag_coord, ivec2(-1, -1)), 0);
  uvec4 state_0m = texelFetch(state, getCoord(frag_coord, ivec2( 0, -1)), 0);
  uvec4 state_pm = texelFetch(state, getCoord(frag_coord, ivec2(+1, -1)), 0);
  uvec4 state_m0 = texelFetch(state, getCoord(frag_coord, ivec2(-1,  0)), 0);
  uvec4 state_00 = texelFetch(state, getCoord(frag_coord, ivec2( 0,  0)), 0);
  uvec4 state_p0 = texelFetch(state, getCoord(frag_coord, ivec2(+1,  0)), 0);
  uvec4 state_mp = texelFetch(state, getCoord(frag_coord, ivec2(-1, +1)), 0);
  uvec4 state_0p = texelFetch(state, getCoord(frag_coord, ivec2( 0, +1)), 0);
  uvec4 state_pp = texelFetch(state, getCoord(frag_coord, ivec2(+1, +1)), 0);
  uvec4 n_survival = uvec4(0);
  n_survival += uvec4(equal(uvec4_on, state_mm));
  n_survival += uvec4(equal(uvec4_on, state_0m));
  n_survival += uvec4(equal(uvec4_on, state_pm));
  n_survival += uvec4(equal(uvec4_on, state_m0));
  n_survival += uvec4(equal(uvec4_on, state_p0));
  n_survival += uvec4(equal(uvec4_on, state_mp));
  n_survival += uvec4(equal(uvec4_on, state_0p));
  n_survival += uvec4(equal(uvec4_on, state_pp));
  uint r = calcNew(state_00.r, n_survival.r);
  uint g = calcNew(state_00.g, n_survival.g);
  uint b = calcNew(state_00.b, n_survival.b);
  new_state = uvec4(r, g, b, 0);
}
