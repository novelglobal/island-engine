# The island format, version 0.1

An island is **one manifest and a set of packs**, all plain files: JSON, CSV, GeoJSON, SVG, fonts, sounds, PMTiles. Nothing in a pack is code, so a pack from anyone can be added to any island without risk, offline, without asking anyone.

```text
islands/<island>/
├── island.json            the manifest: what the island is
└── packs/
    ├── map/pack.json      the ground, its tiles, its layers of cells
    ├── lives/pack.json    the species and stories of the place
    ├── sound/pack.json    voices, moods, tempo
    ├── steps/pack.json    the journey, any number of steps
    ├── style-*/pack.json  how a receipt looks (1.0 C's style pack)
    └── templates/pack.json  what a receipt holds, block by block
```

Every file is checked against its schema in [`schemas/`](../schemas/). A file that fails is refused whole, never half loaded.

## The words used

| Word | Meaning |
|---|---|
| **island** | One community's print place: a manifest, its packs, its printers |
| **manifest** | `island.json`: the name, the place, which packs, which printers, who may print |
| **pack** | A folder with a `pack.json` and the files it names. Six kinds: `map`, `lives`, `sound`, `steps`, `style`, `templates` |
| **cell** | One thing on the map: a point with a kind, a name and a few words. Every layer, whatever went in, comes out as cells |
| **step** | One moment of the journey, with the fields it asks for |
| **piece** | What one person makes in one journey: the values of every field. A template prints a piece |
| **template** | A receipt's blocks in order, each filled from the piece |
| **style** | How the blocks look on paper and on screen: fonts, sizes, photo filter, frame |
| **shell** | The client's own look and motion (novel.global's is the aura). Code, so installed by the island's keeper only; never in a pack |

## The rules

1. **Packs are data.** No scripts, no HTML, no remote code. SVG is drawn as an image (never inline), so it runs nothing.
2. **Offline first.** Everything a step needs is in the packs. A source on the internet (`live`) is always optional and always has an offline fallback in the pack.
3. **Paths stay inside the pack.** Relative, forward slashes, no `..`, no leading `/`.
4. **Ids** are lowercase letters, numbers and `-`, at most 63 characters. A pack's full id is `<author>/<name>`.
5. **Versions** are semver. A manifest names a pack by folder, or by `{ id, version, url, sha256 }` when it is fetched; the hash is checked before anything is read.
6. **Licences** are SPDX ids. A pack without one is not loaded. Packs are suggested CC-BY-SA-4.0.
7. **Time shown to people is the moon.** Phases, never dates or countdowns (`clock: "moon"`). Durations inside the files (how long a cache lasts) are ISO 8601, for machines only.
8. **Printed codes outlive releases.** The signal formats (`#x=` links and `ng:` mesh lines) belong to the engine, not to a pack, and stay backwards compatible.
9. **Privacy.** No pack can add a tracker, an analytics call or a host the manifest does not list in `network.hosts`.

## The manifest: `island.json`

| Field | What it holds | Required |
|---|---|---|
| `format` | `"island/0.1"` | yes |
| `id`, `name` | the island's id and its name as printed | yes |
| `place` | `centre` [lat, lng], `bbox` [west, south, east, north], `timezone`, and `country`: whose Country it is and the line said for it | yes |
| `clock` | `"moon"` (the only one so far) | no |
| `packs` | one entry for each kind: `map`, `lives`, `sound`, `steps`, `templates`; `style` is a list, the first the default | `steps`, `templates`, `style` |
| `printers` | each printer: `id`, `name`, `model`, `paper` (58 or 80), `dpi`, `dots`, `approval` (`required` or `auto`), `mesh` | yes, one at least |
| `access` | who may print: `anyone` on the island's Wi-Fi, `code` (a short code printed or said), or `approved` (every piece waits); and how long waiting pieces are kept | yes |
| `network` | `online` (true or false), `hosted` (its address, when it has one), `directory` (listed on novel.global's directory), `mesh` (the radio's channel), `hosts` (every outside host a live source may ask) | yes |
| `codes` | the code prefix (`DA` on novel.global) and the reserved showcase code (`888`) | no |
| `client` | the `shell` (`plain` by default; `aura` is novel.global's own) and the screen's `start` step | no |
| `about` | a link and a few words for the directory | no |

## The packs

Every `pack.json` starts the same: `pack` (its kind), `id`, `version`, `name`, `by`, `licence`, `engine` (the format it needs, `"^0.1"`). The rest depends on the kind.

### map: the ground and its cells

- **`area`**: the bbox, the zooms, the centre.
- **`basemap`**: the ground. `pmtiles` (a file in the pack, served by the island itself, read by range requests) and, only when online, `online` (a tile address). `look` says how it is drawn: `greys`, `as-is` or `ink`. Its `attribution` is shown, always.
- **`terrain`** (optional): heights, as PMTiles or a tile address.
- **`kinds`**: every kind of cell: its word, its icon (an SVG in the pack, or a glyph name), its colour, its sound.
- **`layers`**: each a set of cells. A layer's `source` is one of:
  - `csv` or `geojson`: a file in the pack. `columns` names which column holds what (`lat`, `lng`, `name`, `kind`, `note`, `url`).
  - `cells`: the engine's own cell list, as novel.global's cell packs are today (`docs/cell-packs.md` there).
  - `live`: an adapter (`inaturalist`, `overpass`, `open-meteo`, `csv-url`), its query and how long an answer is kept. Always with an `offline` file to fall back on, which may be empty.
  - `stories`: what visitors placed and the keeper approved.
- Each layer is `on` or off at first, `locked` on or not (the keeper's TRACKS), with its `track` name, its `sound`, and `max` cells.

**Cells out.** Whatever goes in, each row becomes a cell: `{ id, layer, kind, name, lat, lng, note?, url?, t? }`. A row that can't be placed is counted and left out. Cells outside the area are dropped.

### lives: species and stories

- **`species`**: a file of lives. Each: `id`, `n` (Latin), `cn` (common name), `g` (its group), and what the island knows of it: `st` (native, introduced, threatened, edge), `act` and `brd` (twelve letters, one a month), `heat` and `water` (0 to 3), `call` (who to ring), `aware`, `harm`, `help`, `note`, `src` (sources, required for any claim).
- **`groups`**: each group's word, colour, icon and sound.
- **`stories`**: files of stories of the place: `case` (something that worked elsewhere, as novel.global's briefs), `group` (people already caring for ground here), `hero` (one in greatest need).
- **`calls`**: numbers to ring, each with its words.
- **`seasons`** (optional): an outlook by month, with its sources.
- **`live`** (optional): where sightings come from when online (iNaturalist, its place and taxa).

### sound: voices, moods, tempo

- **`tuning`**: a root note and a scale (`minor`, `pelog`, `slendro`, `harmonic`, or the steps in cents).
- **`tempo`**: beats a minute, and whether sounds land on the grid.
- **`voices`**: each a `synth` (a named recipe of the engine, with its settings) or a `sample` (a sound file in the pack). Recipes are the engine's: a pack chooses and tunes them, never writes new code.
- **`moods`**: named mixes (which voices, how loud, the room).
- **`bind`**: which voice a group, a kind, a layer or a step sounds in.
- **`limits`**: the most voices at once, so a small phone keeps up.

### steps: the journey

A journey is **any number of steps**, in order. A step has an `id`, its `name`, an `icon`, its `words` (the tab, the question, a line of help, all editable on the builder) and its `fields`.

A field has an `id`, a `type` and that type's settings:

| Type | Asks for |
|---|---|
| `photo` | a photograph: the camera, a file, or none; where and when from the picture itself |
| `text` | a few words, up to `max` characters |
| `lines` | a fixed number of lines, each with its own heading and help |
| `choose` | chips from a list, from a pack's kinds, or from the template list |
| `catch` | something from the island: the map, a life, a reading, the season |
| `place` | where it is: the phone, the photo, or a touch on the map |
| `art` | how the picture is drawn: the photograph, pixels, a net, a sign, or a style's own |
| `frame` | a frame from the chosen style |
| `print` | which printer and which template; or keep it, pass it on as a link, send it by mesh |

A step can be `optional`. A step can name a `phase`, a word that groups steps (novel.global groups its four into NOTICED, RESPONSE and DIRECT ACTION). The last step holds a `print` field, or the journey ends without paper.

**The piece** is every field's value, by `step.field`: `notice.photo`, `wish.lines`. Templates read the piece by these paths.

### style: how it looks

The style pack is **1.0 C's**: what it defines in novel.global's repository becomes this pack, unchanged, inside the pack header. The schema follows 1.0 C's draft (`src/base/thermal.js` there) and is checked again when it lands. A style sets:

- `fonts` on paper and `screen` fonts: `head`, `body`, `small`, each one of the engine's faces (`sans`, `narrow`, `serif`, `mono`, `hand`, with a weight) or a font the style carries;
- `size` (the words against the poster as drawn), `lead`, `margin`;
- `photo`: `dither` (`auto`, `atkinson`, `floyd`, `bayer`, `none`), `contrast`, `sharpen`, `gamma`. The curve is the printer's own, from its calibration strip, so it belongs to the printer, not the style;
- `frame` round the picture, `rule` under the words, `top` (the mark and name, or a solid band), `night` (solid or shade);
- `colours` on screen, a `mark` printed at the foot, and `assets` (fonts and images as data URLs, six at most, 90 KB together).

Words are always set on the printer's grid as solid ink; only photographs are dithered. A style pack holds up to twelve styles; the manifest's first is the default.

### templates: what a receipt holds

A template has an `id`, a `name`, the `paper` it fits, and **blocks** in order. Each block is a `type` and where it is filled from (`from`): a piece path (`wish.lines.h`); what the engine reads from the piece against the packs (`read.life`, `read.threat`, `read.tied`, `read.join`: the life it may be, a place tied to it, a group to join), never made up to fill a gap; an island value (`island.name`); or fixed words in single quotes. A block with `when` prints only if that value is there.

`photo` · `heading` · `text` · `lines` · `data` · `art` · `image` (a file in the pack) · `marks` · `rule` · `space` · `qr` (a link or the mesh line) · `code` · `moon` (the phase) · `cut`

How each block looks comes from the style. A template can also give a `mesh` line, the piece as one `ng:` line of 200 bytes at most.

## What is not in a pack

The engine itself (drawing, sound, print rendering, the API), the signal formats, the printer driver, the shell, and anything that would send data off the island. These are code, kept in the engine and installed only by an island's keeper.
