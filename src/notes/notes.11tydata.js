// Defaults for every note in this folder. The file name becomes the permanent URL.
export default {
  layout: "note.njk",
  nav: "notes",
  contribution: true,
  permalink: (data) => `/notes/${data.page.fileSlug}/`,
  eleventyComputed: { searchType: (data) => data.format || "Note" },
};
