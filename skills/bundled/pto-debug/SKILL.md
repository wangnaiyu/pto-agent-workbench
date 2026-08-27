---
name: pto-debug
description: Localize a PyPTO 3.0 compile, runtime, or wrong-result failure from one or more runs and propose a discriminating next check. Use when the primary task is explaining a failed, stopped, erroneous, or contract-violating run; use pto-analyze instead to characterize an otherwise valid run, and do not use for changing or rerunning an operator.
---

# PTO Debug

Localize a PyPTO failure to the narrowest evidence-backed phase and propose the next diagnostic action without modifying code, artifacts, configuration, or execution state.

Use this Skill to answer “why did the run fail or violate its expected result, and what check would distinguish the causes?” A request that only asks where time is spent, where values differ, or which compiler transformations occurred belongs to `pto-analyze` unless those observations are being used to localize an explicit failure symptom.

## Establish the failing run

Use `pto_run_discover` if no exact run is named, then call `pto_run_inspect` for every selected run. If the result is L3, use `subBuilds` to identify the relevant child program and inspect that child path before making compile-side health claims.

Treat the inspection contract literally:

- `runHealth.compileStatus=incomplete-or-failed` means the recognized L2 run lacks observed `passes_dump/`, `ptoas/`, and `kernels/` file evidence; report “运行未完成或失败” and inspect available diagnostics;
- `runHealth.compileStatus=unknown` means truncation or an L3 parent prevents the same conclusion;
- an optional DFX capability with `status=not-observed` is primarily “本次未采集”, not proof that collection was disabled and not proof of failure;
- use only the capability's `collection.runConfigLiteral`, `pytestLiterals`, and `costNote` when proposing recollection; never reconstruct or approximate those upstream literals;
- `identityStatus=unverified` prevents claims that the run came from the current source or build.

If provenance, data level, or share safety is unresolved, load and apply `pto-evidence-intake` before reading or transmitting raw evidence. Never present L2 or L3 fixtures as real customer results, and never send L3 outside the workspace.

## Triage by symptom

First preserve the user's observed symptom, expected outcome, failing command or entrypoint, and the earliest known failure boundary. Then choose only the relevant path:

- compile or lowering failure: read `runHealth.diagnosticArtifacts`, the last available ordered `irLowering` snapshots, and directly relevant compile reports;
- runtime crash, hang, or incomplete execution: inspect runtime logs and the last observed runtime-side capability, while keeping compile success and runtime success separate;
- wrong result or accuracy divergence: require `tensorValues` plus the expected-value source and preserve original tensor, argument, rank, and program identities;
- missing performance evidence with an otherwise valid run: route to `pto-analyze`; do not relabel an uncollected timeline or PMU file as a runtime failure.

Read the smallest relevant artifacts with ordinary filesystem tools. Preserve upstream filenames, fields, error text, pass names, and command literals exactly. For long logs, locate the earliest material error and include enough preceding context to establish its phase; repeated downstream errors are consequences unless independently supported.

## Form and test hypotheses

Separate observed facts, derived phase localization, candidate causes, and unverified hypotheses. Rank candidates by how directly they explain the first failing boundary. Do not infer causality from filename presence, ordering, correlation, or a single compiler hint.

Prefer a read-only discriminating check that can eliminate candidates. Do not execute `debug/run.py`, pytest, compilation, device workloads, or recollection; do not edit generated or source files. If execution or mutation is needed, return the exact proposed action, expected evidence, risk or collection cost, and required user authorization.

## Return

Return a compact debug record containing:

1. symptom, expected outcome, run scope, identity status, and evidence health;
2. earliest evidence-backed failing phase and the artifacts actually read;
3. observed facts and ranked candidate causes, each with supporting and conflicting evidence;
4. missing evidence, using “本次未采集” versus “运行未完成或失败” correctly;
5. the smallest next diagnostic action and its success/failure discriminator;
6. whether to collect evidence, request an authorized rerun, enter `pto-optimize`, or stop.
