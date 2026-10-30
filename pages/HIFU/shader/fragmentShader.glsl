precision mediump float;

#define PI 3.141592653589793238462643383

// transducer
const float radius = 5e-2;
const float theta_min = PI / 12.;
const float theta_max = PI / 6.;
// domain center
const vec2 domain_center = vec2(0., 0.375 * radius);
// wavelength
float wavelength = 1e-3;

uniform int u_is_animated;
uniform float u_source_argument;
uniform vec2 u_resolution;
uniform vec3 u_color_exponents;

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
      domain_center.x - 0.5 * domain_length.x,
      domain_center.y - 0.5 * domain_length.y,
      1.
  );
  vec3 converted = transform_matrix * vec3(point, 1.);
  return vec2(converted.x, converted.y);
}

float compute_distance(
    vec2 angles,
    vec2 point
) {
  vec2 center = vec2(0., 0.);
  vec2 cp = point - center;
  float cp_atan2 = atan(cp.y, cp.x);
  if (angles.x < cp_atan2 && cp_atan2 < angles.y) {
    return abs(radius - length(cp));
  } else {
    return min(
        length(center + radius * vec2(cos(angles.x), sin(angles.x)) - point),
        length(center + radius * vec2(cos(angles.y), sin(angles.y)) - point)
    );
  }
}

vec3 get_color_map(
    float scalar
) {
  // scalar is in [-1, 1]
  float factor = 0.5;
  return vec3(clamp(0.5 + factor * scalar, 0., 1.));
}

vec3 blur(
    float x
) {
  return vec3(1. - smoothstep(0., 0.5 * wavelength, x));
}

void main(
    void
) {
  float aspect_ratio = u_resolution.x / u_resolution.y;
  // domain_size denotes the length of the shorter edge
  float domain_size = 0.125;
  vec2 domain_length = vec2(
      aspect_ratio < 1. ? domain_size * aspect_ratio : domain_size,
      aspect_ratio < 1. ? domain_size : domain_size / aspect_ratio
  );
  vec2 point = transform_to_screen_coordinate(domain_length, gl_FragCoord.xy);
  const int n_sources = 128;
  float dist_min = wavelength;
  float theoretical_max = float(n_sources) * inversesqrt(radius / dist_min);
  vec2 pressure = vec2(0., 0.);
  for (int n = 0; n < n_sources; n++) {
    float sgn = 0 == (n - (n / 2) * 2) ? 1. : -1.;
    float factor = 1. * float(n / 2) / float(n_sources / 2);
    float theta = 0.5 * PI + sgn * (theta_min + (theta_max - theta_min) * factor);
    vec2 source = vec2(radius * cos(theta), radius * sin(theta));
    float dist = distance(point, source);
    float amp = inversesqrt(max(1., dist / dist_min));
    float phase = - u_source_argument + 2. * PI * mod(dist, wavelength) / wavelength;
    pressure.x += amp * cos(phase);
    pressure.y -= amp * sin(phase);
  }
  if (1 == u_is_animated) {
    float scalar = pressure.x / theoretical_max;
    gl_FragColor = vec4(get_color_map(scalar), 1.);
  } else {
    float scalar = length(pressure) / theoretical_max;
    float r = pow(scalar, u_color_exponents.x);
    float g = pow(scalar, u_color_exponents.y);
    float b = pow(scalar, u_color_exponents.z);
    gl_FragColor = vec4(r, g, b, 1.);
  }
  // superposing arcs
  vec2 distances = vec2(
      compute_distance(
        vec2(0.5 * PI - theta_max, 0.5 * PI - theta_min),
        point
      ),
      compute_distance(
        vec2(0.5 * PI + theta_min, 0.5 * PI + theta_max),
        point
      )
  );
  gl_FragColor += vec4(
      blur(distances[0]),
      0.
  );
  gl_FragColor += vec4(
      blur(distances[1]),
      0.
  );
}

