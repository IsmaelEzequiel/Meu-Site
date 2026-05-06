# Migration story: Rails → Next

*2026-04-09 · 4 min read*

A short one. We migrated a Rails 5 + AngularJS app to Next.js over 14 months. Here's what I'd do differently.

## What I'd keep

The strangler fig approach. We routed new pages through Next from day one, while the old app stayed in production. Users didn't notice the seam. PMs didn't have to choose between new features and migration progress.

## What I'd change

I'd invest more in our Storybook setup *before* we started migrating screens. Half our migration friction was discovering, mid-screen, that we had three slightly different button components and nobody had decided which one was canonical.

Build the design system first. Migrate to it second. The temptation is to do them in parallel — don't.

## Numbers

- 45% reduction in page load time
- 30% reduction in frontend bug reports
- ~3x developer velocity on new features after migration
- 2 senior engineers full-time for 14 months

The math worked out. It usually does. The hard part is convincing leadership it'll work out *this time*.
