document.addEventListener("DOMContentLoaded", () => {
  const burger = document.querySelector(".nav-burger");
  const menu = document.querySelector(".nav-menu"); // pas aan indien andere class

  if (!burger || !menu) return;

  // Zorg dat hij altijd start als "dicht"
  menu.classList.remove("is-open");
  burger.setAttribute("aria-expanded", "false");

  const closeMenu = () => {
    menu.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  };

  burger.addEventListener("click", (e) => {
    e.preventDefault();
    const open = menu.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // Sluit menu bij klik op een link
  menu.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a) closeMenu();
  });

  // Sluit menu bij klik buiten menu/burger
  document.addEventListener("click", (e) => {
    if (e.target.closest(".nav-menu")) return;
    if (e.target.closest(".nav-burger")) return;
    closeMenu();
  });

  // Sluit menu bij resize naar desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 600) closeMenu();
  });
});

  // Sluit menu bij resize / orientation change
  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 901px)").matches) {
      nav.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      dropdownItems.forEach((d) => d.classList.remove("is-open"));
    }
  });
