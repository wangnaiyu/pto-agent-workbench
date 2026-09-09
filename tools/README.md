# tools/ — fixed runtime tool closures

`official/` contains selected, immutable upstream tool files used by released
analysis actions. Each release directory retains the upstream notices and
license text; exact source commit and content digests live in
`skills/official/release-lock.json` beside the Skill/tool compatibility tuple.

The current `pypto-runtime-77fa0171c24a` closure contains only the standalone
`deps_viewer.py` required by `dependency-redundancy`, not the complete PyPTO
runtime. It is post-processing only and does not install, build, capture, or
update an upstream environment.
