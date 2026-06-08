# Gibson Chu Photography Portfolio

A clean editorial Next.js portfolio for event, portrait, documentary, street, travel, and film photography.

## Routes

- `/` home
- `/portfolio` full portfolio index
- `/events`
- `/portraits`
- `/personal`
- `/about`
- `/contact`
- `/admin`

## Admin

The admin dashboard supports drag-and-drop multi-photo uploads, drag ordering, hero selection, featured flags, show/hide, category assignment, metadata editing, homepage/about copy editing, and contact submission viewing.

Local default password:

```bash
admin123
```

Set these environment variables in production:

```bash
ADMIN_PASSWORD=replace-with-a-strong-password
ADMIN_SECRET=replace-with-a-long-random-secret
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

Without `BLOB_READ_WRITE_TOKEN`, uploads and content edits persist locally in `data/content.json` and `public/uploads`. On Vercel, set up Vercel Blob so admin uploads and edits persist across deployments.

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run build
```
