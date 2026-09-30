// Preview-only layout specimens. Never built for the live site (see eleventy.config.mjs).
export default {
  contribution: true,
  specimen: true,
  eleventyExcludeFromCollections: ["notes", "cases", "searchable"],
  permalink: (data) => `/specimens/${data.page.fileSlug}/`,
  eleventyComputed: {
    // Default author is the editor. (Not set as plain data: Eleventy would merge the arrays.)
    authors: (data) => (data.authors && data.authors.length ? data.authors : [data.site.editor]),
  },
};
