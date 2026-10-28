# Westwood Subject Explorer

One stop ECG site for Westwood Students.

This repository contains the complete static website, including the official school logo, six alumni portfolio preview images, source data, checks, and optional Google Apps Script setup files.

## Run locally

With Python 3 installed, run this command from the repository folder:

```sh
python3 -m http.server 8000 --directory dist
```

Open http://localhost:8000 in your browser. No build step or API key is required.

## Website features

- Subject options: subject profiles, combination builder, expandable subject descriptions, videos and FAQs.
- Post-secondary options: subject-level route matching and grade conversion information.
- Early Admissions Process: ITE and Poly EAE guidance, write-up practice, portfolio resources, alumni previews and interview preparation.
- Interview preparation: general advice and a mock chatbot window.

The mock chatbot is not a live AI service. External videos, portfolios, documents and chatbots remain links or embeds; their original remote files are not copied into this repository.

## Files

- `dist/`: the complete static website; use this directory as the publishing root for static hosting.
- `dist/data.json`: current subject and combination data.
- `dist/app.js`, `dist/eae.js`: website behaviour.
- `dist/style.css`: appearance and layout.
- `dist/assets/`: school logo and alumni portfolio previews.
- `google-apps-script/`: optional Google Apps Script version and staff administration setup.
- `dist/setup.html` and `dist/google-sites-setup.zip`: setup instructions and downloadable Apps Script package.
- `checks*.cjs`: source validation checks.
- `asset-sources.md` and `descriptor-sources.md`: source references.

## Edit and check

Edit the files in `dist/` and refresh your local preview. With Node.js installed, run:

```sh
node checks.cjs
node checks-pse.cjs
node checks-eae.cjs
```

The current `dist/data.json` is authoritative. `make_data.py` is an original data-generation script retained for reference; running it may overwrite newer content changes.

`package_google.py` regenerates the optional Google Apps Script package. It contains asset URLs pointing to the original hosted website; review those URLs if changing hosting.

## Optional Google Apps Script setup

Follow `dist/setup.html` to install the Apps Script version. Uploading this repository does not automatically deploy Apps Script, create its spreadsheet, or enable a staff dashboard.

## Hosting

The existing site is available at:
https://westwood-subject-explorer-2027.apicalmavistem.chatgpt.site/

This repository export does not enable GitHub Pages. To use another static host, publish the contents of `dist/`. Retain the source references and check external resources when updating the site.
