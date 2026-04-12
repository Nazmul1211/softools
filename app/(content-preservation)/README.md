# Content Preservation Routes

This route group contains SEO-preservation boilerplate pages for legacy high-performing URLs.

## Image placement
Add featured images to:

`public/legacy-images/<slug>.png|jpg|jpeg`

Then run:

`npm run images:convert`

The image pipeline creates a `.webp` version automatically (quality 75), and
runtime proxy logic serves the `.webp` file to compatible browsers while keeping
the original file available as fallback.

During local development, `npm run dev` includes a watcher that converts newly
added/updated files in `public/` to `.webp` automatically. For files in
`public/legacy-images/`, the watcher removes the original `.png/.jpg/.jpeg`
after conversion and keeps only the `.webp`.

Each page currently references its own dedicated image path and placeholder body text.

## Notes
- These routes are intentionally separated in a route group: `app/(content-preservation)/...`
- Route-group folder name does not change public URL structure.
- Replace only the placeholder content in each page file with the exact legacy article content.
