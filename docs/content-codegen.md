# Content codegen — from drift to draft PR

**Status: implemented** on `content-codegen`. Phase 1 (a separate drift monitor) is not
needed: the daily job regenerates from the live endpoint and files a draft PR when it finds
content the package does not ship, and `--check` stays available as the read-only way to ask
the same question by hand.

Ground truth for "what a data release touches": `47525a3` ("add brutus boss"), plus what
the shipped tests actually depend on. Design: content that arrives from the hiscores
endpoint lives in **generated files owned by the robot**, so codegen is a file writer with
a deterministic diff — not string surgery into a hand-authored file.

## Goal

When Jagex ships content the wrapper does not ship, a script regenerates the derived files
and opens a **draft PR**. A human verifies spelling and merges. Nothing self-merges,
nothing publishes, `main` is never written to.

## What is actually derivable

Measured against the shipped constants, not assumed:

| Content                                                           | Derivable?                                                                                                                             | Where it lives                      |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Skills (25)                                                       | yes — keygen reproduces all 25                                                                                                         | `src/utils/generated/skills.ts`     |
| Bosses (71)                                                       | yes — keygen reproduces 70, 1 override                                                                                                 | `src/utils/generated/bosses.ts`     |
| Fixed activities (points, Bounty Hunter, clue scrolls, minigames) | yes — 7 of the 20 come from the rule, 13 from the override table (`LMS - Rank` → `lastManStanding`, `Clue Scrolls (all)` → `allClues`) | `src/utils/generated/activities.ts` |
| URLs, gamemodes, error classes                                    | not content                                                                                                                            | hand-authored in `constants.ts`     |

So `constants.ts` keeps the static URLs, the `GAMEMODES` list, the hand-written display-name
maps for clues and Bounty Hunter, and the error classes. `ACTIVITIES` is
`[...FIXED_ACTIVITIES, ...BOSSES]`, both generated in hiscores order, which is what makes
`ACTIVITIES.indexOf(boss)` the correct hiscores `table=` number by construction rather than by
care. Every import and public type is unchanged: `src/utils/index.ts` still re-exports
`./constants.js`, and the `as const` array → `type Boss` → `{ [key in Boss]: string }` chain
still gives a compile error if a key and its display name drift apart.

A name the table does not cover is a normal addition, generated like any other — but picking a
public key is a human decision, so a name whose _key_ disappears from the hiscores (a rename
the table cannot follow, a retirement) stops the run instead of diffing the key away.

## Keygen

```js
const keygen = (name) =>
  name
    .replace(/['’]/g, '') // Phosani's Nightmare → phosanisNightmare
    .replace(/^The\s+/i, '') // The Leviathan → leviathan
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((word, i) =>
      // keep capitals inside a word
      i === 0
        ? word[0].toLowerCase() + word.slice(1)
        : word[0].toUpperCase() + word.slice(1)
    )
    .join(''); // TzKal-Zuk → tzKalZuk, Kree'Arra → kreeArra
```

Lowercasing each whole word instead ("the obvious version") breaks three shipped keys —
`tzKalZuk`, `tzTokJad`, `kreeArra` — and needs three overrides. Preserving inner capitals
leaves fourteen: the boss `Barrows Chests`, and thirteen legacy fixed-activity keys no rule can
name — four Bounty Hunter entries, seven clue rows, `LMS - Rank` and `PvP Arena - Rank`. That
table is the whole cost of making the fixed block derivable; the other seven fixed names fall
out of the rule.

Validation before any write, all fatal:

1. **Reproduce history** — `keyOf(display) === key` for every shipped key in both maps.
2. **No removals** — a key the hiscores no longer lists is a human decision, not a regen.
3. **No duplicate keys** — a rule collision must be caught, not shipped.
4. **Two reference RSNs agree** — `B0aty` and `Lynx Titan` must return the same name list in
   the same order, or nothing is written.
5. **Removals** — a key the endpoint no longer lists, in any group, stops the run. Removing
   content is a human decision, and this is what a shrinking fixed block looks like.
6. **One namespace** — uniqueness is checked over `[...FIXED_ACTIVITIES, ...BOSSES]`, because
   that is the list `indexOf` resolves against. Two entries sharing a key would send every
   request after the second one to the wrong table.

## Ordering

The generated files' line order _is_ the hiscores order — they are rewritten from the live
response, so there is no splice to get wrong, no adjacency to assert, and no position for a
human to paste into. The fixed block is the run before the first name that matches a shipped
boss; bosses are everything from there on. `ACTIVITIES` is their concatenation, so its indices
are the hiscores `table=` numbers by construction.

## README

The boss table sits between two markers and is regenerated from the same entries:

```md
<!-- begin:bosses -->

| Boss Name    |     Param     |
| ------------ | :-----------: |
| Abyssal Sire | `abyssalSire` |

<!-- end:bosses -->
```

Rows are emitted unpadded and prettier aligns the table, so the diff is content only — except
when a new display name is wider than the current widest column, which re-pads every row and
makes that PR look like a rewrite of the table.

## Flow

```
scripts/regen-content.ts            write generated files + README table
  --check                           report drift, write nothing, exit 1

scripts/codegen-content-pr.ts       regen, run the gate, open a draft PR
  --dry                             regen, print branch/title/notes/diff/PR body, touch no git state
```

`--dry` still rewrites the generated files — the git state is what it leaves alone — and the
diff it prints is the diff once those files are corrected. So a simulated drift has to be
committed to be visible; an uncommitted one is simply overwritten.

`codegen-content-pr.ts` runs the same gate as CI (prettier, eslint, `tsc`,
`tsc -p tsconfig.scripts.json`, vitest) before
it commits, then `git switch -C content/add-<keys>` → commit → `git push --force` →
`gh pr create --draft`. Force is safe here because the branch is bot-owned and rebuilt from
the default branch every run — a second dispatch must replace the first, and without it the
push is rejected as non-fast-forward. When a PR for that branch is already open, the push
updates it instead of opening a second one. It only ever stages `src/utils/generated` and
`README.md`.

The PR body carries the one check a machine cannot make — that the display name is spelled
exactly as the game spells it, because a typo becomes permanent public API — plus a note
when a new name was appended to the end of the hiscores list. It also states that the gate
above is the CI result: GitHub does not run `pull_request` workflows for PRs opened with
`GITHUB_TOKEN`, so the PR will show no checks of its own.

## Workflow

`.github/workflows/content-drift.yml`:

- **schedule** (daily) → codegen: files or updates the draft PR, and exits green when there is
  nothing to add.
- **workflow_dispatch** → the same step, with `dry_run` defaulting to true so a human can
  rehearse first.

Both run the same command, so there is one code path to trust. The job asks for
`contents: write` and `pull-requests: write`, and never for merge permission. A `concurrency`
group keeps two runs off the same branch.

## Verification

| Check                                     | Result                                                                                                                                                                                                                                                                  |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `regen --check` against the live endpoint | up to date, exit 0 — the generator reproduces shipped content byte-for-byte                                                                                                                                                                                             |
| Refactor proof                            | generated files are the moved literals and the public surface is unchanged: 35 runtime exports identical to the base branch, `lib/utils/index.d.ts` byte-identical, only the four moved names re-exported instead of declared; `tsc` clean, 31 tests pass               |
| Drift detection rehearsal                 | with a boss removed from the repo, the flow reported the addition, chose `content/add-zulrah`, titled `feat: add Zulrah`, and printed the exact two-line diff                                                                                                           |
| Real drift found on first run             | README boss table had drifted from the endpoint in five places: `Chambers Of Xeric` → `Chambers of Xeric`, `Theatre Of Blood` → `Theatre of Blood`, `Kreearra` → `Kree'Arra`, `Vetion` → `Vet'ion`, and a missing `Shellbane Gryphon` row                               |
| Not needed after all                      | fixture recapture and test edits — `parseJsonStats` derives keys from `BOSSES` and falls back to `-1` for names the fixture lacks, so `Object.keys(bosses)` still matches `BOSSES` with a stale fixture. Dropped rather than churning ~130 lines of rank noise per PR   |
| Adversarial review                        | no P0; two P1s fixed (pre-boss blind spot, duplicate-dispatch push rejection) plus the correctness items it found — `JSON.stringify` literals, `Object.hasOwn`, function replacer for the README, keygen diagnostic, `git add -N` in `--dry`, `validate` now under test |
| Fixed block generated                     | a 13-pair table plus the rule reproduces the shipped `ACTIVITIES[0..19]` exactly; the emitted `ACTIVITIES` declaration is byte-identical to the base branch, `ActivityName` is unchanged, and `constants.ts` shrinks to a shim                                          |

## Known ceilings

- The scripts are TypeScript, run by Node's native type stripping, so they need Node >= 22.18
  (the content job pins 24). The library itself still supports the 20.19 in `engines`.
- `scripts/**` is type-checked by `tsconfig.scripts.json` (noEmit) instead of the build config,
  which is why `@types/node` can be a devDependency without leaking a node reference into the
  published `.d.ts` — verified by diffing `lib/` against the base branch.
- `scripts/**` carries an eslint override that turns off `no-console`, `no-await-in-loop`,
  `no-restricted-syntax`, `no-continue`, `import/extensions` and
  `import/no-extraneous-dependencies` — app-style rules that do not fit a CLI which prints and
  writes files in order.
- The scripts read the shipped constants through `lib/`, so `pnpm build` must run first
  (CI does it in the previous step). A stale `lib/` can over-report what is "new"; the
  written files are unaffected because they come from the live response.
- Everything the endpoint lists is regenerated. A rename that moves a key is caught as a
  removal; a rename that keeps its key is invisible for the fixed block, because the package
  keeps no display name for every fixed entry (`FORMATTED_*` scalars cover only some).
- `src/utils/generated/*` is excluded from eslint (`ignorePatterns`) — machine-written, checked
  by prettier and `tsc` instead.

## Decisions

1. **Auto-file PRs on drift** — the daily job opens the PR itself; a manual dispatch stays dry
   by default. Drift therefore arrives as a draft PR rather than as a red run. A run still ends
   red when a key disappears or the gate fails.
2. Renames stay issue-only forever, or allow flagged draft PRs after a few months of track
   record?
