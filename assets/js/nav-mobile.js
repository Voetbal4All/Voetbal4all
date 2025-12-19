document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".nav-burger");
  const nav = document.querySelector(".nav-links");
  if (!burger || !nav) return;

  burger.setAttribute("aria-expanded", "false");

  // Menu open/dicht
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // Dropdowns op mobiel (click)
  const dropdownItems = document.querySelectorAll(".nav-item--dropdown");
  dropdownItems.forEach((item) => {
    const btn = item.querySelector(".nav-link--dropdown");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
      // Alleen op mobiel, anders blijft hover gedrag gelden op desktop
      if (window.matchMedia("(min-width: 901px)").matches) return;

      e.preventDefault();
      const isOpen = item.classList.toggle("is-open");

      // Andere dropdowns sluiten
      dropdownItems.forEach((other) => {
        if (other !== item) other.classList.remove("is-open");
      });
    });
  });

  // Menu sluiten bij klik op link
  nav.querySelectorAll("a.nav-link, a.nav-dropdown-link, a.nav-cta").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      dropdownItems.forEach((d) => d.classList.remove("is-open"));
    });
  });
});
