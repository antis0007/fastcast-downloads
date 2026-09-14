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

/* The hero figure leans toward the pointer, and can be clicked, dragged and
   right-clicked. Everything visible is either a custom property or a transform
   on the figure, written inside a requestAnimationFrame, so the whole thing is
   one composited layer and never triggers layout or paint. Pointer-follow and
   dragging need a fine pointer and motion enabled; text responses remain
   available to keyboard, touch and reduced-motion visitors. */
const scene = document.querySelector('.cast-scene');
const figure = scene?.querySelector('.cast-figure');
const wizard = scene?.querySelector('.cast-body');
const bubble = scene?.querySelector('.wizard-voice');
const lineSource = document.querySelector('#wizard-voice-lines');
const wizardControls = document.querySelector('.wizard-controls');
const wizardTip = document.querySelector('.wizard-tip');
const wizardAnnouncement = document.querySelector('.wizard-announcement');
const canFollow = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (figure && canFollow) {
  let box = scene.getBoundingClientRect();
  let stale = false;
  let gazeX = 0;
  let gazeY = 0;
  let queued = false;

  const draw = () => {
    queued = false;
    figure.style.setProperty('--gaze-x', gazeX.toFixed(3));
    figure.style.setProperty('--gaze-y', gazeY.toFixed(3));
  };
  const aim = event => {
    // The box is cached: measuring it per move would force a style recalculation
    // on every pointer event, which is the usual way this effect janks.
    if (stale) {
      box = scene.getBoundingClientRect();
      stale = false;
    }
    gazeX = Math.max(-1, Math.min(1, (event.clientX - box.left - box.width / 2) / (box.width / 2)));
    gazeY = Math.max(-1, Math.min(1, (event.clientY - box.top - box.height / 2) / (box.height / 2)));
    if (!queued) { queued = true; requestAnimationFrame(draw); }
  };
  const rest = () => {
    gazeX = 0;
    gazeY = 0;
    if (!queued) { queued = true; requestAnimationFrame(draw); }
  };
  // A scroll or resize moves the scene under a stationary pointer, so the next
  // move has to re-measure before it can aim.
  const invalidate = () => { stale = true; };

  scene.addEventListener('pointermove', aim, { passive: true });
  scene.addEventListener('pointerleave', rest, { passive: true });
  window.addEventListener('resize', invalidate, { passive: true });
  window.addEventListener('scroll', invalidate, { passive: true });
}

/* Each situation has a shuffle bag. Remember the last draw as well, so refilling
   a bag cannot repeat the line the visitor has just read. */
const wizardVoice = (() => {
  if (!figure || !wizard || !bubble || !lineSource) return null;
  let lines;
  try {
    lines = JSON.parse(lineSource.textContent);
  } catch (error) {
    return null;
  }
  const order = {};
  const previous = {};
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const VISIBLE_MS = 8000;
  const FADE_MS = 260;
  let dismissTimer = 0;
  let hideTimer = 0;

  const next = pool => {
    const bag = order[pool] || (order[pool] = []);
    if (!bag.length) {
      bag.push(...lines[pool].map((_, index) => index));
      // Shuffle, so the order is fresh on every pass rather than a fixed cycle.
      for (let i = bag.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
      if (bag.length > 1 && bag[bag.length - 1] === previous[pool]) {
        [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
      }
    }
    previous[pool] = bag.pop();
    return lines[pool][previous[pool]];
  };

  const dismiss = () => {
    clearTimeout(dismissTimer);
    clearTimeout(hideTimer);
    bubble.classList.remove('is-fading');
    bubble.hidden = true;
    if (wizardAnnouncement) wizardAnnouncement.textContent = '';
  };

  const scheduleDismiss = () => {
    clearTimeout(dismissTimer);
    clearTimeout(hideTimer);
    dismissTimer = setTimeout(() => {
      if (reducedMotion) {
        dismiss();
        return;
      }
      bubble.classList.add('is-fading');
      hideTimer = setTimeout(dismiss, FADE_MS);
    }, VISIBLE_MS);
  };

  const say = (pool, mood) => {
    const available = lines[pool];
    if (!available?.length) return false;
    clearTimeout(dismissTimer);
    clearTimeout(hideTimer);
    bubble.classList.remove('is-fading');
    bubble.textContent = next(pool);
    // Which pool a line came from is otherwise invisible, and it is the only way
    // to tell a click line from a drag line once the text is on screen.
    bubble.dataset.pool = pool;
    bubble.hidden = false;
    if (wizardAnnouncement) wizardAnnouncement.textContent = bubble.textContent;
    // Restarting the animation needs the class off for a frame.
    wizard.classList.remove('is-pleased', 'is-thoughtful');
    void wizard.offsetWidth;
    wizard.classList.add(mood);
    // Focusing the artwork or tip button can leave the bubble behind the sticky
    // header. Reveal the text only when necessary; never scroll during a drag.
    if (!figure.classList.contains('is-dragging')) {
      const headerBottom = document.querySelector('.site-header')?.getBoundingClientRect().bottom || 0;
      const box = bubble.getBoundingClientRect();
      if (box.top < headerBottom + 12) {
        window.scrollBy({ top: box.top - headerBottom - 12, behavior: 'instant' });
      } else if (box.bottom > window.innerHeight - 12) {
        window.scrollBy({ top: box.bottom - window.innerHeight + 12, behavior: 'instant' });
      }
    }
    scheduleDismiss();
    return true;
  };

  // The bounce is a one-shot: clear it so the next click can play it again.
  wizard.addEventListener('animationend', () => {
    wizard.classList.remove('is-pleased', 'is-thoughtful');
  });

  return { say, dismiss };
})();

if (wizardVoice) {
  const THRESHOLD = 5;
  // How far he has to be carried before he objects, and how long a press has to
  // be held before he notices it is a hold and not a click.
  const TOO_FAR = 240;
  const HELD = 1100;
  // Rapid clicks inside this window count as poking rather than as separate
  // conversations.
  const POKE_WINDOW = 1100;
  let dragging = false;
  let moved = false;
  let complained = false;
  let originX = 0;
  let originY = 0;
  let dragX = 0;
  let dragY = 0;
  let minDragX = 0;
  let maxDragX = 0;
  let queued = false;
  let holdTimer = 0;
  let said = false;
  let greeted = false;
  let pokes = 0;
  // -Infinity, not 0: on a fast page the first click can land within the poke
  // window of the clock's own zero and be miscounted as a second click.
  let lastPoke = -Infinity;
  let lastActivation = -Infinity;
  // Accidental double-clicks do not burn through the pool or flash new text.
  const acceptActivation = () => {
    const now = performance.now();
    if (now - lastActivation < 650) return false;
    lastActivation = now;
    return true;
  };

  const paint = () => {
    queued = false;
    // Leave room for the lean and flinch at the viewport edge. The aura is no
    // longer clipped, so the figure itself must not widen the page when dragged.
    const visibleDragX = Math.max(minDragX, Math.min(maxDragX, dragX));
    figure.style.setProperty('--drag-x', `${visibleDragX}px`);
    figure.style.setProperty('--drag-y', `${dragY}px`);
  };
  const schedule = () => {
    if (!queued) { queued = true; requestAnimationFrame(paint); }
  };

  // An image inside a button is natively draggable, and the native drag cancels
  // the pointer sequence the moment it starts -- the drag never gets a second
  // move event. Refusing dragstart here keeps the gesture ours.
  wizard.addEventListener('dragstart', event => event.preventDefault());

  wizard.addEventListener('pointerdown', event => {
    // Only a primary mouse/pen press starts a drag. Secondary clicks ask for tips.
    if (!canFollow || event.button !== 0) return;
    dragging = true;
    moved = false;
    complained = false;
    said = false;
    originX = event.clientX;
    originY = event.clientY;
    const figureBox = figure.getBoundingClientRect();
    minDragX = 16 - figureBox.left;
    maxDragX = window.innerWidth - 16 - figureBox.right;
    // Offsets are relative to the resting pose, and the pointer starts on him,
    // so the drag begins from wherever he currently sits.
    figure.classList.add('is-dragging');
    wizard.setPointerCapture?.(event.pointerId);
    // A press that just sits there is its own gesture, and it is not a click.
    clearTimeout(holdTimer);
    holdTimer = setTimeout(() => {
      if (!dragging || moved) return;
      said = true;
      wizardVoice.say('hold', 'is-pleased');
    }, HELD);
  });

  wizard.addEventListener('pointermove', event => {
    if (!dragging) return;
    dragX = event.clientX - originX;
    dragY = event.clientY - originY;
    const travel = Math.hypot(dragX, dragY);
    if (!moved && travel > THRESHOLD) {
      moved = true;
      // A hold that turns into a drag was never a hold.
      clearTimeout(holdTimer);
      wizardVoice.say('drag', 'is-pleased');
    }
    // A gentle request to return home, once per drag.
    if (moved && !complained && travel > TOO_FAR) {
      complained = true;
      wizardVoice.say('far', 'is-thoughtful');
    }
    schedule();
  });

  const release = event => {
    if (!dragging) return;
    dragging = false;
    clearTimeout(holdTimer);
    if (event.type !== 'pointerup') { moved = false; said = false; }
    // The flag lives on the figure, which is what the stylesheet reads.
    figure.classList.remove('is-dragging');
    if (wizard.hasPointerCapture?.(event.pointerId)) wizard.releasePointerCapture(event.pointerId);
    // Handing him back to the transition is what springs him home.
    dragX = 0;
    dragY = 0;
    schedule();
  };
  wizard.addEventListener('pointerup', release);
  wizard.addEventListener('pointercancel', release);
  wizard.addEventListener('lostpointercapture', release);

  // Three regions of the artwork, measured off a render of it as fractions of his
  // own box -- guessed coordinates put the hat on empty background and the beard
  // on his face, which is why they are checked against a picture and not by eye.
  // Nothing marks any of them as targets: they are found by being curious rather
  // than by being told. Beard is tested first because it abuts the hat.
  const REGIONS = [
    { pool: 'beard', left: 0.26, right: 0.42, top: 0.44, bottom: 0.66 },
    { pool: 'hat', left: 0.15, right: 0.50, top: 0.02, bottom: 0.32 },
    { pool: 'orb', left: 0.58, right: 0.82, top: 0.40, bottom: 0.68 },
  ];
  const regionAt = event => {
    // Keyboard activation has no position within the artwork.
    if (event.detail === 0) return undefined;
    const box = wizard.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    const hit = REGIONS.find(
      region => x > region.left && x < region.right && y > region.top && y < region.bottom
    );
    return hit?.pool;
  };

  // A press that never really moved is a click, so the two share one gesture.
  wizard.addEventListener('click', event => {
    if (moved) { moved = false; return; }
    // Holding on and letting go is not a click either; he already said his piece.
    if (said) { said = false; return; }
    if (!acceptActivation()) return;
    if (!greeted) {
      greeted = true;
      lastPoke = performance.now();
      wizardVoice.say('first', 'is-pleased');
      return;
    }
    const region = regionAt(event);
    // A region whose dialogue was cut still behaves like an ordinary click.
    if (region && wizardVoice.say(region, 'is-pleased')) return;
    const now = performance.now();
    pokes = now - lastPoke < POKE_WINDOW ? pokes + 1 : 0;
    lastPoke = now;
    // A pause returns to conversation; continued pokes get a mild reaction.
    if (pokes > 0) wizardVoice.say('poke', 'is-pleased');
    else wizardVoice.say('idle', 'is-pleased');
  });

  const offerTip = () => {
    if (acceptActivation()) wizardVoice.say('rightclick', 'is-thoughtful');
  };
  // Shift-right-click retains the browser menu. The visible button offers the
  // same tips on touch screens and without requiring a keyboard shortcut.
  wizard.addEventListener('contextmenu', event => {
    if (event.shiftKey) return;
    event.preventDefault();
    offerTip();
  });
  wizardTip?.addEventListener('click', offerTip);
  if (wizardControls) wizardControls.hidden = false;
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') wizardVoice.dismiss();
  });
  document.addEventListener('pointerdown', event => {
    if (!figure.contains(event.target) && !wizardControls?.contains(event.target)) wizardVoice.dismiss();
  });
}
