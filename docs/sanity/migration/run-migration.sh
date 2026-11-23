#!/bin/sh
# Sanity content migration — Dr. Alici website
# NOT executed automatically. Run manually, in this repo's root, only after
# explicit approval, with the Sanity CLI already authenticated
# (the same `npx sanity ...` session used throughout this project).
#
# Idempotent by design: every document below has a fixed, deterministic _id
# (same convention as the already-migrated doctor.dr-uemit-alici,
# staffMember.*, service.* documents). `--missing` means "create only if
# this exact ID doesn't already exist — never modify an existing document."
# Running this script twice, or after a partial failure, is safe: it will
# simply skip whatever was already created.
#
# Target dataset: production (qhrodl8k). Change -d if you want to dry-run
# against the isolated "test" dataset first (create it with
# `npx sanity dataset create test --visibility private` beforehand).

set -e
cd "$(dirname "$0")"

PROJECT="qhrodl8k"
DATASET="${1:-production}"

echo "Migrating into dataset: $DATASET"
echo "--- 1/4: doctors (Dr. Sigrid Meier, Dr. Benjamin Alici) ---"
npx sanity documents create 01-doctors.json --project "$PROJECT" --dataset "$DATASET" --missing

echo "--- 2/4: review platforms (Google, DocFinder, Herold) ---"
npx sanity documents create 02-review-platforms.json --project "$PROJECT" --dataset "$DATASET" --missing

echo "--- 3/4: patient reviews (6 real reviews) ---"
npx sanity documents create 03-patient-reviews.json --project "$PROJECT" --dataset "$DATASET" --missing

echo "--- 4/4: SEO landing pages (2 bilingual documents) ---"
npx sanity documents create 04-landing-pages.json --project "$PROJECT" --dataset "$DATASET" --missing

echo "Done. Verify with:"
echo "  npx sanity documents query '*[_type in [\"doctor\",\"reviewPlatform\",\"patientReview\",\"landingPage\"]]{_id,_type}' --project $PROJECT --dataset $DATASET"
