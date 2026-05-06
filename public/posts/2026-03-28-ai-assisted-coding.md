# AI-assisted coding: a year in

*2026-03-28 · 7 min read*

I've been using Codex and Claude as part of my daily workflow for about 14 months. Here's what changed and what didn't.

## What changed

**Boilerplate is dead.** Setting up a new component, a new test file, a new API route — work I used to estimate in hours is now in minutes. The model gets you 80% of the way to a reasonable scaffold, and the 20% you adjust is the part that actually requires your judgement.

**Code review changed shape.** I read more code than I write now. Not because I write less, but because the model writes more. The skill that matters most is being a good editor.

**My memory got worse.** This is real. I don't memorize the exact shape of a TanStack Query hook anymore. I describe what I want, and the model fills it in. I'm not sure how I feel about this.

## What didn't change

**Architecture.** The model can implement a pattern, but it can't tell you which pattern fits your codebase, your team, your roadmap. Those decisions still take a human who has been with the system long enough to feel its grain.

**Debugging non-obvious bugs.** When the bug is "this works locally but fails in production," the model is roughly as helpful as a rubber duck. Not nothing — but not the breakthrough.

**Caring.** The model doesn't care about your code. You still have to.

## How I work now

1. Sketch the change in plain English first, in a comment.
2. Ask the model to implement it.
3. Read every line. Every line. *Every* line.
4. Refactor for the things only I notice.

I estimate this makes me ~30% faster on feature work and roughly the same speed on debugging and architecture. Net positive, but uneven.
