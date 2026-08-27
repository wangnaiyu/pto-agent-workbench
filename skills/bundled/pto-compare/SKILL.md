---
name: pto-compare
description: Compare a PyPTO 3.0 baseline and candidate run under an explicit compatibility gate, then report evidence-backed metric deltas and regressions. Use for collected or clearly labelled simulated before/after evidence; do not use for a single run, projections, or runs with unresolved comparison identity.
---

# PTO Compare

Determine whether a candidate supports its optimization hypothesis without turning two nearby run directories or two precise-looking numbers into a false causal comparison. This Skill is read-only.

## Establish both runs

Require the user or experiment record to identify the `baseline` and `candidate` roles explicitly; never infer roles from directory names, timestamps, or ordering. Inspect both runs with `pto_run_inspect`. If either inventory is truncated, compile health is unresolved for the question, required capability is absent, or provenance/share safety is unclear, resolve the gap or apply `pto-evidence-intake` before comparison.

Run paths and `identityStatus=unverified` cannot prove cross-run identity. Build a comparison identity from cited evidence for:

- operator/program and, for L3, rank/dispatch identity;
- workload and input/shape/dtype/batch or equivalent;
- hardware identity;
- software/compiler/runtime version;
- collection configuration and collection overhead;
- metric definition and unit;
- scope and timebase;
- round, warmup, sample set, and statistic or aggregation;
- source/build lineage and the exact candidate change.

Preserve task identifiers in their program/rank namespace. Display labels, filenames, `taskId` alone, and uncalibrated numeric confidence do not establish a match.

## Gate comparison

Classify task matching as `matched`, `partial`, `unmatched`, or `unavailable`. A collected delta is admissible only when the relevant task is `matched`, every comparison-identity dimension is supported and compatible, and the only material difference is the declared candidate change. Any other difference is a confounder and blocks the causal comparison.

For `partial`, `unmatched`, `unavailable`, stale source, or any unresolved identity dimension:

- show baseline and candidate observations separately;
- list mismatched or missing fields and the evidence needed to resolve them;
- do not calculate or display a combined performance delta;
- do not conclude that the optimization hypothesis is supported or rejected.

An added DFX capability makes a run `diagnostic`, not automatically comparable. Different collection overhead, scope, clock/timebase, aggregation, hardware, workload, or undeclared source/config changes block a causal comparison even when the metric names match.

## Compare admitted metrics

Separate `projected`, `simulated`, and `collected` values. A projection is never after-run verification. A simulated comparison may validate a deterministic fixture rule but must remain L2 and cannot substantiate real hardware improvement.

For each admitted metric, cite both source artifacts and preserve its definition, unit, scope, sample/round semantics, and whether higher or lower is favorable. Compute absolute change as `candidate - baseline`; compute relative change against the baseline only when the baseline is nonzero. Use a deterministic calculator for arithmetic and retain enough precision to audit the calculation, while formatting separately for presentation.

Do not call a directional delta significant or meaningful without the predeclared acceptance threshold and required variance/repetition treatment. If those are absent, report the observed direction and mark significance `needs-user-confirmation`. A correctness, compile, runtime, memory, or portability guard failure overrides a performance improvement.

Compare the declared target metric first, then guards and secondary diagnostics. Do not cherry-pick a favorable task while end-to-end scope regresses or while unmatched residual time remains material.

## Decide the hypothesis

Use only these outcomes:

- `supported`: matched collected evidence passes correctness guards and the predeclared performance threshold;
- `not-supported`: matched collected evidence fails the target threshold or a hard guard;
- `inconclusive`: evidence is matched but variance, repetitions, missing guards, or conflicting metrics prevent a decision;
- `incomparable`: the compatibility gate failed, so no causal delta is admitted.

Do not upgrade `simulated` evidence to `supported` for a real run. Preserve neutral and failed candidates as experiment evidence; do not erase them or immediately stack another change before interpreting the result.

## Return

Return a compact comparison record containing:

1. explicit run roles, evidence levels, run health, and provenance;
2. comparison identity with each field's evidence and mismatch status;
3. task match state and declared candidate change/confounders;
4. admitted metrics with before, after, absolute change, relative change when defined, thresholds, variance treatment, and guard results;
5. outcome with the exact evidence that supports it, plus conflicts and residuals;
6. the next action: accept the candidate for review, roll back, collect a compatible verification run, investigate a regression, or stop as incomparable.

Do not edit source or artifacts, run another experiment, publish evidence, or claim an optimal result in this workflow.
