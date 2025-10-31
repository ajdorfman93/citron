// neuroCanvas.js  – replaces the old <script id="rendered-js">
(async () => {

  if (window.__citronDisableAnimations === true) {
    const canvas = document.querySelector("canvas#neuro");
    if (canvas) {
      canvas.classList.add("is-disabled");
    }
    return;
  }

  /** Convenience loader for external GLSL files */
  async function loadText(url) {
    const res = await fetch(url);
    return res.text();
  }

  /* ---------- DOM/GL setup ---------- */
  const canvas = document.querySelector("canvas#neuro");
  const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (!gl) { alert("WebGL not supported"); return; }

  const [vsSource, fsSource] = await Promise.all([
    loadText("js/shaders/vertShader.glsl"),
    loadText("js/shaders/fragShader.glsl")
  ]);

  /* ---------- compile & link ---------- */
  function compile(type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS))
         throw new Error(gl.getShaderInfoLog(sh));
    return sh;
  }
  const program = gl.createProgram();
  gl.attachShader(program, compile(gl.VERTEX_SHADER, vsSource));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fsSource));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
        throw new Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);

  /* ---------- buffers & uniforms ---------- */
  const vertices = new Float32Array([ -1, -1,  1, -1,  -1, 1,   1, 1 ]);
  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  const posLoc = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

  const uniforms = {
    time : gl.getUniformLocation(program, "u_time"),
    ratio: gl.getUniformLocation(program, "u_ratio"),
    pointer: gl.getUniformLocation(program, "u_pointer_position"),
    scroll : gl.getUniformLocation(program, "u_scroll_progress")
  };

  /* ---------- helpers ---------- */
  function resize() {
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width  = window.innerWidth  * dpr;
    canvas.height = window.innerHeight * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform1f(uniforms.ratio, canvas.width / canvas.height);
  }
  resize();  window.addEventListener("resize", resize);

  const pointer = { x:0, y:0, tx:0, ty:0 };
  window.addEventListener("pointermove", e => { pointer.tx = e.clientX; pointer.ty = e.clientY; });

  /* ---------- render loop ---------- */
  function render(now) {
    pointer.x += (pointer.tx - pointer.x)*0.5;
    pointer.y += (pointer.ty - pointer.y)*0.5;

    gl.uniform1f(uniforms.time, now);
    gl.uniform2f(uniforms.pointer, pointer.x / window.innerWidth,
                                 1 - pointer.y / window.innerHeight);
    gl.uniform1f(uniforms.scroll, window.pageYOffset / (2*window.innerHeight));

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

})();
