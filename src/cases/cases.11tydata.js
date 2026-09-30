// Defaults for every case profile. The URL is derived from the case ID, not the file name,
// so it stays stable even if the file is renamed: PAIR-DEU-BT-001 -> /cases/pair-deu-bt-001/
import { contributionDefaults } from "../../lib/contribution-defaults.js";

export default {
  layout: "case.njk",
  nav: "cases",
  contribution: true,
  format: "Case Profile",
  searchType: "Case Profile",
  permalink: (data) => (data.published || data.site.show_drafts ? `/cases/${String(data.case_id).toLowerCase()}/` : false),
  eleventyComputed: { ...contributionDefaults },
};
