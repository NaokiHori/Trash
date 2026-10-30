precision mediump float;

uniform float u_domain_size;
uniform int u_orbit_type;
uniform vec2 u_center;
uniform vec2 u_resolution;
uniform vec2 u_orbit_trap_center;
uniform vec2 u_recurrence_offset;
uniform int u_counter;

const float PI = 3.141592653589793;
const int RECURSION_MAX = 32;

vec2 transform_to_screen_coordinate(
    vec2 domain_length,
    vec2 point
) {
  mat3 transform_matrix = mat3(
      domain_length.x / u_resolution.x,
      0.,
      0.,
      0.,
      domain_length.y / u_resolution.y,
      0.,
      u_center.x - 0.5 * domain_length.x,
      u_center.y - 0.5 * domain_length.y,
      1.
  );
  vec3 converted = transform_matrix * vec3(point, 1.);
  return vec2(converted.x, converted.y);
}

float min_of_vec4(
    vec4 value
) {
  float result = 1e+16;
  result = min(result, value.x);
  result = min(result, value.y);
  result = min(result, value.z);
  result = min(result, value.w);
  return result;
}

float find_minimum_distance_lines(
    vec2 p
) {
  vec2 center = vec2(
      length(u_orbit_trap_center) * cos(0.01 * float(u_counter)),
      length(u_orbit_trap_center) * sin(0.01 * float(u_counter))
  );
  vec4 a = vec4(0., 1., 1., +1.);
  vec4 b = vec4(1., 0., 1., -1.);
  vec4 c = vec4(
      - a.x * center.x - b.x * center.y,
      - a.y * center.x - b.y * center.y,
      - a.z * center.x - b.z * center.y,
      - a.w * center.x - b.w * center.y
  );
  vec4 absolute_distances = vec4(1e+16);
  for (int iter = 0; iter < RECURSION_MAX; iter += 1) {
    p = vec2(
        u_recurrence_offset.x + p.x * p.x - p.y * p.y,
        u_recurrence_offset.y + p.x * p.y + p.x * p.y
    );
    // absolute distance from four lines
    absolute_distances = min(
        absolute_distances,
        abs(a * p.x + b * p.y + c) / sqrt(a * a + b * b)
    );
  }
  return min_of_vec4(absolute_distances);
}

float find_minimum_distance_circles(
    vec2 p
) {
  vec2 center = vec2(
      length(u_orbit_trap_center) * cos(0.01 * float(u_counter)),
      length(u_orbit_trap_center) * sin(0.01 * float(u_counter))
  );
  vec4 radii = vec4(1., 4., 9., 16.);
  vec4 absolute_distances = vec4(1e+16);
  for (int iter = 0; iter < RECURSION_MAX; iter += 1) {
    p = vec2(
        u_recurrence_offset.x + p.x * p.x - p.y * p.y,
        u_recurrence_offset.y + p.x * p.y + p.x * p.y
    );
    // absolute distance from four circles
    absolute_distances = min(
        absolute_distances,
        abs(radii - distance(p, center))
    );
  }
  return min_of_vec4(absolute_distances);
}

vec3 hsv_to_rgb(
    float h,
    float scalar
) {
  float s = scalar < 2. / 3. ? 1. : 2. - 1.5 * scalar;
  float v = sqrt(scalar);
  if (0. == s) {
    return vec3(v, v, v);
  }
  h = fract(h);
  float f = fract(6. * h);
  float p = v * (1. - s);
  float q = v * (1. - s * f);
  float t = v * (1. - s + s * f);
  if (h < 1. / 6.) {
    return vec3(v, t, p);
  } else if (h < 2. / 6.) {
    return vec3(q, v, p);
  } else if (h < 3. / 6.) {
    return vec3(p, v, t);
  } else if (h < 4. / 6.) {
    return vec3(p, q, v);
  } else if (h < 5. / 6.) {
    return vec3(t, p, v);
  } else {
    return vec3(v, p, q);
  }
}

void main(
    void
) {
  float aspect_ratio = u_resolution.x / u_resolution.y;
  // "u_domain_size" is assigned to the shorter edge
  vec2 domain_length = vec2(
      aspect_ratio < 1. ? u_domain_size * aspect_ratio : u_domain_size,
      aspect_ratio < 1. ? u_domain_size : u_domain_size / aspect_ratio
  );
  vec2 point = transform_to_screen_coordinate(domain_length, gl_FragCoord.xy);
  vec3 rgb = vec3(0.);
  float power = 16.;
  if (1 == u_orbit_type || 3 == u_orbit_type) {
    rgb = max(
        rgb,
        hsv_to_rgb(
            0.6,
            pow(1. - clamp(find_minimum_distance_lines(point) / length(0.25 * domain_length), 0., 1.), power)
        )
    );
  }
  if (2 == u_orbit_type || 3 == u_orbit_type) {
    rgb = max(
        rgb,
        hsv_to_rgb(
            0.6,
            pow(1. - clamp(find_minimum_distance_circles(point) / length(0.25 * domain_length), 0., 1.), power)
        )
    );
  }
  gl_FragColor = clamp(vec4(rgb, 1.), 0., 1.);
}

