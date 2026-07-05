# @megbailey/utils

Framework-agnostic helpers. Source: [github.com/megbailey/megbailey-core/tree/main/packages/utils](https://github.com/megbailey/megbailey-core/tree/main/packages/utils)

Used by [`@megbailey/ui`](https://github.com/megbailey/megbailey-core/tree/main/packages/ui) and published separately for reuse in other projects.

## Core Concepts

- Dot-notation paths — address deeply nested fields without manual traversal
- In-place mutation — consistent with form/state update patterns
- Array helpers — append, update by index, and remove by ID
- Zero dependencies — small surface area, easy to tree-shake

## Install

```bash
npm install @megbailey/utils
```

No peer dependencies. Works in Node.js (≥ 18) and browsers.

## Usage

Helpers mutate the original object in place and return it for chaining.

```ts
import {
  resolveAmbiguousPath,
  setObjectField,
  addToObjectArray,
  setObjectArrayField,
  removeFromObjectArrayByID,
} from "@megbailey/utils";

const state = {
  user: {
    profile: { name: "Ada" },
    tags: [{ id: 1, label: "admin" }],
  },
};

// Read a nested value
resolveAmbiguousPath(state, "user.profile.name"); // "Ada"

// Set a nested field
setObjectField(state, "user.profile.name", "Grace");

// Append to a nested array
addToObjectArray(state, "user.tags", { id: 2, label: "editor" });

// Update a field on an array element by index
setObjectArrayField(state, "user.tags", 0, "label", "superadmin");

// Remove an array element by ID field
removeFromObjectArrayByID(state, "user.tags", "id", 2);
```

Paths use dot notation (e.g. `"user.profile.name"`). Missing paths throw a descriptive string error.

## Exports

| Export | Description |
| --- | --- |
| `resolveAmbiguousPath(object, fieldName)` | Walk a dot-notation path and return the value at the end |
| `setObjectField(object, fieldName, value)` | Set a value at a dot-notation path |
| `addToObjectArray(object, fieldName, value)` | Append a value to the array at a dot-notation path |
| `setObjectArrayField(object, groupFieldName, index, fieldName, value)` | Set a property on an array element at `index` |
| `removeFromObjectArrayByID(object, fieldName, IDFieldName, IDValue)` | Remove the first array element whose `IDFieldName` matches `IDValue` |
| `isCallableFunction(func, label?)` | Type guard that returns `true` when `func` is a callable function |

All functions accept `any` for object values and return the mutated root object (except `resolveAmbiguousPath`, which returns the resolved value).

## Development

From the monorepo root:

```bash
npm install
npm run build --workspace=@megbailey/utils
```

From this package directory:

```bash
npm run build   # compiles to dist/
npm run clean   # remove dist/
```

## License

MIT
