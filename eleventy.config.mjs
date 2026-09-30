import { HtmlBasePlugin } from "@11ty/eleventy";
import markdownItAnchor from "markdown-it-anchor";
import markdownItFootnote from "markdown-it-footnote";

// Layout specimens (placeholder pages showing the Brief and Case Profile layouts) are only
// built for previews: PAIR_SPECIMENS=1 npx @11ty/eleventy
const SPECIMENS = !!process.env.PAIR_SPECIMENS;

export default function (cfg) {
  cfg.addPlugin(HtmlBasePlugin);
  if (!SPECIMENS) cfg.ignores.add("src/specimens/**");

  cfg.amendLibrary("md", (md) => {
    md.use(markdownItFootnote);
    // Headings get stable ids from their text, e.g. "How AI is used" -> #how-ai-is-used.
    md.use(markdownItAnchor, {
      level: [2, 3], tabIndex: false,
      slugify: (s) => s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-"),
    });
    // Paragraph anchors for pinpoint citation: top-level paragraphs get id="p1", "p2", …
    // and a small number link. Numbers are shown only on contributions (see style.css).
    md.core.ruler.push("paragraph_ids", (state) => {
      let n = 0, inFootnotes = false;
      for (const t of state.tokens) {
        if (t.type === "footnote_block_open") inFootnotes = true;
        if (t.type === "footnote_block_close") inFootnotes = false;
        if (t.type === "paragraph_open" && t.level === 0 && !inFootnotes) {
          n += 1;
          t.attrSet("id", "p" + n);
          t.meta = { ...(t.meta || {}), pnum: n };
        }
      }
    });
    const orig = md.renderer.rules.paragraph_open || ((tokens, idx, opts, env, self) => self.renderToken(tokens, idx, opts));
    md.renderer.rules.paragraph_open = (tokens, idx, opts, env, self) => {
      const t = tokens[idx];
      const html = orig(tokens, idx, opts, env, self);
      return t.meta && t.meta.pnum
        ? html + `<a class="pnum" href="#p${t.meta.pnum}" aria-label="Paragraph ${t.meta.pnum}">${t.meta.pnum}</a>`
        : html;
    };
  });

  cfg.addPassthroughCopy({ "src/assets": "assets" });

  const byDateDesc = (a, b) => b.date - a.date;
  cfg.addCollection("notes", (api) => api.getFilteredByGlob("src/notes/*.md").sort(byDateDesc));
  cfg.addCollection("cases", (api) =>
    api.getFilteredByGlob("src/cases/*.md").sort((a, b) => String(a.data.case_id).localeCompare(String(b.data.case_id))));
  cfg.addCollection("specimens", (api) => api.getFilteredByGlob("src/specimens/*.md"));
  cfg.addCollection("searchable", (api) => api.getAll().filter((p) => p.data.searchType));

  const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  cfg.addFilter("longDate", (d) => (d ? fmt.format(new Date(d)) : ""));
  cfg.addFilter("isoDate", (d) => (d ? new Date(d).toISOString().slice(0, 10) : ""));
  cfg.addFilter("year", (d) => new Date(d).getUTCFullYear());
  cfg.addFilter("paragraphs", (t) => String(t || "").split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean));
  cfg.addFilter("slug", (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  cfg.addFilter("plain", (html) => String(html || "")
    .replace(/<(script|style|svg)[\s\S]*?<\/\1>/g, " ")
    .replace(/<a class="pnum"[^>]*>\d+<\/a>/g, "")
    .replace(/<\/h[1-6]>/g, " · ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\s+/g, " ").trim());
  cfg.addFilter("toJson", (v) => JSON.stringify(v).replace(/</g, "\\u003c"));
  cfg.addFilter("csv", (v) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  });
  // Notes that refer to a given case id.
  cfg.addFilter("notesForCase", (notes, id) => (notes || []).filter((n) => (n.data.cases || []).includes(id)));
  cfg.addFilter("caseById", (cases, id) => (cases || []).find((c) => c.data.case_id === id));

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
}
