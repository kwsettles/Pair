// Defaults for every note in this folder. The file name becomes the permanent URL.
export default {
  layout: "note.njk",
  contribution: true,
  permalink: (data) => `/notes/${data.page.fileSlug}/`,
  eleventyComputed: {
    // Highlight the matching format tab; Editorials belong to "Notes".
    nav: (data) => ({ Brief: "briefs", "Comparative Note": "comparisons" })[data.format] || "notes",
    // Default author is the editor. (Not set as plain data: Eleventy would merge the arrays.)
    authors: (data) => (data.authors && data.authors.length ? data.authors : [data.site.editor]), searchType: (data) => data.format || "Note" },
};
