'use strict';
(() => {
  const root = document.body.dataset.root || './';
  const $ = (s, parent = document) => parent.querySelector(s);
  const $$ = (s, parent = document) => [...parent.querySelectorAll(s)];
  const node = (tag, text, cls) => {const e = document.createElement(tag); if (text !== undefined) e.textContent = text; if (cls) e.className = cls; return e;};
  const status = $('#notice');
  let noticeTimer;
  const announce = message => { if (status) {clearTimeout(noticeTimer);status.textContent = message;noticeTimer=setTimeout(()=>{status.textContent='';},6500);} };
  async function getJSON(path) {
    const response = await fetch(root + path);
    if (!response.ok) throw new Error('内容暂时无法读取，请刷新重试。');
    return response.json();
  }
  // Compatibility with the original single-page share links.
  if (document.body.dataset.page === 'home') {
    const redirectLegacy = () => {
      if (!/^#AS-\d{3}$/.test(location.hash)) return;
      const id = location.hash.slice(1);
      const ids = JSON.parse($('#legacy-ids').textContent);
      if (ids.includes(id)) location.replace(root + 'cases/' + id + '/');
    };
    redirectLegacy();
    addEventListener('hashchange', redirectLegacy);
  }
  const dialog = $('#lightbox');
  if (dialog) {
    $$('[data-zoom]').forEach(button => button.addEventListener('click', () => {
      $('#zoom-image').src = button.dataset.zoom;
      $('#zoom-image').alt = button.dataset.caption;
      $('#zoom-caption').textContent = button.dataset.caption;
      dialog.showModal();
    }));
    $('#close-lightbox').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', e => {if (e.target === dialog) dialog.close();});
  }
  $$('[data-comparison]').forEach(el => {
    const range = $('input[type="range"]', el);
    const update = () => {el.style.setProperty('--split', range.value + '%'); range.setAttribute('aria-valuetext', '原图显示 ' + range.value + '%');};
    range.addEventListener('input', update); update();
  });
  async function copy(text, button) {
    try {await navigator.clipboard.writeText(text); announce('已复制，可粘贴到你的创作工具。');}
    catch (_) {
      const area = node('textarea'); area.value = text; document.body.append(area); area.select();
      const ok = document.execCommand('copy'); area.remove();
      announce(ok ? '已复制。' : '复制未成功，请选中下方文本手动复制。');
    }
    button.focus();
  }
  $$('[data-copy]').forEach(b => b.addEventListener('click', () => copy(document.getElementById(b.dataset.copy).textContent, b)));
  function card(entry) {
    const li = node('article', undefined, 'card');
    const a = node('a'); a.href = root + entry.url;
    const image = node('img'); image.src = root + entry.cover; image.alt = entry.name + '参考作品'; image.loading = 'lazy'; image.width = 640; image.height = 480;
    a.append(image);
    const body = node('div', undefined, 'card-body');
    body.append(node('span', entry.type === 'guide' ? '风格指南 · ' + entry.kind : '参考案例 · ' + entry.id, 'eyebrow'));
    body.append(node('h3', entry.name), node('p', entry.artist, 'artist'), node('p', entry.summary, 'card-summary'));
    a.append(body); li.append(a); return li;
  }
  async function catalog() {
    const [index, taxonomy, dictionary] = await Promise.all([getJSON('data/search.json'), getJSON('data/taxonomy.json'), getJSON('data/terms.json')]);
    const form = $('#catalog-form'), results = $('#results'), pager = $('#pagination');
    $('.filters').open = matchMedia('(min-width: 1100px)').matches;
    let state = Atlas.readState(location.search, taxonomy);
    function readForm() {
      const data = new FormData(form), s = {q:data.get('q') || '',page:1};
      Atlas.FACETS.forEach(k => s[k] = data.getAll(k)); return s;
    }
    function fillForm() {
      form.elements.q.value = state.q;
      Atlas.FACETS.forEach(k => $$('input[name="'+k+'"]', form).forEach(x => x.checked = state[k].includes(x.value)));
    }
    function render(push = false) {
      const matches = Atlas.search(index, state), page = Atlas.paginate(matches, state.page);
      state.page = page.page;
      const url = location.pathname + (Atlas.stateQuery(state) ? '?' + Atlas.stateQuery(state) : '');
      if (push && url !== location.pathname + location.search) history.pushState(null, '', url);
      else if (url !== location.pathname + location.search) history.replaceState(null, '', url);
      results.replaceChildren(...page.items.map(card));
      if (!matches.length) results.append(node('p', '暂时没有符合全部条件的内容。试试减少一个筛选条件，或从下方词典继续探索。', 'empty'));
      const active = Atlas.FACETS.reduce((n,k) => n + state[k].length, 0);
      $('#result-count').textContent = '找到 ' + matches.length + ' 条内容' + (active ? ' · 已选 ' + active + ' 项筛选' : '');
      $('#filter-summary').textContent = active ? '分类筛选 · 已选 ' + active + ' 项' : '分类筛选';
      pager.replaceChildren();
      if (page.pages > 1) {
        for (let p = 1; p <= page.pages; p++) {
          const b = node('button', String(p)); b.type = 'button'; b.setAttribute('aria-label','第 '+p+' 页');
          if (p === page.page) b.setAttribute('aria-current','page');
          b.addEventListener('click', () => {state.page=p;render(true);$('#result-count').scrollIntoView({block:'start'});});pager.append(b);
        }
      }
      const list = $('#term-results');list.replaceChildren();
      const ts = Atlas.tokens(state.q);
      const found = ts.length ? dictionary.terms.filter(t => ts.every(q => Atlas.normalize(t.name+' '+t.query+' '+t.meaning).includes(q))).slice(0,6) : [];
      $('#term-results-wrap').hidden = !found.length;
      found.forEach(t => {const a=node('a',t.name+' · '+t.query,'term-link');a.href=root+'learn/glossary/#'+t.id;list.append(a);});
    }
    let timer;
    form.addEventListener('submit', e => {e.preventDefault();clearTimeout(timer);state=readForm();render(true);});
    form.elements.q.addEventListener('input', () => {clearTimeout(timer);timer=setTimeout(()=>{state=readForm();render(true);},180);});
    form.addEventListener('change',e=>{if(e.target.type==='checkbox'){clearTimeout(timer);state=readForm();render(true);}});
    $('#reset-filters').addEventListener('click',()=>{clearTimeout(timer);form.reset();state=readForm();render(true);});
    addEventListener('popstate',()=>{clearTimeout(timer);state=Atlas.readState(location.search,taxonomy);fillForm();render();});
    fillForm();render();
  }
  async function composer() {
    const index = await getJSON('data/search.json');
    const select = $('#source-select'), features = $('#feature-options');
    let profile, lang='zh', request=0;
    const data = await getJSON('data/taxonomy.json');
    function state() {
      return {goal:$('#goal').value, selected:$$('input:checked',features).map(x=>x.value),preserve:$$('[name="preserve"]:checked').map(x=>x.value),customKeep:$('#custom-keep').value,customAvoid:$('#custom-avoid').value,baseAvoid:$('#base-avoid').checked};
    }
    function render() {
      if (!profile) return;
      $('#prompt-output').textContent = Atlas.compose(profile,state(),lang);
      $('#selected-count').textContent = Atlas.selectedFeatures(profile,state().selected).length+' 个已选特征';
    }
    function renderFeatures() {
      features.replaceChildren();
      data.dimensions.forEach(dim => {
        const fs=node('fieldset');fs.append(node('legend',dim.name));
        const options=profile.features.filter(f=>f.dimension===dim.id);
        options.forEach(f=>{
          const label=node('label',undefined,'feature-option');
          const input=node('input');input.type=f.group?'radio':'checkbox';input.name=f.group||f.id;input.value=f.id;input.checked=f.default;
          const body=node('span');body.append(node('strong',f.label),node('span',f.zh,'feature-description'),node('span',f.en,'feature-english'));
          label.append(input,body);fs.append(label);
        });
        const group=options.find(f=>f.group);
        if(group){const label=node('label',undefined,'feature-option compact');const input=node('input');input.type='radio';input.name=group.group;input.value='';label.append(input,node('span','本次不指定配色'));fs.append(label);}
        features.append(fs);
      });
      render();
    }
    async function loadSource(id,updateURL=true) {
      const token=++request;$('#composer-main').setAttribute('aria-busy','true');
      $('#copy-prompt').disabled=true;
      try {
        const next=await getJSON('data/profiles/'+encodeURIComponent(id)+'.json');
        if(token!==request)return;
        profile=next;
        const entry=index.find(e=>e.id===id);
        $('#source-link').href=root+entry.url;$('#source-link').textContent='回看 '+entry.name+' →';
        $('#source-image').src=root+entry.cover;$('#source-image').alt=entry.name+'参考作品';
        $('#source-note').textContent=entry.type==='guide'?'当前组合以该指南的示例为观察入口，可自行删减。':'当前组合来自这个具体案例，配色等特点不代表整个流派。';
        $('#avoid-description').textContent=profile.avoid.zh;
        renderFeatures();
        if(updateURL){const p=new URLSearchParams(location.search);p.set('source',id);history.replaceState(null,'',location.pathname+'?'+p);}
        $('#copy-prompt').disabled=false;
      } catch(e){if(token!==request)return;announce(e.message);$('#prompt-output').textContent='内容加载失败，请重新选择或刷新。';profile=null;}
      finally{if(token===request)$('#composer-main').removeAttribute('aria-busy');}
    }
    select.addEventListener('change',()=>loadSource(select.value));
    $('#composer-main').addEventListener('input',render);
    $('#composer-main').addEventListener('change',render);
    $('#reset-recommended').addEventListener('click',()=>{if(profile){renderFeatures();announce('已恢复推荐特征；你的改绘目标、保留要求与补充避免项已保留。');}});
    $$('[data-lang]').forEach(b=>b.addEventListener('click',()=>{lang=b.dataset.lang;$$('[data-lang]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$('#prompt-output').lang=lang==='zh'?'zh-CN':'en';render();}));
    $('#copy-prompt').addEventListener('click',e=>copy($('#prompt-output').textContent,e.currentTarget));
    const chosen=new URLSearchParams(location.search).get('source');
    if(index.some(e=>e.id===chosen))select.value=chosen;
    await loadSource(select.value);
  }
  function glossary() {
    const input=$('#glossary-search'), group=$('#glossary-group');
    function render(){let n=0;const ts=Atlas.tokens(input.value);$$('.term-row').forEach(row=>{const show=(!group.value||group.value===row.dataset.group)&&ts.every(t=>Atlas.normalize(row.textContent).includes(t));row.hidden=!show;if(show)n++;});$('#glossary-count').textContent=n+' 个探索词';}
    input.addEventListener('input',render);group.addEventListener('change',render);
  }
  if(document.body.dataset.page==='catalog')catalog().catch(e=>announce(e.message+' 下方仍可浏览完整目录。'));
  if(document.body.dataset.page==='compose')composer().catch(e=>announce(e.message));
  if(document.body.dataset.page==='glossary')glossary();
})();
