---
name: pto-analyze
description: Characterize performance, numerical-accuracy evidence, or compiler transformations in one or more PyPTO 3.0 runs. Use to explain what a run's artifacts show; use pto-debug instead when the primary task is localizing a failure or wrong-result symptom, and do not use for changing or rerunning an operator.
---

# PTO Analyze

Produce an evidence-backed analysis of PyPTO run artifacts without modifying the run or claiming that absent evidence proves a cause.

Use this Skill to answer “what does the run show?”: where time is spent, where values diverge, or which transformations occurred. If the user's primary question is “why did this compile/run fail?” or “what caused this wrong result?”, route to `pto-debug`; analysis may characterize the symptom, but it does not own failure localization.

## Establish the run

Use `pto_run_discover` when the user has not identified an exact run. Ask the user to choose only when multiple candidates remain materially ambiguous. Inspect every selected run with `pto_run_inspect` before reading individual artifacts.

Treat the tool result as an inventory, not a diagnosis:

- `identityStatus=unverified` means the directory name cannot establish source or build identity;
- `not-observed` means the bounded inventory found no supporting artifact, not that collection was disabled or that the run failed;
- `artifactInventoryTruncated=true` prevents negative conclusions about missing evidence;
- L3 `next_levels` entries are child builds of the parent run, not independent runs.

If provenance, data level, or share safety is unresolved, load and apply `pto-evidence-intake` before drawing conclusions. Never present L2 or L3 material as a real run result. Do not send L3 data outside the workspace, and disclose L2 when it leaves the workspace.

## Select the analysis path

Choose the path from the question and observed capabilities:

- runtime performance: prefer `timeline`, then `hardwareCounters`, `taskGraph`, `scopeStats`, or `criticalPath` as supporting roles;
- accuracy or value divergence: require `tensorValues` and preserve the original tensor and argument identities;
- compiler transformation: use ordered `irLowering` snapshots, with `compileHints` or `memoryAllocation` only for the claims they directly support;
- insufficient evidence: report evidence health and the exact missing capability instead of rendering or narrating a substitute analysis.

Capability names route the workflow; they do not make all files mutually joinable. For distributed evidence, resolve the relevant child program before using its names or maps. Do not join compile and runtime evidence across captures merely because model, callable, or kernel names match.

## Analyze

Read only the artifacts needed for the selected question with the platform's ordinary filesystem tools. Preserve upstream filenames, field keys, pass names, trace keys, and other literals exactly.

Separate each material statement as observed fact, derived finding, design intent, empirical note, or unresolved hypothesis. A viewer, report, or adjacent diff is derived presentation evidence unless its source artifacts and generation rule are also available. Correlation and ordering do not by themselves prove causality.

This Skill is read-only. Do not edit generated artifacts, source code, configuration, or trigger a rerun unless the user separately authorizes a workflow that performs those mutations.

## Return

Return a compact analysis containing:

1. the question, run scope, identity status, and evidence health;
2. the selected analysis path and artifacts actually read;
3. findings with claim type and supporting paths;
4. conflicts, uncertainty, and alternative explanations;
5. the next best action: collect missing evidence, enter `pto-debug`, plan `pto-optimize`, enter `pto-compare`, or stop because the question is answered.
