# The island builder

The approval page grown into a dashboard for **print experiences**, not websites. It writes the manifest and chooses the packs; it never asks for code. It opens on the island itself (`/build`, on the Pi or the site), behind the keeper's key.

**The keeper** is whoever holds the island's first receipt: 1.0 A prints the setup slip, and that slip carries the keeper's key. Nobody else has to approve anything.

## Its pages

```text
┌──────────────────────────────────────────────────────────────┐
│ ISLAND   STEPS   PACKS   PRINTER   WAITING   PEOPLE          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  STEPS                                    ┌───────────┐      │
│                                           │  phone    │      │
│  ① booth           photo ×3 · frame · ⎙   │  preview  │      │
│  ＋                                       │           │      │
│                                           └───────────┘      │
│  START FROM   booth · flyer · pledge · fundraiser · zine     │
│                                           ┌───────────┐      │
│                                           │ receipt   │      │
│                                           │ preview   │      │
│                                           └───────────┘      │
└──────────────────────────────────────────────────────────────┘
```

| Page | What it does | Today's approval page |
|---|---|---|
| **ISLAND** | name, place (a pin and a box on the map), whose Country, online or offline, listed on the directory or not | partly in `config.js` |
| **STEPS** | the journey: steps in a column, each a card of fields (photo, words, lines, choose, catch, place, art, frame, print). **＋** adds a step or a field; drag to reorder. Each word editable. A phone preview and a receipt preview follow every change | INTENTION AND W.I.S.H. · THE WORDS; BOARD 01 · THE TEMPLATE |
| **PACKS** | what the island is made of: map, lives, sound, styles, templates. Add a pack from a file (offline) or the directory (online); each shows who made it and its licence. Styles from artists are curated here: on, off, the default | CELLS; CITIES AND DATA PACKS; TRACKS |
| **PRINTER** | each printer: its paper, a test strip, the calibration strip (1.0 C), approval or straight to print, mesh on or off. **CONNECT A DEVICE**: the device prints a short code, the keeper types it here, done. No tokens | PRINTERS · PAIR A PRINTER |
| **WAITING** | every piece waiting: SHOW, REFUSE, PRINT | the approval list |
| **PEOPLE** | who may print: anyone on the island, whoever has the code (printed on a slip, changed each moon quarter), or every piece approved first | — |

## Starting points

A new island starts from one of these, then everything can change:

| Start from | Steps | Prints |
|---|---|---|
| **booth** | one: three photographs, a frame, print | a strip of stickers (the [sticker island](../islands/stickers/island.json)) |
| **flyer** | one: a photograph, the gig's words, when and where | a flyer with a code to the night |
| **pledge** | two: what was noticed, what I will do | a pledge, kept by the one who made it |
| **fundraiser** | two: a photograph, a name and an amount promised | a ticket with a code back to the cause |
| **zine** | any number: a page a step | a long strip folded into a zine |
| **W.I.S.H.** | four: novel.global's own | the W.I.S.H. receipt |
| **shop** | a counter card made each morning, and a pledge for whoever scans a sale | the day's action at the foot of every sale (the [shop island](../islands/shop/island.json)) |

## The store

A lite store, like an app store or Steam, but small and made for this one stack. An island is built visually from blocks: a step, a style, a map, a game, a template, a story box. Each is a pack with its maker and licence, and a keeper picks blocks on PACKS, sees them on the phone and receipt previews, and keeps or swaps them.

- **Publish:** a keeper sends a block they made to the store, where it waits for approval, like everything else on novel.global.
- **Find:** blocks by what they make (a booth, a till's foot, a game, a look), with a receipt printed as the picture of each.
- **Swap:** one press puts a block on the island; one press takes it off. A swap never touches what the island has already printed.
- **Free:** no block has a price (rule 2). Each carries its licence, CC BY-SA 4.0 unless its maker chooses another.
- **Where:** novel.global hosts the store. Its start screen's NETWORK key is the door, and the builder's PACKS page is the same store from inside an island. An offline island takes blocks from a file.

## Taking it away

**↓ ISLAND** saves the manifest and its packs as one file, to share, to start another island from, or to move to a new Pi. **↑** opens one.

## What it never does

It never runs code from a pack, never adds a tracker, and never sends anything off the island that the manifest doesn't name.
