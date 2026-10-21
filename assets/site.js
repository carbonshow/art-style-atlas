'use strict';
(() => {
  if(window.atlasLocaleRedirecting)return;
  const runtime=AtlasLocale.runtime;
  async function prepare(doc,base,snapshot={},signal) {
    const locale=doc.body.dataset.locale;
    const root=new URL(locale==='zh'?'zh/':'',base);
    const getJSON=async path=>{const r=await fetch(new URL(path,root),{signal});if(!r.ok)throw new Error('content-load');return r.json();};
    const ui=JSON.parse(doc.getElementById('ui-config').textContent);
    const page=doc.body.dataset.page;
    const data={page,locale,base,root,ui,getJSON};
    if(page==='catalog') [data.index,data.taxonomy,data.dictionary]=await Promise.all([getJSON('data/search.json'),getJSON('data/taxonomy.json'),getJSON('data/terms.json')]);
    if(page==='glossary')data.dictionary=await getJSON('data/terms.json');
    if(page==='compose'){
      [data.index,data.taxonomy]=await Promise.all([getJSON('data/search.json'),getJSON('data/taxonomy.json')]);
      const chosen=snapshot.source||new URLSearchParams(location.search).get('source');
      data.source=data.index.some(e=>e.id===chosen)?chosen:data.index[0].id;
      data.profile=await getJSON('data/profiles/'+encodeURIComponent(data.source)+'.json');
    }
    return data;
  }
  function mount(data,saved={}) {
    const {root,base,locale,ui}=data;
    const abort=new AbortController(),signal=abort.signal;
    const on=(target,type,fn)=>target.addEventListener(type,fn,{signal});
    const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
    const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e;};
    const t=(key,values={})=>{let text=ui[key];if(text===undefined)throw new Error('Missing UI translation: '+key);Object.entries(values).forEach(([k,v])=>text=text.replaceAll('{'+k+'}',String(v)));return text;};
    let noticeTimer,timer,sourceRequest=0,profile=data.profile,source=data.source,visibleHref=location.href;
    let catalogState=null,promptExplicit=!!AtlasLocale.read(runtime.storage,AtlasLocale.PROMPT_KEY),promptLang=AtlasLocale.read(runtime.storage,AtlasLocale.PROMPT_KEY)||locale;
    if(saved.promptExplicit){promptExplicit=true;promptLang=saved.promptLang;}
    const announce=message=>{const n=$('#notice');if(n){clearTimeout(noticeTimer);n.textContent=message;noticeTimer=setTimeout(()=>{if(!signal.aborted)n.textContent='';},6500);}};
    const snapshot=()=>{
      const result={};
      if(data.page==='home')result.homeQuery=$('#home-search').value;
      if(data.page==='catalog')Object.assign(result,{catalog:{...catalogState,...catalogForm(),page:catalogState.q===$('#catalog-form').elements.q.value?catalogState.page:1},filtersOpen:$('.filters').open});
      if(data.page==='glossary')Object.assign(result,{glossaryQuery:$('#glossary-search').value,glossaryGroup:$('#glossary-group').value});
      if(data.page==='compose')Object.assign(result,{source:$('#source-select').value,composer:{...composerState(),selected:source===$('#source-select').value?composerState().selected:null},promptExplicit,promptLang});
      result.comparisons=$$('[data-comparison] input').map(x=>x.value);
      result.openDetails=$$('details').map((x,i)=>x.open?i:-1).filter(i=>i>=0);
      result.lightbox=$('#lightbox')?.open?{src:$('#zoom-image').src}:null;
      return result;
    };
    const dialog=$('#lightbox');
    if(dialog){
      $$('[data-zoom]').forEach(b=>on(b,'click',()=>{const img=$('#zoom-image');img.src=b.dataset.zoom;img.alt=b.dataset.caption;$('#zoom-caption').textContent=b.dataset.caption;dialog.showModal();}));
      on($('#close-lightbox'),'click',()=>dialog.close());on(dialog,'click',e=>{if(e.target===dialog)dialog.close();});
      if(saved.lightbox){const b=$$('[data-zoom]').find(b=>new URL(b.dataset.zoom,location.href).href===saved.lightbox.src);if(b)b.click();}
    }
    $$('[data-comparison]').forEach((el,i)=>{const range=$('input',el);if(saved.comparisons?.[i]!==undefined)range.value=saved.comparisons[i];const update=()=>{el.style.setProperty('--split',range.value+'%');range.setAttribute('aria-valuetext',t('原图显示 {value}%',{value:range.value}));};on(range,'input',update);update();});
    async function copy(text,button){
      let ok=false;
      try{await navigator.clipboard.writeText(text);ok=true;}catch(_){const area=node('textarea');area.value=text;document.body.append(area);area.select();try{ok=document.execCommand('copy');}finally{area.remove();}}
      if(signal.aborted)return;
      announce(t(ok?'已复制，可粘贴到你的创作工具。':'复制未成功，请选中下方文本手动复制。'));button.focus();
    }
    $$('[data-copy]').forEach(b=>on(b,'click',()=>copy(document.getElementById(b.dataset.copy).textContent,b)));
    function card(entry){
      const li=node('article',undefined,'card'),a=node('a');a.href=new URL(entry.url,root);
      const img=node('img');img.src=new URL(entry.cover,base);img.alt=t('{name}参考作品',{name:entry.name});img.loading='lazy';img.width=640;img.height=480;a.append(img);
      const body=node('div',undefined,'card-body');body.append(node('span',entry.type==='guide'?t('风格指南')+' · '+entry.kind:t('参考案例')+' · '+entry.id,'eyebrow'),node('h3',entry.name),node('p',entry.artist,'artist'),node('p',entry.summary,'card-summary'));a.append(body);li.append(a);return li;
    }
    function catalogForm(){const f=new FormData($('#catalog-form')),s={q:f.get('q')||''};Atlas.FACETS.forEach(k=>s[k]=f.getAll(k));return s;}
    function catalogFill(){const f=$('#catalog-form');f.elements.q.value=catalogState.q;Atlas.FACETS.forEach(k=>$$('input[name="'+k+'"]',f).forEach(x=>x.checked=catalogState[k].includes(x.value)));}
    function catalogRender(push=false){
      const state=catalogState,matches=Atlas.search(data.index,state),page=Atlas.paginate(matches,state.page);state.page=page.page;
      const url=location.pathname+(Atlas.stateQuery(state)?'?'+Atlas.stateQuery(state):'')+location.hash;
      if(push&&url!==location.pathname+location.search+location.hash)history.pushState(null,'',url);
      else if(url!==location.pathname+location.search+location.hash)history.replaceState(null,'',url);
      visibleHref=location.href;
      const results=$('#results');results.replaceChildren(...page.items.map(card));if(!matches.length)results.append(node('p',t('暂时没有符合全部条件的内容。试试减少一个筛选条件，或从下方词典继续探索。'),'empty'));
      const active=Atlas.FACETS.reduce((n,k)=>n+state[k].length,0);
      $('#result-count').textContent=t('找到 {count} 条内容',{count:matches.length})+(active?t(' · 已选 {count} 项筛选',{count:active}):'');
      $('#filter-summary').textContent=active?t('分类筛选 · 已选 {count} 项',{count:active}):t('分类筛选');
      const pager=$('#pagination');pager.replaceChildren();if(page.pages>1){for(let p=1;p<=page.pages;p++){const b=node('button',String(p));b.type='button';b.setAttribute('aria-label',t('第 {page} 页',{page:p}));if(p===page.page)b.setAttribute('aria-current','page');on(b,'click',()=>{state.page=p;catalogRender(true);$('#result-count').scrollIntoView({block:'start'});});pager.append(b);}}
      const ts=Atlas.tokens(state.q),found=ts.length?data.dictionary.terms.filter(t=>ts.every(q=>Atlas.normalize(t.search_text).includes(q))).slice(0,6):[];
      $('#term-results-wrap').hidden=!found.length;$('#term-results').replaceChildren(...found.map(term=>{const a=node('a',term.name+' · '+term.query,'term-link');a.href=new URL('learn/glossary/#'+term.id,root);return a;}));
    }
    if(data.page==='home'&&saved.homeQuery!==undefined)$('#home-search').value=saved.homeQuery;
    if(data.page==='catalog'){
      catalogState=saved.catalog||Atlas.readState(location.search,data.taxonomy);$('.filters').open=saved.filtersOpen??matchMedia('(min-width: 1100px)').matches;
      const form=$('#catalog-form');const change=()=>{clearTimeout(timer);catalogState={...catalogForm(),page:1};catalogRender(true);};
      on(form,'submit',e=>{e.preventDefault();change();});on(form.elements.q,'input',()=>{clearTimeout(timer);timer=setTimeout(change,180);});on(form,'change',e=>{if(e.target.type==='checkbox')change();});on($('#reset-filters'),'click',()=>{form.reset();change();});catalogFill();catalogRender();
    }
    function composerState(){return {goal:$('#goal').value,selected:$$('input:checked',$('#feature-options')).map(x=>x.value),preserve:$$('[name="preserve"]:checked').map(x=>x.value),customKeep:$('#custom-keep').value,customAvoid:$('#custom-avoid').value,baseAvoid:$('#base-avoid').checked};}
    function composerRender(){if(!profile)return;const state=composerState();$('#prompt-output').textContent=Atlas.compose(profile,state,promptLang);$('#prompt-output').lang=promptLang==='zh'?'zh-CN':'en';$('#selected-count').textContent=t('{count} 个已选特征',{count:Atlas.selectedFeatures(profile,state.selected).length});$$('[data-lang]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lang===promptLang)));}
    function renderFeatures(selected){
      const features=$('#feature-options');features.replaceChildren();
      data.taxonomy.dimensions.forEach(dim=>{const fs=node('fieldset');fs.append(node('legend',dim.name));const options=profile.features.filter(f=>f.dimension===dim.id);options.forEach(f=>{const label=node('label',undefined,'feature-option'),input=node('input');input.type=f.group?'radio':'checkbox';input.name=f.group||f.id;input.value=f.id;input.checked=selected?selected.includes(f.id):f.default;const body=node('span');body.append(node('strong',f.label),node('span',f[locale],'feature-description'));label.append(input,body);fs.append(label);});const group=options.find(f=>f.group);if(group){const label=node('label',undefined,'feature-option compact'),input=node('input');input.type='radio';input.name=group.group;input.value='';input.checked=!!selected&&!options.some(f=>selected.includes(f.id));label.append(input,node('span',t('本次不指定配色')));fs.append(label);}features.append(fs);});
    }
    function showSource(selected){
      const entry=data.index.find(e=>e.id===source);$('#source-select').value=source;$('#source-link').href=new URL(entry.url,root);$('#source-link').textContent=t('回看 {name} →',{name:entry.name});$('#source-image').src=new URL(entry.cover,base);$('#source-image').alt=t('{name}参考作品',{name:entry.name});$('#source-note').textContent=t(entry.type==='guide'?'当前组合以该指南的示例为观察入口，可自行删减。':'当前组合来自这个具体案例，配色等特点不代表整个流派。');$('#avoid-description').textContent=profile.avoid[locale];renderFeatures(selected);composerRender();$('#copy-prompt').disabled=false;
    }
    async function loadSource(id){
      const request=++sourceRequest;$('#composer-main').setAttribute('aria-busy','true');$('#copy-prompt').disabled=true;
      try{const response=await fetch(new URL('data/profiles/'+encodeURIComponent(id)+'.json',root),{signal});if(!response.ok)throw new Error('profile');const next=await response.json();if(signal.aborted||request!==sourceRequest)return;profile=next;source=id;showSource();const params=new URLSearchParams(location.search);params.set('source',id);history.replaceState(null,'',location.pathname+'?'+params+location.hash);visibleHref=location.href;}
      catch(e){if(signal.aborted||request!==sourceRequest)return;$('#source-select').value=source;$('#copy-prompt').disabled=!profile;announce(t('内容加载失败，请重新选择或刷新。'));}
      finally{if(!signal.aborted&&request===sourceRequest)$('#composer-main').removeAttribute('aria-busy');}
    }
    if(data.page==='compose'){
      if(saved.composer){for(const [id,key]of [['goal','goal'],['custom-keep','customKeep'],['custom-avoid','customAvoid']])$('#'+id).value=saved.composer[key];$$('[name="preserve"]').forEach(x=>x.checked=saved.composer.preserve.includes(x.value));$('#base-avoid').checked=saved.composer.baseAvoid;}
      showSource(saved.composer?.selected);
      if(saved.source&&new URLSearchParams(location.search).get('source')!==source){
        const params=new URLSearchParams(location.search);params.set('source',source);
        history.replaceState(null,'',location.pathname+'?'+params+location.hash);visibleHref=location.href;
      }
      on($('#source-select'),'change',()=>loadSource($('#source-select').value));on($('#composer-main'),'input',composerRender);on($('#composer-main'),'change',composerRender);on($('#reset-recommended'),'click',()=>{renderFeatures();composerRender();announce(t('已恢复推荐特征；你的改绘目标、保留要求与补充避免项已保留。'));});
      $$('[data-lang]').forEach(b=>on(b,'click',()=>{promptExplicit=true;promptLang=b.dataset.lang;AtlasLocale.write(runtime.storage,AtlasLocale.PROMPT_KEY,promptLang);composerRender();}));on($('#copy-prompt'),'click',e=>copy($('#prompt-output').textContent,e.currentTarget));
    }
    function glossaryRender(){const q=$('#glossary-search').value,group=$('#glossary-group').value,ts=Atlas.tokens(q);const ids=new Set(data.dictionary.terms.filter(term=>(!group||group===term.group)&&ts.every(t=>Atlas.normalize(term.search_text).includes(t))).map(x=>x.id));$$('.term-row').forEach(row=>row.hidden=!ids.has(row.id));$('#glossary-count').textContent=t('{count} 个探索词',{count:ids.size});}
    if(data.page==='glossary'){if(saved.glossaryQuery!==undefined)$('#glossary-search').value=saved.glossaryQuery;if(saved.glossaryGroup!==undefined)$('#glossary-group').value=saved.glossaryGroup;on($('#glossary-search'),'input',glossaryRender);on($('#glossary-group'),'change',glossaryRender);glossaryRender();}
    if(saved.openDetails)$$('details').forEach((x,i)=>x.open=saved.openDetails.includes(i));
    const controller={get href(){return visibleHref;},snapshot,destroy:()=>{abort.abort();clearTimeout(timer);clearTimeout(noticeTimer);},popstate:()=>{visibleHref=location.href;if(data.page==='catalog'){clearTimeout(timer);catalogState=Atlas.readState(location.search,data.taxonomy);catalogFill();catalogRender();}if(data.page==='compose'){const id=new URLSearchParams(location.search).get('source');if(data.index.some(e=>e.id===id)&&id!==source)loadSource(id);}}};
    return controller;
  }
  window.AtlasPage={prepare,mount};
  window.AtlasPage.ready=prepare(document,runtime.base).then(data=>runtime.setController(mount(data))).catch(()=>{const n=document.getElementById('notice');if(n)n.textContent=JSON.parse(document.getElementById('ui-config').textContent)['交互内容加载失败，请刷新；静态内容仍可阅读。'];});
})();
