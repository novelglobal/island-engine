# island engine

An island is a receipt printer, a small computer and a community. It has its own map, lives, sounds, steps and look, and it keeps working with no internet.

This repository holds the format that describes an island, and later the engine that runs one. novel.global is the first island and the showcase.

It makes a new category out of hardware people already have. A second-hand receipt printer and a small Pi, joined to the network, become a place for experiences and interventions that end in direct action. A shop's till printer, usually a passive printer for sales, becomes an in-store driver, a creative tool for staff, and a way to print a direct action under every sale. novel.global runs like Wikipedia: free, open, and made by the people who use it. Islands share their blocks through a lite store ([docs/builder.md](docs/builder.md)).

**Status: phase 1, the format.** Nothing here runs yet. The engine code still lives in novel.global's own repository and comes out piece by piece once its print work (1.0 C) has landed: see [docs/extraction.md](docs/extraction.md).

## What is here

| Path | What it is |
|---|---|
| [spec/](spec/README.md) | The island format: the manifest and the eight kinds of pack, in plain words |
| [schemas/](schemas/) | The same format as JSON Schemas, which a builder or an engine checks every file against |
| [islands/novel-global/](islands/novel-global/island.json) | novel.global described as an island: the proof that the format can hold a whole site. With its five games, the first story box (the riparian drain) and the farm |
| [islands/stickers/](islands/stickers/island.json) | A second, tiny island: photo stickers in one step, offline |
| [islands/shop/](islands/shop/island.json) | A third: a shop's till. The staff make a counter card each morning; the same action prints at the foot of every sale; whoever scans it can pledge |
| [docs/extraction.md](docs/extraction.md) | How the engine comes out of novel.global's repository, stage by stage |
| [docs/runtimes.md](docs/runtimes.md) | One engine, two homes: Cloudflare, and a Raspberry Pi with 512 MB |
| [docs/builder.md](docs/builder.md) | The island builder: the approval page grown into a dashboard for print experiences |
| [docs/decisions.md](docs/decisions.md) | The decisions, in plain words |
| [tools/](tools/) | `check.mjs` checks every island against the schemas; `export-front.mjs` writes novel.global's data packs from its repository |

## Checking

```bash
npm install
npm test
```

`npm test` checks every manifest and pack in `islands/` against `schemas/`, and that every file a pack names is there.

## Licence

AGPL-3.0 for the engine and the island program, CC BY-SA 4.0 for packs, MIT for the image and build scripts (decided 6 November 2026: [docs/decisions.md](docs/decisions.md)).
