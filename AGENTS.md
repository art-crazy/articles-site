# Agent Notes

Use Feature-Sliced Design for frontend changes.

Why:

- Next.js routes should stay thin: fetch data, compose widgets, define metadata.
- Article/domain UI should live outside `app`, so it can be reused on home, lists, search, categories, and tags.
- Shared UI and helpers should not depend on business entities.
- CSS should be local by default with `*.module.css`; keep `app/(frontend)/styles.css` for tokens, reset, base typography, and page-level layout only.

Preferred structure:

```txt
src/app/(frontend)       route handlers and route pages
src/entities/article     article domain UI and helpers
src/features             user actions such as search
src/widgets              composed page sections
src/shared               shared UI, API clients, formatting, config
```

Rules for future UI work:

- Add new component styles as CSS Modules.
- Do not keep growing global `styles.css` unless the style is truly global.
- Keep source files at 300 lines or shorter. The file-length lint is advisory and should guide refactoring without blocking commits.
- Keep Payload collection/global config in `src/collections`, `src/globals`, and `src/blocks`.
- After UI changes, run `pnpm lint` and `pnpm build`, restart the dev server if config/env changed, and verify the affected pages in the browser.
