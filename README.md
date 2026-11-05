# island engine

An island is a receipt printer, a small computer and a community. It has its own map, lives, sounds, steps and look, and it keeps working with no internet.

This repository holds the format that describes an island, and later the engine that runs one. novel.global is the first island and the showcase.

**Status: phase 1, the format.** Nothing here runs yet. The engine code still lives in novel.global's own repository and comes out piece by piece once its print work (1.0 C) has landed: see [docs/extraction.md](docs/extraction.md).

## What is here

| Path | What it is |
|---|---|
| [spec/](spec/README.md) | The island format: the manifest and the six kinds of pack, in plain words |
| [schemas/](schemas/) | The same format as JSON Schemas, which a builder or an engine checks every file against |
| [islands/novel-global/](islands/novel-global/island.json) | novel.global described as an island: the proof that the format can hold a whole site |
| [islands/stickers/](islands/stickers/island.json) | A second, tiny island: photo stickers in one step, offline |
| [docs/extraction.md](docs/extraction.md) | How the engine comes out of novel.global's repository, stage by stage |
| [docs/runtimes.md](docs/runtimes.md) | One engine, two homes: Cloudflare, and a Raspberry Pi with 512 MB |
| [docs/builder.md](docs/builder.md) | The island builder: the approval page grown into a dashboard for print experiences |
| [docs/decisions.md](docs/decisions.md) | The open decisions, in plain words |
| [tools/](tools/) | `check.mjs` checks every island against the schemas; `export-front.mjs` writes novel.global's data packs from its repository |

## Checking

```bash
npm install
npm test
```

`npm test` checks every manifest and pack in `islands/` against `schemas/`, and that every file a pack names is there.

## Licence

Not chosen yet (see [docs/decisions.md](docs/decisions.md)). The suggestion is AGPL-3.0 for the engine and CC BY-SA 4.0 for packs.
