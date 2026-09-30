// Monthly issues of PAIR Monthly. File name = month, e.g. 2026-10.md -> /newsletter/2026-10/
export default {
  layout: "issue.njk",
  nav: "none",
  permalink: (data) => (data.published || data.site.show_drafts ? `/newsletter/${data.page.fileSlug}/` : false),
  eleventyComputed: {
    month: (data) => data.month || data.page.fileSlug,
    title: (data) => data.title || `${data.site.newsletter.name}, ${new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date((data.month || data.page.fileSlug) + "-01"))}`,
  },
};
