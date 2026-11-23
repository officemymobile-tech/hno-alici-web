import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";
import { structure, singletonTypes } from "./sanity/structure";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  schema,
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  document: {
    // Prevents the two singleton document types (openingHours, siteSettings)
    // from being deleted or duplicated — they must always exist exactly once.
    // The structure.ts desk config additionally routes editors straight to
    // the single fixed document ID instead of a creatable list.
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter((action) => !["delete", "duplicate"].includes(action.action ?? ""))
        : input,
    newDocumentOptions: (input) => input.filter((item) => !singletonTypes.has(item.templateId)),
  },
});
