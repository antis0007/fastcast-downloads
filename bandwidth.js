/* Constant-rate video payload model. This does not measure app or provider traffic. */
function estimatePayload(mbps, minutes) {
  if (!Number.isFinite(mbps) || mbps < 1 || mbps > 50 ||
      !Number.isFinite(minutes) || minutes < 5 || minutes > 240) {
    throw new RangeError('Use 1–50 Mbps and 5–240 minutes.');
  }
  const payloadGb = mbps * minutes * 0.0075;
  return { payloadGb, relayCombinedGb: payloadGb * 2 };
}

function initializeCalculator() {
  const bitrate = document.querySelector('#bitrate');
  if (!bitrate) return;
  const duration = document.querySelector('#duration');
  const canvas = document.querySelector('#payload-chart');
  const table = document.querySelector('#payload-table');
  const status = document.querySelector('#calculator-status');
  const context = canvas.getContext('2d');
  document.querySelector('#bandwidth-controls').disabled = false;
  canvas.hidden = !context;

  function drawChart() {
    if (!context) return;
    const { payloadGb } = estimatePayload(Number(bitrate.value), Number(duration.value));
    const width = Math.max(240, Math.round(canvas.getBoundingClientRect().width));
    const height = 230;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.scale(ratio, ratio);
    const left = 42, top = 14, right = width - 16, bottom = height - 34;
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    context.font = '11px Arial, sans-serif';
    for (let step = 0; step <= 4; step += 1) {
      const part = step / 4;
      const y = bottom - part * (bottom - top);
      context.strokeStyle = '#303943';
      context.beginPath(); context.moveTo(left, y); context.lineTo(right, y); context.stroke();
      context.fillStyle = '#aab4c2';
      context.textAlign = 'right';
      context.fillText((payloadGb * part).toFixed(2), left - 8, y + 4);
      context.textAlign = step === 4 ? 'right' : step === 0 ? 'left' : 'center';
      context.fillText(`${Number(duration.value) * part}m`, left + part * (right - left), height - 10);
    }
    context.beginPath(); context.moveTo(left, bottom); context.lineTo(right, top); context.lineTo(right, bottom); context.closePath();
    context.fillStyle = '#6bc9ff14'; context.fill();
    context.beginPath(); context.moveTo(left, bottom); context.lineTo(right, top);
    context.lineWidth = 2; context.strokeStyle = accent; context.stroke();
  }

  function render() {
    const mbps = Number(bitrate.value), minutes = Number(duration.value);
    const { payloadGb, relayCombinedGb } = estimatePayload(mbps, minutes);
    document.querySelector('#bitrate-value').textContent = `${mbps} Mbps`;
    document.querySelector('#duration-value').textContent = `${minutes} minutes`;
    bitrate.setAttribute('aria-valuetext', `${mbps} megabits per second`);
    duration.setAttribute('aria-valuetext', `${minutes} minutes`);
    document.querySelector('#payload-value').textContent = payloadGb.toFixed(2);
    document.querySelector('#payload-description').textContent = `${minutes} minutes at ${mbps} Mbps, for one viewer.`;
    document.querySelectorAll('[data-payload]').forEach(node => node.textContent = `${payloadGb.toFixed(2)} GB`);
    document.querySelector('#relay-total').textContent = `${relayCombinedGb.toFixed(2)} GB`;
    canvas.setAttribute('aria-label', `Cumulative video payload rises linearly from zero to ${payloadGb.toFixed(2)} GB over ${minutes} minutes. Exact values are in the table below.`);
    const rows = document.createDocumentFragment();
    for (let step = 0; step <= 4; step += 1) {
      const row = document.createElement('tr');
      for (const value of [`${minutes * step / 4} min`, `${(payloadGb * step / 4).toFixed(2)} GB`]) {
        const cell = document.createElement('td'); cell.textContent = value; row.append(cell);
      }
      rows.append(row);
    }
    table.replaceChildren(rows);
    drawChart();
  }
  function announce() {
    status.textContent = `Estimate updated: ${document.querySelector('#payload-value').textContent} GB of video payload per endpoint.`;
  }
  for (const input of [bitrate, duration]) {
    input.addEventListener('input', render);
    input.addEventListener('change', announce);
  }
  document.querySelector('#reset-bandwidth').addEventListener('click', () => {
    bitrate.value = bitrate.defaultValue; duration.value = duration.defaultValue;
    render(); announce();
  });
  if (context) new ResizeObserver(drawChart).observe(canvas);
  render();
}
if (typeof document !== 'undefined') initializeCalculator();
if (typeof module !== 'undefined') module.exports = { estimatePayload };
