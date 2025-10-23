## Quick orientation — what this project is

- This repository is a small, static personal website (GitHub Pages). The entry point is `index.html` at the repo root.
- Styling and runtime code live under `assets/` (notably `assets/css/` and `assets/js/`). Content-driven data is stored as JSON in `assets/publications.json`.

## Key locations an AI agent will touch

- `index.html` — page structure and the script/style includes. It loads `assets/css/main.css`, fetches `assets/js/config.json` (for Google Analytics), and then runs `assets/js/languageManager.js` and `assets/js/main.js`.
- `assets/js/config.json` — small runtime config (example: `googleAnalyticsMeasurementId`). Update here to change GA tracking.
- `assets/js/languageManager.js` and `assets/js/main.js` — main interactive behavior:
  - `languageManager.js` reads `assets/js/languages.json` and uses data attributes (`data-en`, `data-es`, etc.) to translate DOM nodes with class `language`.
  - `main.js` (or `assets/script.js` in some places) handles UI toggles, theme selection, publications rendering (it fetches `assets/publications.json`), and other nav interactions.
- `assets/publications.json` — canonical list of publications used to render the Publications page. Each entry is an object with keys: `title`, `authors` (array), `venue`, `year`, `pdf`, `doi`, `code`, `video`, `award`, `bibtex`.
- `assets/css/*` (`main.css`, `light.css`, `dark.css`) — theme variables live in `main.css` and `:root`/`:root.light` pairs control colors. Theme toggling loads `light.css` or `dark.css` dynamically.
- `assets/documents/` — images, PDFs and other static assets referenced from the site.

## Patterns & conventions to follow

- Translation: elements in translatable sections have `class="language"` and use `data-<lang>` attributes (e.g., `data-en`, `data-es`). Use `languageManager.js` to add new languages and keep keys consistent across elements.
- Data-driven pages: publications and project lists are rendered from JSON. Prefer editing `assets/publications.json` instead of hand-editing `index.html` for publication changes.
- No build step: this is a plain static site. Changes are effective by committing and pushing to the branch that hosts GitHub Pages.
- jQuery is used widely. Prefer using existing jQuery idioms in `assets/js/*` when adding small UI behaviors for consistency.

## How to run and debug locally (important)

- Do NOT open `index.html` with the `file://` protocol — `fetch()` calls (for JSON/config) require an HTTP server. Use one of these quick options in PowerShell:

  - Python 3 built-in server (works if Python is installed):
    ```powershell
    cd 'c:\Users\Erwin Wu\Documents\Projects\my_homepage'
    python -m http.server 8000
    ```

  - VS Code: Use the Live Server extension (recommended for quick edits).

- Once served, open `http://localhost:8000` and use browser DevTools Console and Network to inspect `fetch()` calls (config, publications, languages).

## Common maintenance tasks and where to change them

- Add or update a publication: edit `assets/publications.json`. Keep `authors` as an array. Example entry:

  {
    "title": "Example Paper",
    "authors": ["A. Author","B. Author"],
    "venue": "Conference",
    "year": 2024,
    "pdf": "/assets/documents/publications/example.pdf",
    "bibtex": "@article{...}"
  }

- Add a language: update `assets/js/languages.json` with a new language key and flag, then ensure `languageManager.js` can access it. Use `data-<lang>` attributes on elements that should be translated.
- Change Google Analytics: update `assets/js/config.json` → `googleAnalyticsMeasurementId`.
- Add a new page/section: follow the existing pattern — add a `div` with an id (e.g., `#newSectionContent`), hide it by default in `main.js`/`assets/script.js` and add a corresponding nav item with a `data-en`/`data-es` label.

## What to watch out for / gotchas

- Path sensitivity: assets are loaded with relative paths such as `assets/js/...`. When adding files, preserve those relative paths or update `index.html` accordingly.
- Duplicate/legacy files: there are multiple CSS locations (`css/` and `assets/css/`)—`index.html` references `assets/css/main.css`. Trust what `index.html` imports when deciding which file to edit.
- Fetch + CORS: `fetch()` requests (e.g., `assets/publications.json` and `assets/js/config.json`) require a running HTTP server during development.

## Small automation examples the agent can perform

- Add a new publication object to `assets/publications.json` and run a local server to verify it appears.
- Add a new translation key: find elements with `class="language"`, add `data-<lang>` attributes, and update `assets/js/languages.json`.

## If you need more context

- Start by opening `index.html`, then `assets/js/languageManager.js`, `assets/js/main.js` and `assets/publications.json` — those four files contain most of the runtime logic and examples.

Please review and tell me if you'd like me to (a) include a short checklist for adding a new language, (b) add a small JSON-schema validator for `assets/publications.json`, or (c) wire a minimal test harness to validate `fetch()` data locally.
