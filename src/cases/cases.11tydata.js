// Defaults for every case profile. The URL is derived from the case ID, not the file name,
// so it stays stable even if the file is renamed: PAIR-DEU-BT-001 -> /cases/pair-deu-bt-001/
export default {
  layout: "case.njk",
  nav: "cases",
  contribution: true,
  format: "Case Profile",
  searchType: "Case Profile",
  permalink: (data) => `/cases/${String(data.case_id).toLowerCase()}/`,
  eleventyComputed: {
    // Default author is the editor. (Not set as plain data: Eleventy would merge the arrays.)
    authors: (data) => (data.authors && data.authors.length ? data.authors : [data.site.editor]),
  },
};
