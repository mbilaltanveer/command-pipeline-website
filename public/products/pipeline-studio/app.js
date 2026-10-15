// Pipeline Studio front end (vanilla JS, hash routes)
// Website preview build: reads the sample projects from data.js instead of the local studio server.
const DEMO = !!window.DEMO, BOOKING = 'https://calendly.com/bilal-commandpipeline/30min';
const DEMO_MSG = 'This is a preview of Pipeline Studio. Book a demo to make your own videos.';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const app = $('#app'); let STATE = null, POLL = null;

async function api(path, body, method) {
  if (DEMO) {
    if (body !== undefined) throw new Error(DEMO_MSG);
    const X = window.DEMO, copy = o => JSON.parse(JSON.stringify(o)); let m;
    if (path === '/api/state') return copy(X.state);
    if ((m = path.match(/^\/api\/projects\/(.+)$/)) && X.projects[m[1]]) return copy(X.projects[m[1]]);
    if ((m = path.match(/^\/api\/brands\/(.+)$/)) && X.brands[m[1]]) return copy(X.brands[m[1]]);
    if (path.startsWith('/api/examples/')) return { text: X.example };
    throw new Error('Not found');
  }
  const r = await fetch(path, body !== undefined ? { method: method || 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : {});
  const j = await r.json().catch(() => ({ error: 'Bad response' }));
  if (!r.ok || j.error) throw new Error(j.error || r.statusText); return j;
}
function toast(msg, err) { const t = $('#toast'); t.textContent = msg; t.className = 'on' + (err ? ' err' : ''); clearTimeout(t._h); t._h = setTimeout(() => t.className = '', err ? 6000 : 2600); }
function upload(file, onprog) {
  return new Promise((res, rej) => { const x = new XMLHttpRequest(); x.open('POST', '/api/upload?name=' + encodeURIComponent(file.name));
    x.upload.onprogress = e => e.lengthComputable && onprog && onprog(e.loaded / e.total);
    x.onload = () => { try { const j = JSON.parse(x.responseText); x.status === 200 ? res(j) : rej(new Error(j.error)); } catch (e) { rej(e); } };
    x.onerror = () => rej(new Error('Upload failed')); x.send(file); });
}
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
  play: '<svg viewBox="0 0 24 24"><path d="M7 4l12 8-12 8z"/></svg>', img: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/></svg>',
  mic: '<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/></svg>',
  folder: '<svg viewBox="0 0 24 24"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>',
};
const MODE_INFO = {
  clean: { n: '01', title: 'Clean edit', p: 'Upload any video. We tidy it up and make it ready to post.', get: ['Word-by-word captions in your brand colours', 'Trim to where you say "start", tighten pauses', 'Smart zooms and reframing (9:16, 1:1, 16:9)', '3 thumbnails + SRT, VTT and TXT transcript'] },
  motion: { n: '02', title: 'Brand motion', p: 'No camera needed. Kinetic typography built from your brand guidelines.', get: ['Animated scenes in your colours, logo and fonts', 'Branded transitions and an original music bed', 'Storyboard you can edit line by line', 'Designed thumbnail + script'] },
  voiceover: { n: '03', title: 'Voiceover', p: 'Brand motion with a voiceover, in your own cloned voice or a stock voice. Or voice over your own footage.', get: ['Voice cloned from a 10 second sample', 'Animation timed to every spoken word', 'Music ducks under the voice automatically', 'Voiceover file + captions transcript'] },
  popups: { n: '04', title: 'Talking head + pop-ups', p: 'Your talking video with key-point cards that pop up beside you while you speak.', get: ['Hook line, name card and pop-up cards', 'Captions under you as you speak', 'Cards placed away from your face', 'Thumbnails from your best frames'] },
};
const STAGE = { queued: ['Queued', 'run'], analyzing: ['Working', 'run'], review: ['Ready for review', 'review'], rendering: ['Rendering', 'run'], done: ['Done', 'done'], error: ['Needs attention', 'error'] };
const chip = st => { const s = STAGE[st] || [st, '']; return `<span class="chip ${s[1]}">${esc(s[0])}</span>`; };

async function refreshState() { STATE = await api('/api/state'); const q = STATE.queue; $('#qstat').innerHTML = q ? `<span class="dot"></span>${q} job${q > 1 ? 's' : ''} running` : ''; return STATE; }

// ------------------------------------------------------------------------------------------------ router
async function route() {
  clearInterval(POLL); POLL = null;
  const h = location.hash.slice(1) || '/'; const [, a, b] = h.split('/');
  $$('nav a').forEach(x => x.classList.toggle('on', x.dataset.nav === (a || 'home') || (a === 'new' && x.dataset.nav === 'home') || (a === 'project' && x.dataset.nav === 'projects') || (a === 'brand' && x.dataset.nav === 'brands')));
  try {
    await refreshState(); window.scrollTo(0, 0);
    if (!a) return home();
    if (a === 'new') return newProject(b);
    if (a === 'projects') return projects();
    if (a === 'project') return project(b);
    if (a === 'brands') return brands();
    if (a === 'brand') return brandEdit(b);
    if (a === 'settings' && !DEMO) return settings();
    home();
  } catch (e) { app.innerHTML = `<div class="err">${esc(e.message)}</div>`; }
}
window.addEventListener('hashchange', route);

// ------------------------------------------------------------------------------------------------ home
function pcard(p) {
  return `<a class="pcard" href="#/project/${p.id}"><div class="im" style="background-image:url('${p.thumb_url || ''}')"></div>
  <div class="b"><div class="t">${esc(p.title)}</div><div class="spread"><span class="small muted">${esc(p.mode_name)} · ${esc(p.created.slice(5, 16))}</span>${chip(p.stage)}</div></div></a>`;
}
function home() {
  const B = STATE.brain;
  app.innerHTML = `<div class="hero"><div><div class="kicker">Pipeline Studio</div><h1 style="margin-top:14px">What are we <span class="g">making</span> today?</h1>
    <p class="lead">Pick one of four ways to make a video. Every option uses your saved brand kit and gives you the video, a phone-size copy, thumbnails and a transcript.</p></div>
    <div class="row">${DEMO ? '' : `<span class="pill"><i class="${B.on ? '' : 'off'}"></i>AI planner ${B.on ? 'on' : 'off'}</span>`}<span class="pill"><i class="${STATE.clone ? '' : 'off'}"></i>Voice cloning ${STATE.clone ? 'ready' : 'off'}</span><span class="pill"><i></i>${STATE.brands.length} brand kit${STATE.brands.length === 1 ? '' : 's'}</span></div></div>
  <div class="grid g4">${Object.entries(MODE_INFO).map(([k, m]) => `<a class="mode" href="#/new/${k}"><div class="spread"><div class="ico">${I[k]}</div><span class="num">${m.n}</span></div>
    <h3>${m.title}</h3><p>${m.p}</p><ul>${m.get.map(x => `<li>${x}</li>`).join('')}</ul><div class="go">Start →</div></a>`).join('')}</div>
  <div class="section"><div class="spread"><h2>Recent projects</h2><a class="btn sm ghost" href="#/projects">All projects</a></div>
  <div class="grid g4" style="margin-top:14px">${STATE.projects.slice(0, 8).map(pcard).join('') || '<div class="empty" style="grid-column:1/-1">Nothing yet. Pick an option above to make your first video.</div>'}</div></div>`;
}
function projects() {
  app.innerHTML = `<div class="spread"><div><div class="kicker">Library</div><h1 style="margin-top:12px">Projects</h1></div><a class="btn primary" href="#/">New video</a></div>
  <div class="grid g4" style="margin-top:24px">${STATE.projects.map(pcard).join('') || '<div class="empty" style="grid-column:1/-1">No projects yet.</div>'}</div>`;
}

// ------------------------------------------------------------------------------------------------ new project
function seg(name, opts, val) { return `<div class="seg" data-seg="${name}">${opts.map(([v, l]) => `<button type="button" data-v="${v}" class="${v === val ? 'on' : ''}">${l}</button>`).join('')}</div>`; }
function tog(name, title, desc, on) { return `<label class="tog"><input type="checkbox" name="${name}" ${on ? 'checked' : ''}><span class="sw"></span><span><b>${title}</b><span class="d">${desc}</span></span></label>`; }
function bindSeg(root) { $$('.seg', root).forEach(s => s.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; $$('button', s).forEach(x => x.classList.toggle('on', x === b)); s.dispatchEvent(new Event('change')); })); }
const segVal = (root, n) => $(`[data-seg="${n}"] .on`, root)?.dataset.v;
function brandPicker(sel) {
  if (!STATE.brands.length) return `<div class="empty">No brand kits yet. <a class="btn sm primary" href="#/brand/new" style="margin-left:8px">Create your brand kit</a></div>`;
  return `<div class="brandpick">${STATE.brands.map(b => `<button type="button" data-brand="${b.slug}" class="${b.slug === sel ? 'on' : ''}"><span class="lg" style="background-image:url('${b.mark || b.logo}')"></span>${esc(b.name)}</button>`).join('')}
    <a class="btn ghost" href="#/brand/new">+ New brand kit</a></div>`;
}
function dropZone(id, label, accept) {
  return `<div class="drop" id="${id}"><input type="file" accept="${accept}" hidden>${I.up}<div class="t">${label}</div><div class="small muted">Drag and drop, or click to choose. Stays on this Mac.</div>
    <div class="bar" style="margin-top:14px;display:none"><i style="width:0"></i></div><div class="small st" style="margin-top:8px"></div></div>`;
}
function bindDrop(el, onDone) {
  const inp = $('input', el), bar = $('.bar', el), st = $('.st', el);
  const go = async f => { if (DEMO) { st.innerHTML = `<b style="color:var(--good)">✓</b> ${esc(f.name)} · ${fmtSize(f.size)} · selected (preview only, nothing is uploaded)`; return onDone({ path: '' }); }
    bar.style.display = 'block'; st.textContent = `Uploading ${f.name}...`;
    try { const r = await upload(f, x => $('i', bar).style.width = (x * 100).toFixed(1) + '%'); $('i', bar).style.width = '100%';
      st.innerHTML = `<b style="color:var(--good)">✓</b> ${esc(f.name)} · ${fmtSize(r.size)}${r.info && r.info.duration ? ' · ' + fmtT(r.info.duration) + ' · ' + r.info.width + '×' + r.info.height : ''}`; onDone(r); }
    catch (e) { st.textContent = e.message; toast(e.message, 1); } };
  el.addEventListener('click', e => { if (e.target !== inp) inp.click(); }); inp.addEventListener('change', () => inp.files[0] && go(inp.files[0]));
  el.addEventListener('dragover', e => { e.preventDefault(); el.classList.add('over'); }); el.addEventListener('dragleave', () => el.classList.remove('over'));
  el.addEventListener('drop', e => { e.preventDefault(); el.classList.remove('over'); e.dataTransfer.files[0] && go(e.dataTransfer.files[0]); });
}

function newProject(mode) {
  const M = MODE_INFO[mode]; if (!M) return home();
  const brand = STATE.brands[0]?.slug; let src = null;
  const video = mode === 'clean' || mode === 'popups';
  const formats = seg('format', [['original', 'Original framing'], ['9:16', '9:16 vertical'], ['1:1', '1:1 square'], ['16:9', '16:9 wide']], 'original');
  const videoOpts = `<div class="c"><h3>Format</h3>${formats}<div class="small muted">Original keeps your framing exactly. Vertical/square reframe around your face.</div></div>
    <div class="grid g2">${tog('captions', 'Captions', 'Word-by-word captions, key words in your accent colour', true)}${tog('trim_start', 'Trim the start', 'Start where you say "start" and cut dead air', true)}
    ${tog('tighten', 'Tighten pauses', 'Squeeze long silences (soft dissolve on each cut)', false)}${tog('zooms', 'Zoom cuts', 'Punch-in zooms on sentence starts and numbers', mode === 'popups')}
    ${tog('unmirror', 'Fix mirrored selfie', 'Flip a front-camera recording so text reads right', false)}${tog('progress_bar', 'Progress bar', 'Thin brand-colour bar along the bottom', false)}</div>`;
  const story = (voice) => `<label class="f">Topic<input name="topic" placeholder="e.g. How we build a pipeline"></label>
    <label class="f">Key points <span class="hint">One per line. These become scenes. Only facts you write here are used.</span><textarea name="points" rows="5" placeholder="Buying signals&#10;Verified data&#10;Copy that sounds human&#10;Email and LinkedIn as one story"></textarea></label>
    ${voice ? `<label class="f">Your script <span class="hint">Optional. Paste what the voice should say (one paragraph per scene). Leave empty and we write it in your brand's tone.</span><textarea name="script" rows="4"></textarea></label>` : ''}
    <details><summary>Or write the storyboard yourself</summary><div class="c" style="margin-top:10px"><div class="row"><button type="button" class="btn sm" id="ex">Load example storyboard</button><span class="small muted">Scenes in [brackets], one field per line. You can edit everything again before rendering.</span></div>
    <textarea name="storyboard" class="code" style="min-height:300px" placeholder="[title]&#10;line1: Your outbound,&#10;line2: running itself."></textarea></div></details>
    <div class="row"><span class="small muted">Music</span>${seg('mood', [['confident', 'Confident'], ['bright', 'Bright'], ['calm', 'Calm'], ['none', 'No music']], 'confident')}</div>`;
  const voicePick = () => `<div class="c"><h3>Voice</h3>${seg('voice_engine', [['clone', 'Brand voice (cloned)'], ['builtin', 'Stock voice']], 'clone')}
    <div id="vstock" style="display:none"><label class="f">Stock voice<select name="builtin_voice">${STATE.voices.map(v => `<option>${esc(v)}</option>`).join('')}</select></label></div>
    <div class="small muted" id="vnote"></div></div>`;
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
    <div class="step"><div class="n">1</div><div class="c"><h3>Brand kit</h3><div id="bp">${brandPicker(brand)}</div></div></div>
    ${body}
    <div class="step"><div class="n">${mode === 'voiceover' ? 4 : video ? 4 : 3}</div><div class="c"><label class="f">Project name<input name="title" placeholder="${M.title} ${new Date().toLocaleDateString()}"></label>
      <div class="row">${DEMO ? `<a class="btn primary" id="go" href="${BOOKING}" target="_blank" rel="noopener">Book a demo to make this video →</a><span class="small muted">In your studio you review and edit everything before the final render.</span>` : '<button class="btn primary" id="go">Analyze and draft the plan →</button><span class="small muted">You review and edit everything before the final render.</span>'}</div></div></div>
  </div></div>`;
  bindSeg(app); let sel = brand;
  const refreshVoice = () => { const b = STATE.brands.find(x => x.slug === sel); const eng = segVal(app, 'voice_engine'); const vs = $('#vstock'); if (!vs) return;
    vs.style.display = eng === 'builtin' ? '' : 'none';
    $('#vnote').innerHTML = eng === 'clone' ? (b?.voice_sample && STATE.clone ? `Using the voice sample saved in <b>${esc(b.name)}</b>. Each line is generated several times and the most natural take is kept.` :
      `<span style="color:var(--accentL)">${!STATE.clone ? 'Voice cloning is not installed on this Mac.' : `No voice sample in this brand kit yet.`}</span> <a href="#/brand/${sel}" style="text-decoration:underline">Add a 10 second sample</a>, or a stock voice is used.`) : 'A built-in macOS voice. Fast, no setup.'; };
  $('#bp').addEventListener('click', e => { const b = e.target.closest('[data-brand]'); if (!b) return; sel = b.dataset.brand; $$('#bp [data-brand]').forEach(x => x.classList.toggle('on', x === b)); refreshVoice(); });
  $('[data-seg="voice_engine"]')?.addEventListener('change', refreshVoice); refreshVoice();
  $('[data-seg="vsource"]')?.addEventListener('change', () => { const f = segVal(app, 'vsource') === 'footage'; $('#vsrc-footage').style.display = f ? '' : 'none'; $('#vsrc-motion').style.display = f ? 'none' : ''; });
  if ($('#drop')) bindDrop($('#drop'), r => src = r);
  $('#ex')?.addEventListener('click', async () => { const r = await api('/api/examples/command-pipeline'); $('[name=storyboard]').value = r.text; $('[name=storyboard]').closest('details').open = true; });
  if (!DEMO) $('#go').addEventListener('click', async () => {
    const v = n => $(`[name=${n}]`)?.value?.trim() || '', ck = n => !!$(`[name=${n}]`)?.checked;
    if (!sel) return toast('Pick or create a brand kit first', 1);
    const footage = mode === 'voiceover' && segVal(app, 'vsource') === 'footage';
    if ((video || footage) && !src) return toast('Upload your video first', 1);
    let o;
    if (video) o = { format: segVal(app, 'format'), captions: ck('captions'), trim_start: ck('trim_start'), tighten: ck('tighten'), zooms: ck('zooms'), unmirror: ck('unmirror'), progress_bar: ck('progress_bar'), hook: v('hook'), topic: v('topic') };
    else if (footage) o = { footage: true, script: v('fscript'), format: segVal(app, 'format'), captions: ck('fcaptions'), music: ck('fmusic') };
    else { const mood = segVal(app, 'mood'); o = { topic: v('topic'), points: v('points'), script: v('script'), storyboard: $('[name=storyboard]')?.value || '', music: mood !== 'none', mood: mood === 'none' ? 'confident' : mood };
      if (!o.topic && !o.points && !o.storyboard.trim() && !o.script) return toast('Add a topic and a few key points (or a storyboard)', 1); }
    if (footage && !o.script) return toast('Write the script for the voiceover', 1);
    if (mode === 'voiceover') { o.voice_engine = segVal(app, 'voice_engine'); o.builtin_voice = v('builtin_voice'); }
    $('#go').disabled = true;
    try { const r = await api('/api/projects', { mode, brand: sel, title: v('title'), source: src?.path, options: o }); location.hash = '#/project/' + r.id; }
    catch (e) { toast(e.message, 1); $('#go').disabled = false; }
  });
}

// ------------------------------------------------------------------------------------------------ project
async function project(id) {
  let P = await api('/api/projects/' + id); const brand = STATE.brands.find(b => b.slug === P.brand);
  const head = () => `<a class="small muted" href="#/projects">← Projects</a><div class="spread" style="margin-top:10px"><div><div class="kicker">${esc(P.mode_name)} · ${esc(brand?.name || P.brand)}</div>
    <h1 style="margin-top:12px">${esc(P.title)}</h1></div><div class="row">${chip(P.stage)}${DEMO ? '' : `<button class="btn sm" id="reveal">${I.folder}Open folder</button>`}</div></div>`;
  const bindHead = () => { if ($('#reveal')) $('#reveal').onclick = () => api(`/api/projects/${id}/reveal`, {}); };
  const running = () => ['queued', 'analyzing', 'rendering'].includes(P.stage);
  if (running()) {
    app.innerHTML = head() + `<div class="card" style="margin-top:24px"><div class="spread"><h3 id="step">${esc(P.step || 'Working')}</h3><span class="small muted" id="pct"></span></div>
      <div class="bar" style="margin:14px 0 18px"><i id="pb" style="width:${(P.progress || 0) * 100}%"></i></div><div class="log" id="log"></div>
      <p class="small muted" style="margin-top:12px">You can leave this page. Jobs keep running in the background, one at a time.</p></div>`; bindHead();
    const upd = () => { $('#step').textContent = P.step || 'Working'; $('#pb').style.width = ((P.progress || 0) * 100) + '%'; $('#pct').textContent = Math.round((P.progress || 0) * 100) + '%';
      const l = $('#log'); const atEnd = l.scrollTop + l.clientHeight >= l.scrollHeight - 20; l.textContent = (P.log || []).join('\n'); if (atEnd) l.scrollTop = l.scrollHeight; };
    upd(); POLL = setInterval(async () => { try { P = await api('/api/projects/' + id); if (!running()) { clearInterval(POLL); route(); } else upd(); } catch { /* keep polling through a missed beat */ } }, 1500); return;
  }
  if (P.stage === 'error') {
    app.innerHTML = head() + `<div class="card" style="margin-top:24px"><h3>Something went wrong</h3><div class="err" style="margin-top:12px">${esc(P.error)}</div>
      <div class="row" style="margin-top:16px"><button class="btn primary" id="retry">Try again</button>${P.plan || P.storyboard || P.script ? '<button class="btn" id="back">Back to the plan</button>' : ''}</div>
      <details style="margin-top:16px"><summary>Log</summary><div class="log" style="margin-top:8px">${esc((P.log || []).join('\n'))}</div></details></div>`; bindHead();
    $('#retry').onclick = async () => { await api(`/api/projects/${id}/${P.queued_action === 'render' ? 'render' : P.queued_action === 'preview' ? 'preview' : 'reanalyze'}`, {}); route(); };
    if ($('#back')) $('#back').onclick = async () => { await api(`/api/projects/${id}/review`, {}); route(); };
    return;
  }
  if (P.stage === 'done') return projectDone(P, head, bindHead);
  return projectReview(P, head, bindHead);
}

function projectDone(P, head, bindHead) {
  const U = P.output_urls || {}, S = P.output_sizes || {}; const portrait = (P.plan?.output?.[1] || 0) > (P.plan?.output?.[0] || 1);
  const dl = (url, name, size, icon) => `<div class="dl"><div class="ic">${icon}</div><div><div class="nm">${esc(name)}</div><div class="sz">${size ? fmtSize(size) : ''}</div></div><a class="btn sm" href="${DEMO ? url + '" download="' : url + '?download=1'}">${I.dl}Download</a></div>`;
  const tr = (U.transcripts || []).map(u => dl(u, u.split('/').pop(), 0, I.file)).join('');
  app.innerHTML = head() + `<div class="split" style="margin-top:24px"><div class="c"><div class="vwrap ${portrait ? 'portrait' : ''}"><video src="${U.video}" controls playsinline preload="metadata" poster="${U.thumbnails?.[0] || ''}"></video></div>
    <div class="section"><h2>Thumbnails</h2><p class="small muted">Click to download. Upload one as the cover on LinkedIn.</p><div class="grid g3 thumbs" style="margin-top:12px">${(U.thumbnails || []).map(u => `<a href="${DEMO ? u + '" download="' : u + '?download=1'}"><img src="${DEMO ? u : u + '?v=' + Date.now()}"></a>`).join('')}</div></div></div>
    <div class="c sticky"><div class="card"><h3>Your files</h3><div class="grid" style="margin-top:14px;gap:10px">${dl(U.video, DEMO ? 'Video' : 'Video (full quality)', S.video, I.play)}${U.small ? dl(U.small, 'Phone-size copy', S.small, I.play) : ''}
      ${U.voiceover ? dl(U.voiceover, 'Voiceover (MP3)', S.voiceover, I.mic) : ''}${tr}</div>
      <hr class="s"><div class="small muted">Rendered in ${Math.round((P.render_seconds || 0) / 60 * 10) / 10} min.${DEMO ? '' : ` Saved in Pipeline-Studio/projects/${esc(P.id)}/output`}</div>
      <div class="row" style="margin-top:14px">${DEMO ? `<a class="btn primary" href="${BOOKING}" target="_blank" rel="noopener">Book a demo to make yours →</a>` : '<button class="btn" id="edit">Edit and render again</button>'}</div></div></div></div>`;
  bindHead(); if (!DEMO) $('#edit').onclick = async () => { await api(`/api/projects/${P.id}/review`, {}); route(); };
}

function projectReview(P, head, bindHead) {
  const video = P.mode === 'clean' || P.mode === 'popups'; const footage = P.options?.footage;
  const actions = `<div class="row" style="margin-top:18px"><button class="btn primary" id="render">Render final video →</button>${!footage ? '<button class="btn" id="preview">Save and update preview</button>' : ''}<button class="btn ghost" id="save">Save</button></div>`;
  if (video) {
    const pl = P.plan; let pops = (pl.popups || []).map(x => ({ ...x }));
    const sentences = P.sentences || [];
    app.innerHTML = head() + `<div class="split" style="margin-top:24px"><div class="c"><div class="card"><div class="spread"><h3>Preview frames</h3><span class="small muted">${fmtT(pl.duration)} · ${pl.output[0]}×${pl.output[1]}${pl.planner ? ' · planned by ' + (pl.planner === 'ai' ? 'AI planner' : 'built-in planner') : ''}</span></div>
      <img class="preview" style="margin-top:12px" src="${P.preview_url}"></div>
      ${P.mode === 'popups' ? `<div class="card section"><div class="spread"><div><h3>Pop-up cards</h3><p class="small muted">Times are in seconds. Click a line of the transcript to add a card there.</p></div><button class="btn sm" id="addp">+ Add card</button></div>
        <div class="tl" id="tl" style="margin-top:14px"></div><div class="grid" id="pops" style="margin-top:12px;gap:10px"></div></div>` : ''}
      <div class="card section"><h3>Captions</h3><p class="small muted">Type over a misheard word to fix it. Wrap words in *stars* to colour them, use / to break a caption. Keep one word per spoken word.</p>
        <textarea name="display" class="code" style="min-height:160px;margin-top:10px">${esc(pl.display)}</textarea></div></div>
      <div class="c sticky"><div class="card"><h3>Plan</h3><div class="grid" style="margin-top:12px;gap:12px">
        ${P.mode === 'popups' ? `<label class="f">Hook (first 4 seconds)<input name="hook" value="${esc(pl.hook || '')}"></label>` : ''}
        <label class="f">Thumbnail headline<input name="thumbnail" value="${esc(pl.thumbnail || '')}"></label>
        ${tog('captions', 'Captions', 'Show captions under you', pl.captions !== false)}${tog('progress_bar', 'Progress bar', 'Thin bar along the bottom', !!pl.progress_bar)}</div>${actions}</div>
      ${sentences.length ? `<div class="card section"><h3>Transcript</h3><div class="sents" id="sents" style="margin-top:10px">${sentences.map(s => `<div class="sent" data-t="${s[0]}" data-e="${s[1]}"><span class="tm">${fmtT(s[0])}</span><span>${esc(s[2])}</span></div>`).join('')}</div></div>` : ''}</div></div>`;
    const drawPops = () => { const box = $('#pops'); if (!box) return;
      box.innerHTML = pops.map((p, i) => `<div class="pop" data-i="${i}"><input type="number" step="0.1" data-k="t0" value="${p.t0}" title="Start (s)"><input type="number" step="0.1" data-k="t1" value="${p.t1}" title="End (s)">
        <div class="grid" style="gap:6px"><input data-k="kicker" value="${esc(p.kicker)}" placeholder="Kicker (1-3 words)"><input data-k="title" value="${esc(p.title)}" placeholder="Title (the key point)"><input data-k="body" value="${esc(p.body)}" placeholder="Supporting line (optional)"></div>
        <button class="x" data-del="${i}" title="Remove">✕</button></div>`).join('') || '<div class="empty">No cards. Add one, or click a transcript line.</div>';
      $('#tl').innerHTML = `<i class="h" style="left:0;width:${4 / pl.duration * 100}%" title="Hook"></i>` + pops.map(p => `<i style="left:${p.t0 / pl.duration * 100}%;width:${(p.t1 - p.t0) / pl.duration * 100}%"></i>`).join(''); };
    drawPops();
    $('#pops')?.addEventListener('input', e => { const r = e.target.closest('[data-i]'); if (!r) return; const p = pops[+r.dataset.i]; const k = e.target.dataset.k; p[k] = k[0] === 't' ? +e.target.value : e.target.value; if (k[0] === 't') drawPops(); });
    $('#pops')?.addEventListener('click', e => { const d = e.target.closest('[data-del]'); if (d) { pops.splice(+d.dataset.del, 1); drawPops(); } });
    $('#addp')?.addEventListener('click', () => { const t = pops.length ? pops[pops.length - 1].t1 + 2 : 5; pops.push({ t0: +t.toFixed(1), t1: +(t + 5).toFixed(1), kicker: 'Key point', title: '', body: '', side: 'auto' }); drawPops(); });
    $('#sents')?.addEventListener('click', e => { const s = e.target.closest('.sent'); if (!s || P.mode !== 'popups') return; const t0 = +s.dataset.t;
      const words = s.lastElementChild.textContent.split(' '); pops.push({ t0: +(t0 + 0.15).toFixed(1), t1: +Math.min(pl.duration - 0.3, t0 + 5.5).toFixed(1), kicker: brandName(P), title: words.slice(0, 8).join(' ').replace(/[.,]$/, ''), body: '', side: 'auto' });
      pops.sort((a, b) => a.t0 - b.t0); drawPops(); toast('Card added. Edit its text on the left.'); });
    const collect = () => ({ plan: { hook: $('[name=hook]')?.value || '', thumbnail: $('[name=thumbnail]').value, captions: $('[name=captions]').checked, progress_bar: $('[name=progress_bar]').checked,
      popups: pops, display: $('[name=display]').value } });
    return bindReview(P, collect, bindHead);
  }
  if (footage) {
    app.innerHTML = head() + `<div class="split" style="margin-top:24px"><div class="card"><h3>Voiceover script</h3><p class="small muted">One paragraph per breath. The captions and timing follow the voice.</p>
      <textarea name="script" style="min-height:340px;margin-top:12px">${esc(P.script || '')}</textarea></div>
      <div class="c sticky"><div class="card"><h3>Footage</h3>${P.preview_url ? `<img class="preview" style="margin-top:10px" src="${P.preview_url}">` : ''}<p class="small muted" style="margin-top:10px">${esc(P.source_name)}</p>${actions}</div></div></div>`;
    return bindReview(P, () => ({ script: $('[name=script]').value }), bindHead);
  }
  const F = STATE.scene_fields, Hh = STATE.scene_help;
  app.innerHTML = head() + `<div class="split" style="margin-top:24px"><div class="c"><div class="card"><div class="spread"><h3>Preview: one frame per scene</h3><span class="small muted">Final timing follows ${P.mode === 'voiceover' ? 'the voice' : 'the music'}</span></div>
      <div class="scenes" style="margin-top:12px">${(P.stills || []).map((u, i) => `<figure><img src="${u}"><figcaption>${i + 1}</figcaption></figure>`).join('')}</div></div>
    <div class="card section"><div class="spread"><h3>Storyboard</h3><span class="small muted">${P.mode === 'voiceover' ? 'Each scene\'s vo line is what the voice says' : 'Edit any text, add or remove scenes'}</span></div>
      <textarea name="storyboard" class="code" style="margin-top:12px" spellcheck="false">${esc(P.storyboard || '')}</textarea></div></div>
    <div class="c sticky"><div class="card"><h3>Thumbnail</h3><div class="grid" style="margin-top:12px;gap:10px"><label class="f">Line 1 (white)<input name="t1" value="${esc(P.thumb?.line1 || '')}"></label>
      <label class="f">Line 2 (brand gradient)<input name="t2" value="${esc(P.thumb?.line2 || '')}"></label></div>${actions}</div>
      <div class="card section"><h3>Scene types</h3><div class="ref" style="margin-top:10px">${Object.keys(F).map(k => `<div><b>[${k}]</b><div class="small muted" style="margin:4px 0">${esc(Hh[k])}</div><code>${F[k].join(', ')}</code></div>`).join('')}
      <div><b>every scene</b><div class="small muted" style="margin:4px 0">label, right (small labels), dur (seconds, rounded to 2 s bars)${P.mode === 'voiceover' ? ', vo (voiceover line), cues (e.g. value=sixteen)' : ''}</div></div></div></div></div></div>`;
  return bindReview(P, () => ({ storyboard: $('[name=storyboard]').value, thumb: { line1: $('[name=t1]').value, line2: $('[name=t2]').value } }), bindHead);
}
const brandName = P => STATE.brands.find(b => b.slug === P.brand)?.name || 'Key point';
function bindReview(P, collect, bindHead) {
  bindHead(); bindSeg(app);
  const act = async (a, btn) => { btn.disabled = true; try { if (a === 'save') { await api(`/api/projects/${P.id}/review`, collect()); toast('Saved'); } else { await api(`/api/projects/${P.id}/${a}`, collect()); route(); } } catch (e) { toast(e.message, 1); } btn.disabled = false; };
  $('#render').onclick = e => act('render', e.currentTarget); $('#save').onclick = e => act('save', e.currentTarget); if ($('#preview')) $('#preview').onclick = e => act('preview', e.currentTarget);
}

// ------------------------------------------------------------------------------------------------ brand kits
function brands() {
  app.innerHTML = `<div class="spread"><div><div class="kicker">Product memory</div><h1 style="margin-top:12px">Brand kits</h1><p class="lead">Colours, logos, fonts, tone, rules and voice for every client. Saved once, used on every video.</p></div><a class="btn primary" href="#/brand/new">New brand kit</a></div>
  <div class="grid g2" style="margin-top:26px">${STATE.brands.map(b => `<a class="card bcard" href="#/brand/${b.slug}"><div class="lg" style="background-image:url('${b.logo || b.mark}')"></div>
    <div style="min-width:0"><h3>${esc(b.name)}</h3><div class="small muted">${esc(b.tagline)}</div><div class="sw5" style="margin-top:10px">${['accent', 'accent_light', 'accent_2', 'dark', 'panel'].map(k => `<i style="background:${b.colors[k]}"></i>`).join('')}</div>
    <div class="small muted" style="margin-top:8px">${b.voice_sample ? 'Voice sample saved' : 'No voice sample'}${b.font_headline ? ' · custom font' : ''}</div></div></a>`).join('') || '<div class="empty" style="grid-column:1/-1">No brand kits yet.</div>'}</div>`;
}
const COLOR_FIELDS = [['accent', 'Accent', '#E8A000'], ['accent_light', 'Accent light', '#FBBF24'], ['accent_2', 'Accent 2', '#F78C45'], ['dark', 'Background', '#0D0F14'], ['panel', 'Panel', '#1C1C24'], ['ink', 'Text on light', '#1E293B'], ['light', 'Light canvas', '#FFFFFF']];
async function brandEdit(slug) {
  const isNew = slug === 'new'; const b = isNew ? { name: '', tagline: '', colors: {}, person: {}, voice: { engine: 'clone', builtin: 'Samantha', exaggeration: 0.72, cfg: 0.32 }, rules: [], keywords: [] } : await api('/api/brands/' + slug);
  const assets = {}; const V = b.voice || {};
  const asset = (key, title, desc, url, accept, light) => `<div class="asset" data-asset="${key}"><div class="pv ${light ? 'light' : ''}" style="background-image:url('${url || ''}')">${key.startsWith('font') || key === 'voice_sample' ? `<div style="display:grid;place-items:center;height:100%">${key === 'voice_sample' ? I.mic : I.file}</div>` : ''}</div>
    <div style="min-width:0"><div class="nm">${title}</div><div class="st">${url ? (key === 'voice_sample' && url === 'saved' ? 'Saved' : key === 'voice_sample' ? `<audio controls src="${url}" style="height:30px;margin-top:4px;max-width:220px"></audio>` : 'Saved') : desc}</div></div>
    <input type="file" accept="${accept}" hidden><button type="button" class="btn sm">${url ? 'Replace' : 'Upload'}</button></div>`;
  app.innerHTML = `<a class="small muted" href="#/brands">← Brand kits</a><div class="kicker" style="margin-top:14px">Brand memory</div><h1 style="margin-top:12px">${isNew ? 'New brand kit' : esc(b.name)}</h1>
  <p class="lead">Share your brand guidelines once. ${DEMO ? 'Everything here is saved' : 'Everything here is saved on this Mac'} and reused for every video, thumbnail and voiceover.</p>
  <div class="split" style="margin-top:26px"><div class="c">
    <div class="card"><h3>Basics</h3><div class="grid g2" style="margin-top:14px"><label class="f">Brand name<input name="name" value="${esc(b.name)}"></label><label class="f">Tagline<input name="tagline" value="${esc(b.tagline || '')}"></label>
      <label class="f">Person on camera<input name="pname" value="${esc(b.person?.name || '')}"></label><label class="f">Their role<input name="prole" value="${esc(b.person?.role || '')}"></label>
      <label class="f">Website<input name="website" value="${esc(b.website || '')}"></label><label class="f">Call to action<input name="cta" value="${esc(b.cta || '')}" placeholder="e.g. Worth a quick chat?"></label></div></div>
    <div class="card section"><div class="spread"><h3>Colours</h3><div class="row"><span class="small muted" id="sugl"></span><div class="swatches" id="sug"></div></div></div>
      <div class="colors" style="margin-top:14px">${COLOR_FIELDS.map(([k, l, d]) => `<div class="color"><input type="color" data-c="${k}" value="${b.colors?.[k] || d}"><div><div class="l">${l}</div><input type="text" data-ct="${k}" value="${b.colors?.[k] || d}"></div></div>`).join('')}</div>
      <p class="small muted" style="margin-top:10px">Tip: upload a logo and we suggest colours from it. The accent is used for lines, highlights and buttons, never as a full-screen fill.</p></div>
    <div class="card section"><h3>Logos and fonts</h3><div class="grid g2" style="margin-top:14px">
      ${asset('logo_dark', 'Logo for dark backgrounds', 'PNG/SVG with transparency', b.logo, 'image/*')}${asset('logo_light', 'Logo for light backgrounds', 'Optional', b.logo_light, 'image/*', true)}
      ${asset('mark', 'Icon / mark', 'Square symbol without words', b.mark, 'image/*')}${asset('font_headline', 'Headline font', b.font_headline || 'Optional .ttf / .otf (default: SF Pro)', '', '.ttf,.otf')}
      ${asset('font_body', 'Body font', b.font_body || 'Optional .ttf / .otf', '', '.ttf,.otf')}</div></div>
    <div class="card section"><h3>Voice</h3><div class="grid g2" style="margin-top:14px">${asset('voice_sample', 'Voice sample', '10-20 s of clear speech (audio or video)', b.voice_sample, 'audio/*,video/*')}
      <label class="f">Default voice${seg('vengine', [['clone', 'Cloned from sample'], ['builtin', 'Stock voice']], V.engine || 'clone')}</label>
      <label class="f">Stock voice<select name="builtin">${STATE.voices.map(v => `<option ${v === V.builtin ? 'selected' : ''}>${esc(v)}</option>`).join('')}</select></label>
      <label class="f">Expressiveness <span class="hint">Higher is livelier. 0.7 is a good start.</span><input type="number" step="0.05" min="0.3" max="1.2" name="exag" value="${V.exaggeration ?? 0.72}"></label>
      <label class="f">Greeting<input name="greeting" value="${esc(V.greeting || '')}" placeholder="Hey everyone"></label><label class="f">Sign-off<input name="signoff" value="${esc(V.signoff || '')}" placeholder="Take care"></label></div></div>
    <div class="card section"><h3>Tone, rules and guidelines</h3><div class="grid" style="margin-top:14px;gap:14px">
      <label class="f">Tone of voice<textarea name="tone" rows="3">${esc(b.tone || '')}</textarea></label>
      <label class="f">Rules <span class="hint">One per line. The planner and every video follow these.</span><textarea name="rules" rows="4">${esc((b.rules || []).join('\n'))}</textarea></label>
      <label class="f">Keywords <span class="hint">Comma separated. Highlighted in captions.</span><input name="keywords" value="${esc((b.keywords || []).join(', '))}"></label>
      <label class="f">Brand guidelines notes <span class="hint">Paste anything from the brand book. Hex colours found here are offered as swatches.</span><textarea name="guidelines" rows="4">${esc(b.guidelines || '')}</textarea></label></div></div>
  </div><div class="c sticky"><div class="card"><h3>Preview</h3><div id="bprev" style="margin-top:12px;border-radius:12px;overflow:hidden;border:1px solid var(--line)"></div>
    ${DEMO ? `<a class="btn primary" id="saveb" href="${BOOKING}" target="_blank" rel="noopener" style="margin-top:16px;width:100%;justify-content:center">Book a demo to save your brand kit</a><p class="small muted" style="margin-top:10px">Try a logo or colours here. Nothing is uploaded.</p>` : `<button class="btn primary" id="saveb" style="margin-top:16px;width:100%;justify-content:center">${isNew ? 'Save brand kit' : 'Save changes'}</button><p class="small muted" style="margin-top:10px">Saved to Pipeline-Studio/brands/</p>`}</div></div></div>`;
  bindSeg(app);
  const col = k => $(`[data-ct="${k}"]`).value;
  const prev = () => { const L = assets.logo_dark?.url || b.logo; $('#bprev').innerHTML = `<div style="background:${col('dark')};padding:22px;position:relative">
      <div style="font:600 10px 'SF Mono',Menlo,monospace;letter-spacing:.14em;color:${col('accent_light')}">NO. 01 · ${esc(($('[name=tagline]').value || 'Tagline').toUpperCase())}</div>
      <div style="font-weight:850;font-size:34px;letter-spacing:-.03em;line-height:1.02;margin-top:14px;color:#fff">${esc($('[name=name]').value || 'Your brand')}</div>
      <div style="font-weight:850;font-size:34px;letter-spacing:-.03em;line-height:1.05;background:linear-gradient(90deg,${col('accent_light')},${col('accent')} 55%,${col('accent_2')});-webkit-background-clip:text;color:transparent">gets built.</div>
      <div style="height:4px;border-radius:4px;margin-top:18px;background:linear-gradient(90deg,${col('accent_light')},${col('accent')} 55%,${col('accent_2')})"></div>
      ${L ? `<img src="${L}" style="height:26px;margin-top:16px;display:block">` : ''}</div>
      <div style="background:${col('light')};padding:16px 22px"><div style="font-weight:800;font-size:20px;color:${col('ink')}">One clear statement.</div></div><div style="background:${col('panel')};padding:14px 22px;display:flex;gap:8px">
      <span style="font:600 10px 'SF Mono',Menlo,monospace;padding:4px 8px;border-radius:5px;background:${col('accent')}29;color:${col('accent_light')}">TIER 1</span></div>`; };
  $$('[data-c]').forEach(i => i.addEventListener('input', () => { $(`[data-ct="${i.dataset.c}"]`).value = i.value.toUpperCase(); prev(); }));
  $$('[data-ct]').forEach(i => i.addEventListener('input', () => { if (/^#[0-9a-f]{6}$/i.test(i.value)) { $(`[data-c="${i.dataset.ct}"]`).value = i.value; prev(); } }));
  $$('[name=name],[name=tagline]').forEach(i => i.addEventListener('input', prev));
  const offer = (hexes, label) => { if (!hexes.length) return; $('#sugl').textContent = label; $('#sug').innerHTML = hexes.slice(0, 8).map(h => `<button type="button" style="background:${h}" data-h="${h}" title="${h}: click to use as accent, shift-click for background"></button>`).join(''); };
  $('#sug').addEventListener('click', e => { const h = e.target.dataset.h; if (!h) return; const k = e.shiftKey ? 'dark' : 'accent'; $(`[data-ct="${k}"]`).value = h.toUpperCase(); $(`[data-c="${k}"]`).value = h; prev(); toast(`Set ${k === 'dark' ? 'background' : 'accent'} to ${h}`); });
  $('[name=guidelines]').addEventListener('input', e => offer([...new Set((e.target.value.match(/#[0-9a-f]{6}\b/gi) || []).map(x => x.toUpperCase()))], 'From your guidelines'));
  $$('[data-asset]').forEach(el => { const inp = $('input', el), key = el.dataset.asset;
    $('button', el).onclick = () => inp.click();
    inp.onchange = async () => { const f = inp.files[0]; if (!f) return; $('.st', el).textContent = 'Uploading...';
      try { const r = DEMO ? { path: '' } : await upload(f); assets[key] = { path: r.path, url: URL.createObjectURL(f) }; $('.st', el).textContent = `${f.name} · ready to save`;
        if (key.startsWith('logo') || key === 'mark') { $('.pv', el).style.backgroundImage = `url('${assets[key].url}')`; if (key !== 'logo_light') logoColors(assets[key].url).then(h => offer(h, 'From your logo')); prev(); }
      } catch (e) { $('.st', el).textContent = e.message; } }; });
  prev();
  if (!DEMO) $('#saveb').onclick = async e => { const v = n => $(`[name=${n}]`).value.trim(); e.currentTarget.disabled = true;
    const colors = {}; COLOR_FIELDS.forEach(([k]) => colors[k] = col(k).toUpperCase());
    const body = { slug: isNew ? undefined : slug, name: v('name'), tagline: v('tagline'), website: v('website'), cta: v('cta'), person: { name: v('pname'), role: v('prole') }, colors,
      tone: v('tone'), rules: v('rules').split('\n').map(x => x.trim()).filter(Boolean), keywords: v('keywords').split(',').map(x => x.trim()).filter(Boolean), guidelines: v('guidelines'),
      voice: { engine: segVal(app, 'vengine'), builtin: v('builtin'), exaggeration: +v('exag') || 0.72, greeting: v('greeting'), signoff: v('signoff') },
      assets: Object.fromEntries(Object.entries(assets).map(([k, a]) => [k, a.path])) };
    try { await api('/api/brands', body); toast('Brand kit saved'); location.hash = '#/brands'; } catch (err) { toast(err.message, 1); e.currentTarget.disabled = false; } };
}
function logoColors(url) {
  return new Promise(res => { const im = new Image(); im.onload = () => { const c = document.createElement('canvas'); const s = 80; c.width = c.height = s; const x = c.getContext('2d'); x.drawImage(im, 0, 0, s, s);
    const d = x.getImageData(0, 0, s, s).data, bins = {};
    for (let i = 0; i < d.length; i += 4) { const [r, g, b, a] = [d[i], d[i + 1], d[i + 2], d[i + 3]]; if (a < 200) continue; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); if (mx - mn < 40 || mx < 60) continue;
      const k = [r, g, b].map(v => Math.round(v / 24) * 24).join(','); bins[k] = (bins[k] || 0) + 1; }
    res(Object.entries(bins).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k]) => '#' + k.split(',').map(v => Math.min(255, +v).toString(16).padStart(2, '0')).join('').toUpperCase())); };
    im.onerror = () => res([]); im.src = url; });
}

// ------------------------------------------------------------------------------------------------ settings
function settings() {
  const B = STATE.brain;
  app.innerHTML = `<div class="kicker">Settings</div><h1 style="margin-top:12px">Settings</h1>
  <div class="grid g2" style="margin-top:26px"><div class="card"><div class="spread"><h3>AI planner</h3><span class="pill"><i class="${B.on ? '' : 'off'}"></i>${B.on ? 'On' : 'Off'}</span></div>
    <p class="small muted" style="margin-top:8px">When on, Claude writes the hook, pop-up cards and full storyboards in each brand's tone and rules. When off, the built-in planner drafts them and you edit before rendering.</p>
    <div class="grid" style="margin-top:14px;gap:10px"><div class="small">SDK installed: <b>${B.sdk ? 'yes' : 'no'}</b>${B.sdk ? '' : ' <span class="muted">(run: Video-Edit-Kit/voice-env/bin/pip install anthropic)</span>'}</div><div class="small">API key: <b>${B.key ? 'saved' : 'not set'}</b></div>
    <label class="f">Anthropic API key <span class="hint">Stored only in Pipeline-Studio/settings.json on this Mac.</span><input type="password" name="key" placeholder="${B.key ? '••••••••' : 'sk-ant-...'}"></label>
    ${tog('brain', 'Use the AI planner', 'Turn off to always use the built-in planner', B.on || !B.key)}<button class="btn primary" id="sv" style="justify-self:start">Save</button></div></div>
  <div class="card"><h3>Where things live</h3><div class="grid small" style="margin-top:12px;gap:8px"><div><b>Brand kits</b> <span class="muted">Pipeline-Studio/brands/&lt;brand&gt;/brand.json + logos, fonts, voice sample</span></div>
    <div><b>Projects</b> <span class="muted">Pipeline-Studio/projects/&lt;id&gt;/output: video, phone copy, thumbnails, transcript, voiceover</span></div>
    <div><b>Engines</b> <span class="muted">Video-Edit-Kit (reel engine, face tracking, Whisper, Chatterbox voice)</span></div>
    <div><b>Voice cloning</b> <span class="muted">${STATE.clone ? 'Installed (runs locally, nothing uploaded)' : 'Not installed'}</span></div></div></div></div>`;
  $('#sv').onclick = async () => { const k = $('[name=key]').value.trim(); const body = { brain: $('[name=brain]').checked }; if (k) body.anthropic_api_key = k;
    try { await api('/api/settings', body); toast('Saved'); route(); } catch (e) { toast(e.message, 1); } };
}

route();
