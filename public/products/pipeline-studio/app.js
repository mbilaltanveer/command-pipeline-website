// Pipeline Studio on commandpipeline.com (vanilla JS, hash routes). Same interface as the local studio app.
// Samples come from data.js. "Create video" uploads to Vercel Blob and queues a job at /api/studio;
// the studio on Bilal's Mac renders it and this page follows the job until the video is ready.
const SAMPLES = window.DEMO;
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const app = $('#app'); let STATE = null, POLL = null;
const PER_DAY = 3, MAX_BYTES = 300 * 1024 * 1024, MAX_SECONDS = 180;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---- this browser's brand kit, email and videos (localStorage; the page still works without it)
const store = {
  get(k, d) { try { const v = localStorage.getItem('pipeline-studio:' + k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('pipeline-studio:' + k, JSON.stringify(v)); return true; } catch { return false; } },
};
const myKit = () => store.get('brand', null);
const myJobs = () => store.get('jobs', []);

// ---- data: samples are static, jobs are live
const copy = o => JSON.parse(JSON.stringify(o));
async function api(path) {
  let m;
  if ((m = path.match(/^\/api\/projects\/(.+)$/)) && SAMPLES.projects[m[1]]) return copy(SAMPLES.projects[m[1]]);
  if ((m = path.match(/^\/api\/brands\/(.+)$/)) && SAMPLES.brands[m[1]]) return copy(SAMPLES.brands[m[1]]);
  if (path.startsWith('/api/examples/')) return { text: SAMPLES.example };
  throw new Error('Not found');
}
async function studio(action, body, query = '') {
  const r = await fetch(`/api/studio?action=${action}${query}`, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {});
  const j = await r.json().catch(() => ({ error: 'The studio did not answer. Please try again.' }));
  if (!r.ok || j.error) throw new Error(j.error || r.statusText); return j;
}
function toast(msg, err) { const t = $('#toast'); t.textContent = msg; t.className = 'on' + (err ? ' err' : ''); clearTimeout(t._h); t._h = setTimeout(() => t.className = '', err ? 6000 : 2600); }
const fmtSize = b => b > 1e9 ? (b / 1e9).toFixed(2) + ' GB' : b > 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1e3)) + ' KB';
const fmtT = t => { t = Math.max(0, +t || 0); return Math.floor(t / 60) + ':' + String(Math.floor(t % 60)).padStart(2, '0') + '.' + Math.floor((t % 1) * 10); };
const I = {
  clean: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 15h4M13 15h4M7 11h10"/></svg>',
  motion: '<svg viewBox="0 0 24 24"><path d="M4 7h11M4 12h16M4 17h8"/><circle cx="19" cy="7" r="1.6"/><circle cx="15" cy="17" r="1.6"/></svg>',
  voiceover: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
  popups: '<svg viewBox="0 0 24 24"><circle cx="8" cy="9" r="3"/><path d="M3 19c.8-3 2.7-4.5 5-4.5s4.2 1.5 5 4.5"/><rect x="13" y="4" width="8" height="7" rx="1.5"/><path d="M15 7h4"/></svg>',
  up: '<svg viewBox="0 0 24 24"><path d="M12 16V4M7 9l5-5 5 5M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></svg>',
  dl: '<svg viewBox="0 0 24 24"><path d="M12 4v12M7 11l5 5 5-5M4 20h16"/></svg>',
  file: '<svg viewBox="0 0 24 24"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path d="M7 4l12 8-12 8z"/></svg>',
  mic: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/></svg>',
};
const MODE_INFO = {
  clean: { n: '01', title: 'Clean edit', p: 'Upload any video. We tidy it up and make it ready to post.', get: ['Word-by-word captions in your brand colours', 'Trim to where you say "start", tighten pauses', 'Smart zooms and reframing (9:16, 1:1, 16:9)', '3 thumbnails + SRT, VTT and TXT transcript'] },
  motion: { n: '02', title: 'Brand motion', p: 'No camera needed. Kinetic typography built from your brand guidelines.', get: ['Animated scenes in your colours and logo', 'Branded transitions and an original music bed', 'Storyboard written from your topic', 'Designed thumbnail + script'] },
  voiceover: { n: '03', title: 'Voiceover', p: 'Brand motion with a natural voiceover. Or a voiceover on your own footage.', get: ['A natural voice reads your script', 'Animation timed to every spoken word', 'Music ducks under the voice automatically', 'Voiceover file + captions transcript'] },
  popups: { n: '04', title: 'Talking head + pop-ups', p: 'Your talking video with key-point cards that pop up beside you while you speak.', get: ['Hook line, name card and pop-up cards', 'Captions under you as you speak', 'Cards placed away from your face', 'Thumbnails from your best frames'] },
};
const STAGE = { queued: ['Queued', 'run'], analyzing: ['Working', 'run'], rendering: ['Rendering', 'run'], done: ['Done', 'done'], error: ['Needs attention', 'error'] };
const chip = st => { const s = STAGE[st] || [st, '']; return `<span class="chip ${s[1]}">${esc(s[0])}</span>`; };

async function refreshState() {
  const kit = myKit(), base = copy(SAMPLES.state);
  const sample = base.brands.map(b => ({ ...b, sample: true }));
  STATE = { ...base, brands: kit ? [{ ...kit, slug: 'my-brand', logo: kit.logo || '', mark: kit.mark || '' }, ...sample] : sample, web: STATE?.web || { online: false, configured: false, queue: 0 } };
  try { STATE.web = await studio('status'); } catch { /* shown as offline */ }
  const W = STATE.web;
  $('#qstat').innerHTML = W.online ? `<span class="dot"></span>Studio online${W.queue ? ` · ${W.queue} in line` : ''}` : '<span class="dot" style="background:var(--dim);animation:none"></span>Studio offline';
  return STATE;
}

// ------------------------------------------------------------------------------------------------ router
async function route() {
  clearInterval(POLL); POLL = null;
  const h = location.hash.slice(1) || '/'; const [, a, b] = h.split('/');
  $$('nav a').forEach(x => x.classList.toggle('on', x.dataset.nav === (a || 'home') || (a === 'new' && x.dataset.nav === 'home') || ((a === 'project' || a === 'job') && x.dataset.nav === 'projects') || (a === 'brand' && x.dataset.nav === 'brands')));
  try {
    await refreshState(); window.scrollTo(0, 0);
    if (!a) return home();
    if (a === 'new') return newProject(b);
    if (a === 'projects') return projects();
    if (a === 'project') return project(b);
    if (a === 'job') return job(b);
    if (a === 'brands') return brands();
    if (a === 'brand') return brandEdit(b);
    home();
  } catch (e) { app.innerHTML = `<div class="err">${esc(e.message)}</div>`; }
}
window.addEventListener('hashchange', route);

// ------------------------------------------------------------------------------------------------ home + projects
function pcard(p) {
  return `<a class="pcard" href="#/${p.job ? 'job' : 'project'}/${p.id}"><div class="im" style="background-image:url('${p.thumb_url || ''}')"></div>
  <div class="b"><div class="t">${esc(p.title)}</div><div class="spread"><span class="small muted">${esc(p.mode_name)} · ${esc((p.created || '').replace('T', ' ').slice(5, 16))}</span>${chip(p.stage)}</div></div></a>`;
}
async function yourVideos() {
  const ids = myJobs(); if (!ids.length) return [];
  const got = await Promise.all(ids.map(id => studio('job', null, `&id=${id}`).catch(e => (/not found/i.test(e.message) ? 'gone' : null))));
  const keep = ids.filter((_, i) => got[i] !== 'gone'); if (keep.length !== ids.length) store.set('jobs', keep);
  return got.filter(j => j && j !== 'gone').map(j => ({ ...j, job: true, thumb_url: j.outputs?.thumbnails?.[0] || '' }));
}
async function home() {
  const W = STATE.web;
  app.innerHTML = `<div class="hero"><div><div class="kicker">Pipeline Studio</div><h1 style="margin-top:14px">What are we <span class="g">making</span> today?</h1>
    <p class="lead">Pick one of four ways to make a video. Every option uses your saved brand kit and gives you the video, thumbnails and a transcript.</p></div>
    <div class="row"><span class="pill"><i class="${W.online ? '' : 'off'}"></i>Studio ${W.online ? 'online' : 'offline'}</span><span class="pill"><i></i>Free · ${PER_DAY} videos a day</span><span class="pill"><i class="${myKit() ? '' : 'off'}"></i>${myKit() ? 'Your brand kit is saved' : 'No brand kit yet'}</span></div></div>
  <div class="grid g4">${Object.entries(MODE_INFO).map(([k, m]) => `<a class="mode" href="#/new/${k}"><div class="spread"><div class="ico">${I[k]}</div><span class="num">${m.n}</span></div>
    <h3>${m.title}</h3><p>${m.p}</p><ul>${m.get.map(x => `<li>${x}</li>`).join('')}</ul><div class="go">Start →</div></a>`).join('')}</div>
  <div class="section"><div class="spread"><h2>Recent projects</h2><a class="btn sm ghost" href="#/projects">All projects</a></div>
  <div class="grid g4" style="margin-top:14px" id="recent">${SAMPLES.state.projects.slice(0, 8).map(pcard).join('')}</div></div>`;
  const mine = await yourVideos().catch(() => []);
  if (mine.length && $('#recent')) $('#recent').innerHTML = [...mine, ...SAMPLES.state.projects].slice(0, 8).map(pcard).join('');
}
async function projects() {
  app.innerHTML = `<div class="spread"><div><div class="kicker">Library</div><h1 style="margin-top:12px">Projects</h1></div><a class="btn primary" href="#/">New video</a></div>
  <div id="mine"></div><div class="section"><h2>Samples</h2><p class="small muted">Made in Pipeline Studio for Command Pipeline.</p></div>
  <div class="grid g4" style="margin-top:14px">${SAMPLES.state.projects.map(pcard).join('')}</div>`;
  const mine = await yourVideos().catch(() => []);
  if (mine.length) $('#mine').innerHTML = `<div class="section"><h2>Your videos</h2><p class="small muted">Saved in this browser. Links work for 14 days.</p></div><div class="grid g4" style="margin-top:14px">${mine.map(pcard).join('')}</div>`;
}

// ------------------------------------------------------------------------------------------------ new video
function seg(name, opts, val) { return `<div class="seg" data-seg="${name}">${opts.map(([v, l]) => `<button type="button" data-v="${v}" class="${v === val ? 'on' : ''}">${l}</button>`).join('')}</div>`; }
function tog(name, title, desc, on) { return `<label class="tog"><input type="checkbox" name="${name}" ${on ? 'checked' : ''}><span class="sw"></span><span><b>${title}</b><span class="d">${desc}</span></span></label>`; }
function bindSeg(root) { $$('.seg', root).forEach(s => s.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('button', s).forEach(x => x.classList.toggle('on', x === b)); s.dispatchEvent(new Event('change')); })); }
const segVal = (root, n) => $(`[data-seg="${n}"] .on`, root)?.dataset.v;
function brandPicker() {
  const kit = myKit();
  if (!kit) return `<div class="empty">No brand kit yet. <a class="btn sm primary" href="#/brand/new" data-return style="margin-left:8px">Create your brand kit</a></div>`;
  return `<div class="brandpick"><button type="button" class="on"><span class="lg" style="background-image:url('${kit.mark || kit.logo || ''}')"></span>${esc(kit.name)}</button>
    <a class="btn ghost" href="#/brand/my-brand" data-return>Edit brand kit</a></div>`;
}
function dropZone(id, label, accept) {
  return `<div class="drop" id="${id}"><input type="file" accept="${accept}" hidden>${I.up}<div class="t">${label}</div><div class="small muted">Drag and drop, or click to choose. Up to 3 minutes and 300 MB.</div>
    <div class="bar" style="margin-top:14px;display:none"><i style="width:0"></i></div><div class="small st" style="margin-top:8px"></div></div>`;
}
function videoLength(file) {
  return new Promise(res => { const v = document.createElement('video'); v.preload = 'metadata';
    v.onloadedmetadata = () => { URL.revokeObjectURL(v.src); res(v.duration); }; v.onerror = () => res(null); v.src = URL.createObjectURL(file); });
}
function bindDrop(el, onPick) {
  const inp = $('input', el), st = $('.st', el);
  const go = async f => {
    if (f.size > MAX_BYTES) { st.textContent = `That file is ${fmtSize(f.size)}. The limit is 300 MB.`; return onPick(null); }
    const d = await videoLength(f);
    if (d && d > MAX_SECONDS + 1) { st.textContent = `That video is ${fmtT(d)} long. The limit is 3 minutes.`; return onPick(null); }
    st.innerHTML = `<b style="color:var(--good)">✓</b> ${esc(f.name)} · ${fmtSize(f.size)}${d ? ' · ' + fmtT(d) : ''}`; onPick(f);
  };
  el.addEventListener('click', e => { if (e.target !== inp) inp.click(); }); inp.addEventListener('change', () => inp.files[0] && go(inp.files[0]));
  el.addEventListener('dragover', e => { e.preventDefault(); el.classList.add('over'); }); el.addEventListener('dragleave', () => el.classList.remove('over'));
  el.addEventListener('drop', e => { e.preventDefault(); el.classList.remove('over'); e.dataTransfer.files[0] && go(e.dataTransfer.files[0]); });
}
function dataUrlFile(url, name) {
  const [head, b64] = url.split(','); const bin = atob(b64); const a = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
  return new File([a], name, { type: head.match(/data:([^;]+)/)?.[1] || 'image/png' });
}

function newProject(mode) {
  const M = MODE_INFO[mode]; if (!M) return home();
  let file = null;
  const video = mode === 'clean' || mode === 'popups';
  const formats = seg('format', [['original', 'Original framing'], ['9:16', '9:16 vertical'], ['1:1', '1:1 square'], ['16:9', '16:9 wide']], 'original');
  const videoOpts = `<div class="c"><h3>Format</h3>${formats}<div class="small muted">Original keeps your framing exactly. Vertical/square reframe around your face.</div></div>
    <div class="grid g2">${tog('captions', 'Captions', 'Word-by-word captions, key words in your accent colour', true)}${tog('trim_start', 'Trim the start', 'Start where you say "start" and cut dead air', true)}
    ${tog('tighten', 'Tighten pauses', 'Squeeze long silences (soft dissolve on each cut)', false)}${tog('zooms', 'Zoom cuts', 'Punch-in zooms on sentence starts and numbers', mode === 'popups')}
    ${tog('unmirror', 'Fix mirrored selfie', 'Flip a front-camera recording so text reads right', false)}${tog('progress_bar', 'Progress bar', 'Thin brand-colour bar along the bottom', false)}</div>`;
  const story = (voice) => `<label class="f">Topic<input name="topic" placeholder="e.g. How we build a pipeline"></label>
    <label class="f">Key points <span class="hint">One per line. These become scenes. Only facts you write here are used.</span><textarea name="points" rows="5" placeholder="Buying signals&#10;Verified data&#10;Copy that sounds human&#10;Email and LinkedIn as one story"></textarea></label>
    ${voice ? `<label class="f">Your script <span class="hint">Optional. Paste what the voice should say (one paragraph per scene). Leave empty and we write it in your brand's tone.</span><textarea name="script" rows="4"></textarea></label>` : ''}
    <details><summary>Or write the storyboard yourself</summary><div class="c" style="margin-top:10px"><div class="row"><button type="button" class="btn sm" id="ex">Load example storyboard</button><span class="small muted">Scenes in [brackets], one field per line.</span></div>
    <textarea name="storyboard" class="code" style="min-height:300px" placeholder="[title]&#10;line1: Your outbound,&#10;line2: running itself."></textarea></div></details>
    <div class="row"><span class="small muted">Music</span>${seg('mood', [['confident', 'Confident'], ['bright', 'Bright'], ['calm', 'Calm'], ['none', 'No music']], 'confident')}</div>`;
  const kitVoice = myKit()?.voice?.builtin;
  const voicePick = () => `<div class="c"><h3>Voice</h3><label class="f">Voice<select name="builtin_voice">${STATE.voices.map(v => `<option ${v === kitVoice ? 'selected' : ''}>${esc(v)}</option>`).join('')}</select></label>
    <div class="small muted">A natural stock voice reads your script. Voice cloning is only available in your own studio.</div></div>`;
  let body = '';
  if (video) body = `<div class="step"><div class="n">2</div><div class="c"><h3>Your video</h3>${dropZone('drop', 'Upload your video', 'video/*')}</div></div>
    <div class="step"><div class="n">3</div><div class="c"><h3>Options</h3>${videoOpts}
    ${mode === 'popups' ? `<label class="f">Hook <span class="hint">Optional. The first line people read. Leave empty and we write one from what you say.</span><input name="hook" placeholder="e.g. How we book meetings without cold calling"></label>
    <label class="f">Topic hint <span class="hint">Optional, helps the planner pick the right key points.</span><input name="topic"></label>` : ''}</div></div>`;
  if (mode === 'motion') body = `<div class="step"><div class="n">2</div><div class="c"><h3>What is it about?</h3>${story(false)}</div></div>`;
  if (mode === 'voiceover') body = `<div class="step"><div class="n">2</div><div class="c"><h3>Picture</h3>${seg('vsource', [['motion', 'Brand motion video'], ['footage', 'My own footage']], 'motion')}
      <div id="vsrc-footage" style="display:none" class="c">${dropZone('drop', 'Upload your footage (screen recording, b-roll, product demo)', 'video/*')}
      <label class="f">Script <span class="hint">One paragraph per breath. Captions follow the voice.</span><textarea name="fscript" rows="6" placeholder="Hey everyone, ..."></textarea></label>
      <div class="row"><span class="small muted">Format</span>${formats}</div><div class="grid g2">${tog('fcaptions', 'Captions', 'Burn captions into the video', true)}${tog('fmusic', 'Music bed', 'Soft music under the voice', true)}</div></div>
      <div id="vsrc-motion" class="c">${story(true)}</div></div></div>
    <div class="step"><div class="n">3</div>${voicePick()}</div>`;
  app.innerHTML = `<a class="small muted" href="#/">← All options</a><div class="spread" style="margin-top:10px"><div><div class="kicker">Option ${M.n}</div><h1 style="margin-top:12px">${M.title}</h1><p class="lead">${M.p}</p></div></div>
  <div class="card" style="margin-top:26px"><div class="steps">
    <div class="step"><div class="n">1</div><div class="c"><h3>Brand kit</h3><div id="bp">${brandPicker()}</div></div></div>
    ${body}
    <div class="step"><div class="n">${mode === 'voiceover' ? 4 : video ? 4 : 3}</div><div class="c">
      <div class="grid g2"><label class="f">Your email <span class="hint">Free, up to ${PER_DAY} videos a day.</span><input name="email" inputmode="email" autocapitalize="off" spellcheck="false" value="${esc(store.get('email', ''))}" placeholder="you@company.com" autocomplete="email"></label>
      <label class="f">Project name<input name="title" placeholder="${M.title} ${new Date().toLocaleDateString()}"></label></div>
      <div class="row"><button class="btn primary" id="go">Create video</button><span class="small muted" id="gost"></span></div></div></div>
  </div></div>`;
  bindSeg(app);
  $$('[data-return]').forEach(a => a.addEventListener('click', () => store.set('return', location.hash)));
  $('[data-seg="vsource"]')?.addEventListener('change', () => { const f = segVal(app, 'vsource') === 'footage'; $('#vsrc-footage').style.display = f ? '' : 'none'; $('#vsrc-motion').style.display = f ? 'none' : ''; });
  if ($('#drop')) bindDrop($('#drop'), f => file = f);
  $('#ex')?.addEventListener('click', async () => { const r = await api('/api/examples/command-pipeline'); $('[name=storyboard]').value = r.text; $('[name=storyboard]').closest('details').open = true; });
  $('#go').addEventListener('click', async () => {
    const v = n => $(`[name=${n}]`)?.value?.trim() || '', ck = n => !!$(`[name=${n}]`)?.checked, st = t => $('#gost').textContent = t;
    const kit = myKit(); if (!kit) return toast('Create your brand kit first', 1);
    const email = v('email'); if (!EMAIL.test(email)) return toast('Enter your email', 1);
    const footage = mode === 'voiceover' && segVal(app, 'vsource') === 'footage';
    if ((video || footage) && !file) return toast('Upload your video first', 1);
    let o;
    if (video) o = { format: segVal(app, 'format'), captions: ck('captions'), trim_start: ck('trim_start'), tighten: ck('tighten'), zooms: ck('zooms'), unmirror: ck('unmirror'), progress_bar: ck('progress_bar'), hook: v('hook'), topic: v('topic') };
    else if (footage) o = { footage: true, script: v('fscript'), format: segVal(app, 'format'), captions: ck('fcaptions'), music: ck('fmusic') };
    else { const mood = segVal(app, 'mood'); o = { topic: v('topic'), points: v('points'), script: v('script'), storyboard: $('[name=storyboard]')?.value || '', music: mood !== 'none', mood: mood === 'none' ? 'confident' : mood };
      if (!o.topic && !o.points && !o.storyboard.trim() && !o.script) return toast('Add a topic and a few key points (or a storyboard)', 1); }
    if (footage && !o.script) return toast('Write the script for the voiceover', 1);
    if (mode === 'voiceover') o.builtin_voice = v('builtin_voice');
    if (!window.studioUpload) return toast('The page did not finish loading. Refresh and try again.', 1);
    store.set('email', email); $('#go').disabled = true;
    try {
      let source = null;
      if (file) {
        const bar = $('#drop .bar'); bar.style.display = 'block';
        const url = await window.studioUpload(file, email, x => { $('i', bar).style.width = (x * 100).toFixed(1) + '%'; st(`Uploading your video · ${Math.round(x * 100)}%`); });
        source = { url, name: file.name, size: file.size };
      }
      st('Saving your brand kit...');
      const brand = { ...kit, logo: undefined, mark: undefined, logo_light: undefined };
      if (kit.logo) brand.logo_url = await window.studioUpload(dataUrlFile(kit.logo, 'logo.png'), email);
      if (kit.mark) brand.mark_url = await window.studioUpload(dataUrlFile(kit.mark, 'mark.png'), email);
      st('Sending to the studio...');
      const r = await studio('create', { email, mode, title: v('title'), brand, options: o, source });
      store.set('jobs', [r.id, ...myJobs().filter(x => x !== r.id)].slice(0, 30));
      location.hash = '#/job/' + r.id;
    } catch (e) { toast(e.message, 1); st(''); $('#go').disabled = false; }
  });
}

// ------------------------------------------------------------------------------------------------ samples and live jobs
async function project(id) {
  const P = await api('/api/projects/' + id); const brand = STATE.brands.find(b => b.slug === P.brand);
  const head = () => `<a class="small muted" href="#/projects">← Projects</a><div class="spread" style="margin-top:10px"><div><div class="kicker">${esc(P.mode_name)} · ${esc(brand?.name || P.brand)}</div>
    <h1 style="margin-top:12px">${esc(P.title)}</h1></div><div class="row">${chip(P.stage)}</div></div>`;
  return projectDone(P, head);
}

async function job(id) {
  let J = await studio('job', null, `&id=${encodeURIComponent(id || '')}`);
  const head = () => `<a class="small muted" href="#/projects">← Projects</a><div class="spread" style="margin-top:10px"><div><div class="kicker">${esc(J.mode_name)} · ${esc(J.brand?.name || '')}</div>
    <h1 style="margin-top:12px">${esc(J.title)}</h1></div><div class="row">${chip(J.stage)}</div></div>`;
  const running = () => ['queued', 'analyzing', 'rendering'].includes(J.stage);
  if (running()) {
    app.innerHTML = head() + `<div class="card" style="margin-top:24px"><div class="spread"><h3 id="step"></h3><span class="small muted" id="pct"></span></div>
      <div class="bar" style="margin:14px 0 18px"><i id="pb" style="width:0"></i></div><div class="log" id="log"></div>
      <p class="small muted" style="margin-top:12px" id="note"></p></div>`;
    const upd = () => {
      const q = J.stage === 'queued';
      $('#step').textContent = q ? (J.queue_position > 1 ? `Waiting in line · ${J.queue_position - 1} ahead of you` : 'Waiting for the studio') : (J.step || 'Working');
      $('#pb').style.width = ((J.progress || 0) * 100) + '%'; $('#pct').textContent = q ? '' : Math.round((J.progress || 0) * 100) + '%';
      const l = $('#log'); const atEnd = l.scrollTop + l.clientHeight >= l.scrollHeight - 20;
      l.textContent = (J.log || []).join('\n') || 'Your video is queued. It starts as soon as the studio picks it up.'; if (atEnd) l.scrollTop = l.scrollHeight;
      $('#note').textContent = q && !STATE.web.online ? 'The studio is offline right now. Your video starts as soon as it is back. Keep this page or its link; it works for 14 days.'
        : 'You can leave this page and come back. Your video is saved under Projects in this browser.';
    };
    upd(); POLL = setInterval(async () => { try { J = await studio('job', null, `&id=${J.id}`); if (!running()) { clearInterval(POLL); route(); } else upd(); } catch { /* keep polling through a missed beat */ } }, 3000); return;
  }
  if (J.stage === 'error') {
    app.innerHTML = head() + `<div class="card" style="margin-top:24px"><h3>Something went wrong</h3><div class="err" style="margin-top:12px">${esc(J.error || 'The video could not be made.')}</div>
      <div class="row" style="margin-top:16px"><a class="btn primary" href="#/new/${esc(J.mode)}">Try again</a></div>
      ${J.log?.length ? `<details style="margin-top:16px"><summary>Log</summary><div class="log" style="margin-top:8px">${esc(J.log.join('\n'))}</div></details>` : ''}</div>`;
    return;
  }
  const O = J.outputs || {};
  return projectDone({ ...J, output_urls: O, output_sizes: J.output_sizes || {} }, head);
}

function projectDone(P, head) {
  const U = P.output_urls || {}, S = P.output_sizes || {}; const portrait = (P.plan?.output?.[1] || 0) > (P.plan?.output?.[0] || 1);
  const href = u => (u.startsWith('/') ? `${u}" download="` : `${u}${u.includes('?') ? '&' : '?'}download=1`);
  const dl = (url, name, size, icon) => `<div class="dl"><div class="ic">${icon}</div><div><div class="nm">${esc(name)}</div><div class="sz">${size ? fmtSize(size) : ''}</div></div><a class="btn sm" href="${href(url)}">${I.dl}Download</a></div>`;
  const tr = (U.transcripts || []).map(u => dl(u, u.split('/').pop(), 0, I.file)).join('');
  app.innerHTML = head() + `<div class="split" style="margin-top:24px"><div class="c"><div class="vwrap ${portrait ? 'portrait' : ''}"><video src="${U.video}" controls playsinline preload="metadata" poster="${U.thumbnails?.[0] || ''}"></video></div>
    <div class="section"><h2>Thumbnails</h2><p class="small muted">Click to download. Upload one as the cover on LinkedIn.</p><div class="grid g3 thumbs" style="margin-top:12px">${(U.thumbnails || []).map(u => `<a href="${href(u)}"><img src="${u}"></a>`).join('')}</div></div></div>
    <div class="c sticky"><div class="card"><h3>Your files</h3><div class="grid" style="margin-top:14px;gap:10px">${dl(U.video, 'Video', S.video, I.play)}
      ${U.voiceover ? dl(U.voiceover, 'Voiceover (MP3)', S.voiceover, I.mic) : ''}${tr}</div>
      <hr class="s"><div class="small muted">${P.render_seconds ? `Rendered in ${Math.round(P.render_seconds / 60 * 10) / 10} min.` : ''}</div>
      <div class="row" style="margin-top:14px"><a class="btn primary" href="#/">Create another video</a></div></div></div></div>`;
}

// ------------------------------------------------------------------------------------------------ brand kits
function brands() {
  app.innerHTML = `<div class="spread"><div><div class="kicker">Product memory</div><h1 style="margin-top:12px">Brand kits</h1><p class="lead">Colours, logos, tone and rules for your brand. Saved once in this browser, used on every video.</p></div><a class="btn primary" href="#/brand/${myKit() ? 'my-brand' : 'new'}">${myKit() ? 'Edit your brand kit' : 'New brand kit'}</a></div>
  <div class="grid g2" style="margin-top:26px">${STATE.brands.map(b => `<a class="card bcard" href="#/brand/${b.slug}"><div class="lg" style="background-image:url('${b.logo || b.mark}')"></div>
    <div style="min-width:0"><h3>${esc(b.name)}${b.sample ? ' <span class="chip">Sample</span>' : ''}</h3><div class="small muted">${esc(b.tagline)}</div><div class="sw5" style="margin-top:10px">${['accent', 'accent_light', 'accent_2', 'dark', 'panel'].map(k => `<i style="background:${b.colors[k]}"></i>`).join('')}</div>
    <div class="small muted" style="margin-top:8px">${b.sample ? 'Made for Command Pipeline' : 'Your brand kit, saved in this browser'}</div></div></a>`).join('')}</div>`;
}
const COLOR_FIELDS = [['accent', 'Accent', '#E8A000'], ['accent_light', 'Accent light', '#FBBF24'], ['accent_2', 'Accent 2', '#F78C45'], ['dark', 'Background', '#0D0F14'], ['panel', 'Panel', '#1C1C24'], ['ink', 'Text on light', '#1E293B'], ['light', 'Light canvas', '#FFFFFF']];
function shrinkImage(file, max = 800) {
  return new Promise((res, rej) => { const im = new Image(); im.onload = () => { const k = Math.min(1, max / Math.max(im.width, im.height)); const c = document.createElement('canvas');
    c.width = Math.round(im.width * k); c.height = Math.round(im.height * k); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); URL.revokeObjectURL(im.src); res(c.toDataURL('image/png')); };
    im.onerror = () => rej(new Error('That image could not be read')); im.src = URL.createObjectURL(file); });
}
async function brandEdit(slug) {
  const sample = SAMPLES.brands[slug]; const mine = slug === 'my-brand' ? myKit() : null;
  const b = sample ? await api('/api/brands/' + slug) : mine || { name: '', tagline: '', colors: {}, person: {}, voice: { builtin: 'Samantha' }, rules: [], keywords: [] };
  const assets = {}; const V = b.voice || {};
  const asset = (key, title, desc, url, accept, light) => `<div class="asset" data-asset="${key}"><div class="pv ${light ? 'light' : ''}" style="background-image:url('${url || ''}')"></div>
    <div style="min-width:0"><div class="nm">${title}</div><div class="st">${url ? 'Saved' : desc}</div></div>
    <input type="file" accept="${accept}" hidden><button type="button" class="btn sm">${url ? 'Replace' : 'Upload'}</button></div>`;
  app.innerHTML = `<a class="small muted" href="#/brands">← Brand kits</a><div class="kicker" style="margin-top:14px">Brand memory</div><h1 style="margin-top:12px">${sample ? esc(b.name) : mine ? 'Your brand kit' : 'New brand kit'}</h1>
  <p class="lead">${sample ? 'A sample kit made for Command Pipeline. Make your own to create videos with your brand.' : 'Share your brand guidelines once. Everything here is saved in this browser and reused for every video, thumbnail and voiceover.'}</p>
  <div class="split" style="margin-top:26px"><div class="c">
    <div class="card"><h3>Basics</h3><div class="grid g2" style="margin-top:14px"><label class="f">Brand name<input name="name" value="${esc(b.name)}"></label><label class="f">Tagline<input name="tagline" value="${esc(b.tagline || '')}"></label>
      <label class="f">Person on camera<input name="pname" value="${esc(b.person?.name || '')}"></label><label class="f">Their role<input name="prole" value="${esc(b.person?.role || '')}"></label>
      <label class="f">Website<input name="website" value="${esc(b.website || '')}"></label><label class="f">Call to action<input name="cta" value="${esc(b.cta || '')}" placeholder="e.g. Worth a quick chat?"></label></div></div>
    <div class="card section"><div class="spread"><h3>Colours</h3><div class="row"><span class="small muted" id="sugl"></span><div class="swatches" id="sug"></div></div></div>
      <div class="colors" style="margin-top:14px">${COLOR_FIELDS.map(([k, l, d]) => `<div class="color"><input type="color" data-c="${k}" value="${b.colors?.[k] || d}"><div><div class="l">${l}</div><input type="text" data-ct="${k}" value="${b.colors?.[k] || d}"></div></div>`).join('')}</div>
      <p class="small muted" style="margin-top:10px">Tip: upload a logo and we suggest colours from it. The accent is used for lines, highlights and buttons, never as a full-screen fill.</p></div>
    <div class="card section"><h3>Logos</h3><div class="grid g2" style="margin-top:14px">
      ${asset('logo', 'Logo for dark backgrounds', 'PNG/SVG with transparency', b.logo, 'image/*')}${asset('mark', 'Icon / mark', 'Square symbol without words', b.mark, 'image/*')}</div></div>
    <div class="card section"><h3>Voice</h3><div class="grid g2" style="margin-top:14px">
      <label class="f">Stock voice<select name="builtin">${STATE.voices.map(v => `<option ${v === V.builtin ? 'selected' : ''}>${esc(v)}</option>`).join('')}</select></label><div></div>
      <label class="f">Greeting<input name="greeting" value="${esc(V.greeting || '')}" placeholder="Hey everyone"></label><label class="f">Sign-off<input name="signoff" value="${esc(V.signoff || '')}" placeholder="Take care"></label></div></div>
    <div class="card section"><h3>Tone, rules and guidelines</h3><div class="grid" style="margin-top:14px;gap:14px">
      <label class="f">Tone of voice<textarea name="tone" rows="3">${esc(b.tone || '')}</textarea></label>
      <label class="f">Rules <span class="hint">One per line. The planner and every video follow these.</span><textarea name="rules" rows="4">${esc((b.rules || []).join('\n'))}</textarea></label>
      <label class="f">Keywords <span class="hint">Comma separated. Highlighted in captions.</span><input name="keywords" value="${esc((b.keywords || []).join(', '))}"></label>
      <label class="f">Brand guidelines notes <span class="hint">Paste anything from the brand book. Hex colours found here are offered as swatches.</span><textarea name="guidelines" rows="4">${esc(b.guidelines || '')}</textarea></label></div></div>
  </div><div class="c sticky"><div class="card"><h3>Preview</h3><div id="bprev" style="margin-top:12px;border-radius:12px;overflow:hidden;border:1px solid var(--line)"></div>
    ${sample ? `<a class="btn primary" href="#/brand/${myKit() ? 'my-brand' : 'new'}" style="margin-top:16px;width:100%;justify-content:center">Make my own brand kit</a>`
      : `<button class="btn primary" id="saveb" style="margin-top:16px;width:100%;justify-content:center">${mine ? 'Save changes' : 'Save brand kit'}</button><p class="small muted" style="margin-top:10px">Saved in this browser.</p>`}</div></div></div>`;
  bindSeg(app);
  const col = k => $(`[data-ct="${k}"]`).value;
  const prev = () => { const L = assets.logo || b.logo; $('#bprev').innerHTML = `<div style="background:${col('dark')};padding:22px;position:relative">
      <div style="font:600 10px 'SF Mono',Menlo,monospace;letter-spacing:.14em;color:${col('accent_light')}">NO. 01 · ${esc(($('[name=tagline]').value || 'Tagline').toUpperCase())}</div>
      <div style="font-weight:850;font-size:34px;letter-spacing:-.03em;line-height:1.02;margin-top:14px;color:#fff">${esc($('[name=name]').value || 'Your brand')}</div>
      <div style="font-weight:850;font-size:34px;letter-spacing:-.03em;line-height:1.05;background:linear-gradient(90deg,${col('accent_light')},${col('accent')} 55%,${col('accent_2')});-webkit-background-clip:text;color:transparent">gets built.</div>
      <div style="height:4px;border-radius:4px;margin-top:18px;background:linear-gradient(90deg,${col('accent_light')},${col('accent')} 55%,${col('accent_2')})"></div>
      ${L ? `<img src="${L}" style="height:26px;margin-top:16px;display:block">` : ''}</div>
      <div style="background:${col('light')};padding:16px 22px"><div style="font-weight:800;font-size:20px;color:${col('ink')}">One clear statement.</div></div><div style="background:${col('panel')};padding:14px 22px;display:flex;gap:8px">
      <span style="font:600 10px 'SF Mono',Menlo,monospace;padding:4px 8px;border-radius:5px;background:${col('accent')}29;color:${col('accent_light')}">TIER 1</span></div>`; };
  // Changing the accent re-derives the lighter and secondary accents, unless those were set by hand.
  const touched = new Set(); const setCol = (k, h) => { $(`[data-ct="${k}"]`).value = h.toUpperCase(); $(`[data-c="${k}"]`).value = h.toLowerCase(); };
  const follow = k => { if (k !== 'accent') return; const a = col('accent'); if (!/^#[0-9a-f]{6}$/i.test(a)) return;
    if (!touched.has('accent_light')) setCol('accent_light', shade(a, 0, 0.16)); if (!touched.has('accent_2')) setCol('accent_2', shade(a, -18, 0.04)); };
  $$('[data-c]').forEach(i => i.addEventListener('input', () => { touched.add(i.dataset.c); $(`[data-ct="${i.dataset.c}"]`).value = i.value.toUpperCase(); follow(i.dataset.c); prev(); }));
  $$('[data-ct]').forEach(i => i.addEventListener('input', () => { if (/^#[0-9a-f]{6}$/i.test(i.value)) { touched.add(i.dataset.ct); $(`[data-c="${i.dataset.ct}"]`).value = i.value; follow(i.dataset.ct); prev(); } }));
  $$('[name=name],[name=tagline]').forEach(i => i.addEventListener('input', prev));
  const offer = (hexes, label) => { if (!hexes.length) return; $('#sugl').textContent = label; $('#sug').innerHTML = hexes.slice(0, 8).map(h => `<button type="button" style="background:${h}" data-h="${h}" title="${h}: click to use as accent, shift-click for background"></button>`).join(''); };
  $('#sug').addEventListener('click', e => { const h = e.target.dataset.h; if (!h) return; const k = e.shiftKey ? 'dark' : 'accent'; setCol(k, h); follow(k); prev(); toast(`Set ${k === 'dark' ? 'background' : 'accent'} to ${h}`); });
  $('[name=guidelines]').addEventListener('input', e => offer([...new Set((e.target.value.match(/#[0-9a-f]{6}\b/gi) || []).map(x => x.toUpperCase()))], 'From your guidelines'));
  $$('[data-asset]').forEach(el => { const inp = $('input', el), key = el.dataset.asset;
    $('button', el).onclick = () => inp.click();
    inp.onchange = async () => { const f = inp.files[0]; if (!f) return;
      try { assets[key] = await shrinkImage(f); $('.st', el).textContent = `${f.name} · ready to save`; $('.pv', el).style.backgroundImage = `url('${assets[key]}')`;
        logoColors(assets[key]).then(h => offer(h, 'From your logo')); prev();
      } catch (e) { $('.st', el).textContent = e.message; } }; });
  prev();
  if (!sample) $('#saveb').onclick = () => { const v = n => $(`[name=${n}]`).value.trim();
    if (!v('name')) return toast('Add your brand name', 1);
    const colors = {}; COLOR_FIELDS.forEach(([k]) => colors[k] = col(k).toUpperCase());
    const kit = { name: v('name'), tagline: v('tagline'), website: v('website'), cta: v('cta'), person: { name: v('pname'), role: v('prole') }, colors,
      tone: v('tone'), rules: v('rules').split('\n').map(x => x.trim()).filter(Boolean), keywords: v('keywords').split(',').map(x => x.trim()).filter(Boolean), guidelines: v('guidelines'),
      voice: { builtin: v('builtin'), greeting: v('greeting'), signoff: v('signoff') }, logo: assets.logo || b.logo || '', mark: assets.mark || b.mark || '' };
    if (!store.set('brand', kit)) return toast('Your browser would not save the kit. Try a smaller logo.', 1);
    toast('Brand kit saved'); const back = store.get('return', ''); store.set('return', ''); location.hash = back || '#/brands'; };
}
// Hue shift (degrees) and lightness shift (0-1) of a hex colour.
function shade(hex, dh, dl) {
  let [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255); const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2;
  if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; }
  h = (h + dh + 360) % 360; const L = Math.min(0.92, Math.max(0.08, l + dl)); const c = (1 - Math.abs(2 * L - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = L - c / 2;
  [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return '#' + [r, g, b].map(v => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
}
function logoColors(url) {
  return new Promise(res => { const im = new Image(); im.onload = () => { const c = document.createElement('canvas'); const s = 80; c.width = c.height = s; const x = c.getContext('2d'); x.drawImage(im, 0, 0, s, s);
    const d = x.getImageData(0, 0, s, s).data, bins = {};
    for (let i = 0; i < d.length; i += 4) { const [r, g, b, a] = [d[i], d[i + 1], d[i + 2], d[i + 3]]; if (a < 200) continue; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); if (mx - mn < 40 || mx < 60) continue;
      const k = [r, g, b].map(v => Math.round(v / 24) * 24).join(','); bins[k] = (bins[k] || 0) + 1; }
    res(Object.entries(bins).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k]) => '#' + k.split(',').map(v => Math.min(255, +v).toString(16).padStart(2, '0')).join('').toUpperCase())); };
    im.onerror = () => res([]); im.src = url; });
}

route();
