# In plain words

## What this is

novel.global is becoming one example of something anyone can set up: a second-hand receipt printer, a small Raspberry Pi and a community make an **island**. Each island has its own map, lives, sounds, steps and look, and keeps working with no internet.

To get there, everything novel.global is made of has to be written down as **files anyone can swap**, called packs. This folder is that first step:

- **The format** ([spec/](../spec/README.md)): the rules for describing an island. One file says what the island is (its name, its place, its printers, who may print). Packs hold the rest: the map, the lives, the sounds, the steps, the receipt's look (1.0 C's styles), and what each receipt holds.
- **novel.global, described as an island** ([islands/novel-global/](../islands/novel-global/island.json)). Its 204 lives, 53 things that worked elsewhere, 57 places, the four printers, W.I.S.H.'s own words and the four house styles all fit. If the format couldn't hold novel.global, it wouldn't be ready.
- **A second, tiny island** ([islands/stickers/](../islands/stickers/island.json)): a sticker booth. One step: three photographs on a count of three, choose a frame, print. No internet, no approval. It proves an island doesn't have to be W.I.S.H.
- **A checker**: it reads every island and refuses anything broken, such as a receipt asking for something no step collects.
- **Three plans**: how the engine comes out of novel.global's code a piece at a time ([extraction.md](extraction.md)), how the same engine runs on Cloudflare and on a Pi ([runtimes.md](runtimes.md)), and the switchboard, each island's control panel, the approval page grown up ([switchboard.md](switchboard.md)).

novel.global's own code is untouched. The moving starts once 1.0 C (the better receipts) is finished and live.

## Decided, 6 November 2026

1. **Home:** the novelglobal GitHub account. This repository (`island-engine`) holds the engine and `island-kit` holds the device. This folder stays on this PC, private, until you say to publish it.
2. **Licences:** AGPL-3.0 for the engine and the island program, CC BY-SA 4.0 for packs, MIT for the image and build scripts.
3. **The Pi:** a Raspberry Pi 3 (B, B+ or A+) is the floor, and a Zero 2 W works too. The printer is a second-hand Epson TM-T88V.
4. **One way:** an island's devices are always open to novel.global, never the other way.

The choices as they were first put are kept below.

## As first put

### 1. The engine's name and home

The working name is **island engine**. It needs a name of its own, so novel.global can stay the showcase.

Where it lives on GitHub:

- **A new organisation** (recommended): a shared home for the engine, 1.0 A's island program and the packs. Others can join and help without ever touching novel.global's account.
- **Under novelglobal**: simpler now, harder to share later.

This folder sits only on this PC, beside `front`, until you say where it goes on GitHub.

### 2. The licence

| For | Suggested | What it means |
|---|---|---|
| The engine and the island program | **AGPL-3.0** | Anyone may use it and change it. Anyone who runs a changed copy for other people must share their changes too, so islands stay open |
| Packs (maps, lives, styles) | **CC BY-SA 4.0** | Anyone may reuse a pack with credit, and must share what they make from it the same way |

Each pack carries its own licence, so an artist can choose another (CC BY, say, for wider use). novel.global's code is MIT now; whatever has already been published stays MIT for whoever copied it, and the engine's releases can be AGPL from the start.

### 3. The smallest Pi

| Pi | Memory | Suits |
|---|---|---|
| **3 A+** (the one at novel.global) | 512 MB | the floor: one printer, a handful of phones at once |
| **Zero 2 W** | 512 MB | the same limits, smaller and cheaper; the printer needs a USB adapter |
| **4** (2 GB or more) | 2 GB+ | busy places and events; costs more, draws more power |

Suggested: **the 3 A+ as the floor, the 4 recommended for events.** The 3 A+ fits because the phone already does the heavy work (shrinking photographs and drawing the receipt) before anything reaches the Pi. Its weak point is its own Wi-Fi, which holds about eight to ten phones at once. That needs testing on the real one before it's promised.

### Also worth knowing

- **The map an offline island shows has to be open.** The satellite picture novel.global uses now may be shown online with credit but can't be kept on a Pi. Offline islands will use OpenStreetMap, drawn in greys.
- **An island's printers are always open to novel.global, one way** (your rule, 6 November). Even with a site of its own, an island lets novel.global publish to and print on its printers. Its own site prints only to its own printers. The checker refuses an island that leaves novel.global out.
- **Each printer has its own size.** The TM-T88V lays 512 dots across 80 mm paper. The brief's 576 belongs to other printers, and the format keeps both.

## What happens next

1. You choose the name, the home and the licence.
2. Once you say so, this folder goes onto GitHub where you chose. Nothing is put there before.
3. When 1.0 C is live, the moving starts in `front`, one stage at a time, each checked on the preview first, as now.
