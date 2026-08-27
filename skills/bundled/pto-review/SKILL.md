---
name: pto-review
description: Synthesize a completed or halted PyPTO 3.0 investigation or optimization experiment into an auditable claim-evidence-decision record. Use for PTO experiment review, handoff, or retrospective; do not use for generic code/PR review, fresh diagnosis, or inventing missing analysis and comparison steps.
---

# PTO Review

Produce a traceable review of what a PTO investigation established, what it did not establish, and what decision follows. The review is a derived record, not a new source of truth and not approval to merge, deploy, edit, rerun, or publish.

## Admit the record

Identify the original question, operator/program scope, participants or decision owner when known, and the run roles explicitly recorded as `baseline`, `diagnostic`, `candidate`, or `verification`. Never infer roles from paths, timestamps, or ordering.

Collect the available outputs or cited artifacts from `pto-evidence-intake`, `pto-analyze` or `pto-debug`, `pto-optimize`, and `pto-compare`. Do not recreate a missing phase merely to make the story look complete. If a material output is absent, record the gap and its consequence.

Reinspect a referenced run with `pto_run_inspect` only when its current existence or evidence health needs confirmation. A review must not silently replace the evidence snapshot used by the original decision with newer files.

Preserve data level, share-safe status, provenance, identity status, and upstream literals. Never present L2 or L3 material as a real collected result. Disclose L2 when it leaves the workspace, do not send L3 outside the workspace, and do not assume raw L1 evidence is safe to publish.

## Build the claim ledger

Give each material claim a stable local identifier and record:

- the claim and its scope;
- claim type: observed fact, derived finding, design intent, empirical note, opinion, or hypothesis;
- supporting artifact paths or authoritative sources;
- conflicting evidence and alternative explanations;
- status: `verified`, `conflict`, `stale`, `unverifiable-missing`, `unverifiable-empirical`, or `needs-user-confirmation`;
- which later action or decision consumed it.

Preserve original status and chronology. A repeated claim, polished summary, later filename, or successful candidate does not retroactively verify its proposed mechanism. Do not hide negative, neutral, incomparable, or failed results.

## Reconstruct the decision chain

Separate these stages when they exist:

1. evidence admission and its limits;
2. observed symptom, bottleneck, or first failing boundary;
3. candidate hypothesis, declared change, predicted direction, risks, guards, and authorization;
4. actual code/config difference and run role, if execution occurred;
5. comparison identity, admitted metrics, hard guards, and `pto-compare` outcome;
6. resulting disposition and unresolved follow-up.

Keep projection, simulation, and collected validation distinct. Use `supported`, `not-supported`, `inconclusive`, or `incomparable` only with the meanings established by `pto-compare`; absence of a comparison is not `supported`. Correlation, a compiler hint, or a favorable local task delta does not prove end-to-end causality.

Record the decision owner and rationale when available. If no authorized decision was made, label the disposition `no-decision`; do not convert an Agent recommendation into user acceptance. Performance evidence alone does not approve source integration or deployment.

## Assess reuse

State the exact conditions under which the result may be reused: product line, source/build lineage, hardware, software/runtime, workload/shape/dtype, metric scope, collection configuration, and known boundary conditions. A result outside those conditions is a hypothesis for another experiment, not a reusable rule.

Preserve failed and neutral candidates as evidence about the tested conditions. Identify what was learned, what remains unknown, and whether the next action is adoption review, rollback, compatible recollection, a new single-variable candidate, regression investigation, or no further work.

## Return

Return a compact review containing:

1. question, scope, run-role inventory, provenance, evidence levels, and review completeness;
2. claim ledger with sources, conflicts, statuses, and consumers;
3. chronological evidence → diagnosis → candidate → authorization → execution → comparison chain, with absent stages explicit;
4. metric/guard results and comparison outcome without changing their evidence class;
5. disposition, decision owner, rationale, and whether it is recommendation-only or authorized;
6. reuse boundary, retained negative evidence, unresolved risks, and next action.

Do not alter source or artifacts, rerun an experiment, publish restricted evidence, or silently write a persistent review file. Write a file only when the user explicitly asks, and keep its cited evidence paths intact.
