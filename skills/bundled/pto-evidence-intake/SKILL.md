---
name: pto-evidence-intake
description: Prepare a PTO operator analysis by classifying input artifacts, data sensitivity, evidence authority, and claim status before diagnosis, optimization, or review. Use for PTO traces, compiler outputs, reports, screenshots, and performance observations; do not use for generic coding tasks.
---

# PTO Evidence Intake

Build a trustworthy evidence inventory before drawing PTO diagnostic or optimization conclusions. This Skill prepares the analysis; it does not replace the analysis tools or claim that a run was executed.

## Intake

Identify the user's question, the operator or run in scope, the supplied artifacts, and whether the result may leave the current workspace. Preserve upstream filenames, field keys, trace keys, and other literals exactly.

For each artifact, record:

- its path or stable identifier;
- what claim types it can support;
- its data level: `L1` real, `L2` derived from known schema or rules, or `L3` placeholder;
- whether it is share-safe, which is independent of being `L1`;
- any freshness, completeness, or permission uncertainty.

Never present `L2` or `L3` as a real run result. Disclose `L2` whenever it leaves the workspace. Do not send or publish `L3` data, and do not assume raw `L1` data is share-safe.

## Evidence plan

Classify intended claims as factual, design-intent, empirical, opinion, or derived. Current fields, paths, APIs, versions, and runtime behavior require an authoritative source such as the local PyPTO mirror, official documentation, or the actual run artifact. Issues and user reports prove that feedback occurred, not that a technical claim is true.

For non-trivial diagnosis or optimization, plan more than one evidence role when available: implementation or schema, runtime artifacts, official platform guidance, and clearly labelled empirical observations. Treat repository summaries as orientation only when a more authoritative source exists.

Assign each material claim one status: `verified`, `conflict`, `stale`, `unverifiable-missing`, `unverifiable-empirical`, or `needs-user-confirmation`. Keep conflicts and uncertainty visible.

## Handoff

Return a compact intake containing:

1. analysis question and scope;
2. artifact inventory with data level and share status;
3. claim-to-source plan and freshness requirements;
4. blockers, conflicts, and user confirmations still needed;
5. the recommended next workflow: diagnosis, optimization, before/after validation, or review.

Do not modify PyPTOUX or external mirrors during intake. If the evidence is insufficient, state the missing material instead of manufacturing a conclusion.
