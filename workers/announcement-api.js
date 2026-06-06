/**
 * Cloudflare Worker: speichert Mitteilungen in GitHub (ohne GitHub-Login für die Ordination).
 *
 * Geheimnisse im Cloudflare Dashboard setzen:
 * - ADMIN_PASSWORD       Passwort für das Ordinationsteam
 * - GITHUB_PAT           Fine-grained PAT (Contents: Read and write, nur dieses Repo)
 * - GITHUB_OWNER         z. B. officemymobile-tech
 * - GITHUB_REPO          z. B. hno-alici-web
 * - GITHUB_FILE_PATH     z. B. src/content/announcements.json
 */

const ALLOWED_ORIGINS = [
  "https://hno-alici.at",
  "https://www.hno-alici.at",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function json(data, status, request, env) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(request, env),
    },
  });
}

async function githubFile(env) {
  const owner = env.GITHUB_OWNER;
  const repo = env.GITHUB_REPO;
  const path = env.GITHUB_FILE_PATH || "src/content/announcements.json";
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${env.GITHUB_PAT}`,
      "User-Agent": "hno-alici-announcement-worker",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (res.status === 404) {
    return { content: null, sha: null };
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub read failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  const decoded = JSON.parse(atob(data.content.replace(/\n/g, "")));
  return { content: decoded, sha: data.sha };
}

async function githubWrite(env, announcement, sha) {
  const owner = env.GITHUB_OWNER;
  const repo = env.GITHUB_REPO;
  const path = env.GITHUB_FILE_PATH || "src/content/announcements.json";
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const body = JSON.stringify(announcement, null, 2) + "\n";
  const bytes = new TextEncoder().encode(body);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  const content = btoa(binary);

  const payload = {
    message: "Mitteilung aktualisiert (Ordinations-Admin)",
    content,
    committer: {
      name: "HNO Alici Admin",
      email: "admin@hno-alici.at",
    },
  };
  if (sha) payload.sha = sha;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${env.GITHUB_PAT}`,
      "User-Agent": "hno-alici-announcement-worker",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub write failed: ${res.status} ${text}`);
  }

  return announcement;
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

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, "") || "/";

    try {
      if (request.method === "GET" && (path === "" || path === "/" || path === "/current")) {
        const { content } = await githubFile(env);
        return json(content || {}, 200, request, env);
      }

      if (request.method === "POST" && path === "/update") {
        const body = await request.json();
        if (!body?.password || body.password !== env.ADMIN_PASSWORD) {
          return json({ error: "Falsches Passwort." }, 401, request, env);
        }

        const announcement = sanitizeAnnouncement(body.announcement);
        const { sha } = await githubFile(env);
        await githubWrite(env, announcement, sha);
        return json({ ok: true, announcement }, 200, request, env);
      }

      return json({ error: "Not found" }, 404, request, env);
    } catch (err) {
      return json({ error: err.message || "Server error" }, 500, request, env);
    }
  },
};
