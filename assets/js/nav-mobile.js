(function () {
  const burger = document.querySelector(".nav-burger");
  const nav = document.querySelector(".nav-links");
  if (!burger || !nav) return;

  burger.setAttribute("aria-expanded", "false");

  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });

  const dropdownItems = document.querySelectorAll(".nav-item--dropdown");
  dropdownItems.forEach((item) => {
    const btn = item.querySelector(".nav-link--dropdown");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const isOpen = item.classList.toggle("is-open");

      dropdownItems.forEach((other) => {
        if (other !== item) other.classList.remove("is-open");
      });
    });
  });

  nav.querySelectorAll("a.nav-link, a.nav-dropdown-link, a.nav-cta").forEach((a) => {
    a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    });
  });
})();
