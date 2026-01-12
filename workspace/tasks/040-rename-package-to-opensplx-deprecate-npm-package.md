---
status: to-do
skill-level: medior
parent-type: change
parent-id: rename-package-to-opensplx
---

# Task: Deprecate Current NPM Package

## End Goal

The old npm package `@appboypov/OpenSplx` is deprecated with a clear migration message pointing users to the new package.

## Currently

- Package `@appboypov/OpenSplx` is active on npm
- No deprecation notice exists

## Should

- Package `@appboypov/OpenSplx` is marked as deprecated on npm
- Deprecation message directs users to install `@appboypov/opensplx`
- Deprecation message explains the command name change from `splx` to `splx`

## Constraints

- [ ] Must use npm CLI or npm API to deprecate
- [ ] Deprecation message must be clear and actionable
- [ ] Must have publish access to the old package

## Acceptance Criteria

- [ ] Old package `@appboypov/OpenSplx` is deprecated on npm
- [ ] Deprecation message includes: "This package has been renamed to @appboypov/opensplx. Please install @appboypov/opensplx instead. The CLI command has changed from 'splx' to 'splx'."
- [ ] npm shows deprecation warning when users try to install old package
- [ ] Deprecation is visible on npm package page

## Implementation Checklist

- [ ] 5.1 Verify npm authentication and access to `@appboypov/OpenSplx`
- [ ] 5.2 Run `npm deprecate @appboypov/OpenSplx "This package has been renamed to @appboypov/opensplx. Please install @appboypov/opensplx instead. The CLI command has changed from 'splx' to 'splx'."`
- [ ] 5.3 Verify deprecation is visible on npm package page
- [ ] 5.4 Test that `npm install -g @appboypov/OpenSplx` shows deprecation warning

## Notes

The npm deprecate command format is:
```bash
npm deprecate <package>[@<version>] <message>
```

To deprecate all versions, use:
```bash
npm deprecate @appboypov/OpenSplx "message"
```

Ensure you're logged into npm with appropriate permissions.
