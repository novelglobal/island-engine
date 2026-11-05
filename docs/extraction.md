# Taking the engine out of novel.global

The engine comes out of novel.global's repository (`front`) one piece at a time, behind the island format, and novel.global keeps working after every stage. Each stage is one change on `staging` there, checked on the preview and merged by the owner, as every change is now.

**Nothing moves until 1.0 C has landed in `front`.** 1.0 C is changing the receipt (its new `src/base/thermal.js`, `base.js`, `admin.js`, the Worker); moving those files under it would break both.

## What stays in novel.global for good

- **The aura shell**: the globe, the rings, the Irukandji and its tentacles, the blueprint paper (`src/base/aura.js` lines about 474 to 800, `aura.css`). It is novel.global's look; the engine only runs the steps underneath it.
- **The studio** at `/studio` (`src/app/*.js`, `body.html`, `app.css`): RADIO, SIGNALS, SIGNS, PORTFOLIO, the radar on MapLibre. It reads packs from E1 on but stays novel.global's.
- **The portfolio** (`portfolio.html`, the `posts` table), the touch screen sketch (`src/touch/`), and novel.global's own packs.
- **The receiver** (`receiver/pull.py`) until 1.0 A's island program replaces it.

## The stages

| Stage | What moves | Out of `front` | Into the engine | Proof it worked |
|---|---|---|---|---|
| **E0** contract | Nothing. The Worker's checks (`test/api.mjs`) are written up as the API every island answers, and the export is checked against the site | none | `docs/api.md`, `tools/export-front.mjs` | the export of `front` checks clean; `npm test` there unchanged |
| **E1** packs are the source | novel.global's data, as packs. `build.mjs` reads `island/` and writes the same `window.DA_*` it writes now | `src/field.js`, `briefs.js`, `places.js` and most of `config.js` become generated | the format, as a dependency | the built `dist/` holds the same data; every test passes |
| **E2** the core | The pure parts, no screen: the signal (`#x=` and `ng:`), the thermal renderer and ESC/POS raster, the cell reader, the photo's where and when, the moon, and the reading engine | `60-paper.js` (signal, raster), `thermal.js`, `66-packs.js`, `NG.exif` and `read`/`guess`/`related`/`caseOf` in `base.js`, the `ng:` line in `aura.js` | `core/` | the same piece makes the same bytes before and after (golden files); old printed codes still open |
| **E3** the server | `src/worker/index.js`, split by what it serves and written against two small doors: `sql` (the part of D1 it uses: prepare, bind, first, all, run, batch) and `blobs` (get, put, delete) | the Worker becomes a few lines: the engine's server with novel.global's manifest | `server/`, `server/schema.sql` | `test/api.mjs` passes unchanged |
| **E4** the journey | The piece and the panel in `aura.js` (about lines 1693 to 2066) read the steps pack; the words come from the pack and the builder | the step logic | `client/journey.js`, and a new `plain` shell | novel.global's journey is the same in every check; the sticker island runs in the plain shell in a browser |
| **E5** the map | The ground in greys, panned by hand (`base.js`, the ground), reading the map pack, with offline PMTiles. Layers become cells: iNaturalist (`10-data.js`), OpenStreetMap (`20-orbit.js`), cell packs, TRACKS (`68-tracks.js`) | the ground and the layer readers | `client/map.js`, `core/cells.js` | novel.global's map unchanged; the sticker island's map (if it has one) works offline |
| **E6** sound | The voices of `00-core.js` and the base's sound as the engine's recipes, chosen by the sound pack | the voice code | `client/sound.js` | novel.global sounds the same; a sound pack changes it |
| **E7** the builder | The approval page (`admin.html`, `admin.js`) grown into the island builder | the approval page | `builder/` | novel.global's approvals work as today; a new island is made from it (see [builder.md](builder.md)) |
| **E8** the Pi | 1.0 A's island program serves the engine's client and the island's API from SQLite and files | none | the conformance checks run against the Pi | **the brief's done:** the sticker island runs from packs alone, offline on a Pi, while novel.global runs from its own packs online |

## The order

```text
1.0 C lands ─┬─ E0 ── E1 ──┬── E4 ── E7
             │             └── E5 ── E6
             ├─ E2 (needs C's renderer) ─┘ (E4 needs E2)
             └─ E3 ─────────────────────────── E8 (needs 1.0 A's binary)
```

E1 and E3 can go side by side; E2 waits for 1.0 C because it moves C's work. E8 is the brief's "done".

## How each stage is done

1. One stage, one change, on `staging` in `front`, with the engine's matching change in this repository.
2. Before: the checks in `front` pass. After: the same checks pass, unchanged, plus that stage's proof.
3. The service worker's cache is bumped in `front` whenever the site changes.
4. The old phones rule stays: the engine's client code is plain script, no `?.`, no `??`, as `base.js` and `aura.js` are now.
5. `front` takes the engine as a dependency pinned to a version (a tag of this repository), so a change here never reaches novel.global until it is chosen there.

## Things found on the way, to settle in their stage

- Calls are written in two places: `DA_CONTACTS` in `config.js` and `CALLS` in `base.js`; a life's `call: 'council'` has no number in either. The lives pack's `calls` takes both (E1).
- The 80 mm paper is 512 dots at 180 dpi on the TM-T88V (as `DA_PRINTERS` and 1.0 C's `thermal.js` say); a 203 dpi printer has 576. The manifest gives each printer its own `dpi` and `dots`.
- The imagery novel.global uses (Esri World Imagery) may be viewed with credit but not kept offline. An offline island needs open tiles (OpenStreetMap, made into greys) — see [runtimes.md](runtimes.md).
- Partner printers are listed in `config.js` (`DA_PARTNERS`) and in the `printers` table. From E3, the manifest lists them and the table holds only what changes (tokens, last seen, mesh).
