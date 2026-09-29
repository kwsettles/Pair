// Defaults for every note in this folder. The file name becomes the permanent URL.
export default {
  layout: "note.njk",
  nav: "notes",
  searchType: "Note",
  permalink: (data) => `/notes/${data.page.fileSlug}/`,
};
