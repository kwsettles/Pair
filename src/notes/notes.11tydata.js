// Defaults for every note in this folder. The file name becomes the permanent URL.
export default {
  layout: "note.njk",
  nav: "notes",
  contribution: true,
  permalink: (data) => `/notes/${data.page.fileSlug}/`,
  eleventyComputed: {
    // Default author is the editor. (Not set as plain data: Eleventy would merge the arrays.)
    authors: (data) => (data.authors && data.authors.length ? data.authors : [data.site.editor]), searchType: (data) => data.format || "Note" },
};
