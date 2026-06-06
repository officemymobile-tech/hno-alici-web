(function () {
  const config = window.ADMIN_CONFIG || {};
  const apiUrl = (config.apiUrl || "").replace(/\/$/, "");

  const els = {
    status: document.getElementById("status"),
    form: document.getElementById("form"),
    password: document.getElementById("password"),
    saveBtn: document.getElementById("saveBtn"),
    teamList: document.getElementById("teamList"),
    addTeamBtn: document.getElementById("addTeamBtn"),
  };

  const fields = {
    heroEyebrowDe: "heroEyebrowDe",
    heroEyebrowTr: "heroEyebrowTr",
    heroTitleDe: "heroTitleDe",
    heroTitleTr: "heroTitleTr",
    heroSubtitleDe: "heroSubtitleDe",
    heroSubtitleTr: "heroSubtitleTr",
    heroTaglineDe: "heroTaglineDe",
    heroTaglineTr: "heroTaglineTr",
    aboutTitleDe: "aboutTitleDe",
    aboutTitleTr: "aboutTitleTr",
    aboutIntroDe: "aboutIntroDe",
    aboutIntroTr: "aboutIntroTr",
    aboutPhilosophyDe: "aboutPhilosophyDe",
    aboutPhilosophyTr: "aboutPhilosophyTr",
    hoursMonDe: "hoursMonDe",
    hoursMonTr: "hoursMonTr",
    hoursTueDe: "hoursTueDe",
    hoursTueTr: "hoursTueTr",
    hoursWedDe: "hoursWedDe",
    hoursWedTr: "hoursWedTr",
    hoursThuDe: "hoursThuDe",
    hoursThuTr: "hoursThuTr",
    hoursFriDe: "hoursFriDe",
    hoursFriTr: "hoursFriTr",
  };

  function showStatus(message, ok) {
    els.status.textContent = message;
    els.status.className = "status " + (ok ? "ok" : "err");
    els.status.classList.remove("hidden");
  }

  function teamRow(member, index) {
    const div = document.createElement("div");
    div.className = "img-card";
    div.dataset.index = String(index);
    div.innerHTML =
      '<label class="field"><span>Name</span><input class="team-name" maxlength="80" value="' +
      (member?.name || "").replace(/"/g, "&quot;") +
      '" /></label>' +
      '<div class="grid-2">' +
      '<label class="field"><span>Rolle (DE)</span><input class="team-role-de" maxlength="120" value="' +
      (member?.role?.de || "").replace(/"/g, "&quot;") +
      '" /></label>' +
      '<label class="field"><span>Rolle (TR)</span><input class="team-role-tr" maxlength="120" value="' +
      (member?.role?.tr || "").replace(/"/g, "&quot;") +
      '" /></label></div>' +
      '<button type="button" class="btn btn-ghost team-remove">Entfernen</button>';
    div.querySelector(".team-remove").addEventListener("click", () => div.remove());
    return div;
  }

  function renderTeam(staff) {
    els.teamList.innerHTML = "";
    (staff || []).forEach((m, i) => els.teamList.appendChild(teamRow(m, i)));
    if (!staff?.length) els.teamList.appendChild(teamRow({}, 0));
  }

  function fillForm(data) {
    const t = data.texts || {};
    const h = t.hero || {};
    const a = t.about || {};
    const hrs = t.hours || {};

    document.getElementById("heroEyebrowDe").value = h.eyebrow?.de || "";
    document.getElementById("heroEyebrowTr").value = h.eyebrow?.tr || "";
    document.getElementById("heroTitleDe").value = h.title?.de || "";
    document.getElementById("heroTitleTr").value = h.title?.tr || "";
    document.getElementById("heroSubtitleDe").value = h.subtitle?.de || "";
    document.getElementById("heroSubtitleTr").value = h.subtitle?.tr || "";
    document.getElementById("heroTaglineDe").value = h.tagline?.de || "";
    document.getElementById("heroTaglineTr").value = h.tagline?.tr || "";

    document.getElementById("aboutTitleDe").value = a.title?.de || "";
    document.getElementById("aboutTitleTr").value = a.title?.tr || "";
    document.getElementById("aboutIntroDe").value = a.intro?.de || "";
    document.getElementById("aboutIntroTr").value = a.intro?.tr || "";
    document.getElementById("aboutPhilosophyDe").value = a.philosophy?.de || "";
    document.getElementById("aboutPhilosophyTr").value = a.philosophy?.tr || "";

    document.getElementById("hoursMonDe").value = hrs.mondayHours?.de || "";
    document.getElementById("hoursMonTr").value = hrs.mondayHours?.tr || "";
    document.getElementById("hoursTueDe").value = hrs.tuesdayHours?.de || "";
    document.getElementById("hoursTueTr").value = hrs.tuesdayHours?.tr || "";
    document.getElementById("hoursWedDe").value = hrs.wednesdayHours?.de || "";
    document.getElementById("hoursWedTr").value = hrs.wednesdayHours?.tr || "";
    document.getElementById("hoursThuDe").value = hrs.thursdayHours?.de || "";
    document.getElementById("hoursThuTr").value = hrs.thursdayHours?.tr || "";
    document.getElementById("hoursFriDe").value = hrs.fridayHours?.de || "";
    document.getElementById("hoursFriTr").value = hrs.fridayHours?.tr || "";

    renderTeam(data.team?.staff || []);
  }

  function collectPayload() {
    const staff = [];
    els.teamList.querySelectorAll(".img-card").forEach((row) => {
      const name = row.querySelector(".team-name")?.value.trim();
      if (!name) return;
      staff.push({
        name,
        role: {
          de: row.querySelector(".team-role-de")?.value.trim() || "",
          tr: row.querySelector(".team-role-tr")?.value.trim() || "",
        },
      });
    });

    return {
      texts: {
        hero: {
          eyebrow: { de: document.getElementById("heroEyebrowDe").value.trim(), tr: document.getElementById("heroEyebrowTr").value.trim() },
          title: { de: document.getElementById("heroTitleDe").value.trim(), tr: document.getElementById("heroTitleTr").value.trim() },
          subtitle: { de: document.getElementById("heroSubtitleDe").value.trim(), tr: document.getElementById("heroSubtitleTr").value.trim() },
          tagline: { de: document.getElementById("heroTaglineDe").value.trim(), tr: document.getElementById("heroTaglineTr").value.trim() },
        },
        about: {
          title: { de: document.getElementById("aboutTitleDe").value.trim(), tr: document.getElementById("aboutTitleTr").value.trim() },
          intro: { de: document.getElementById("aboutIntroDe").value.trim(), tr: document.getElementById("aboutIntroTr").value.trim() },
          philosophy: { de: document.getElementById("aboutPhilosophyDe").value.trim(), tr: document.getElementById("aboutPhilosophyTr").value.trim() },
        },
        hours: {
          mondayHours: { de: document.getElementById("hoursMonDe").value.trim(), tr: document.getElementById("hoursMonTr").value.trim() },
          tuesdayHours: { de: document.getElementById("hoursTueDe").value.trim(), tr: document.getElementById("hoursTueTr").value.trim() },
          wednesdayHours: { de: document.getElementById("hoursWedDe").value.trim(), tr: document.getElementById("hoursWedTr").value.trim() },
          thursdayHours: { de: document.getElementById("hoursThuDe").value.trim(), tr: document.getElementById("hoursThuTr").value.trim() },
          fridayHours: { de: document.getElementById("hoursFriDe").value.trim(), tr: document.getElementById("hoursFriTr").value.trim() },
        },
      },
      team: { staff },
    };
  }

  async function loadContent() {
    if (!apiUrl) return;
    try {
      const res = await fetch(apiUrl + "/content");
      if (!res.ok) throw new Error("Laden fehlgeschlagen");
      fillForm(await res.json());
    } catch {
      showStatus("Inhalte konnten nicht geladen werden.", false);
    }
  }

  async function save() {
    if (!apiUrl) {
      showStatus("Admin ist noch nicht eingerichtet (API-URL fehlt).", false);
      return;
    }
    const password = els.password.value;
    if (!password) {
      showStatus("Bitte das Ordinations-Passwort eingeben.", false);
      return;
    }

    els.saveBtn.disabled = true;
    showStatus("Wird gespeichert …", true);

    try {
      const res = await fetch(apiUrl + "/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, content: collectPayload() }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Speichern fehlgeschlagen");
      fillForm(body.content || collectPayload());
      els.password.value = "";
      showStatus("Gespeichert. Die Website aktualisiert sich in ca. 2–3 Minuten.", true);
    } catch (err) {
      showStatus(err.message || "Speichern fehlgeschlagen.", false);
    } finally {
      els.saveBtn.disabled = false;
    }
  }

  els.addTeamBtn.addEventListener("click", () => {
    els.teamList.appendChild(teamRow({}, els.teamList.children.length));
  });

  els.form.addEventListener("submit", (e) => {
    e.preventDefault();
    save();
  });

  if (!apiUrl) {
    showStatus("Techniker muss zuerst den Cloudflare Worker deployen.", false);
    els.form.querySelectorAll("input, textarea, button").forEach((el) => {
      if (el.id !== "password") el.disabled = true;
    });
  } else {
    loadContent();
  }
})();
