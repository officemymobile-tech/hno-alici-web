/**
 * Cloudflare Worker: Ordinations-Admin (Mitteilungen, Texte, Bilder) → GitHub API
 *
 * Geheimnisse: ADMIN_PASSWORD, GITHUB_PAT, GITHUB_OWNER, GITHUB_REPO
 */

const ALLOWED_ORIGINS = [
  "https://hno-alici.at",
  "https://www.hno-alici.at",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

const ANNOUNCEMENT_PATH = "src/content/announcements.json";
const CONTENT_PATH = "src/content/site-editable.json";
const UPLOAD_DIR = "public/images/uploads";
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const EDITABLE_IMAGE_KEYS = new Set([
  "ordinationHero",
  "drAliciPortrait",
  "teamFrAlici",
  "leistungenOverview",
]);

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function json(data, status, request) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(request),
    },
  });
}

function githubHeaders(env) {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${env.GITHUB_PAT}`,
    "User-Agent": "hno-alici-cms-worker",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

async function githubReadPath(env, path) {
  const owner = env.GITHUB_OWNER;
  const repo = env.GITHUB_REPO;
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const res = await fetch(url, { headers: githubHeaders(env) });

  if (res.status === 404) {
    return { content: null, sha: null, isBinary: false };
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub read failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  const isBinary = path.match(/\.(jpg|jpeg|png|webp|gif)$/i);
  if (isBinary) {
    return { content: data.content, sha: data.sha, isBinary: true };
  }

  const decoded = JSON.parse(atob(data.content.replace(/\n/g, "")));
  return { content: decoded, sha: data.sha, isBinary: false };
}

function encodeUtf8(text) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

async function githubWritePath(env, path, contentB64, sha, message) {
  const owner = env.GITHUB_OWNER;
  const repo = env.GITHUB_REPO;
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const payload = {
    message,
    content: contentB64,
    committer: {
      name: "HNO Alici Admin",
      email: "admin@hno-alici.at",
    },
  };
  if (sha) payload.sha = sha;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      ...githubHeaders(env),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub write failed: ${res.status} ${text}`);
  }

  return res.json();
}

async function githubWriteJson(env, path, obj, sha, message) {
  const body = JSON.stringify(obj, null, 2) + "\n";
  return githubWritePath(env, path, encodeUtf8(body), sha, message);
}

function checkPassword(body, env) {
  return body?.password && body.password === env.ADMIN_PASSWORD;
}

function sanitizeLocalized(input, max = 2000) {
  return {
    de: String(input?.de || "").slice(0, max),
    tr: String(input?.tr || "").slice(0, max),
  };
}

function sanitizeAnnouncement(input) {
  const variant = ["info", "warning", "urgent"].includes(input?.variant)
    ? input.variant
    : "info";

  return {
    active: Boolean(input?.active),
    variant,
    title: {
      de: String(input?.title?.de || "").slice(0, 120),
      tr: String(input?.title?.tr || "").slice(0, 120),
    },
    text: {
      de: String(input?.text?.de || "").slice(0, 500),
      tr: String(input?.text?.tr || "").slice(0, 500),
    },
    link: {
      url: String(input?.link?.url || "").slice(0, 300),
      label: {
        de: String(input?.link?.label?.de || "").slice(0, 80),
        tr: String(input?.link?.label?.tr || "").slice(0, 80),
      },
    },
    validUntil: input?.validUntil ? String(input.validUntil).slice(0, 10) : null,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}

function sanitizeEditableContent(input, existing = null) {
  const texts = input?.texts || {};
  const existingTexts = existing?.texts || {};

  const sanitizeSection = (section, keys, max = 2000) => {
    const out = { ...(existingTexts[section] || {}) };
    for (const key of keys) {
      if (texts[section]?.[key]) {
        out[key] = sanitizeLocalized(texts[section][key], max);
      }
    }
    return out;
  };

  const staff = Array.isArray(input?.team?.staff)
    ? input.team.staff.slice(0, 30).map((m) => ({
        name: String(m?.name || "").slice(0, 80),
        role: sanitizeLocalized(m?.role, 120),
      }))
    : existing?.team?.staff || [];

  const images = { ...(existing?.images || {}) };
  if (input?.images && typeof input.images === "object") {
    for (const key of EDITABLE_IMAGE_KEYS) {
      if (input.images[key]) {
        const path = String(input.images[key]).slice(0, 200);
        if (path.startsWith("/images/")) images[key] = path;
      }
    }
  }

  return {
    updatedAt: new Date().toISOString().slice(0, 10),
    texts: {
      hero: sanitizeSection("hero", ["eyebrow", "title", "subtitle", "tagline"], 200),
      about: sanitizeSection("about", ["title", "intro", "philosophy"], 2000),
      hours: sanitizeSection("hours", [
        "mondayHours",
        "tuesdayHours",
        "wednesdayHours",
        "thursdayHours",
        "fridayHours",
      ], 80),
    },
    images,
    team: { staff },
  };
}

function extFromMime(mime) {
  if (mime === "image/jpeg") return "jpg";
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  return null;
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, "") || "/";

    try {
      // —— Mitteilungen (bestehend) ——
      if (request.method === "GET" && (path === "" || path === "/" || path === "/current")) {
        const filePath = env.GITHUB_FILE_PATH || ANNOUNCEMENT_PATH;
        const { content } = await githubReadPath(env, filePath);
        return json(content || {}, 200, request);
      }

      if (request.method === "POST" && path === "/update") {
        const body = await request.json();
        if (!checkPassword(body, env)) {
          return json({ error: "Falsches Passwort." }, 401, request);
        }
        const announcement = sanitizeAnnouncement(body.announcement);
        const filePath = env.GITHUB_FILE_PATH || ANNOUNCEMENT_PATH;
        const { sha } = await githubReadPath(env, filePath);
        await githubWriteJson(env, filePath, announcement, sha, "Mitteilung aktualisiert (Ordinations-Admin)");
        return json({ ok: true, announcement }, 200, request);
      }

      // —— Website-Inhalte (Texte + Team) ——
      if (request.method === "GET" && path === "/content") {
        const { content } = await githubReadPath(env, CONTENT_PATH);
        return json(content || {}, 200, request);
      }

      if (request.method === "POST" && path === "/content") {
        const body = await request.json();
        if (!checkPassword(body, env)) {
          return json({ error: "Falsches Passwort." }, 401, request);
        }

        const { content: existing } = await githubReadPath(env, CONTENT_PATH);
        const merged = sanitizeEditableContent(
          {
            texts: body.content?.texts || {},
            images: body.content?.images || {},
            team: body.content?.team || existing?.team,
          },
          existing,
        );

        const { sha } = await githubReadPath(env, CONTENT_PATH);
        await githubWriteJson(env, CONTENT_PATH, merged, sha, "Website-Inhalte aktualisiert (Ordinations-Admin)");
        return json({ ok: true, content: merged }, 200, request);
      }

      // —— Bild-Upload ——
      if (request.method === "POST" && path === "/upload-image") {
        const body = await request.json();
        if (!checkPassword(body, env)) {
          return json({ error: "Falsches Passwort." }, 401, request);
        }

        const field = String(body.field || "");
        if (!EDITABLE_IMAGE_KEYS.has(field)) {
          return json({ error: "Ungültiges Bildfeld." }, 400, request);
        }

        const mime = String(body.contentType || "");
        const ext = extFromMime(mime);
        if (!ext) {
          return json({ error: "Nur JPG, PNG oder WebP erlaubt." }, 400, request);
        }

        const b64 = String(body.dataBase64 || "").replace(/^data:[^;]+;base64,/, "");
        if (!b64) {
          return json({ error: "Keine Bilddaten." }, 400, request);
        }

        const rawLen = Math.floor((b64.length * 3) / 4);
        if (rawLen > MAX_IMAGE_BYTES) {
          return json({ error: "Bild zu groß (max. 4 MB)." }, 400, request);
        }

        const stamp = new Date().toISOString().slice(0, 10);
        const imagePath = `${UPLOAD_DIR}/${field}-${stamp}.${ext}`;
        const publicUrl = `/images/uploads/${field}-${stamp}.${ext}`;

        const { sha: imgSha } = await githubReadPath(env, imagePath);
        await githubWritePath(
          env,
          imagePath,
          b64,
          imgSha,
          `Bild ${field} aktualisiert (Ordinations-Admin)`,
        );

        const { content: existing, sha: contentSha } = await githubReadPath(env, CONTENT_PATH);
        const merged = sanitizeEditableContent(
          { images: { [field]: publicUrl } },
          existing,
        );
        await githubWriteJson(
          env,
          CONTENT_PATH,
          merged,
          contentSha,
          `Bildverweis ${field} aktualisiert (Ordinations-Admin)`,
        );

        return json({ ok: true, field, url: publicUrl, content: merged }, 200, request);
      }

      return json({ error: "Not found" }, 404, request);
    } catch (err) {
      return json({ error: err.message || "Server error" }, 500, request);
    }
  },
};
