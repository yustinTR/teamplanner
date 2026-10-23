---
type: decision
title: One brain, two clients — the web app is the source of truth, Android follows
created: 2026-10-23
updated: 2026-10-23
status: accepted
decided_by: Yustin Troost, product and process call, 2026-10-23 (working session; no raw source)
supersedes: ""
tags: [android, parity, process, brain]
sources: []
---

# One brain, two clients — the web app is the source of truth, Android follows

## Decision

There is one brain for both repositories, it lives in `teamplanner/brain/`, and it keeps the parity ledger. The web app defines behaviour, data shapes and Dutch copy; the Android app must become and stay identical to it, with differences allowed only where Kotlin/Compose and Next.js genuinely differ, and every allowed difference written down.

## Context

On 2026-10-23 Yustin asked for the brain to cover the Android app as well, *"zodat het straks niet allebei een eigen leven gaat leiden maar juist identiek blijft"*, accepting that *"de 1 is een Kotlin app en de andere een Next.js site"*. The Android repository's own `CLAUDE.md` already names the web repository as the source of truth; what was missing is a place that records where the two have drifted — by 2026-10-23 the web had gained 3-4-3, auto-sync settings and a season dashboard that Android lacks, and Android had coach-managed availability four weeks before the web.

## Alternatives considered

- **A brain per repository.** Two places to record one product's reasoning; the drift would be invisible in both.
- **A third, shared repository for the brain.** Clean, but a third checkout for a solo developer, and the `docs/plans/` skills write into the app repositories anyway.
- **Shared code instead of a ledger** (a KMP module, generated models). Would prevent some drift at a cost nobody has scoped; not excluded for later, out of scope now.

## Consequences

- `brain/CLAUDE.md` names three immutable source locations: `brain/raw/`, `teamplanner/docs/plans/`, `teamplanner-android/docs/plans/`.
- [[web-android-parity]] is the ledger: every feature with its state on both clients, every allowed difference with its reason. A feature design on either side updates it.
- Before building a feature on one client, read the ledger; after building, record whether the other client needs it. A web feature that Android lacks is a gap, not a decision, until the ledger says otherwise.
- The Android `CLAUDE.md` points at `../teamplanner/brain/` and this rule.
- The brain never edits either codebase; it records the gap and who owes the port.

## Where it lives in the code

- `teamplanner/brain/` (this brain), `teamplanner/CLAUDE.md` and `teamplanner-android/CLAUDE.md` (pointers)
