(() => {
  "use strict";
  const accents = { cyan: "#6bc9ff", amber: "#ffc870", phosphor: "#89e09d" };
  for (const radio of document.querySelectorAll('input[name="theme"]')) {
    radio.addEventListener("change", () => {
      document.documentElement.style.setProperty("--accent", accents[radio.value]);
    });
  }
  const menu = document.querySelector(".mobile-menu");
  for (const link of menu.querySelectorAll("a")) {
    link.addEventListener("click", () => { menu.open = false; });
  }
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menu.open) {
      menu.open = false;
      menu.querySelector("summary").focus();
    }
  });
})();
