# The switchboard

Each island's own control panel: the approval page grown into one screen for **print experiences**, on a phone and on a desk. It writes the manifest and chooses the packs; it never asks for code. The plan it follows is `front`'s `docs/brief-1.0-b.md` (stage E1b); this page says what each part reads and writes in the format.

**The owner** is whoever holds the island's first slip. 1.0 A's kit prints it the first time the printer is on the Pi: one QR code joins the island's wifi, the other opens the switchboard with the owner's key. Nothing is typed. The format calls the owner the keeper.

## The mirror

A new island starts as a copy of novel.global under its own name, so it works from the first minute: its manifest's `from` says `novel-global` and the version copied. It can start from any island in the library instead (the photo booth, the shop till), and `from` names that one. Everything can then change, except the four rules.

## Its layout

```text
┌ STATUS ───────────────────────────────────────────────────────┐
│ the shop   ● LIGHT   PAPER 80   QUEUE 2   PRINTS 53   ◐       │
└───────────────────────────────────────────────────────────────┘
┌ EXPERIENCES ┐ ┌ STACK ─────────────────────┐ ┌ PREVIEW ───────┐
│ ▣ counter   │ │ BLOCK LIGHT PATTERN CAMERA │ │ phone │ receipt│
│   41  ●●○   │ │ OUTPUT                     │ │       │ 512    │
│ ▣ pledge    │ │ ─ words                    │ │       │ dots   │
│   12  ●○○   │ │ ─ photograph               │ │       │        │
│ ＋          │ │ ─ qr                       │ │       │        │
└─────────────┘ └────────────────────────────┘ └────────────────┘
┌───────────────────────────────────────────────────────────────┐
│                           PUBLISH                             │
└───────────────────────────────────────────────────────────────┘
```

| Part | Reads | Writes |
|---|---|---|
| **Status strip** | the island's `name`, each printer's light, paper and queue (from the island program, not the files), the moon | nothing |
| **Experiences** | each `steps` pack is a card: its mark, the prints it made this moon, its state | adds a steps pack from the library, or forks one card into another (a copy with `parent` set) |
| **Stack** | the chosen experience's steps and fields, and the templates its print steps name | their order and words; the tabs write BLOCK (a template's blocks), LIGHT and PATTERN (the style: photo curve, dither, frame, rule), CAMERA (a photo field's settings), OUTPUT (the print field: which templates, which printers) |
| **Preview** | the phone page, and the receipt drawn at the chosen printer's profile: its dots, in true black and white | nothing |
| **PUBLISH** | everything changed | the packs and manifest, live on the island at once. A piece already printed never changes |

The look is 1-bit, as the printer prints: black title bars, dithered images, mono readings, one large figure to a panel, and one flat colour only on the open tab.

## The owner's other keys

| Key | Writes |
|---|---|
| **ISLAND** | `name`, `place`, `about`, and `network`: online or off, the mesh, the novel.global `feed`, the `directory` |
| **PRINTERS** | `printers`: each one's profile, its paper, darkness, approval, mesh, till. **CONNECT A DEVICE**: the device prints a short code, the owner types it here, done. A test strip and the calibration strip (1.0 C) print from here |
| **WAITING** | nothing in the files: every piece waiting, with SHOW, REFUSE, PRINT |
| **PEOPLE** | `people`: a key for each member of staff, set to approve, make or both; and `access`: who may print at all |
| **PARTNERS** | `partners`: the islands this one lets print here, and the islands it prints to |

novel.global, as steward, can open and change every island's switchboard. No island can open novel.global's (rule 4). novel.global's own switchboard adds **the fleet**: every island as a small panel with its bars (prints, paper, queue, light), and one line at the foot for the whole network.

## Starting points

Besides novel.global's mirror, a new island can start from one of these:

| Start from | Steps | Prints |
|---|---|---|
| **booth** | one: three photographs, a frame, print | a strip of stickers (the [sticker island](../islands/stickers/island.json)) |
| **flyer** | one: a photograph, the gig's words, when and where | a flyer with a code to the night |
| **pledge** | two: what was noticed, what I will do | a pledge, kept by the one who made it |
| **fundraiser** | two: a photograph, a name and an amount promised | a ticket with a code back to the cause |
| **zine** | any number: a page a step | a long strip folded into a zine |
| **shop** | a counter card made each morning, and a pledge for whoever scans a sale | the day's action at the foot of every sale (the [shop island](../islands/shop/island.json)) |

## The library and the commons

Every block and pack any island publishes, in one place, with novel.global's NETWORK key as its door. The switchboard's ＋ is the same library from inside an island. It is built in stage E4.

- **Publish:** an owner sends a pack they made, where it waits for approval, like everything else on novel.global.
- **Find:** packs by what they make (a booth, a till's foot, a game, a look), with a receipt printed as the picture of each. Ranked by prints and keeps, never by money or likes.
- **Install is a copy.** One press puts a pack on the island as its own; one press takes it off. Updates are offered, never forced, and a swap never touches what was already printed.
- **Fork:** a copy changed and published again, with `parent` naming where it came from. The chain of parents is the credit, printed as a small code at the foot of a receipt.
- **Free:** no pack has a price (rule 2). Each carries its licence, CC BY-SA 4.0 unless its maker chooses another. Every version is kept, with a talk thread, and stewards curate.
- **Offline**, an island takes packs from a file.

## Taking it away

**↓ ISLAND** saves the manifest and its packs as one file, to share, to start another island from, or to move to a new Pi. **↑** opens one.

## What it never does

It never runs code from a pack, never adds a tracker, and never sends anything off the island that the manifest doesn't name.
