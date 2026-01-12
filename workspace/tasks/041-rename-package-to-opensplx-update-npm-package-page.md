---
status: to-do
skill-level: senior
parent-type: change
parent-id: rename-package-to-opensplx
---

# Task: Update NPM Package Page with Playwright

## End Goal

The npm package page for `@appboypov/opensplx` is updated via Playwright automation as part of the release pipeline. The user is logged into all accounts.

## Currently

- No automation exists for updating npm package pages
- Package page updates are manual

## Should

- Playwright script automates npm package page updates
- Script is integrated into release pipeline
- Script handles authentication (user is already logged in)
- Script updates package description, README, and other editable fields

## Constraints

- [ ] Must use Playwright for browser automation
- [ ] Must handle npm login state (user is already logged in)
- [ ] Must be idempotent (safe to run multiple times)
- [ ] Must handle npm's UI structure
- [ ] Must be part of release workflow

## Acceptance Criteria

- [ ] Playwright script exists for updating npm package page
- [ ] Script navigates to npm package page
- [ ] Script updates package description if needed
- [ ] Script updates README content if needed
- [ ] Script handles authentication (uses existing session)
- [ ] Script is integrated into release pipeline (or documented for manual run)
- [ ] Script is tested and works reliably

## Implementation Checklist

- [ ] 6.1 Install Playwright if not already installed: `pnpm add -D playwright @playwright/test`
- [ ] 6.2 Create script file: `scripts/update-npm-package-page.mjs` (or similar)
- [ ] 6.3 Implement Playwright script to:
  - [ ] Navigate to npm package page for `@appboypov/opensplx`
  - [ ] Check if user is logged in (handle if not)
  - [ ] Navigate to package edit/settings page
  - [ ] Update package description
  - [ ] Update README if needed
  - [ ] Save changes
- [ ] 6.4 Add error handling and logging
- [ ] 6.5 Test script manually (user is logged in)
- [ ] 6.6 Integrate into release pipeline or document manual execution
- [ ] 6.7 Document script usage in README or release docs

## Notes

The user mentioned they are logged into all accounts, so the script should be able to use the existing browser session. Consider:
- Using Playwright's persistent context to reuse login state
- Or using Playwright's `--headed` mode for manual authentication if needed
- npm package pages have specific URLs: `https://www.npmjs.com/package/@appboypov/opensplx`
- Package edit page: `https://www.npmjs.com/package/@appboypov/opensplx/edit`

The script should be idempotent and handle cases where the package page is already updated.
