# Building a Chrome extension at scale

*2026-01-30 · 8 min read*

A few years ago I built a Chrome extension for real-time exam proctoring. At peak it served 5,000+ MAU with 99.9% uptime over WebSocket connections.

Here are the things I wish I'd known on day one.

## Manifest V3 is not optional

If you're starting a new extension in 2026, it must be V3. Service workers replace background pages. Persistent connections need careful handling. The migration from V2 was painful for the entire ecosystem — don't add yourself to that list.

## Storage strategy matters more than you think

Chrome's `storage.local` and `storage.sync` are not interchangeable. `sync` has tight quotas (100KB total, 8KB per item). `local` has 10MB but doesn't roam between devices.

For our proctoring use case: ephemeral session state in `local`, user prefs in `sync`, exam data on the server.

## Don't trust the page

The single biggest lesson: a content script runs in the same DOM as the page, but it should treat that DOM as hostile. Sites change. Frameworks re-render. Ad scripts do unspeakable things to the DOM tree. Build your selectors to be loose, your error handling to be paranoid, and your fallbacks to be loud (in dev) and silent (in prod).

## WebSockets without tears

We had 1,000+ concurrent sessions. Three things kept us sane:

1. **Aggressive heartbeats.** Don't trust the OS to tell you a connection is dead. It won't.
2. **Exponential backoff with jitter.** Without jitter, every disconnected client reconnects at the same moment and DDoSes you.
3. **Graceful degradation.** If the WebSocket dies for good, fall back to polling. The user's exam shouldn't fail because their wifi blinked.

## Distribution

Chrome Web Store review times have gotten worse, not better. Plan for 5–10 business days on a meaningful release. If you're shipping critical fixes, this is unacceptable, so... don't ship critical fixes through the store. Have a self-update mechanism for enterprise installs.
