(() => {
  "use strict";

  const bitrate = document.getElementById("bitrate");
  const duration = document.getElementById("duration");
  function updateGraphs() {
    const rate = Number(bitrate.value);
    const minutes = Number(duration.value);
    const gigabytes = (rate * 60 * minutes / 8000).toFixed(2);
    document.getElementById("bitrate-value").textContent = `${rate} Mbps`;
    document.getElementById("duration-value").textContent = `${minutes} min`;
    document.getElementById("payload-total").textContent = `${gigabytes} GB`;
    document.getElementById("relay-total").textContent = `${gigabytes} GB`;
    document.getElementById("graph-max").textContent = `${Number(gigabytes)} GB`;
    document.getElementById("graph-time").textContent = `${minutes} min`;
    document.getElementById("graph-description").textContent = `At ${rate} megabits per second, a ${minutes} minute session transfers an estimated ${gigabytes} gigabytes of video payload. This is a calculation, not a benchmark.`;
  }
  bitrate.addEventListener("input", updateGraphs);
  duration.addEventListener("input", updateGraphs);
  updateGraphs();

  const source = document.getElementById("demo-source");
  const receiver = document.getElementById("demo-receiver");
  const sourceContext = source.getContext("2d");
  const receiverContext = receiver.getContext("2d");
  if (!sourceContext || !receiverContext) return;
  const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
  let paused = motionPreference.matches;
  let mirrored = true;
  let effect = "signal";
  let frame = 0;
  let visible = true;
  let pointer = null;
  let clock = 0;
  let previousTimestamp = null;
  const pauseButton = document.getElementById("demo-pause");

  function resizeCanvas(canvas) {
    const bounds = canvas.getBoundingClientRect();
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    const width = Math.max(1, Math.round(bounds.width * ratio));
    const height = Math.max(1, Math.round(bounds.height * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
  }

  function paint(canvas, context, active) {
    resizeCanvas(canvas);
    const width = canvas.width;
    const height = canvas.height;
    context.clearRect(0, 0, width, height);
    context.fillStyle = "#0b100e";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "#1a2821";
    context.lineWidth = 1;
    for (let x = 0; x < width; x += width / 16) {
      context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke();
    }
    for (let y = 0; y < height; y += height / 9) {
      context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke();
    }
    if (!active) {
      context.fillStyle = "#8b928d";
      context.font = `${Math.max(12, width / 35)}px monospace`;
      context.textAlign = "center";
      context.fillText("MIRROR PAUSED", width / 2, height / 2);
      return;
    }
    const time = clock / 1000;
    const x = (pointer?.x ?? (0.5 + Math.sin(time * 0.7) * 0.22)) * width;
    const y = (pointer?.y ?? (0.5 + Math.cos(time * 0.9) * 0.19)) * height;
    const scale = Math.min(width, height);
    context.lineWidth = Math.max(1, scale / 180);
    if (effect === "signal") {
      for (let i = 0; i < 5; i++) {
        const phase = (time * 0.3 + i / 5) % 1;
        context.strokeStyle = `rgba(120,209,139,${(1 - phase) * 0.75})`;
        context.beginPath(); context.arc(x, y, 5 + phase * scale * 0.55, 0, Math.PI * 2); context.stroke();
      }
    } else if (effect === "orbit") {
      for (let i = 0; i < 28; i++) {
        const angle = time * 1.1 + i * 2.399;
        const radius = scale * (0.07 + (i % 7) * 0.024);
        context.fillStyle = i % 3 ? "#78d18b" : "#d1d8d3";
        context.beginPath(); context.arc(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius * 0.62, 1.5 + i % 3, 0, Math.PI * 2); context.fill();
      }
    } else {
      for (let ribbon = 0; ribbon < 4; ribbon++) {
        context.strokeStyle = `rgba(120,209,139,${0.8 - ribbon * 0.16})`;
        context.beginPath();
        for (let point = 0; point < 65; point++) {
          const distance = point / 64;
          const px = x - distance * scale * 0.7;
          const py = y + Math.sin(distance * 10 - time * 2 + ribbon * 0.45) * distance * scale * 0.17;
          if (point === 0) context.moveTo(px, py); else context.lineTo(px, py);
        }
        context.stroke();
      }
    }
    context.fillStyle = "#e6f8eb";
    context.beginPath(); context.moveTo(x, y); context.lineTo(x + 5, y + 19); context.lineTo(x + 10, y + 12); context.lineTo(x + 18, y + 10); context.closePath(); context.fill();
  }

  function render() {
    paint(source, sourceContext, true);
    paint(receiver, receiverContext, mirrored);
  }
  function tick(timestamp) {
    frame = 0;
    if (previousTimestamp !== null) clock += Math.min(timestamp - previousTimestamp, 50);
    previousTimestamp = timestamp;
    render();
    if (!paused && visible && !document.hidden) frame = requestAnimationFrame(tick);
  }
  function schedule() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    previousTimestamp = null;
    render();
    if (!paused && visible && !document.hidden) frame = requestAnimationFrame(tick);
  }
  function updatePause() {
    pauseButton.textContent = paused ? "Play motion" : "Pause motion";
    pauseButton.setAttribute("aria-pressed", String(paused));
    schedule();
  }
  pauseButton.addEventListener("click", () => { paused = !paused; updatePause(); });
  document.getElementById("demo-mirror").addEventListener("click", (event) => {
    mirrored = !mirrored;
    event.currentTarget.textContent = mirrored ? "Mirroring on" : "Mirroring off";
    event.currentTarget.setAttribute("aria-pressed", String(mirrored));
    document.getElementById("mirror-status").textContent = mirrored ? "MIRRORING" : "PAUSED";
    render();
  });
  for (const button of document.querySelectorAll("[data-effect]")) {
    button.addEventListener("click", () => {
      effect = button.dataset.effect;
      for (const option of document.querySelectorAll("[data-effect]")) {
        const selected = option === button;
        option.classList.toggle("is-selected", selected);
        option.setAttribute("aria-pressed", String(selected));
      }
      render();
    });
  }
  source.addEventListener("pointermove", (event) => {
    const bounds = source.getBoundingClientRect();
    pointer = { x: (event.clientX - bounds.left) / bounds.width, y: (event.clientY - bounds.top) / bounds.height };
    if (paused) render();
  });
  source.addEventListener("pointerleave", () => { pointer = null; if (paused) render(); });
  document.addEventListener("visibilitychange", schedule);
  motionPreference.addEventListener("change", (event) => { paused = event.matches; updatePause(); });
  new ResizeObserver(schedule).observe(source.parentElement);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); }).observe(source);
  updatePause();
})();
