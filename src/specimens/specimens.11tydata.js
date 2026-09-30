// Preview-only layout specimens. Never built for the live site (see eleventy.config.mjs).
import { contributionDefaults } from "../../lib/contribution-defaults.js";

export default {
  contribution: true,
  specimen: true,
  eleventyExcludeFromCollections: ["notes", "cases", "searchable"],
  permalink: (data) => `/specimens/${data.page.fileSlug}/`,
  eleventyComputed: { ...contributionDefaults },
};
