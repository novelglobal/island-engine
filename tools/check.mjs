/* Checks every island in islands/: its manifest and packs against schemas/, every file a pack names, and that the parts
   agree with each other (a template reads only fields that exist, a print step names only templates that exist, ...).
   node tools/check.mjs [island folder ...] */
import fs from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
for (const f of fs.readdirSync(path.join(root, 'schemas'))) ajv.addSchema(JSON.parse(fs.readFileSync(path.join(root, 'schemas', f), 'utf8')));
const schema = ref => ajv.getSchema(ref) || (() => { throw new Error('no schema ' + ref); })();

let bad = 0;
const fail = (where, msg) => { bad++; console.log(`  ✗ ${where}: ${msg}`); };
const read = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const check = (where, ref, data) => { const v = schema(ref); if (!v(data)) v.errors.slice(0, 8).forEach(e => fail(where, `${e.instancePath || '/'} ${e.message}${e.params && e.params.additionalProperty ? ' (' + e.params.additionalProperty + ')' : ''}`)); };
const exists = (where, dir, rel) => { if (!fs.existsSync(path.join(dir, rel))) { fail(where, `missing file ${rel}`); return false; } return true; };

function island(dir) {
  const name = path.basename(dir), m = read(path.join(dir, 'island.json'));
  console.log(`${name}`);
  check(`${name}/island.json`, 'urn:island:0.1:island', m);
  const packs = {};
  for (const [kind, ref] of Object.entries(m.packs || {})) for (const r of [].concat(ref)) {
    if (typeof r !== 'string') continue; /* fetched packs are checked when fetched */
    const pd = path.join(dir, r), where = `${name}/${r}`;
    if (!exists(where, pd, 'pack.json')) continue;
    const p = read(path.join(pd, 'pack.json'));
    if (p.pack !== kind) fail(where, `is a ${p.pack} pack, named as ${kind}`);
    check(where, `urn:island:0.1:${p.pack}`, p);
    (packs[kind] = packs[kind] || []).push({ p, dir: pd, where });
    files(p, pd, where);
  }
  agree(name, m, packs);
}

/* the files a pack names: there, and their rows in shape */
function files(p, dir, where) {
  if (p.pack === 'map') for (const l of p.layers || []) {
    const s = l.source || {}, f = s.file || s.offline; if (!f || !exists(where, dir, f)) continue;
    if (s.type === 'geojson') { const g = read(path.join(dir, f)); if (g.type !== 'FeatureCollection') fail(`${where}/${f}`, 'not a FeatureCollection'); }
    else if (s.type === 'cells' || s.type === 'live') { const c = read(path.join(dir, f)); if (!Array.isArray(c)) fail(`${where}/${f}`, 'not a list of cells'); else c.forEach((x, i) => check(`${where}/${f}[${i}]`, 'urn:island:0.1:map#/$defs/cell', x)); }
  }
  if (p.pack === 'map' && p.basemap && p.basemap.pmtiles) exists(where, dir, p.basemap.pmtiles);
  if (p.pack === 'lives') {
    if (p.species && exists(where, dir, p.species.file)) check(`${where}/${p.species.file}`, 'urn:island:0.1:lives#/$defs/species', read(path.join(dir, p.species.file)));
    for (const s of p.stories || []) if (exists(where, dir, s.file)) check(`${where}/${s.file}`, 'urn:island:0.1:lives#/$defs/stories', read(path.join(dir, s.file)));
    if (p.seasons) exists(where, dir, p.seasons.file);
  }
  if (p.pack === 'sound') for (const v of p.voices || []) if (v.sample) exists(where, dir, v.sample);
  if (p.pack === 'style') for (const s of p.styles || []) for (const fr of s.frames || []) if (fr.file) exists(where, dir, fr.file);
}

/* the parts agree */
function agree(name, m, packs) {
  const one = k => (packs[k] || [])[0];
  const tpl = one('templates'), map = one('map'), sound = one('sound'), lives = one('lives'), board = one('board');
  /* every journey: its fields by step.field, both for the whole island and for each steps pack */
  const fields = new Map(), byPack = new Map(), stepIds = [];
  for (const steps of packs.steps || []) {
    const own = new Map(); byPack.set(steps.p.id, own);
    for (const s of steps.p.journey.steps) { stepIds.push(s.id); for (const f of s.fields) { fields.set(`${s.id}.${f.id}`, f); own.set(`${s.id}.${f.id}`, f); } }
    const ids = steps.p.journey.steps.map(s => s.id), ph = (steps.p.journey.phases || []).map(x => x.id);
    for (const s of steps.p.journey.steps) if (s.phase && !ph.includes(s.phase)) fail(steps.where, `step ${s.id}: no phase ${s.phase}`);
    if (new Set(ids).size !== ids.length) fail(steps.where, 'two steps share an id');
    /* rule: every journey ends in a direct action */
    const last = steps.p.journey.steps[steps.p.journey.steps.length - 1];
    if (!last.fields.some(f => f.type === 'print')) fail(steps.where, 'the journey ends without a direct action (its last step prints or pledges nothing)');
    for (const s of steps.p.journey.steps) for (const f of s.fields) if (f.type === 'combine') for (const o of f.of || []) if (!own.has(o)) fail(steps.where, `${s.id}.${f.id} combines ${o}, which no step asks for`);
  }
  if (m.client && m.client.start && !stepIds.includes(m.client.start)) fail(name, `client.start ${m.client.start} is not a step`);
  const tplIds = tpl ? tpl.p.templates.map(t => t.id) : [];
  for (const [k, f] of fields) if (f.type === 'print') for (const t of f.templates || []) if (!tplIds.includes(t)) fail(name, `${k} names template ${t}, which is not in the templates pack`);
  const piece = (from, within = fields) => {
    if (!from || /^(island|read)\./.test(from) || /^'/.test(from)) return true;
    const [s, f, line] = from.split('.'); const fd = within.get(`${s}.${f}`); if (!fd) return false;
    return !line || (fd.type === 'lines' && fd.lines.some(l => l.id === line));
  };
  if (tpl) for (const t of tpl.p.templates) {
    for (const b of t.blocks) for (const k of ['from', 'when']) if (b[k] && !piece(b[k])) fail(tpl.where, `template ${t.id}: ${b.type} reads ${b[k]}, which no step asks for`);
    for (const f of (t.mesh && t.mesh.fields) || []) if (!piece(f)) fail(tpl.where, `template ${t.id}: the mesh line reads ${f}, which no step asks for`);
    if (t.blocks[t.blocks.length - 1].type !== 'cut') console.log(`  · ${tpl.where}: template ${t.id} does not end with a cut`);
    /* rule: every receipt carries a way on, a code to scan */
    if (!t.blocks.some(b => b.type === 'qr')) fail(tpl.where, `template ${t.id} has no code to scan: every receipt carries a way on to a direct action`);
  }
  /* story boxes: five receipts at most, each a template of the island, filled only with what its journey asks for */
  const stageIds = board ? board.p.stages.map(s => s.id) : [];
  for (const st of packs.story || []) for (const b of st.p.stories) {
    const own = byPack.get(b.journey); if (!own) { fail(st.where, `box ${b.id}: journey ${b.journey} is not one of the island's steps packs`); continue; }
    for (const r of b.receipts) {
      if (!tplIds.includes(r.template)) fail(st.where, `box ${b.id}: no template ${r.template}`);
      for (const k of Object.keys(r.fill)) if (!piece(k, own)) fail(st.where, `box ${b.id}: ${k} is not asked for in ${b.journey}`);
    }
    for (const u of b.unlocks || []) if (!stageIds.includes(u)) fail(st.where, `box ${b.id}: no board stage ${u}`);
    if (b.headline.checked === false) console.log(`  · ${st.where}: box ${b.id}'s headline is not checked against its source yet`);
    if (b.cover.file) exists(st.where, st.dir, b.cover.file);
  }
  /* the board: stages that come first exist, nothing comes before itself, nature's share adds up to the target at most */
  if (board) {
    const B = board.p, ids = new Set(stageIds);
    for (const s of B.stages) for (const a of [...(s.after || []), ...(s.then || [])]) if (!ids.has(a)) fail(board.where, `stage ${s.id}: no stage ${a}`);
    const seen = new Set(), walk = (id, path) => { if (path.includes(id)) { fail(board.where, `stage ${id} comes before itself`); return; } if (seen.has(id)) return; seen.add(id); const s = B.stages.find(x => x.id === id); for (const a of (s && s.after) || []) walk(a, [...path, id]); };
    for (const s of B.stages) walk(s.id, []);
    const tones = B.ground.tones.map(t => t.id);
    for (const s of B.stages) for (const d of s.draw) if (d.tone && !tones.includes(d.tone)) fail(board.where, `stage ${s.id}: no tone ${d.tone}`);
    for (const s of B.stages) for (const e of s.by || []) { const [k, v] = e.split(':'); if (k === 'step' && !stepIds.includes(v)) fail(board.where, `stage ${s.id}: no step ${v}`); }
    const half = (B.balance ? B.balance.start || 0 : 0) + B.stages.reduce((n, s) => n + (s.nature || 0), 0);
    if (B.balance && Math.abs(half - B.balance.target) > 0.001) console.log(`  · ${board.where}: the stages give nature ${half.toFixed(2)}, the target is ${B.balance.target}`);
    if (B.first) exists(board.where, board.dir, B.first.file);
    if (B.ground.file) exists(board.where, board.dir, B.ground.file);
  }
  if (map) {
    const kinds = Object.keys(map.p.kinds || {});
    for (const l of map.p.layers) if (l.kind && !kinds.includes(l.kind)) fail(map.where, `layer ${l.id}: no kind ${l.kind}`);
    const sounds = sound ? sound.p.voices.map(v => v.id) : null;
    if (sounds) for (const [k, v] of Object.entries(map.p.kinds || {})) if (v.sound && !sounds.includes(v.sound)) fail(map.where, `kind ${k}: no voice ${v.sound}`);
    for (const l of map.p.layers) if (l.source.type === 'live' && !m.network.online) console.log(`  · ${map.where}: layer ${l.id} is live on an offline island; only its offline file is used`);
  }
  if (sound) {
    const v = sound.p.voices.map(x => x.id);
    for (const md of sound.p.moods || []) for (const x of md.voices || []) if (!v.includes(x)) fail(sound.where, `mood ${md.id}: no voice ${x}`);
    for (const [k, x] of Object.entries(sound.p.bind || {})) if (!v.includes(x)) fail(sound.where, `bind ${k}: no voice ${x}`);
  }
  if (lives && lives.p.species) {
    const sp = read(path.join(lives.dir, lives.p.species.file)), g = Object.keys(lives.p.groups || {}), calls = (lives.p.calls || []).map(c => c.id);
    const ug = [...new Set(sp.map(s => s.g).filter(x => !g.includes(x)))]; if (ug.length) fail(lives.where, `species in groups not listed: ${ug.join(', ')}`);
    const uc = [...new Set(sp.map(s => s.call).filter(x => x && !calls.includes(x)))]; if (uc.length) console.log(`  · ${lives.where}: calls named by species but not listed: ${uc.join(', ')}`);
  }
  /* an offline island asks nothing outside */
  if (!m.network.online && (m.network.hosts || []).length) fail(name, 'an offline island lists outside hosts');
  const ids = m.printers.map(p => p.id); if (new Set(ids).size !== ids.length) fail(name, 'two printers share an id');
}

const dirs = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(path.join(root, 'islands')).map(d => path.join(root, 'islands', d));
for (const d of dirs) island(path.resolve(d));
console.log(bad ? `\n${bad} problem${bad > 1 ? 's' : ''}` : '\nall islands check');
process.exit(bad ? 1 : 0);
