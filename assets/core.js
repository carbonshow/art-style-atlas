/* Shared browser / Node functions. No model calls or image uploads. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Atlas = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const FACETS = ['tradition', 'subject', 'effect', 'type'];
  const PAGE_SIZE = 24;
  const normalize = value => String(value || '').normalize('NFKC').toLowerCase().trim().replace(/\s+/g, ' ');
  const tokens = query => normalize(query).split(/[\s+＋,，]+/).filter(Boolean);
  function score(entry, query) {
    const q = normalize(query);
    if (!q) return 1;
    const names = [entry.name, entry.english_name, entry.id].map(normalize);
    const aliases = (entry.aliases || []).map(normalize);
    const text = normalize([entry.search_text, ...names, ...aliases, entry.artist].join(' '));
    if (!tokens(q).every(t => text.includes(t))) return 0;
    if (names.includes(q)) return 1000;
    if (aliases.includes(q)) return 900;
    if (normalize(entry.artist) === q) return 800;
    if (names.some(n => n.includes(q))) return 700;
    if (aliases.some(n => n.includes(q))) return 600;
    if (normalize(entry.artist).includes(q)) return 500;
    return 100;
  }
  function search(entries, state) {
    return entries.map((e, index) => ({e, index, rank: score(e, state.q)}))
      .filter(({e, rank}) => rank && FACETS.every(key => {
        const selected = state[key] || [];
        const values = key === 'type' ? [e.type] : (e.facets[key] || []);
        return !selected.length || selected.some(value => values.includes(value));
      }))
      .sort((a, b) => b.rank - a.rank || a.index - b.index).map(x => x.e);
  }
  function readState(searchString, taxonomy) {
    const params = new URLSearchParams(searchString);
    const state = {q: params.get('q') || '', page: Math.max(1, parseInt(params.get('page'), 10) || 1)};
    FACETS.forEach(key => {
      const allowed = taxonomy.facets[key].values.map(x => x.id);
      state[key] = [...new Set(params.getAll(key))].filter(x => allowed.includes(x));
    });
    return state;
  }
  function stateQuery(state) {
    const p = new URLSearchParams();
    if (state.q.trim()) p.set('q', state.q.trim());
    FACETS.forEach(k => (state[k] || []).forEach(v => p.append(k, v)));
    if (state.page > 1) p.set('page', String(state.page));
    return p.toString();
  }
  function paginate(entries, page) {
    const pages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE));
    page = Math.min(Math.max(1, Number(page) || 1), pages);
    return {page, pages, items: entries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)};
  }
  function selectedFeatures(profile, ids) {
    const selected = new Set(ids), groups = new Set();
    const order = [...new Set(profile.features.map(f => f.dimension))];
    return profile.features.filter(f => {
      if (!selected.has(f.id)) return false;
      if (f.group && groups.has(f.group)) return false;
      if (f.group) groups.add(f.group);
      return true;
    }).sort((a,b) => order.indexOf(a.dimension)-order.indexOf(b.dimension));
  }
  const PRESERVE = [
    {id:'identity', zh:'保留原图主体身份与数量', en:'Preserve the identity and count of the original subjects'},
    {id:'relationships', zh:'保留动作及物件关系', en:'Preserve poses and relationships between objects'},
    {id:'viewpoint', zh:'保留构图与视角', en:'Preserve the original composition and viewpoint'},
    {id:'aspect', zh:'保留原画幅比例', en:'Preserve the original aspect ratio'}
  ];
  function compose(profile, state, lang) {
    lang = lang === 'en' ? 'en' : 'zh';
    const headings = lang === 'en' ? ['Goal','Visual features','Preserve','Avoid'] : ['改绘目标','视觉特征','保留要求','避免项'];
    const goal = state.goal.trim() || (lang === 'en' ? 'Repaint the original image using the selected visual features.' : '按所选视觉特征改绘原图。');
    const features = selectedFeatures(profile, state.selected).map(f => f[lang]);
    const keep = PRESERVE.filter(p => state.preserve.includes(p.id)).map(p => p[lang]);
    if (state.customKeep.trim()) keep.push(state.customKeep);
    const avoid = [];
    if (state.baseAvoid) avoid.push(profile.avoid[lang]);
    if (state.customAvoid.trim()) avoid.push(state.customAvoid);
    const separator = lang === 'en' ? ':\n' : '：\n';
    const sections = [headings[0] + separator + goal];
    [features, keep, avoid].forEach((items, index) => {
      if (items.length) sections.push(headings[index + 1] + separator + items.map(s => '• ' + s).join('\n'));
    });
    return sections.join('\n\n');
  }
  return {FACETS, PAGE_SIZE, normalize, tokens, score, search, readState, stateQuery, paginate, selectedFeatures, compose, PRESERVE};
});
