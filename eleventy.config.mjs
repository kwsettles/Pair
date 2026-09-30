import { HtmlBasePlugin } from "@11ty/eleventy";
import markdownItAnchor from "markdown-it-anchor";
import markdownItFootnote from "markdown-it-footnote";

// Layout specimens (placeholder pages showing the Brief and Case Profile layouts) are only
// built for previews: PAIR_SPECIMENS=1 npx @11ty/eleventy
const SPECIMENS = !!process.env.PAIR_SPECIMENS;

// Drafts are shown on the site only while "Show drafts" is on in Site settings (preview phase).
import { readFileSync } from "node:fs";
const SITE = JSON.parse(readFileSync(new URL("./src/_data/site.json", import.meta.url)));
const visible = (items) => (SITE.show_drafts ? items : items.filter((i) => i.data.published));

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
  cfg.addCollection("notes", (api) => visible(api.getFilteredByGlob("src/notes/*.md")).sort(byDateDesc));
  cfg.addCollection("cases", (api) =>
    visible(api.getFilteredByGlob("src/cases/*.md")).sort((a, b) => String(a.data.case_id).localeCompare(String(b.data.case_id))));
  cfg.addCollection("specimens", (api) => api.getFilteredByGlob("src/specimens/*.md"));
  cfg.addCollection("contributions", (api) =>
    visible([...api.getFilteredByGlob("src/notes/*.md"), ...api.getFilteredByGlob("src/cases/*.md")]).sort(byDateDesc));
  cfg.addCollection("issues", (api) => visible(api.getFilteredByGlob("src/newsletter/*.md")).sort(byDateDesc));
  // Issues that get an email version (includes the preview specimen when specimens are built).
  cfg.addCollection("emailIssues", (api) => [
    ...api.getFilteredByGlob("src/newsletter/*.md"),
    ...api.getFilteredByGlob("src/specimens/*.md").filter((i) => i.data.layout === "issue.njk"),
  ]);
  cfg.addCollection("searchable", (api) => api.getAll().filter((p) => p.data.searchType && (p.data.published || SITE.show_drafts || !p.data.contribution)));

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
  // Authors: front matter lists ids (authors: [kevin-w-settles]); people.json holds the details.
  cfg.addFilter("pick", (people, ids) => (ids || []).map((id) => (people || []).find((p) => p.id === id) || { id, name: id, bibtex: id }));
  cfg.addFilter("nameList", (list) => {
    const n = (list || []).map((p) => p.name);
    return n.length <= 2 ? n.join(" and ") : n.slice(0, -1).join(", ") + " and " + n.at(-1);
  });
  // "Settles, K. W., & Doe, J." style for the suggested citation.
  cfg.addFilter("citeNames", (list) => {
    const n = (list || []).map((p) => p.bibtex || p.name);
    return n.length <= 1 ? n.join("") : n.slice(0, -1).join("; ") + " & " + n.at(-1);
  });
  cfg.addFilter("bibNames", (list) => (list || []).map((p) => p.bibtex || p.name).join(" and "));
  cfg.addFilter("firstSurname", (list) => String(((list || [])[0] || {}).bibtex || "anon").split(",")[0].toLowerCase().replace(/[^a-z]/g, ""));
  cfg.addFilter("personLd", (list) => (list || []).map((p) => ({ "@type": "Person", name: p.name, sameAs: p.orcid || undefined, affiliation: p.affiliation || undefined })));
  cfg.addFilter("byAuthor", (items, id) => (items || []).filter((i) => (i.data.authors || []).includes(id)));
  cfg.addFilter("inMonth", (items, month) => (items || []).filter((i) =>
    i.data.published && !i.data.specimen && new Date(i.date).toISOString().slice(0, 7) === month));
  cfg.addFilter("verifiedInMonth", (items, month) => (items || []).filter((i) =>
    i.data.last_verified && new Date(i.data.last_verified).toISOString().slice(0, 7) === month));
  // Contents of a newsletter issue: contributions first published in the month, and cases
  // whose status was verified in the month. The preview specimen lists the layout specimens.
  cfg.addFilter("issueItems", (collections, month, specimen) => specimen
    ? { items: (collections.specimens || []).filter((i) => i.data.format), cases: [] }
    : {
        items: (collections.contributions || []).filter((i) => i.data.published && new Date(i.date).toISOString().slice(0, 7) === month),
        cases: (collections.cases || []).filter((i) => i.data.published && i.data.last_verified && new Date(i.data.last_verified).toISOString().slice(0, 7) === month),
      });
  cfg.addFilter("monthName", (m) => new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(m + "-01")));
  cfg.addFilter("published", (items) => (items || []).filter((i) => i.data.published));
  // Minimal inline styling for Markdown HTML in the email version of an issue.
  cfg.addFilter("emailify", (html) => String(html || "")
    .replace(/<a class="pnum"[^>]*>\d+<\/a>/g, "")
    .replace(/<p( id="[^"]*")?>/g, '<p style="margin:0 0 14px;">')
    .replace(/<a href=/g, '<a style="color:#5E6325;" href=')
    .replace(/<h2[^>]*>/g, '<h2 style="font-family:Georgia,serif;font-weight:normal;font-size:22px;margin:24px 0 8px;">'));
  cfg.addFilter("absUrl", (u, base) => (base || "") + u);

  // Notes that refer to a given case id.
  cfg.addFilter("notesForCase", (notes, id) => (notes || []).filter((n) => (n.data.cases || []).includes(id)));
  cfg.addFilter("caseById", (cases, id) => (cases || []).find((c) => c.data.case_id === id));

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
  };
}
