# island engine

An island is a receipt printer, a small computer and a community. It has its own map, lives, sounds, steps and look, and it keeps working with no internet.

This repository holds the format that describes an island, and later the engine that runs one. novel.global is the first island and the showcase.

It makes a new category out of hardware people already have. A second-hand receipt printer and a small Pi, joined to the network, become a place for experiences and interventions that end in direct action. A shop's till printer, usually a passive printer for sales, becomes an in-store driver, a creative tool for staff, and a way to print a direct action under every sale. novel.global runs like Wikipedia: free, open, and made by the people who use it. Each island runs from its own switchboard, and islands share their blocks through the library ([docs/switchboard.md](docs/switchboard.md)).

**Status: phase 1, the format.** Nothing here runs yet. The plan the engine follows is `front`'s `docs/brief-1.0-b.md`, stages E1 to E7. The engine code still lives in novel.global's own repository and comes out piece by piece once its print work (1.0 C) has landed: see [docs/extraction.md](docs/extraction.md).

## What is here

| Path | What it is |
|---|---|
| [spec/](spec/README.md) | The island format: the manifest and the eight kinds of pack, in plain words |
| [schemas/](schemas/) | The same format as JSON Schemas, which the switchboard or an engine checks every file against |
| [islands/novel-global/](islands/novel-global/island.json) | novel.global described as an island: the proof that the format can hold a whole site |
| [islands/farm/](islands/farm/island.json) | A companion beside novel.global, planned only: five short games, each its own receipt, each unlocking a real practice placed by hand on a bare paddock. The first story box (the riparian drain) is here. Built after the library and commons, from blocks alone |
| [islands/stickers/](islands/stickers/island.json) | A second, tiny island: photo stickers in one step, offline |
| [islands/shop/](islands/shop/island.json) | A third: a shop's till. The staff make a counter card each morning; the same action prints at the foot of every sale; whoever scans it can pledge |
| [profiles/](profiles/) | Printer profiles: each model as data (paper, dots, cutter, speed, darkness), so any second-hand printer can join without a change to the engine |
| [docs/extraction.md](docs/extraction.md) | How the engine comes out of novel.global's repository, stage by stage |
| [docs/runtimes.md](docs/runtimes.md) | One engine, two homes: Cloudflare, and a Raspberry Pi with 512 MB |
| [docs/switchboard.md](docs/switchboard.md) | The switchboard: each island's control panel, the approval page grown up, and what each part of it writes |
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
