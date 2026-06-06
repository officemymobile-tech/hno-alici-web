(function () {
  const config = window.ADMIN_CONFIG || {};
  const apiUrl = (config.apiUrl || "").replace(/\/$/, "");

  const IMAGE_FIELDS = [
    { key: "ordinationHero", label: "Startseite — Hintergrundfoto", hint: "Breites Querformat, mind. 1600 px" },
    { key: "drAliciPortrait", label: "Porträt Dr. Ümit Alici", hint: "Hochformat, mind. 800 px" },
    { key: "teamFrAlici", label: "Team-Foto Ordination", hint: "Querformat empfohlen" },
    { key: "leistungenOverview", label: "Leistungen — Übersichtsbild", hint: "Querformat empfohlen" },
  ];

  const els = {
    status: document.getElementById("status"),
    imageCards: document.getElementById("imageCards"),
    password: document.getElementById("password"),
  };

  let currentImages = {};

  function showStatus(message, ok) {
    els.status.textContent = message;
    els.status.className = "status " + (ok ? "ok" : "err");
    els.status.classList.remove("hidden");
  }

  function cardHtml(field) {
    const url = currentImages[field.key] || "";
    const src = url ? (url.startsWith("http") ? url : "https://hno-alici.at" + url) : "";
    return (
      '<div class="img-card" data-field="' +
      field.key +
      '">' +
      '<strong>' +
      field.label +
      "</strong>" +
      '<p class="img-meta">' +
      field.hint +
      "</p>" +
      (src
        ? '<img class="img-preview" src="' + src + "?v=" + Date.now() + '" alt="" />'
        : '<p class="img-meta">Noch kein Bild hinterlegt.</p>') +
      '<label class="field"><span>Neues Bild wählen</span><input type="file" accept="image/jpeg,image/png,image/webp" class="file-input" /></label>' +
      '<button type="button" class="btn btn-primary upload-btn">Bild hochladen</button>' +
      "</div>"
    );
  }

  function renderCards() {
    els.imageCards.innerHTML = IMAGE_FIELDS.map(cardHtml).join("");
    els.imageCards.querySelectorAll(".upload-btn").forEach((btn) => {
      btn.addEventListener("click", () => uploadFromCard(btn.closest(".img-card")));
    });
  }

  async function loadImages() {
    if (!apiUrl) return;
    try {
      const res = await fetch(apiUrl + "/content");
      if (!res.ok) throw new Error("Laden fehlgeschlagen");
      const data = await res.json();
      currentImages = data.images || {};
      renderCards();
    } catch {
      showStatus("Bilder konnten nicht geladen werden.", false);
    }
  }

  function readFileAsBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function uploadFromCard(card) {
    if (!apiUrl) {
      showStatus("Admin ist noch nicht eingerichtet.", false);
      return;
    }
    const password = els.password.value;
    if (!password) {
      showStatus("Bitte zuerst das Passwort eingeben.", false);
      return;
    }

    const field = card.dataset.field;
    const fileInput = card.querySelector(".file-input");
    const file = fileInput?.files?.[0];
    if (!file) {
      showStatus("Bitte zuerst ein Bild auswählen.", false);
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      showStatus("Bild zu groß (max. 4 MB).", false);
      return;
    }

    const btn = card.querySelector(".upload-btn");
    btn.disabled = true;
    showStatus("Bild wird hochgeladen …", true);

    try {
      const dataUrl = await readFileAsBase64(file);
      const res = await fetch(apiUrl + "/upload-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password,
          field,
          contentType: file.type,
          dataBase64: dataUrl,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Upload fehlgeschlagen");
      currentImages = body.content?.images || currentImages;
      renderCards();
      fileInput.value = "";
      showStatus("Bild gespeichert. Website aktualisiert sich in ca. 2–3 Minuten.", true);
    } catch (err) {
      showStatus(err.message || "Upload fehlgeschlagen.", false);
    } finally {
      btn.disabled = false;
    }
  }

  if (!apiUrl) {
    showStatus("Techniker muss zuerst den Cloudflare Worker deployen.", false);
  } else {
    loadImages();
  }
})();
