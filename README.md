# PAIR · Parliamentary AI Review

## Kurzanleitung: Posten

**Neuer Beitrag** (im Browser, ca. 2 Minuten)
1. https://app.pagescms.org öffnen → mit GitHub anmelden → Repository wählen.
2. Links **Posts** → **Add entry**.
3. Ausfüllen: *Title*, *Format*, *Date*, *Standfirst*, *Text*, *AI use and review status*.
4. **Published** einschalten → **Save**.
5. Nach etwa einer Minute ist der Beitrag online (Fortschritt: Repository → Reiter *Actions*).

Alles unterhalb von *Published* ist optional und kann leer bleiben: Version, Versionsgeschichte, Teaser und Status werden automatisch gesetzt.

**Beitrag ändern**
- Posts → Beitrag öffnen → Text ändern → Save.
- Bei inhaltlicher Änderung eines veröffentlichten Beitrags zusätzlich: *Last revised* setzen, *Version* erhöhen (z. B. 1.1) und eine Zeile in der *Version history* ergänzen. Tippfehler brauchen keine neue Version.
- Nach Veröffentlichung keine Absätze in der Mitte einfügen (Absatznummern verschieben sich) und den Titel nicht ändern, wenn der Link schon geteilt wurde (die Adresse entsteht beim Anlegen aus dem Titel).

**Entwurf**: *Published* aus lassen. Solange in *Site settings* „Show drafts“ an ist (Vorschau-Phase), erscheinen Entwürfe als „Draft“ auf der Seite. Ist es aus, sind Entwürfe unsichtbar. Wichtig: Das Repository ist öffentlich, Entwürfe sind dort immer lesbar.

**Notfall ohne CMS**: Auf github.com im Ordner `src/notes/` die `.md`-Datei öffnen → Stift-Symbol → ändern → *Commit changes*.

---

Static research blog built with [Eleventy](https://www.11ty.dev). Hosted on GitHub Pages, edited in the browser with [Pages CMS](https://pagescms.org). No tracking, no external services at runtime, no costs.

## Editing in the browser
1. Open https://app.pagescms.org and sign in with GitHub.
2. Choose this repository. The sidebar shows Notes, About, Method, the Notes-page texts, Legal notice, Privacy and Site settings.
3. Saving creates a commit. GitHub Actions rebuilds the site; the change is live after about a minute (tab "Actions" shows progress).

## Formats
- **Brief, Comparative Note, Editorial**: Pages CMS → Notes → Add. The file name comes from the title and becomes the permanent address (`/notes/<file-name>/`). Do not rename a note after it has been shared or cited. Link a note to cases by entering their case IDs.
- **Case Profile**: Pages CMS → Case Profiles → Add. The address is built from the case ID (`/cases/pair-deu-bt-001/`), so the case ID must never change or be reused.
- **Case Register** (`/cases/`, plus `/cases/register.csv` and `/cases/register.json`) is generated automatically from all case profiles.

Conventions:
- A substantive text change raises the version and adds a line to the version history; layout changes do not.
- "Published" switches on the suggested citation, BibTeX and citation metadata. Drafts say "please do not cite".
- Status (Draft / Published / Updated), version (0.1 for drafts, 1.0 when published), teaser and a first version-history line are filled in automatically when left empty (`lib/contribution-defaults.js`).
- Every source gets a source type (Institutional, Supplier, Media, Interview, PAIR inference).
- Footnotes: write `[^1]` in the text and `[^1]: …` at the end of the text.

## Guest contributions
1. Pages CMS → People → add the author (ID, name, name for citations, affiliation, ORCID, one-sentence bio).
2. In the note or case profile, enter the author ID(s) under "Author IDs". Empty = the editor.
3. Fill in received and accepted dates and the competing-interests statement. For contributions without the editor as author, the page automatically shows "Editorial review by … Not peer reviewed."
4. Site settings → "Guest contributions open" adds the Contribute link to the footer.

## Newsletter (PAIR Monthly)
- Issues live in Pages CMS → Newsletter issues. Enter the month covered (YYYY-MM) and a short introduction. New contributions first published in that month, and cases whose status was verified in that month, are listed automatically.
- Each issue has an email version at `/newsletter/<month>/email.html` (tables and inline styles). Open it, copy the HTML into the newsletter service and replace the unsubscribe placeholder with the service's own unsubscribe tag.
- The sign-up form appears only when "Sign-up form URL" is set in Site settings. Complete the newsletter section of the privacy page first.
- `/feed.xml` lists all published contributions (Atom). It needs no service and no personal data.

## Paragraph numbers
Top-level paragraphs in contributions are numbered automatically and get anchors `#p1`, `#p2`, … Inserting a paragraph shifts all later numbers, so after publication add new material at the end or in a new version and note it in the version history.

## Layout specimens (preview only)
`src/specimens/` holds placeholder pages that show the Brief and Case Profile layouts. They are not part of the live site. To see them locally: `PAIR_SPECIMENS=1 npm start`.

## Headings and anchors
Headings get ids from their text: "How AI is used" → `#how-ai-is-used`. The footer and several pages link to `/about/#how-ai-is-used`; if you rename that heading, update those links.

## Working locally (optional)
```
npm install
npm start        # preview at http://localhost:8080
```

## Before making the site public
- Complete the legal notice and privacy page and remove their placeholder notes.
- Review all draft texts.
- Site settings → switch off "Hide from search engines".
- The label "Private editorial preview" is not access control. The repository and the github.io address are public from the start.
