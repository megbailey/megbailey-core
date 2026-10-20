# Agent instructions

## Commits

Never add a co-author. Do not pass `--trailer` with `Co-authored-by`, and do not put a `Co-authored-by` line in the commit message. If a commit command would include that trailer, do not run it.

## Main branch

The GitHub ruleset **Protect main** applies to everyone.

- Open a pull request to change `main`. Do not push commits straight to `main`.
- Do not force-push `main`, and do not delete it.
- Merge only after the `build-and-test` check has succeeded on a branch that is up to date with `main`.

## Version tags

The GitHub ruleset **Protect version tags** applies to `v*` tags.

- Push a new `v*` tag when a release asks for one.
- Do not delete a `v*` tag, and do not move one that already exists.

## Publish a release

Do this only when the user asks to publish or release. That request allows the version commit, the pull request, the merge, and the tag push. `@megbailey/utils` and `@megbailey/ui` share one version. A push to `main` runs `build-and-test` and does not publish. CI publishes both packages when a `v*` tag is pushed and that workflow's build succeeds (`.github/workflows/ci-cd.yml`). Do not run `npm publish` locally.

From the `megbailey-core` repo root, with the release changes already committed:

1. Read `version` in `packages/utils/package.json` and `packages/ui/package.json`. Stop if they differ.
2. Increment the patch segment (`X.Y.Z` → `X.Y.(Z+1)`, so `1.0.3` becomes `1.0.4`) unless the user asks for a minor or major bump. A minor bump increments `Y` and sets `Z` to `0`. A major bump increments `X` and sets `Y` and `Z` to `0`.
3. Write that version in both `package.json` files, and set `dependencies["@megbailey/utils"]` in `packages/ui/package.json` to the same exact version.
4. Run `npm run build` and `npm test`. Stop if either fails.
5. If the current branch is `main`, create `release/vX.Y.Z` from it before committing.
6. Commit only those version edits. The commit message is `Release vX.Y.Z` and nothing else. No `--trailer` and no `Co-authored-by` line.
7. Push that branch and open a pull request into `main`.
8. Merge the pull request after `build-and-test` succeeds.
9. Tag the merge commit on `main` with `vX.Y.Z` (`git tag v1.0.4`). The tag must match `version` and must not already exist. Push that tag only: `git push origin vX.Y.Z`.

Leave an existing tag where it is. After the tag push, tell the user the tag and that Actions publishes `@megbailey/utils`, then `@megbailey/ui`, to npm and GitHub Packages.
