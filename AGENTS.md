# Agent instructions

## Commits

Never add a co-author. Do not pass `--trailer` with `Co-authored-by`, and do not put a `Co-authored-by` line in the commit message. If a commit command would include that trailer, do not run it.

## Publish a release

Do this only when the user asks to publish or release. That request allows the version commit, the tag, and the push. `@megbailey/utils` and `@megbailey/ui` share one version. CI publishes both when a `v*` tag is pushed (`.github/workflows/ci-cd.yml`). Do not run `npm publish` locally.

From the `megbailey-core` repo root, on `main`, with the release changes already committed:

1. Read `version` in `packages/utils/package.json` and `packages/ui/package.json`. Stop if they differ.
2. Increment the patch segment (`X.Y.Z` → `X.Y.(Z+1)`, so `1.0.3` becomes `1.0.4`) unless the user asks for a minor or major bump. A minor bump increments `Y` and sets `Z` to `0`. A major bump increments `X` and sets `Y` and `Z` to `0`.
3. Write that version in both `package.json` files, and set `dependencies["@megbailey/utils"]` in `packages/ui/package.json` to the same exact version.
4. Run `npm run build` and `npm test`. Stop if either fails.
5. Commit only those version edits. The commit message is `Release vX.Y.Z` and nothing else. No `--trailer` and no `Co-authored-by` line.
6. Tag that commit `vX.Y.Z` (`git tag v1.0.4`). The tag must match `version` and must not already exist.
7. Push the branch, then that tag only: `git push origin HEAD` and `git push origin vX.Y.Z`.

Leave an existing tag where it is. After the push, tell the user the tag and that Actions publishes `@megbailey/utils`, then `@megbailey/ui`, to npm and GitHub Packages.
