# PAIR · Parliamentary AI Review

Static research blog built with [Eleventy](https://www.11ty.dev). Hosted on GitHub Pages, edited in the browser with [Pages CMS](https://pagescms.org). No tracking, no external services at runtime, no costs.

## Editing in the browser
1. Open https://app.pagescms.org and sign in with GitHub.
2. Choose this repository. The sidebar shows Notes, About, Method, the Notes-page texts, Legal notice, Privacy and Site settings.
3. Saving creates a commit. GitHub Actions rebuilds the site; the change is live after about a minute (tab "Actions" shows progress).

## Adding a note
In Pages CMS: Notes → Add. The file name comes from the title and becomes the permanent address (`/notes/<file-name>/`). Do not rename a note after it has been shared or cited.

Fill in: title, date, category, status, version, excerpt, text, AI-use note, sources, version history.
Convention: a substantive text change raises the version and adds a line to the version history; layout changes do not.

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
