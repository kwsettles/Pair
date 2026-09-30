/* PAIR local search. Runs entirely in the browser against assets/search-index.js.
   All user input and page text is inserted with textContent, never as HTML. */
(function () {
  "use strict";

  var index = window.PAIR_SEARCH_INDEX || [];
  var FORMAT_MARKER = {"Brief": "brief", "Case Profile": "case", "Comparative Note": "comparative", "Editorial": "editorial"};
  var params = new URLSearchParams(window.location.search);
  var query = (params.get("q") || "").trim();

  var pageInput = document.getElementById("page-search");
  var headerInput = document.getElementById("site-search");
  var statusEl = document.getElementById("search-status");
  var list = document.getElementById("results");

  if (pageInput) pageInput.value = query;
  if (headerInput) headerInput.value = query;

  if (!query) {
    if (pageInput) pageInput.focus();
    return;
  }

  function norm(s) {
    return s.toLocaleLowerCase("en").normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[’‘]/g, "'").replace(/[“”]/g, '"');
  }

  var terms = norm(query).split(/\s+/).filter(Boolean);

  function score(entry) {
    var t = norm(entry.title), b = norm(entry.text), s = 0;
    for (var i = 0; i < terms.length; i++) {
      var inTitle = t.indexOf(terms[i]) !== -1;
      var inBody = b.indexOf(terms[i]) !== -1;
      if (!inTitle && !inBody) return 0;          // every term must match
      if (inTitle) s += 10;
      s += Math.min(b.split(terms[i]).length - 1, 10);
    }
    return s;
  }

  function excerpt(text) {
    var n = norm(text), pos = -1;
    for (var i = 0; i < terms.length && pos === -1; i++) pos = n.indexOf(terms[i]);
    if (pos === -1) return text.slice(0, 220) + (text.length > 220 ? " …" : "");
    var start = Math.max(0, pos - 90), end = Math.min(text.length, pos + 170);
    if (start > 0) { var sp = text.indexOf(" ", start); if (sp !== -1 && sp < pos) start = sp + 1; }
    if (end < text.length) { var ep = text.lastIndexOf(" ", end); if (ep > pos) end = ep; }
    return (start > 0 ? "… " : "") + text.slice(start, end) + (end < text.length ? " …" : "");
  }

  // Append text to el, wrapping matched terms in <mark>. Offsets map 1:1 because
  // norm() keeps string length for the characters used in site text.
  function appendHighlighted(el, text) {
    var n = norm(text), ranges = [];
    terms.forEach(function (term) {
      var from = 0, at;
      while ((at = n.indexOf(term, from)) !== -1) { ranges.push([at, at + term.length]); from = at + term.length; }
    });
    ranges.sort(function (a, b) { return a[0] - b[0]; });
    var cursor = 0;
    ranges.forEach(function (r) {
      if (r[0] < cursor) return;
      el.appendChild(document.createTextNode(text.slice(cursor, r[0])));
      var m = document.createElement("mark");
      m.textContent = text.slice(r[0], r[1]);
      el.appendChild(m);
      cursor = r[1];
    });
    el.appendChild(document.createTextNode(text.slice(cursor)));
  }

  var hits = index
    .map(function (e) { return { e: e, s: score(e) }; })
    .filter(function (h) { return h.s > 0; })
    .sort(function (a, b) { return b.s - a.s; });

  document.title = "Search: " + query + " · PAIR";

  if (!hits.length) {
    statusEl.textContent = "No results for “" + query + "”. Try a different or shorter term. The search covers notes and the Method and About pages.";
    return;
  }

  statusEl.textContent = (hits.length === 1 ? "1 result" : hits.length + " results") + " for “" + query + "”";

  hits.forEach(function (h) {
    var li = document.createElement("li");
    li.className = "result";

    var meta = document.createElement("p");
    meta.className = "meta";
    var marker = document.createElement("span");
    marker.className = "marker" + (FORMAT_MARKER[h.e.type] ? " marker--" + FORMAT_MARKER[h.e.type] : "");
    marker.setAttribute("aria-hidden", "true");
    meta.appendChild(marker);
    meta.appendChild(document.createTextNode(h.e.type));

    var h2 = document.createElement("h2");
    var a = document.createElement("a");
    a.href = h.e.url;
    appendHighlighted(a, h.e.title);
    h2.appendChild(a);

    var p = document.createElement("p");
    appendHighlighted(p, excerpt(h.e.text));

    li.appendChild(meta);
    li.appendChild(h2);
    li.appendChild(p);
    list.appendChild(li);
  });
})();
