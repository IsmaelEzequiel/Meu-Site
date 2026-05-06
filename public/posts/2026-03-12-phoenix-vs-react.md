# Phoenix LiveView vs React

*2026-03-12 · 9 min read*

I've shipped production code in both. Here's the honest comparison nobody on Twitter wants to give you.

## The real question

It's not "which is better." It's "which is better *for the kind of app you're building, with the team you have, on the timeline you've been given*."

## When LiveView wins

- Internal tools. Dashboards. Admin panels.
- Anything CRUD-shaped where the UI changes a lot but the interactions are simple.
- Small teams who want to ship without context-switching between two languages.

The productivity is real. A junior dev with a week of Elixir can ship features that would take a React team a sprint.

## When React wins

- Mobile (obviously — React Native exists, LiveView doesn't).
- Anything with rich client-side state that doesn't need a server roundtrip.
- Hiring. The talent pool for senior React devs is 50x the pool for senior Elixir devs.

## The latency thing

The biggest LiveView gotcha: every interaction is a websocket message. Most of the time it's invisible. But when your user is on hotel wifi in Cusco, the seams show. React apps degrade more gracefully because so much state lives in the client.

## My current heuristic

If I'm building something *for users*, React. If I'm building something *for operators*, LiveView. If I'm building something *for both*, I pick based on who's hardest to hire for.
