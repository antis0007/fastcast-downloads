/* Optional enhancements. Navigation, downloads, images and FAQs work without JS. */
const dialog = document.querySelector('.image-dialog');
if (dialog && typeof dialog.showModal === 'function') {
  let imageTrigger;
  document.querySelectorAll('[data-lightbox]').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      imageTrigger = link;
      const image = link.querySelector('img');
      const fullImage = dialog.querySelector('img');
      fullImage.src = link.href;
      fullImage.alt = image.alt;
      dialog.showModal();
    });
  });
  dialog.addEventListener('close', () => imageTrigger?.focus());
}

const search = document.querySelector('#faq-search');
if (search) {
  const groups = [...document.querySelectorAll('.faq-group')];
  const answers = groups.flatMap(group => [...group.querySelectorAll('details')]);
  const searchText = new Map(answers.map(answer => [answer, answer.textContent.toLocaleLowerCase()]));
  const status = document.querySelector('#search-status');
  document.querySelector('.help-search').hidden = false;
  search.maxLength = 160;
  search.addEventListener('input', () => {
    const query = search.value.trim().toLocaleLowerCase();
    let count = 0;
    for (const answer of answers) {
      const matches = searchText.get(answer).includes(query);
      answer.hidden = !matches;
      answer.open = Boolean(query && matches);
      if (matches) count += 1;
    }
    for (const group of groups) {
      group.hidden = ![...group.querySelectorAll('details')].some(answer => !answer.hidden);
    }
    document.querySelector('#no-results').hidden = count > 0;
    status.textContent = query ? `${count} ${count === 1 ? 'answer' : 'answers'} found` : '';
  });
  // Topic navigation restores the complete list if a search had hidden a topic.
  document.querySelectorAll('.section-nav a').forEach(link => {
    link.addEventListener('click', () => {
      search.value = '';
      search.dispatchEvent(new Event('input'));
    });
  });
}

const platform = /Android/i.test(navigator.userAgent) ? 'android'
  : /Windows/i.test(navigator.userAgent) ? 'windows' : null;
if (platform) {
  const label = document.querySelector(`[data-platform="${platform}"] .recommendation`);
  if (label) label.hidden = false;
  // Keep both direct downloads visible; only promote the matching platform.
  document.querySelectorAll('.hero [data-download]').forEach(link => {
    const matches = link.dataset.download === platform;
    link.classList.toggle('primary', matches);
    link.style.order = matches ? '-1' : '0';
  });
}

/* The wizard. He leans toward the pointer and answers clicks, holds, drags and
   right-clicks from a pool of lines per situation.

   Skipped entirely where there is no fine pointer to follow or the visitor asked
   for reduced motion: everything in the stage is decoration, and the page is
   complete without him. The lines are not motion, though, so a keyboard visitor
   and a reduced-motion visitor both still get a voice -- see `speakable`. */
(() => {
  const scene = document.querySelector('.cast-scene');
  const figure = scene?.querySelector('.cast-figure');
  const wizard = scene?.querySelector('.cast-body');
  const bubble = scene?.querySelector('.wizard-voice');
  const lineSource = document.querySelector('#wizard-voice-lines');
  if (!scene || !figure || !wizard || !bubble || !lineSource) return;

  let lines;
  try {
    lines = JSON.parse(lineSource.textContent);
  } catch (error) {
    return;
  }

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // The lean needs a pointer that can hover; the voice only needs the visitor to
  // be able to activate the button, which every input device can do.
  const canFollow = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !still;

  /* ---- the voice ---------------------------------------------------------- */
  const order = {};
  const next = pool => {
    const bag = order[pool] || (order[pool] = []);
    if (!bag.length) {
      bag.push(...lines[pool].map((_, index) => index));
      for (let i = bag.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
    }
    return lines[pool][bag.pop()];
  };

  // Ordered pools escalate: the sixth poke is the sixth line, not a lucky dip.
  // Past the end the pool keeps rotating instead of freezing on its last entry,
  // so a visitor who keeps poking keeps getting new lines.
  const say = (pool, mood, step) => {
    const available = lines[pool];
    if (!available?.length) return;
    if (Number.isInteger(step)) {
      bubble.textContent = step < available.length ? available[step] : next(pool);
    } else {
      bubble.textContent = next(pool);
    }
    // Which pool a line came from is otherwise invisible, and it is what the
    // interaction tests assert against.
    bubble.dataset.pool = pool;
    bubble.hidden = false;
    wizard.classList.remove('is-pleased', 'is-flinched');
    void wizard.offsetWidth;
    wizard.classList.add(mood);
  };

  wizard.addEventListener('animationend', () => {
    wizard.classList.remove('is-pleased', 'is-flinched');
  });

  /* ---- regions ------------------------------------------------------------ */
  /* Three parts of the artwork, measured off the file as fractions of his own
     box. Nothing marks them as targets: they are found by being curious rather
     than by being told. They must not overlap, because the lookup takes the
     first match -- the beard used to reach 0.58 and swallowed the screen. */
  const REGIONS = [
    { pool: 'beard', left: 0.24, right: 0.44, top: 0.40, bottom: 0.70 },
    { pool: 'hat', left: 0.16, right: 0.50, top: 0.02, bottom: 0.30 },
    { pool: 'orb', left: 0.58, right: 0.90, top: 0.40, bottom: 0.72 },
  ];
  const regionAt = event => {
    const box = wizard.getBoundingClientRect();
    if (!box.width || !box.height) return undefined;
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    return REGIONS.find(
      region => x > region.left && x < region.right && y > region.top && y < region.bottom
    )?.pool;
  };

  /* ---- the gestures ------------------------------------------------------- */
  const THRESHOLD = 5;
  const TOO_FAR = 240;
  const HELD = 1100;
  const POKE_WINDOW = 1100;
  let dragging = false;
  let moved = false;
  let complained = false;
  let originX = 0;
  let originY = 0;
  let dragX = 0;
  let dragY = 0;
  let queued = false;
  let holdTimer = 0;
  let said = false;
  let greeted = false;
  let pokes = 0;
  let lastPoke = -Infinity;
  let rightclicks = 0;
  let lastRightClick = -Infinity;

  const paint = () => {
    queued = false;
    figure.style.setProperty('--drag-x', `${dragX}px`);
    figure.style.setProperty('--drag-y', `${dragY}px`);
  };
  const schedule = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(paint);
    }
  };

  // An image inside a button is natively draggable, and the native drag cancels
  // the pointer sequence the moment it starts.
  wizard.addEventListener('dragstart', event => event.preventDefault());

  wizard.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    dragging = true;
    moved = false;
    complained = false;
    said = false;
    originX = event.clientX;
    originY = event.clientY;
    figure.classList.add('is-dragging');
    wizard.setPointerCapture?.(event.pointerId);
    clearTimeout(holdTimer);
    holdTimer = setTimeout(() => {
      if (!dragging || moved) return;
      said = true;
      say('hold', 'is-pleased');
    }, HELD);
  });

  wizard.addEventListener('pointermove', event => {
    if (!dragging) return;
    dragX = event.clientX - originX;
    dragY = event.clientY - originY;
    const travel = Math.hypot(dragX, dragY);
    if (!moved && travel > THRESHOLD) {
      moved = true;
      clearTimeout(holdTimer);
      say('drag', 'is-pleased');
    }
    if (moved && !complained && travel > TOO_FAR) {
      complained = true;
      say('far', 'is-flinched');
    }
    schedule();
  });

  const release = event => {
    if (!dragging) return;
    dragging = false;
    clearTimeout(holdTimer);
    figure.classList.remove('is-dragging');
    if (wizard.hasPointerCapture?.(event.pointerId)) wizard.releasePointerCapture(event.pointerId);
    dragX = 0;
    dragY = 0;
    schedule();
  };
  wizard.addEventListener('pointerup', release);
  wizard.addEventListener('pointercancel', release);

  wizard.addEventListener('click', event => {
    if (moved) {
      moved = false;
      return;
    }
    if (said) {
      said = false;
      return;
    }
    // A click with no pointer coordinates is a keyboard activation, not a tap on
    // a part of the artwork: `detail` is 0 for Enter and Space. Without this the
    // region lookup runs at (0, 0) and only misses by accident of layout.
    const fromKeyboard = event.detail === 0;
    const region = fromKeyboard ? undefined : regionAt(event);
    if (region) {
      say(region, 'is-pleased');
      return;
    }
    const now = performance.now();
    pokes = now - lastPoke < POKE_WINDOW ? pokes + 1 : 0;
    lastPoke = now;
    if (pokes > 0) say('poke', 'is-pleased', pokes - 1);
    else if (!greeted) {
      greeted = true;
      say('first', 'is-pleased');
    } else say('idle', 'is-pleased');
  });

  // Right-click hurts. The menu is suppressed only over the figure.
  wizard.addEventListener('contextmenu', event => {
    event.preventDefault();
    const now = performance.now();
    rightclicks = now - lastRightClick < POKE_WINDOW * 2 ? rightclicks + 1 : 0;
    lastRightClick = now;
    say('rightclick', 'is-flinched', rightclicks);
  });

  if (!canFollow) return;

  // A press that just sits there is its own gesture, and it is not a click.
  let box = scene.getBoundingClientRect();
  let stale = false;
  let gazeX = 0;
  let gazeY = 0;
  let gazeQueued = false;

  const draw = () => {
    gazeQueued = false;
    figure.style.setProperty('--gaze-x', gazeX.toFixed(3));
    figure.style.setProperty('--gaze-y', gazeY.toFixed(3));
  };
  const aim = event => {
    // The box is cached: measuring per move forces a style recalculation on every
    // pointer event, which is the usual way this effect janks.
    if (stale) {
      box = scene.getBoundingClientRect();
      stale = false;
    }
    gazeX = Math.max(-1, Math.min(1, (event.clientX - box.left - box.width / 2) / (box.width / 2)));
    gazeY = Math.max(-1, Math.min(1, (event.clientY - box.top - box.height / 2) / (box.height / 2)));
    if (!gazeQueued) {
      gazeQueued = true;
      requestAnimationFrame(draw);
    }
  };
  const rest = () => {
    gazeX = 0;
    gazeY = 0;
    if (!gazeQueued) {
      gazeQueued = true;
      requestAnimationFrame(draw);
    }
  };
  const invalidate = () => {
    stale = true;
  };

  scene.addEventListener('pointermove', aim, { passive: true });
  scene.addEventListener('pointerleave', rest, { passive: true });
  window.addEventListener('resize', invalidate, { passive: true });
  window.addEventListener('scroll', invalidate, { passive: true });
})();
