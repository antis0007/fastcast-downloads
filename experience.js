(() => {
  "use strict";
  const byId = (id) => document.getElementById(id);
  const demo = byId("demo");
  const content = byId("channel-content");
  const input = byId("message-input");
  const conversation = content.innerHTML;
  const scenery = byId("session-art").innerHTML;
  const channels = {
    home: { title: "Home", description: "Your people, and what’s happening." },
    general: { title: "# General", description: "The everyday conversation." },
    media: { title: "Media", description: "Things worth sharing, kept with their context." },
    plans: { title: "Plans", description: "Make a small plan. Keep everyone in the loop." },
    files: { title: "Files", description: "The original, its sender, and the conversation." },
  };
  const state = { channel: "general", session: "idle", source: "landscape", choosingSource: false, playing: false, appreciated: false, attending: false, drafts: { general: "", media: "" }, messages: { general: [], media: [] } };
  const preference = matchMedia("(prefers-reduced-motion: reduce)");
  let visible = true;

  function feedback(message) { byId("community-feedback").textContent = message; }
  function renderChannel() {
    const channel = channels[state.channel];
    byId("channel-title").textContent = channel.title;
    byId("channel-description").textContent = channel.description;
    for (const button of demo.querySelectorAll("[data-channel]")) {
      if (button.dataset.channel === state.channel) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    }
    if (state.channel === "general") content.innerHTML = conversation;
    if (state.channel === "home") content.innerHTML = `<div class="channel-home"><p class="eyebrow">THE LIVING ROOM / SAMPLE GROUP</p><h3>A little company.</h3><p>Maya is sharing a view. Jordan has a weekend plan. Rin is happy to watch quietly. Come as you are.</p><div class="home-shortcuts"><button data-open-channel="general">Catch up in General <span aria-hidden="true">→</span></button><button data-open-channel="plans">Saturday’s hike <span aria-hidden="true">→</span></button><button data-open-channel="files">Find the route notes <span aria-hidden="true">→</span></button></div></div>`;
    if (state.channel === "media") content.innerHTML = `<div class="channel-media"><h3>Keep the things you share.</h3><p>Sample illustration from Jordan · #General · Today</p><div class="attachment-preview"><span class="attachment-landscape" aria-hidden="true">${scenery}</span><span><strong>weekend-view.svg</strong><small>Original sample artwork</small></span></div><div class="file-actions"><a class="inline-link" href="assets/weekend-view.svg" download>Download sample ↓</a> <button class="inline-link" data-message-link="true">View conversation →</button></div></div>`;
    if (state.channel === "plans") content.innerHTML = `<div class="channel-plan"><p class="eyebrow">SAMPLE PLAN / FROM #GENERAL</p><h3>Saturday, a little outside.</h3><p>An easy walk, a packed lunch, and no rush to get back.</p><div class="plan-detail"><p><strong>When</strong> · Saturday at 10:00</p><p><strong>Meet</strong> · The trail entrance</p><p><strong>Bring</strong> · Water, lunch, a light jacket</p></div><button class="button primary" id="join-plan" aria-pressed="${state.attending}">${state.attending ? "You’re on the plan ✓" : "Count me in"}</button><p class="caption" style="margin-top:12px">${state.attending ? "You + 3 sample attendees. Saved in this tab only." : "3 sample attendees. Try adding yourself."}</p><button class="inline-link" data-open-channel="general">Back to the conversation →</button></div>`;
    if (state.channel === "files") content.innerHTML = `<div class="channel-files"><h3>Shared, and easy to find.</h3><p>These are downloadable sample files. Nothing is uploaded.</p><article class="file-row"><strong>weekend-view.svg</strong><span class="caption">Jordan · #General · Today · SVG illustration</span><div class="file-actions"><a class="inline-link" href="assets/weekend-view.svg" download>Download ↓</a><button class="inline-link" data-message-link="true">View conversation →</button></div></article><article class="file-row"><strong>saturday-plan.txt</strong><span class="caption">Rin · Plans · Today · Text document</span><div class="file-actions"><a class="inline-link" href="assets/saturday-plan.txt" download>Download ↓</a><button class="inline-link" data-open-channel="plans">Open plan →</button></div></article></div>`;
    const canCompose = state.channel === "general" || state.channel === "media";
    byId("message-form").hidden = !canCompose;
    if (canCompose) {
      input.value = state.drafts[state.channel];
      byId("composer-label").textContent = `Message ${channel.title}`;
      for (const message of state.messages[state.channel]) appendMessage(message);
    }
    syncComposer();
  }
  function appendMessage(text) {
    const article = document.createElement("article");
    article.className = "message local-message";
    const avatar = document.createElement("span");
    avatar.className = "avatar you";
    avatar.textContent = "Y";
    avatar.setAttribute("aria-hidden", "true");
    const body = document.createElement("div");
    const header = document.createElement("header");
    const name = document.createElement("strong");
    name.textContent = "You";
    const time = document.createElement("span");
    time.className = "caption";
    time.textContent = "Only in this demo";
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    header.append(name, time);
    body.append(header, paragraph);
    article.append(avatar, body);
    content.append(article);
  }
  function syncComposer() {
    byId("send-message").disabled = !input.value.trim();
    byId("draft-indicator").textContent = input.value ? "Draft · this tab" : "";
  }
  function navigate(channel) {
    if (!channels[channel]) return;
    state.channel = channel;
    renderChannel();
    content.scrollTop = 0;
  }
  function syncMotion() {
    demo.classList.toggle("is-playing", state.playing && visible && !document.hidden && !preference.matches && state.session !== "idle");
  }
  function renderSession() {
    const active = state.session !== "idle" || state.choosingSource;
    byId("session-pane").hidden = !active;
    byId("conversation-layout").classList.toggle("has-session", active);
    byId("session-dock").hidden = state.session === "idle";
    byId("screen-sources").hidden = !state.choosingSource;
    const sharing = state.session === "sharing";
    byId("session-heading").textContent = state.choosingSource ? "Share a sample" : sharing ? "Your sample screen" : "Maya’s screen";
    byId("session-art").innerHTML = (sharing || state.choosingSource) && state.source === "notes"
      ? '<div class="project-note"><strong>Weekend project</strong><p>01 / Pick a route</p><p>02 / Bring something to share</p><p>03 / Leave room for a detour</p></div>' : scenery;
    byId("session-art").setAttribute("aria-label", sharing && state.source === "notes" ? "Sample project notes" : "Sample landscape screen");
    byId("session-source").textContent = sharing ? "Your sample · Visible only in this page" : "Sample screen · No live video";
    byId("watch-session").setAttribute("aria-pressed", String(state.session === "watch"));
    byId("join-session").setAttribute("aria-pressed", String(state.session === "conversation"));
    byId("watch-session").textContent = state.session === "watch" ? "Watching quietly" : "Watch silently";
    byId("join-session").textContent = state.session === "conversation" ? "Leave conversation" : "Join conversation";
    const label = { idle: "Choose a sample · Nothing is captured", watch: "Watching quietly · Microphone off", conversation: "Conversation demo · Microphone stays off", sharing: "Sharing a sample · Microphone off" }[state.session];
    byId("session-mode").textContent = label;
    byId("session-dock-label").textContent = label;
    byId("your-status").textContent = active ? label : "Exploring the demo";
    byId("share-screen").setAttribute("aria-expanded", String(state.choosingSource));
    byId("scene-motion").textContent = state.playing ? "Pause scene" : "Play scene";
    byId("scene-motion").setAttribute("aria-pressed", String(state.playing));
    byId("scene-motion").disabled = preference.matches || state.choosingSource || (sharing && state.source === "notes");
    byId("scene-reaction").textContent = state.appreciated ? "Appreciated ♥" : "Appreciate ♡";
    byId("scene-reaction").setAttribute("aria-pressed", String(state.appreciated));
    for (const button of demo.querySelectorAll("[data-sample]")) button.setAttribute("aria-pressed", String(button.dataset.sample === state.source));
    syncMotion();
  }
  function leave() {
    state.session = "idle";
    state.choosingSource = false;
    state.playing = false;
    renderSession();
    feedback("You left the sample session. Your channel drafts are still here.");
  }
  demo.addEventListener("click", (event) => {
    const target = event.target.closest("button");
    if (!target) return;
    if (target.dataset.channel) navigate(target.dataset.channel);
    if (target.dataset.openChannel) navigate(target.dataset.openChannel);
    if (target.id === "open-sample-media") navigate("media");
    if (target.dataset.messageLink) {
      navigate("general");
      const attachment = byId("open-sample-media");
      attachment.closest(".message").classList.add("message-highlight");
      attachment.focus({ preventScroll: true });
      content.scrollTop = attachment.closest(".message").offsetTop - content.offsetTop;
    }
    if (target.id === "join-plan") {
      state.attending = !state.attending;
      renderChannel();
      byId("join-plan").focus({ preventScroll: true });
      feedback(state.attending ? "Added to the sample plan. This RSVP stays in your tab." : "Removed your sample RSVP.");
    }
    if (target.dataset.sample) { state.source = target.dataset.sample; renderSession(); }
  });
  byId("watch-session").addEventListener("click", () => {
    state.session = "watch"; state.choosingSource = false; renderSession();
    feedback("Watching the sample screen. No microphone or camera is requested.");
  });
  byId("join-session").addEventListener("click", () => {
    if (state.session === "conversation") { leave(); return; }
    state.session = "conversation"; state.choosingSource = false; renderSession();
    feedback("You joined the concept conversation. There is no live call, and your microphone stays off.");
  });
  byId("share-screen").addEventListener("click", () => {
    state.choosingSource = !state.choosingSource;
    renderSession();
    if (state.choosingSource) byId("screen-sources").querySelector("button").focus({ preventScroll: false });
  });
  byId("start-sample-share").addEventListener("click", () => {
    state.session = "sharing"; state.choosingSource = false; state.playing = false; renderSession();
    byId("leave-session").focus({ preventScroll: true });
    feedback("Sharing the selected sample in this page. Your actual screen is not accessed.");
  });
  byId("leave-session").addEventListener("click", () => { leave(); byId("watch-session").focus({ preventScroll: true }); });
  byId("return-session").addEventListener("click", () => { navigate("general"); content.focus({ preventScroll: true }); });
  byId("scene-motion").addEventListener("click", () => { state.playing = !state.playing; renderSession(); });
  byId("scene-reaction").addEventListener("click", () => { state.appreciated = !state.appreciated; renderSession(); });
  input.addEventListener("input", () => { state.drafts[state.channel] = input.value.slice(0, 500); syncComposer(); });
  byId("message-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim().slice(0, 500);
    if (!text || !state.messages[state.channel]) return;
    state.messages[state.channel].push(text);
    if (state.messages[state.channel].length > 16) state.messages[state.channel].shift();
    state.drafts[state.channel] = "";
    renderChannel();
    content.scrollTop = content.scrollHeight;
    input.focus({ preventScroll: true });
    feedback("Message added only to this demo. It is not sent or stored remotely.");
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey) && !event.isComposing) {
      event.preventDefault(); byId("message-form").requestSubmit();
    }
  });
  byId("reset-community").addEventListener("click", () => {
    Object.assign(state, { channel: "general", session: "idle", source: "landscape", choosingSource: false, playing: false, appreciated: false, attending: false, drafts: { general: "", media: "" }, messages: { general: [], media: [] } });
    renderChannel(); renderSession(); content.scrollTop = 0;
    feedback("Demo reset. Sample people and content restored; local messages and drafts cleared.");
  });
  preference.addEventListener("change", () => { if (preference.matches) state.playing = false; renderSession(); });
  document.addEventListener("visibilitychange", syncMotion);
  if ("IntersectionObserver" in window) new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncMotion(); }).observe(demo);
  renderChannel(); renderSession();
})();

(() => {
  "use strict";
  const byId = id => document.getElementById(id);
  const bitrate = byId("bitrate");
  const duration = byId("duration");
  function updateGraph() {
    const rate = Number(bitrate.value);
    const minutes = Number(duration.value);
    const total = rate * 60 * minutes / 8000;
    const maximum = Math.max(45, Math.ceil(total / 45) * 45);
    const endY = (180 - total / maximum * 160).toFixed(2);
    byId("bitrate-value").textContent = `${rate} Mbps`;
    byId("duration-value").textContent = `${minutes} min`;
    byId("payload-total").textContent = `${total.toFixed(2)} GB`;
    byId("graph-time").textContent = `${minutes} min`;
    byId("graph-line").setAttribute("d", `M60 180L565 ${endY}`);
    byId("graph-area").setAttribute("d", `M60 180L565 ${endY}V180Z`);
    byId("payload-graph").querySelector('text[y="24"]').textContent = `${maximum} GB`;
    byId("graph-description").textContent = `${rate} Mbps for ${minutes} minutes is an estimated ${total.toFixed(2)} gigabytes of video payload. Calculation only, excluding audio and overhead.`;
  }
  bitrate.addEventListener("input", updateGraph);
  duration.addEventListener("input", updateGraph);
  updateGraph();
})();
