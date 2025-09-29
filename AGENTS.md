# Repository Guidelines

## Project Structure & Module Organization
This Google Apps Script project manages multiple-choice exams stored in Google Sheets. `Code.gs` contains all server logic—`doGet`, submission validation, sheet bootstrapping, and shared constants—so keep sheet names and headers centralised there. `Admin.html` renders the teacher console for configuring exams and running corrections, while `Index.html` delivers the student submission form and expects templated values such as `examId` from `Code.gs`. Place any new partials next to these files and load them with `HtmlService.createTemplateFromFile`.

## Build, Test, and Development Commands
Use clasp for local work: `npm install -g @google/clasp`, `clasp login`, then `clasp pull` before edits and `clasp push` to publish. During larger sessions run `clasp push --watch` so Apps Script previews auto-refresh. Deploy test builds with `clasp deploy --description "<note>"` and open them via `clasp open --deploymentId <id>` when sharing with reviewers.

## Coding Style & Naming Conventions
Follow two-space indentation and trailing commas seen in `Code.gs`. Prefer `const`, fall back to `let` only when reassignment is inevitable, and reserve uppercase snake case for shared maps (`SHEET_NAMES`, `SETTINGS_KEYS`). Functions, template IDs, and dataset keys stay lowerCamelCase; HTML attributes use double quotes. Update `SHEET_HEADERS` whenever a column changes so append operations remain aligned.

## Testing Guidelines
No automated test harness is configured. Before committing, run `submitResponse` with sample payloads from the Apps Script editor and confirm rows land in `Submissions` and `Correcció`. Smoke-test the admin panel in preview mode, checking manual open/close toggles and key uploads. Note every scenario exercised in the pull request so other contributors can reproduce quickly.

## Commit & Pull Request Guidelines
With no existing Git history, adopt short imperative messages that scope the change, e.g. `admin: tighten manual toggle validation`. Keep related Apps Script and HTML updates in the same commit to avoid broken deployments. Pull requests should include context, testing notes, and screenshots or sheet snippets when UI or data output changes. Flag follow-up tasks explicitly instead of leaving TODOs in production code.

## Deployment & Configuration Tips
Replace `DEFAULT_ADMIN_TOKEN` before the first push and mirror that value in the `Settings` sheet. Ensure spreadsheet tabs match the names in `SHEET_NAMES`; rename or archive unused tabs outside the active spreadsheet. When cloning the project for another class, duplicate the spreadsheet, clear the `Settings` rows, and redeploy so the new instance starts with fresh exam identifiers.

### Deployment Notes (keep URL stable)
- Always push locally first: `clasp push`.
- Update the existing deployment instead of creating a new one so the Web App URL does not change: `clasp deployments` to list, then `clasp deploy --deploymentId <current_id> --description "<note>"`.
- If `clasp` is not on PATH, use the full path (e.g., `~/.npm-global/bin/clasp`).

Latest deployment context
- Current active deploymentId: `AKfycbwF_uXf1Md8xM79hHIBJtcg2RbPO6nOYyf8RcDzUlDfT-DxZK4z2y6j3M7ji60B5cvsZg`
- Use: `~/.npm-global/bin/clasp deploy --deploymentId AKfycbwF_uXf1Md8xM79hHIBJtcg2RbPO6nOYyf8RcDzUlDfT-DxZK4z2y6j3M7ji60B5cvsZg --description "<note>"`

Policy
- Juanjo prefiere que, tras cambios, se haga `clasp push` y redeploy sobre el `deploymentId` anterior sin pedir confirmación adicional, para mantener la URL estable.
