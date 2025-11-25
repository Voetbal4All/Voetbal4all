
// Placeholder voor toekomstige form-afhandeling (mail, API, logging, ...)
// Voor nu voorkomen we een volledige pagina-refresh bij testen.

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("form").forEach(form => {
    form.addEventListener("submit", e => {
      // Later vervangen door echte submit (bijv. naar backend / serverless functie)
      console.log("Formulier verzonden (dummy):", form.id || form.getAttribute("id"));
      // e.preventDefault(); // Uncomment als je test zonder pagina-refresh
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const successEl = document.getElementById("contact-success");

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault(); // geen echte backend nu
      // eventueel later: fetch naar API

      contactForm.reset();
      if (successEl) {
        successEl.style.display = "block";
      }
    });
  }
});
