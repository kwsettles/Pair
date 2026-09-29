import { HtmlBasePlugin } from "@11ty/eleventy";
import markdownItAnchor from "markdown-it-anchor";

export default function (cfg) {
  cfg.addPlugin(HtmlBasePlugin);
  // Headings get stable ids from their text, e.g. "How AI is used" -> #how-ai-is-used.
  cfg.amendLibrary("md", (md) => md.use(markdownItAnchor, {
    level: [2, 3], tabIndex: false,
    slugify: (s) => s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-"),
  }));
  cfg.addPassthroughCopy({ "src/assets": "assets" });

  // Newest first. Every Markdown file in src/notes is a note.
  cfg.addCollection("notes", (api) =>
    api.getFilteredByGlob("src/notes/*.md").sort((a, b) => b.date - a.date));

  // Pages that carry a searchType go into the local search index.
  cfg.addCollection("searchable", (api) =>
    api.getAll().filter((p) => p.data.searchType));

  const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  cfg.addFilter("longDate", (d) => fmt.format(new Date(d)));
  cfg.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  cfg.addFilter("paragraphs", (t) => String(t || "").split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean));
  cfg.addFilter("plain", (html) => String(html || "")
    .replace(/<(script|style|svg)[\s\S]*?<\/\1>/g, " ")
    .replace(/<\/h[1-6]>/g, " · ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, " ").trim());
  cfg.addFilter("toJson", (v) => JSON.stringify(v).replace(/</g, "\\u003c"));

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
}
