# PAIR · Parliamentary AI Review

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
- Every source gets a source type (Institutional, Supplier, Media, Interview, PAIR inference).
- Footnotes: write `[^1]` in the text and `[^1]: …` at the end of the text.

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
