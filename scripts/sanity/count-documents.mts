process.loadEnvFile(".env.local");
import { createClient } from "@sanity/client";
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: "2025-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});
const counts = await client.fetch(
  `{"staffMember": count(*[_type=="staffMember"]), "service": count(*[_type=="service"]), "blogPost": count(*[_type=="blogPost"]), "legalDocument": count(*[_type=="legalDocument"]), "announcement": count(*[_type=="announcement"]), "doctor": count(*[_type=="doctor"]), "openingHours": count(*[_type=="openingHours"]), "siteSettings": count(*[_type=="siteSettings"]), "total": count(*[])}`,
);
console.log(JSON.stringify(counts, null, 2));
