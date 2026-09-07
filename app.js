(function () {
  "use strict";

  const version = document.querySelector('meta[name="fastcast-version"]')?.content || "";
  for (const label of document.querySelectorAll("[data-fastcast-version]")) {
    label.textContent = `${label.dataset.prefix || ""}${version}`;
  }

  function inferRepository() {
    const configured = String(window.FASTCAST_REPOSITORY || "").trim();
    if (/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(configured)) {
      return configured;
    }

    const pagesHost = window.location.hostname.match(/^([A-Za-z0-9_.-]+)\.github\.io$/i);
    const repositoryName = window.location.pathname.split("/").filter(Boolean)[0];
    if (pagesHost && repositoryName) {
      return `${pagesHost[1]}/${repositoryName}`;
    }

    return "";
  }

  const repository = inferRepository();
  if (repository) {
    for (const link of document.querySelectorAll("[data-repo-path]")) {
      const path = link.dataset.repoPath || "";
      link.href = `https://github.com/${repository}${path}`;
    }
  }

  function initializeSignalField(canvas) {
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
      preserveDrawingBuffer: false,
    });

    if (!gl) return;

    const vertexSource = `
      attribute vec2 a_position;

      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fragmentSource = `
      precision mediump float;

      uniform vec2 u_resolution;
      uniform float u_time;

      float hash(vec2 point) {
        return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453);
      }

      void main() {
        vec2 position = (2.0 * gl_FragCoord.xy - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
        float time = u_time * 0.12;

        float arcDistance = length(position - vec2(-0.42, 0.12));
        float rings = smoothstep(0.92, 1.0, sin(arcDistance * 24.0 - time * 2.0));

        float field = sin(position.x * 4.2 + sin(position.y * 3.1 + time) * 1.4 - time);
        field += sin(position.y * 7.0 - position.x * 1.6 + time * 0.7) * 0.42;
        float contours = smoothstep(0.80, 0.98, abs(field));

        vec2 gridPoint = abs(fract(position * vec2(10.0, 8.0)) - 0.5);
        float grid = smoothstep(0.465, 0.5, max(gridPoint.x, gridPoint.y)) * 0.10;

        vec2 packetCell = floor((position + time * vec2(0.08, -0.025)) * 22.0);
        float packet = step(0.994, hash(packetCell));
        float vignette = 1.0 - smoothstep(0.16, 1.45, length(position * vec2(0.78, 1.0)));

        vec3 base = vec3(0.012, 0.017, 0.015);
        vec3 graphite = vec3(0.12, 0.15, 0.135);
        vec3 phosphor = vec3(0.23, 0.72, 0.39);
        vec3 color = base + graphite * (contours * 0.22 + rings * 0.12 + grid);
        color += phosphor * (rings * 0.13 + contours * 0.055 + packet * 0.42);
        color *= 0.28 + vignette * 0.9;

        gl_FragColor = vec4(color, 0.94);
      }
    `;

    function compileShader(type, source) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const buffer = gl.createBuffer();
    if (!buffer || positionLocation < 0 || !resolutionLocation || !timeLocation) return;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = motionQuery.matches;
    let isVisible = true;
    let frame = 0;

    function resize() {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.35) * 0.62;
      const width = Math.max(1, Math.round(bounds.width * pixelRatio));
      const height = Math.max(1, Math.round(bounds.height * pixelRatio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    }

    function draw(timestamp) {
      frame = 0;
      resize();
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, reduceMotion ? 8.0 : (timestamp % 120000) * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      if (!reduceMotion && isVisible && !document.hidden) {
        frame = window.requestAnimationFrame(draw);
      }
    }

    function start() {
      if (!frame && isVisible && !document.hidden) {
        frame = window.requestAnimationFrame(draw);
      }
    }

    function stop() {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    }

    const visibilityObserver = "IntersectionObserver" in window
      ? new IntersectionObserver(([entry]) => {
          isVisible = entry.isIntersecting;
          if (isVisible) start();
          else stop();
        }, { rootMargin: "80px" })
      : null;
    visibilityObserver?.observe(canvas);

    const resizeObserver = "ResizeObserver" in window
      ? new ResizeObserver(() => {
          resize();
          if (reduceMotion) draw(0);
        })
      : null;
    resizeObserver?.observe(canvas);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });

    motionQuery.addEventListener?.("change", (event) => {
      reduceMotion = event.matches;
      stop();
      if (reduceMotion) draw(0);
      else start();
    });

    window.addEventListener("resize", () => {
      resize();
      if (reduceMotion) draw(0);
    }, { passive: true });

    canvas.classList.add("is-active");
    if (reduceMotion) draw(0);
    else start();
  }

  for (const canvas of document.querySelectorAll("[data-signal-field]")) {
    initializeSignalField(canvas);
  }
})();
