// Defaults for every note in this folder. The file name becomes the permanent URL.
import { contributionDefaults } from "../../lib/contribution-defaults.js";

export default {
  layout: "note.njk",
  contribution: true,
  permalink: (data) => (data.published || data.site.show_drafts ? `/notes/${data.page.fileSlug}/` : false),
  eleventyComputed: {
    ...contributionDefaults,
    // Highlight the matching format tab; Editorials belong to "Notes".
    nav: (data) => ({ Brief: "briefs", "Comparative Note": "comparisons" })[data.format] || "notes",
    searchType: (data) => data.format || "Note",
  },
};
