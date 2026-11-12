# RATM Visualiser

A music visualiser that renders audio as a live screen-printed poster: halftone screens, flat inks, plates knocked out of register on the kick. Built with WebGL2 and anime.js v4.

## Run

```
node server.mjs
```

Then open http://localhost:4173 in Chrome (use `localhost`, not `127.0.0.1` — the YouTube embeds refuse a bare-IP origin).

## Audio sources

Each track slot uses the first source available:

1. **Your own file** — put audio files in `tracks/` (or drag them onto the page). A file whose name contains a track title fills that slot.
2. **Official YouTube embed** — plays behind the canvas and shows through the halftone. Chrome asks to share the tab with audio so the visuals can react; press `V` to ask again.
3. **Test signal** — a synthesised riff.

Press `L` to visualise audio from another tab or the microphone instead.

No recordings are included in this repository.

## Controls

| Input | Action |
|---|---|
| Scroll, ↑ / ↓ | Change track |
| Disc (right) | Drag to turn, click a segment to pick, centre to shuffle |
| Space / click | Play / pause |
| ← / → , bottom bar | Seek |
| S | Shuffle |
| F | Fullscreen |

## Credits

- Typefaces: Redaction (Titus Kaphar and Reginald Dwayne Betts, with Forest Young and Jeremy Mickel) and DM Mono (Colophon Foundry), both under the SIL Open Font License.
- [anime.js](https://animejs.com) (MIT).
- Music videos are embedded from the band's official YouTube channel and remain the property of their owners.
