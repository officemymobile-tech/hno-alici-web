import { createClient } from "next-sanity";
import { readFileSync } from "fs";

// Minimal, self-contained .env.local reader (avoids pulling in dotenv as a
// new dependency for a one-off verification script).
const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET;
const token = env.SANITY_API_TOKEN;

const writeClient = createClient({ projectId, dataset, apiVersion: "2025-01-01", token, useCdn: false });
const publicClient = createClient({ projectId, dataset, apiVersion: "2025-01-01", useCdn: false, perspective: "published" });

async function main() {
  console.log("=== 1. WRITE: create siteSettings + staffMember ===");
  await writeClient.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    name: "Dr. Ümit Alici",
    phone: "+4316025400",
    email: "ordination@hno-alici.at",
  });
  const staff = await writeClient.create({
    _type: "staffMember",
    name: "Frau Ruzica Tadic",
    role: { de: "Ordinationsmanagerin", tr: "Muayenehane Müdürü" },
    order: 0,
    active: true,
  });
  console.log("Created staffMember _id:", staff._id);

  console.log("\n=== 2. READ (published perspective, no token) ===");
  const settings = await publicClient.fetch(`*[_id == "siteSettings"][0]{name, phone, email}`);
  const staffRead = await publicClient.fetch(`*[_type == "staffMember" && _id == $id][0]{name, role}`, { id: staff._id });
  console.log("siteSettings:", JSON.stringify(settings));
  console.log("staffMember:", JSON.stringify(staffRead));
  if (!settings?.name || !staffRead?.name) throw new Error("READ CHECK FAILED — seeded documents not readable");
  console.log("READ CHECK: PASS");

  console.log("\n=== 3. WRITE (edit + publish) ===");
  await writeClient.patch(staff._id).set({ role: { de: "Ordinationsmanagerin (aktualisiert)", tr: "Muayenehane Müdürü (güncellendi)" } }).commit();
  const staffAfterEdit = await publicClient.fetch(`*[_type == "staffMember" && _id == $id][0]{role}`, { id: staff._id });
  console.log("staffMember role after edit:", JSON.stringify(staffAfterEdit));
  if (staffAfterEdit?.role?.de !== "Ordinationsmanagerin (aktualisiert)") throw new Error("WRITE CHECK FAILED — edit not reflected");
  console.log("WRITE CHECK: PASS");

  console.log("\n=== 4. DRAFT SAFETY: create a draft-only announcement, confirm published perspective can't see it ===");
  const draftId = "drafts.verify-announcement-test";
  await writeClient.createOrReplace({
    _id: draftId,
    _type: "announcement",
    title: { de: "DRAFT ONLY — sollte nie live gehen" },
    text: { de: "Dies ist ein unveröffentlichter Entwurf zur Verifikation." },
    variant: "info",
    active: true,
  });
  const draftLeak = await publicClient.fetch(`*[_type == "announcement" && title.de match "DRAFT ONLY*"]`);
  console.log("Draft-perspective leak check (should be empty array):", JSON.stringify(draftLeak));
  if (draftLeak.length !== 0) throw new Error("DRAFT SAFETY CHECK FAILED — draft leaked into published perspective");
  console.log("DRAFT SAFETY CHECK: PASS");

  console.log("\n=== 5. Publish the draft, confirm it now appears ===");
  const publishedId = draftId.replace("drafts.", "");
  await writeClient.createOrReplace({ ...(await writeClient.getDocument(draftId)), _id: publishedId });
  await writeClient.delete(draftId);
  const nowPublished = await publicClient.fetch(`*[_type == "announcement" && _id == $id][0]{title}`, { id: publishedId });
  console.log("After publish:", JSON.stringify(nowPublished));
  if (!nowPublished) throw new Error("PUBLISH CHECK FAILED");
  console.log("PUBLISH CHECK: PASS");

  console.log("\n=== 6. Cleanup test documents ===");
  await writeClient.delete(staff._id);
  await writeClient.delete(publishedId);
  console.log("Cleaned up staffMember and announcement test docs. siteSettings document kept (will be the real singleton).");

  console.log("\nALL CHECKS PASSED");
}

main().catch((e) => {
  console.error("VERIFICATION FAILED:", e.message);
  process.exit(1);
});
