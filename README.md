# Gibson Chu Photography

Responsive recreation of https://photos.gibsonchu.com/ with the original photographs, Cargo Diatype variable font, 28-image slideshow, eight public project galleries, information overlay, and keyboard/touch image viewer.

Run `npm install` then `npm run dev`. Build with `npm run build`; Vercel serves `dist/client` with SPA route rewrites. Production: https://gibsonchuphotos.vercel.app/.

Content is stored in `src/data.json`. Original image attribution and source URLs are recorded in `asset-provenance.json`. Images are locally hosted 2000px Cargo renditions. Historical unlinked gallery routes are preserved. Source copy, gallery order, translucent overlays, and five-column mobile index are retained.

## Admin panel

Open `/admin` and use the existing `ADMIN_PASSWORD` configured in Vercel. Upload JPEG, PNG, WebP or AVIF photographs (up to 30 MB), create collections, choose covers, reorder photographs, edit the homepage slideshow, and update Information text and links. Click **Publish changes** to save. Unpublished browser edits can be discarded; removing a collection keeps its photographs in the library.

Server APIs use the existing Portfolio Vercel Blob connection for durable content and uploads. Content uses a separate `photography-cms/` namespace, preserving the previous site's stored data. Signed HttpOnly sessions expire after eight hours. Saves use ETag conditions to prevent stale editors overwriting newer changes. Credentials are server-only; there are no default production passwords.

Local development: start `scripts/dev-api.mjs` with `CMS_LOCAL=1`, a local-only `ADMIN_PASSWORD` and `ADMIN_SECRET`, then start Vite on port 4175. Local test content and uploads are ignored by Git. Run `npm run test:admin` for authentication, persistence, conflict, and content-validation tests.
