# TOKEN RIOT website and browser game

Source for https://www.token-riot.com/: presentation, browser game at `/play/`
and direct Android APK download. The desktop/Android game project is maintained
at https://github.com/marianocarreira/tokenriot.

## Development

Requires Node.js 22 or later.

```sh
npm ci
npm run build
npm run check
npm test
npm start
```

Open http://127.0.0.1:4174/. The preview server serves only `dist/`.
`game-src/` contains source for the browser bundle. HTML, CSS and media in
`dist/` are also maintained sources: do not remove that directory as a cache.
APK downloads verify each part's size and SHA-256; tests also verify the whole APK.

## Languages and data

The presentation and browser game support English (default), Spanish and
Simplified Chinese, with persistent selectors. The game inherits the site's
choice on first use unless its own preference was already saved. Forms, dynamic
messages, accessibility labels and the privacy/satire notice are localized.
Repository documentation is English only.

Playing requires no API key. The optional community form sends the visitor's
chosen information through FormSubmit to contact@token-riot.com; it does not
create a player account. The Store is a separate private proprietary project.
`/store/` contains only a link to https://www.token-riot.store/.
Internal hosting identities and credentials are not included in this public repo.

## Copyright and contributions

Copyright (C) 2026 Mariano Carreira. Original software uses **GPL-3.0-only**;
see LICENSE, COPYING, COPYRIGHT.md and LICENSE-SCOPE.md. Licensing does not
transfer copyright. Separate media and third-party components retain their
respective rights; not all multimedia content is freely licensed.

The public history starts with sanitized source and excludes Store code and
private development data. See CONTRIBUTING.md, CLA.md and SECURITY.md.
Sole project contact: **contact@token-riot.com**.

## Book and comic

These are separate products in the proprietary Store:

- [Book: the making of TOKEN RIOT (register interest)](https://www.token-riot.store/?product=14-libro-filosofia-0&lang=en).
- [Comic: view available PDF editions](https://www.token-riot.store/?product=15-comic-0&lang=en).

Choose the publication language separately from the interface language. The
website passes its selected language to the Store; unavailable editions cannot
be ordered. A preorder interest registration does not charge the visitor.
