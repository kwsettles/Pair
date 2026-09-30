// Values that are filled in automatically, so that a new post needs only a few fields.
const later = (a, b) => a && b && new Date(a) > new Date(b);

export const contributionDefaults = {
  // Default author is the editor. (Not set as plain data: Eleventy would merge the arrays.)
  authors: (data) => (data.authors && data.authors.length ? data.authors : [data.site.editor]),
  // Status follows the "Published" switch; there is no separate status field to keep in sync.
  status: (data) => (data.withdrawn ? "Withdrawn" : data.published ? (later(data.updated, data.page.date) ? "Updated" : "Published") : "Draft"),
  version: (data) => String(data.version || (data.published ? "1.0" : "0.1")),
  excerpt: (data) => data.excerpt || data.standfirst || data.summary || data.description || "",
  versions: (data) => (data.versions && data.versions.length
    ? data.versions
    : [{ version: String(data.version || (data.published ? "1.0" : "0.1")), date: data.page.date, change: data.published ? "First published." : "Draft." }]),
};
