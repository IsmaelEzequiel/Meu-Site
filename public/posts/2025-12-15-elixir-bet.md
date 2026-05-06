# Why I still bet on Elixir

*2025-12-15 · 6 min read*

Every year someone declares Elixir dead. Every year I find another reason to reach for it.

## The pitch hasn't changed

Concurrency that doesn't make you cry. Hot code reloading that actually works. Pattern matching that makes you wonder why other languages fight you. The BEAM, fault tolerance, supervision trees — the same gospel José Valim has been preaching for over a decade.

## What changed

The ecosystem grew up. Phoenix LiveView gave us a real-time programming model that React still hasn't matched on the server. Phoenix Channels are still the cleanest WebSocket abstraction I've used. Oban quietly became the best background job library in any language.

The tooling caught up too. ElixirLS in VS Code is genuinely good now. Mix is still a joy. Releases just work.

## What still hurts

Hiring. Always hiring. The pool is small. You will train people. Embrace it — make it part of your engineering culture, not an embarrassment.

The mobile story. There isn't one. If your product needs a mobile app, you're back in TypeScript-land for at least part of the stack.

Library breadth. Some niches are well-served (web, data pipelines, distributed systems). Others (ML, embedded, gamedev) you're better off elsewhere.

## My stack heuristic

For anything multi-tenant, real-time, or fault-sensitive — Elixir, full stop. For everything else, I pick the boring tool. Elixir is the boring tool more often than people give it credit for.
