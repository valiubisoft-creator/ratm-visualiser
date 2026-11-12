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
2. **Official YouTube embed** — plays behind the canvas and shows through the halftone. Install the audio tap below so the visuals can react without any prompt. Without it, Chrome asks to share the tab with audio (press `V` to ask again).
3. **Test signal** — a synthesised riff.

Press `L` to visualise audio from another tab or the microphone instead.

No recordings are included in this repository.

## Audio tap (one-time install, removes the screen-share prompt)

A web page cannot read the sound of a cross-origin YouTube embed. The `extension/` folder is a tiny Chrome extension that runs inside the embed, measures its audio and passes the levels to the page. It only acts when the embed sits in a page served from `localhost`, and it records nothing.

1. Open `chrome://extensions` and turn on **Developer mode** (top right).
2. Click **Load unpacked** and choose this repository's `extension` folder.
3. Reload the visualiser.

## How it reacts

- **Kick / snare** — plates jump out of register; the image tears into slices.
- **Instrument plates** — bass prints in the hot ink on a coarse screen, guitar and vocal mids in the key ink, cymbals in the pale ink on a fine screen, each at its own angle.
- **Song structure** — loudness is tracked against each track's own quietest and loudest passages. Quiet passages print sparse, with an outline-only waveform. When the band comes all the way in, a third plate is added and the paper and ink swap; the label in the bottom right shows `quiet`, `build` or `full`.
- **Title** — steps through the Redaction grades (10 → 100) as the track gets heavier, and jumps one grade rougher on every kick.

## Controls

| Input | Action |
|---|---|
| Scroll, ↑ / ↓ | Change track |
| Disc (right edge) | Click to bring it out; drag to turn, click a segment to pick, centre to shuffle |
| Space / click | Play / pause |
| ← / → , bottom bar | Seek |
| S | Shuffle |
| F | Fullscreen |

The same list is under the **Controls** button, top right.

## Credits

- Typefaces: Redaction (Titus Kaphar and Reginald Dwayne Betts, with Forest Young and Jeremy Mickel) and DM Mono (Colophon Foundry), both under the SIL Open Font License.
- [anime.js](https://animejs.com) (MIT).
- Music videos are embedded from the band's official YouTube channel and remain the property of their owners.
