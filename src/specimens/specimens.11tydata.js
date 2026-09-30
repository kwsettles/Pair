// Preview-only layout specimens. Never built for the live site (see eleventy.config.mjs).
export default {
  contribution: true,
  specimen: true,
  eleventyExcludeFromCollections: ["notes", "cases", "searchable"],
  permalink: (data) => `/specimens/${data.page.fileSlug}/`,
};
