---
name: pto-optimize
description: Design an evidence-backed, bounded optimization candidate and verification experiment for a PyPTO 3.0 operator. Use after analysis or debugging identifies a bottleneck and a source or configuration anchor; do not use for generic refactoring, unverified root-cause claims, or declaring an operator optimal.
---

# PTO Optimize

Turn a supported PTO diagnosis into a user-reviewable candidate experiment. This version produces a proposal; it does not modify source, generated artifacts, configuration, or execution state.

## Establish an admissible baseline

Start from an evidence-backed result from `pto-analyze` or `pto-debug`. Inspect the baseline with `pto_run_inspect` if its run scope and evidence health are not already established. Apply `pto-evidence-intake` when provenance, data level, share safety, or claim status remains unresolved.

Record the optimization objective and the baseline metric identity: workload and input or shape, program/rank scope, hardware and environment, configuration, collection settings and overhead, metric definition, aggregation, and correctness criterion. Do not invent missing values or silently adopt a convenient metric.

A concrete code or configuration candidate requires a defensible source/config anchor. Classify the join as `exact`, `candidate`, or `unverifiable-missing`; only `exact` supports binding a precise proposed edit to the baseline. `identityStatus=unverified`, a name match, or temporal proximity does not establish that the baseline came from the current source. For the other join states, return a conceptual action and the missing identity evidence.

## Form bounded candidates

Derive every candidate from an observed bottleneck or supported mechanism. A compiler hint, correlation, or visualization alone is not a root cause. Preserve competing explanations and prefer a read-only discriminating check when it could avoid an unnecessary experiment.

For each candidate specify:

- the editable source/config object and exact anchor;
- one intended material change, or an explicitly disclosed inseparable change set;
- the evidence-backed mechanism and expected direction of effect;
- expected magnitude only when supported by a compatible model or prior measurement;
- correctness, memory, compilation, portability, and performance risks;
- the metric that would confirm or falsify the hypothesis;
- rollback to the unchanged baseline.

Rank candidates by evidence strength, expected information gain, implementation/replay cost, and regression risk. Do not call the first candidate “best” or “optimal”; it is the next experiment under current evidence.

## Design the experiment

Keep the baseline immutable. Record `baseline`, `diagnostic`, `candidate`, and `verification` roles explicitly; never infer them from directory names, timestamps, or ordering. A diagnostic run that only adds DFX evidence is not an optimized candidate. Plan candidate work in a recoverable source working copy and a new output directory; never propose editing a captured run or overwriting its existing output directory.

Change one material variable per candidate when practical. Define comparison compatibility before execution: same task identity, workload/input/shape, hardware/environment, metric scope and aggregation, and compatible collection overhead. If any dimension differs, name the confounder and do not promise a causal before/after conclusion.

Define before execution:

- correctness tolerance and other hard guards;
- performance success threshold and required repetitions or variance treatment;
- compile/runtime failure stop conditions;
- artifacts and capability set to retain for `pto-compare`;
- rollback and what a failed or neutral result teaches.

Use user-provided thresholds. If none exist, mark them `needs-user-confirmation` rather than manufacturing acceptance criteria.

## Preserve the authorization boundary

Do not edit files, invoke `debug/run.py`, compile, run pytest, launch a device workload, collect DFX, or create a candidate run in this workflow. Return the exact proposed edit and execution plan for review. A later user request may authorize implementation and execution; that workflow must preserve the baseline, use a new output directory, disclose cost and data handling, and stop at its stated conditions.

Once a candidate run exists, stop generating new optimization claims and route it with the baseline to `pto-compare` before recommending another change.

## Return

Return a compact optimization proposal containing:

1. objective, admissible baseline, source/config join status, and evidence health;
2. bottleneck or failure mechanism, claim status, supporting evidence, and alternatives;
3. ranked candidate experiments with anchor, change, rationale, expected direction, risks, and falsifier;
4. correctness and performance acceptance criteria, comparability requirements, and stop conditions;
5. recoverable working-copy, new-output, rollback, and evidence-retention plan;
6. unresolved confirmations and the exact next authorization needed before implementation or execution.
