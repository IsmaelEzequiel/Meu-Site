# On writing good code review

*2026-02-19 · 5 min read*

Code review is the highest-leverage thing a senior engineer does. It is also the most under-discussed.

## What a good review is for

Not catching bugs. CI catches bugs. A good review is for the things CI can't see:

- Is this the right abstraction?
- Will the next engineer who touches this understand what we were thinking?
- Does this solve the problem, or does it just dispatch the symptom?

## What a good review is not

- A test of the author's worth.
- An exhaustive search for every possible flaw.
- A place to argue style preferences that have no measurable impact.

## How I structure my reviews now

1. **First pass: read for intent.** Do I understand what this PR is trying to do? If not, comment that, ask.
2. **Second pass: read for correctness.** Does the code do what it claims?
3. **Third pass: read for survival.** Will this code be readable in 18 months when the author has left and the context has evaporated?

If a comment doesn't fit one of those three categories, I ask myself if I really need to leave it.

## The hardest skill

Knowing when to approve. Junior reviewers nitpick because nitpicking *feels* rigorous. Senior reviewers approve quickly when the substance is right and explain themselves when they don't.
