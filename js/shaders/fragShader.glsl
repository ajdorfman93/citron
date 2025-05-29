precision mediump float; // Use medium precision for floats

// vUv: interpolated UV coordinates from vertex shader
varying vec2 vUv;

// Uniforms:
// u_time: elapsed time in milliseconds
// u_ratio: screen width/height ratio to correct aspect
// u_pointer_position: normalized pointer position
// u_scroll_progress: scroll progress from 0.0 to 1.0
uniform float u_time;
uniform float u_ratio;
uniform vec2 u_pointer_position;
uniform float u_scroll_progress;

// Rotate a 2D vector 'uv' by angle 'th' radians
vec2 rotate(vec2 uv, float th) {
    return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}

// Compute a recursive, sine-accumulated "neuro" noise shape
// uv: input coordinates, t: time parameter, p: pointer influence
float neuro_shape(vec2 uv, float t, float p) {
    vec2 sine_acc = vec2(0.); // accumulator for sine shifts
    vec2 res = vec2(0.);      // accumulates result
    float scale = 8.;         // initial scaling factor

    // Iterate multiple layers to build fractal-like structure
    for (int j = 0; j < 100; j++) {
        uv = rotate(uv, 1.);         // rotate uv by 1 radian each iteration
        sine_acc = rotate(sine_acc, 1.); // rotate sine accumulator similarly
        // Compute layer coordinates
        vec2 layer = uv * scale + float(j) + sine_acc - t;
        sine_acc += sin(layer);      // update accumulator with sine of layer
        // accumulate cosine-based pattern, attenuating by scale
        res += (0.5 + 0.25 * cos(layer)) / scale;
        // adjust scale based on pointer influence p
        scale *= (1.2 - 0.07 * p);
    }
    // combine x and y channels for final noise value
    return res.x + res.y;
}

void main() {
    // Normalize UV to range [0, 0.5] and correct x by aspect ratio
    vec2 uv = 0.5 * vUv;
    uv.x *= u_ratio;

    // Compute pointer distance influence
    vec2 pointer = vUv - u_pointer_position;
    pointer.x *= u_ratio;
    float p = clamp(length(pointer), 0.0, 1.0); // distance clamped to [0,1]
    p = 0.5 * pow(1.0 - p, 2.0);                // peak influence near pointer

    // Time parameter scaled down
    float t = 0.001 * u_time;

    // Initialize color vector
    vec3 color = vec3(0.0);

    // Sample the neuro_shape noise
    float noise = neuro_shape(uv, t, p);
    noise = 1.2 * pow(noise, 3.0);    // enhance contrast with power function
    noise += pow(noise, 10.0);        // accentuate bright spots
    noise = max(0.0, noise - 0.5);    // threshold to create sharp patterns
    noise *= (1.0 - length(vUv - 0.5)); // fade edges toward center

    // Base color oscillates with scroll progress
    color = normalize(vec3(
      0.2,
      0.5 + 0.4 * cos(3.0 * u_scroll_progress),
      0.5 + 0.5 * sin(3.0 * u_scroll_progress)
    ));
    // modulate color by noise intensity
    color *= noise;

    // Output final color with noise as alpha
    gl_FragColor = vec4(color, noise);
}
