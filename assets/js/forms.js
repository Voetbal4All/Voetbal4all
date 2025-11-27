
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("form").forEach(form => {
    form.addEventListener("submit", e => {
      e.preventDefault();
      alert("Bedankt! Je formulier werd verzonden (demo-modus).");
    });
  });
});
