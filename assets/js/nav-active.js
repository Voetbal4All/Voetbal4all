(() => {
  "use strict";

  function normPath(p) {
    try { return (p || "").split("#")[0].split("?")[0].trim(); }
    catch (_) { return (p || "").trim(); }
  }

  function currentFile() {
    const p = normPath(window.location.pathname || "");
    const last = (p.split("/").filter(Boolean).pop() || "");
    return last || "index.html";
  }

  document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector(".nav-links");
    if (!nav) return;

    const links = Array.from(nav.querySelectorAll("a.nav-link"));
    if (!links.length) return;

    // verwijder hardcoded active overal
    links.forEach(a => a.classList.remove("nav-link--active"));

    const cur = currentFile();

    let hit = null;
    for (const a of links) {
      const href = normPath(a.getAttribute("href") || "");
      const file = (href.split("/").filter(Boolean).pop() || "");
      if (!file) continue;

      if ((cur === "" || cur === "index.html") && (file === "index.html" || file === "/")) { hit = a; break; }
      if (file === cur) { hit = a; break; }
    }

    if (!hit && (cur === "" || cur === "index.html")) {
      hit = links.find(a => normPath(a.getAttribute("href") || "").endsWith("index.html")) || null;
    }

    if (hit) hit.classList.add("nav-link--active");
  });
})();
