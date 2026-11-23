import type { SchemaTypeDefinition } from "sanity";

import { localeString } from "./objects/localeString";
import { localeText } from "./objects/localeText";
import { timeWindow } from "./objects/timeWindow";

import { doctor } from "./documents/doctor";
import { staffMember } from "./documents/staffMember";
import { openingHours } from "./documents/openingHours";
import { closurePeriod } from "./documents/closurePeriod";
import { announcement } from "./documents/announcement";
import { service } from "./documents/service";
import { blogPost } from "./documents/blogPost";
import { siteSettings } from "./documents/siteSettings";
import { legalDocument } from "./documents/legalDocument";
import { reviewPlatform } from "./documents/reviewPlatform";
import { patientReview } from "./documents/patientReview";
import { landingPage } from "./documents/landingPage";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    localeString,
    localeText,
    timeWindow,
    doctor,
    staffMember,
    openingHours,
    closurePeriod,
    announcement,
    service,
    blogPost,
    siteSettings,
    legalDocument,
    reviewPlatform,
    patientReview,
    landingPage,
  ],
};
