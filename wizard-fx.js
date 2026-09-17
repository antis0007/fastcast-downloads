// FastCast wizard orbit effects.
//
// Binding rules: docs/WEBSITE_DESIGN_CONTRACT.md (§4 motion budget, §8 tiers).
// Ported from the fastcast repo's wizard-fx.js, bound to the current cast-scene.
//
// CSS-only by choice. Animating spans on transform keeps the whole effect off
// the main thread: no requestAnimationFrame, so the spec's "drop to static if
// rAF delta > 50ms" rule has nothing to police. The cost is paid once, in
// element count, which the tier below bounds.
(function () {
  'use strict';

  var stage = document.querySelector('.cast-scene');
  if (!stage) {
    return;
  }
  var field = stage.querySelector('.wizard-particles');
  if (!field) {
    return;
  }

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  // §8 signals. `low` covers reduced motion, phones, thin cores and saveData;
  // `high` wants a real viewport and cores to spare.
  function tier() {
    var cores = navigator.hardwareConcurrency || 2;
    var save = navigator.connection && navigator.connection.saveData;
    if (reduced.matches || window.matchMedia('(max-width: 767px)').matches || cores <= 2 || save) {
      return 'low';
    }
    if (window.matchMedia('(min-width: 900px)').matches && cores >= 4) {
      return 'high';
    }
    return 'medium';
  }

  // Animated-node budget: the scene's existing animated layers stay in place,
  // so the dot count is capped low enough that the total stays within the
  // hero's 20-node budget alongside them.
  var COUNT = { low: 0, medium: 4, high: 6 };

  function render() {
    var level = tier();
    field.textContent = '';
    stage.setAttribute('data-tier', level);
    var total = COUNT[level];
    for (var n = 0; n < total; n += 1) {
      var dot = document.createElement('span');
      dot.className = 'orbit-dot';
      // Phase is a negative delay so every dot starts mid-orbit rather than
      // launching together from the same point on the first paint.
      dot.style.setProperty('--a', (360 * n / total).toFixed(1) + 'deg');
      dot.style.setProperty('--r', (n % 2 ? 66 : 82) + 'px');
      dot.style.setProperty('--d', (n % 2 ? 28 : 18) + 's');
      dot.style.setProperty('--delay', '-' + (n * 1.7).toFixed(1) + 's');
      field.appendChild(dot);
    }
  }

  // Page Visibility: a backgrounded tab must not keep compositing.
  function visibility() {
    stage.toggleAttribute('data-paused', document.hidden);
  }

  render();
  visibility();
  document.addEventListener('visibilitychange', visibility);
  // Re-tier on resize and on a reduced-motion change, so crossing the phone
  // breakpoint or toggling the OS setting takes effect without a reload.
  if (reduced.addEventListener) {
    reduced.addEventListener('change', render);
  }
  var pending;
  window.addEventListener('resize', function () {
    clearTimeout(pending);
    pending = setTimeout(render, 200);
  });
})();
