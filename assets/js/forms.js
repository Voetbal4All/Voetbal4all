
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
