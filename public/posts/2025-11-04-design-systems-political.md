# Design systems are political

*2025-11-04 · 11 min read*

The technical part of a design system is the easy part. The political part is what makes or breaks it.

## What I mean

A design system is not a Storybook. It's a *contract* between design, engineering, and product about what gets built, how it gets built, and who gets to change it.

Most design systems fail not because the tokens are wrong or the component API is bad, but because that contract was never written down — or worse, was written down by one party and never agreed to by the others.

## The three failure modes

**The over-engineered system.** A team of platform engineers builds the perfect Button component with 47 props. Nobody uses it because it's harder than rolling your own. The system dies of its own complexity.

**The under-engineered system.** A designer publishes Figma components. Engineering ignores them. Six months later, every screen renders a slightly different button. The system never had teeth.

**The ghost system.** Components exist. They look great in Storybook. They're used in 30% of the app. The other 70% is the old codebase, and nobody has time to migrate. The system permanently has the energy of an unfinished basement.

## What I've seen work

Strict ownership. One team owns the system. They have product manager. They have a roadmap. They are not "shared infrastructure" — they are a product team whose users happen to be other engineers.

Migrations on the system team. Don't ask product teams to migrate. Have the platform team do it. Yes it's expensive. Yes it's the only thing that works.

Decisions are reviewed across disciplines. A new component isn't approved by engineering alone. Design and accessibility have veto power. Otherwise the design system becomes whatever was easiest to build, not what was right.

## The uncomfortable truth

A design system is a tax on team autonomy. You're saying: in exchange for consistency and quality, every team gives up some freedom. That tax has to be worth paying.

If your design system feels heavy, it's probably because the value isn't there yet. The answer is rarely "more components." It's usually "stronger contracts."
