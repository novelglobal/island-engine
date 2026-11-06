# One engine, two homes

The same island runs **hosted** (Cloudflare, as novel.global does now) or **on its own Pi** (1.0 A's island program, with no internet). The phone sees no difference: the same pages, the same API, the same packs.

## What is the same in both

- **The client**: plain files (HTML, CSS, script, packs), served as they are.
- **The API**: the routes the Worker answers now (`/api/stories`, `/api/printers/:id/next`, `/api/settings`, `/api/admin/…`), written up from `front`'s `test/api.mjs` as a contract. Both homes pass the same checks, run against an address.
- **The database**: D1 *is* SQLite, so both run the same `schema.sql` and the same queries, with the same version number for upgrades (`SCHEMA_V` in the Worker today).
- **The work the phone does**: the phone already shrinks every photograph and draws every receipt into printer dots before sending it. The server never decodes a picture or draws a receipt. This is what makes a 512 MB Pi enough.

## What differs

| | Hosted (Cloudflare) | On a Pi |
|---|---|---|
| Program | a Worker | 1.0 A's island program, one Go binary, one service |
| Database | D1 | SQLite in a file (a pure Go SQLite, so the binary stays one file with nothing to install) |
| Files (photos, art, tapes) | R2 | a folder, `/var/lib/island/files/`, with the same names R2 uses (`photo/…`, `art/…`, `tape/…`) |
| Printing | the queue in D1; each partner's Pi asks for the next job | the queue in SQLite; the program prints over USB itself |
| Offline tiles | not needed; online tiles | PMTiles in the map pack, served in pieces as the phone asks (range requests) |
| Live data (iNaturalist, OpenStreetMap, weather) | asked through the Worker, shared by everyone | only when the Pi is online; otherwise each layer's offline file |
| Pairing | the site approves a printer's code | the island is its own keeper; online, it can pair to a site to be listed and synced |

## How the Pi serves the engine

**Recommended: the Pi program answers the API in Go, and the shared checks keep both homes the same.**

- 1.0 A's program already holds the print queue, the Wi-Fi, the setup page and pairing, in Go. The part of the API an island needs alone is small: the client and packs, sending and listing pieces, approvals, the queue, settings and photos.
- Both homes share the schema file and pass the same checks, so a difference shows at once.
- The alternatives, for the record: running the Worker's own code on the Pi needs a JavaScript runtime there (Node, or Cloudflare's workerd), which is a second program to install and update and uses 60 to 150 MB more; embedding a small JavaScript engine in the Go program keeps one file but is slower and harder to debug. Either is possible later if the two homes drift.

**Not on the Pi, at first:** the portfolio and posts, the iNaturalist and OpenStreetMap pass-throughs (online islands ask those sites directly), the board's talk, and tapes. Each can follow.

## The Pi 3 A+ (512 MB): what fits

| Part | Memory, about |
|---|---|
| Raspberry Pi OS Lite (64-bit), with NetworkManager and the setup Wi-Fi | 120 to 160 MB |
| The island program | 20 to 40 MB |
| SQLite's cache, capped | 8 MB |
| GPU, set to its least | 16 MB |
| Left over | about 250 MB |

To keep it there:

- **Nothing large is held in memory.** Uploads are written to the card as they arrive; files are sent from the card.
- **The phone does the drawing** (above). The Pi never runs a browser or makes an image.
- **Few writes.** SQLite in WAL mode, a print a row, old rows tidied a few at a time, as the Worker's `tidy` does now. This also spares the card.
- **Limits the keeper can see:** the card's free space (keep a fifth free; the Worker keeps R2 under 80% the same way), and how many phones are joined.

**The real limit is the Wi-Fi.** The Pi's own chip, as a hotspot, is commonly reported to hold about eight to ten phones at once. That suits a booth or a stall; a festival wants a proper access point, with the Pi plugged into it. This needs measuring on a real 3 A+ before it is promised.

## Offline tiles

- The ground novel.global shows now is Esri's imagery, which may be viewed with credit but **not kept offline**. The map pack says so (`"open": false`).
- An offline island's ground is made from **OpenStreetMap** (open, with credit), drawn in greys, as raster tiles in one PMTiles file. It is made on a computer by a build script, never on the Pi.
- **Size**, for novel.global's area (about 6.6 × 8.3 km): to zoom 17, about 1,300 tiles, 20 MB; to zoom 18, about 5,000 tiles, 75 MB; zoom 19 would be about 300 MB. Zoom 18 is the suggested limit. A 32 GB card holds this many times over.
- The base already draws its ground with no WebGL, a tile at a time, so old phones can show it.

## One way, always

novel.global is the hub. Whenever it can reach an island (online, or through the mesh), it may publish to and print on every one of that island's devices: a piece approved on novel.global prints there like a piece of the island's own. The island's own site, hosted or on its Pi, prints only to its own printers. It holds no token for novel.global's printers, and the format has no place to name one. It prints on another island's printers only as a partner: when it names that island in `partners.out` and that island names it in `partners.in`, which the owner of each chooses on their own switchboard.

In practice:

- **Pairing gives the hub the key.** Pairing by code (`/api/pair` in front, PAIR AN ISLAND) gives novel.global a token for the island's printers. Nothing pairing returns lets the island print anywhere else.
- **The hub's pieces have passed the hub's approval.** They print without waiting for the island keeper's. The keeper can still turn the printer off at the wall; the island program never refuses the hub while it is on.
- **Over the mesh**, novel.global's line (`ng`) is heard by every island on the channel; an island's own pieces stay on its own printers.
- **Its own site** links only to its own island and printers, and to its partners'.

## Sync, later

An offline island keeps working alone. When it is online and paired, it can list itself on novel.global's directory, send up the pieces its keeper chooses, and take pack updates. Phase 1 only reserves the place for this: `network.directory` and `network.hosted` in the manifest.
