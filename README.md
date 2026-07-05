# megbailey-core

Monorepo for [megbailey](https://github.com/megbailey)'s npm packages.

| Package | npm | Source |
| --- | --- | --- |
| `@megbailey/ui` | [`@megbailey/ui`](https://www.npmjs.com/package/@megbailey/ui) | [packages/ui](https://github.com/megbailey/megbailey-core/tree/main/packages/ui) |
| `@megbailey/utils` | [`@megbailey/utils`](https://www.npmjs.com/package/@megbailey/utils) | [packages/utils](https://github.com/megbailey/megbailey-core/tree/main/packages/utils) |

## Packages

### [@megbailey/ui](https://github.com/megbailey/megbailey-core/tree/main/packages/ui)

React component library with w3 design patterns, form elements, and hooks. Includes Storybook for interactive docs and Vitest for unit tests.

See [packages/ui/README.md](./packages/ui/README.md) for install instructions, exports, and usage examples.

### [@megbailey/utils](https://github.com/megbailey/megbailey-core/tree/main/packages/utils)

Small, framework-agnostic useful helpers. Used internally by `@megbailey/ui` and published separately for reuse.

See [packages/utils/README.md](./packages/utils/README.md) for API details.

## Install from npm

Install only what you need:

```bash
# UI components (also pulls in @megbailey/utils as a dependency)
npm install @megbailey/ui

# Utilities only
npm install @megbailey/utils
```

`@megbailey/ui` has peer dependencies on `react` and `react-dom`. Some form components also require optional peers — see the [UI README](./packages/ui/README.md#peer-dependencies).

## Development

This repo uses [npm workspaces](https://docs.npmjs.com/cli/using-npm/workspaces). Clone the repo and install from the root:

```bash
git clone https://github.com/megbailey/megbailey-core.git
cd megbailey-core
npm install
```

### Scripts

| Command | Description |
| --- | --- |
| `npm run build` | Build `@megbailey/utils`, then `@megbailey/ui` |
| `npm run clean` | Remove `dist/` from both packages |
| `npm test` | Run UI unit tests (Vitest) |
| `npm run test:watch` | Run UI tests in watch mode |
| `npm run test:coverage` | UI tests with coverage report |
| `npm run test:storybook` | Storybook browser tests |
| `npm run test:all` | Unit + Storybook tests |
| `npm run format` | Format TypeScript with Prettier |

Package-specific scripts (Storybook, etc.) live in [packages/ui/package.json](./packages/ui/package.json).

## Publishing

Packages publish to **npm** (OIDC trusted publishing) and **GitHub Packages** Repositories.

### Release (CI)

1. Bump `version` in `packages/utils/package.json` and `packages/ui/package.json`
2. Commit, tag, and push:

```bash
git tag v1.0.1
git push origin main --tags
```

## License

MIT — see [LICENSE](./packages/ui/LICENSE) in each package.
