
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
    loadJson("data/events.json")
  ]);

  const homePremVac = document.getElementById("home-premium-vacatures");
  if (homePremVac) {
    const premiumVac = vacatures.filter(
      (v) => v.premium === true || v.premium === "standard"
    );
    if (premiumVac.length) {
      premiumVac.slice(0, 5).forEach((v) => {
        homePremVac.appendChild(
          makeListItem(
            (v.functie || "Vacature") + " - " + (v.club || ""),
            [v.land, v.regio, v.niveau].filter(Boolean).join(" · "),
            "Premium-vacature"
          )
        );
      });
    } else {
      homePremVac.textContent = "Nog geen premium clubvacatures.";
    }
  }

  const homePremEv = document.getElementById("home-premium-events");
  if (homePremEv) {
    const premiumEv = events.filter(
      (ev) =>
        ev.premium === true ||
        ev.premium === "standard" ||
        ev.premium === "late" ||
        ev.premium === "combo"
    );
    if (premiumEv.length) {
      premiumEv.slice(0, 5).forEach((ev) => {
        homePremEv.appendChild(
          makeListItem(
            ev.titel || "Event",
            [ev.club, ev.land, ev.regio].filter(Boolean).join(" · "),
            "Premium-event"
          )
        );
      });
    } else {
      homePremEv.textContent = "Nog geen premium events.";
    }
  }

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

  const homeEv = document.getElementById("home-events-weekend");
  if (homeEv && events.length) {
    homeEv.textContent = "Events van dit weekend worden hier later automatisch getoond.";
  }

  const vacL = document.getElementById("vacatures-lijst");
  if (vacL && vacatures.length) {
    vacatures.forEach((v) => {
      vacL.appendChild(
        makeListItem(
          (v.functie || "Vacature") + " - " + (v.club || ""),
          [v.land, v.regio, v.niveau].filter(Boolean).join(" · "),
          v.premium === true || v.premium === "standard"
            ? "Premium-vacature"
            : ""
        )
      );
    });
  }

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
