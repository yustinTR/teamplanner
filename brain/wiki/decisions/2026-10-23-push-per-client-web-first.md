---
type: decision
title: Push is built per client, web first
created: 2026-10-23
updated: 2026-10-23
status: accepted
decided_by: Yustin Troost, product and technical call, 2026-10-23
supersedes: ""
tags: [notifications, android, parity]
sources: ["[[2026-10-23-open-questions-answered]]", "[[2026-08-24-v2-sync-push-stats-design]]"]
---

# Push is built per client, web first

## Decision

Web Push for the PWA and Android push are implemented separately, each on its own path, and the web goes first; Android follows once the web's push works.

## Context

Asked whether to build Web Push, Android FCM, or one sender for both, Yustin chose separate paths: *"liefst wel allebei apart pushen zodat sommige dingen in de ontwikkeling anders kunnen blijven en daarbij heeft web voorrang op android"* ([[2026-10-23-open-questions-answered]]). The August design covers the web side ([[2026-08-24-web-push-via-service-worker]]); the Android side is phase 5 of its plan.

## Alternatives considered

- **One server-side sender fanning out to Web Push and FCM subscriptions.** Less duplication, but couples the two clients' release pace, which is exactly what Yustin wants to avoid while Android is behind.
- **Android first**, because native push is simpler. Rejected by the web-first rule of [[2026-10-23-web-is-the-source-of-truth-for-both-clients]].

## Consequences

- The three triggers (availability reminder, lineup published, match changed) are the shared contract; the sending mechanism is not. Record both in [[web-android-parity]].
- The `push_subscriptions` table of the August design should still leave room for an Android subscription type later, so the triggers' queries do not need rewriting (synthesis).
- Order of work: Web Push next, Android push in phase 5.

## Where it lives in the code

- Nowhere yet. Web plan in [[2026-08-24-web-push-via-service-worker]].
