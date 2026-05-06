# The cost of legacy migrations

*2026-04-22 · 6 min read*

When you migrate a legacy system, the easy part is the code. The hard part is everything that grew up around it — the tribal knowledge, the undocumented edge cases, the integrations nobody remembers building.

I've led three migrations in the last four years. Each one taught me the same lesson: **the migration is not the project. The project is what you ship after the migration.**

## What I mean by that

When a stakeholder approves a migration, they're approving the destination, not the journey. Six months in, when the new stack is at 80% feature parity and the old one is still on life support, that's when the project actually starts. That's when you have to negotiate which of the old quirks were features and which were bugs.

## The 80% trap

The first 80% of a migration takes 50% of the time. The last 20% takes the other 50% — and then some. This isn't pessimism, it's structural: the easy paths get migrated first. The hard paths are hard for a reason.

## What actually works

- Ship to production early, even if it's behind a feature flag for one user.
- Keep the old system running. Don't romanticize cutover dates.
- Document the *intent* behind every quirk you preserve. Future you will thank you.

The team that migrates well is the team that treats the old system with respect — not as a legacy burden, but as a record of decisions that were probably reasonable at the time.
