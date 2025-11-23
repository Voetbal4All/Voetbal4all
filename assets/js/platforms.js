(async function () {
  async function loadJson(path) {
    try {
      const resp = await fetch(path, { cache: "no-store" });
      if (!resp.ok) return [];
      const data = await resp.json();
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error("Fout bij laden", path, e);
      return [];
    }
  }

  function makeListItem(title, subtitle, extra) {
    const div = document.createElement("div");
    div.className = "news-card";

    const h3 = document.createElement("h3");
    h3.textContent = title;
    div.appendChild(h3);

    if (subtitle) {
      const p = document.createElement("p");
      p.className = "news-meta";
      p.textContent = subtitle;
      div.appendChild(p);
    }

    if (extra) {
      const p2 = document.createElement("p");
      p2.className = "news-teaser";
      p2.textContent = extra;
      div.appendChild(p2);
    }

    return div;
  }

  const [vacatures, trainers, spelers, events] = await Promise.all([
    loadJson("data/vacatures.json"),
    loadJson("data/trainers.json"),
    loadJson("data/spelers.json"),
    loadJson("data/events.json"),
  ]);

  // Home: trainers
  const homeTr = document.getElementById("home-trainers-lijst");
  if (homeTr && trainers.length) {
    trainers.slice(0, 10).forEach((t) => {
      homeTr.appendChild(
        makeListItem(
          t.naam || "Trainer",
          [t.functie, t.land, t.regio].filter(Boolean).join(" · "),
          t.diploma || ""
        )
      );
    });
  }

  // Home: spelers
  const homeSp = document.getElementById("home-spelers-lijst");
  if (homeSp && spelers.length) {
    spelers.slice(0, 10).forEach((s) => {
      homeSp.appendChild(
        makeListItem(
          s.naam || "Speler",
          [s.leeftijdscategorie, s.positie, s.land]
            .filter(Boolean)
            .join(" · "),
          s.niveau || ""
        )
      );
    });
  }

  // Home: events van dit weekend (alle events, ook niet-premium)
  const homeEv = document.getElementById("home-events-weekend");
  if (homeEv && events.length) {
    const now = new Date();
    const day = now.getDay(); // 0=zo, 6=za
    const diffToSaturday = (6 - day + 7) % 7;
    const saturday = new Date(now);
    saturday.setDate(now.getDate() + diffToSaturday);
    saturday.setHours(0, 0, 0, 0);

    const sunday = new Date(saturday);
    sunday.setDate(saturday.getDate() + 1);
    sunday.setHours(23, 59, 59, 999);

    const weekendEvents = events.filter((ev) => {
      if (!ev.datum) return false;
      const d = new Date(ev.datum);
      return d >= saturday && d <= sunday;
    });

    if (weekendEvents.length) {
      weekendEvents.forEach((ev) => {
        homeEv.appendChild(
          makeListItem(
            ev.titel || "Event",
            [ev.club, ev.land, ev.regio].filter(Boolean).join(" · "),
            ev.type || ""
          )
        );
      });
    } else {
      homeEv.textContent =
        "Er zijn nog geen events voor dit weekend geregistreerd.";
    }
  }

  // Pagina: vacatures
  const vacL = document.getElementById("vacatures-lijst");
  if (vacL && vacatures.length) {
    vacatures.forEach((v) => {
      vacL.appendChild(
        makeListItem(
          (v.functie || "Vacature") + " - " + (v.club || ""),
          [v.land, v.regio, v.niveau].filter(Boolean).join(" · "),
          v.premium === true ? "Premium-vacature" : ""
        )
      );
    });
  }

  // Pagina: trainers
  const trL = document.getElementById("trainers-lijst");
  if (trL && trainers.length) {
    trainers.forEach((t) => {
      trL.appendChild(
        makeListItem(
          t.naam || "Trainer",
          [t.functie, t.land, t.regio].filter(Boolean).join(" · "),
          t.diploma || ""
        )
      );
    });
  }

  // Pagina: spelers
  const spL = document.getElementById("spelers-lijst");
  if (spL && spelers.length) {
    spelers.forEach((s) => {
      spL.appendChild(
        makeListItem(
          s.naam || "Speler",
          [s.leeftijdscategorie, s.positie, s.land]
            .filter(Boolean)
            .join(" · "),
          s.niveau || ""
        )
      );
    });
  }

  // Pagina: events
  const evL = document.getElementById("events-lijst");
  if (evL && events.length) {
    events.forEach((ev) => {
      evL.appendChild(
        makeListItem(
          ev.titel || "Event",
          [ev.club, ev.land, ev.regio].filter(Boolean).join(" · "),
          (ev.type || "") + (ev.premium ? " · Premium" : "")
        )
      );
    });
  }
})();
