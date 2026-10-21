/* Language routing and in-document navigation. Text drafts never leave memory. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else {root.AtlasLocale=api;api.start(root,document);}
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const LANGUAGE_KEY='atlas.language.v1', PROMPT_KEY='atlas.prompt-language.v1';
  const valid = value => value === 'en' || value === 'zh';
  function read(storage,key) {try {const value=storage.getItem(key);return valid(value)?value:null;}catch(_){return null;}}
  function write(storage,key,value) {try {storage.setItem(key,value);}catch(_){/* Optional preference only. */}}
  function destination(base,route,locale,search='',hash='') {
    const url=new URL((locale==='zh'?'zh/':'')+route,base);
    url.search=search;url.hash=hash;
    url.searchParams.delete('lang');
    if(locale==='en'&&!route)url.searchParams.set('lang','en');
    return url;
  }
  function initial(config,href,base,preference) {
    const here=new URL(href),explicit=here.searchParams.get('lang');
    let locale=config.locale;
    if(config.route===''&&config.locale==='en')locale=valid(explicit)?explicit:(valid(preference)?preference:'en');
    const legacy=/^#AS-\d{3}$/.test(here.hash)&&config.cases.includes(here.hash.slice(1));
    if(legacy&&config.route==='')return destination(base,'cases/'+here.hash.slice(1)+'/',locale,here.search,'').href;
    if(config.route==='404.html'&&here.pathname.startsWith(new URL('zh/',base).pathname)&&locale!=='zh')return destination(base,'404.html','zh',here.search,'').href;
    if(locale!==config.locale)return destination(base,config.route,locale,here.search,here.hash).href;
    return null;
  }
  function start(win,doc) {
    let config=JSON.parse(doc.getElementById('locale-config').textContent);
    const base=new URL(config.asset_root,doc.baseURI);
    // Storage access itself can throw; do not access it outside the guarded adapter.
    const storage={getItem:key=>win.localStorage.getItem(key),setItem:(key,val)=>win.localStorage.setItem(key,val)};
    const redirect=initial(config,win.location.href,base,read(storage,LANGUAGE_KEY));
    if(redirect){win.atlasLocaleRedirecting=true;win.location.replace(redirect);return;}
    let controller=null,sequence=0,fetcher=null;
    const cache=new Map();
    async function load(url) {
      const key=url.pathname;
      if(cache.has(key))return cache.get(key);
      const response=await win.fetch(url.pathname+url.search,{signal:fetcher.signal});
      if(!response.ok)throw new Error('language-load');
      const next=new win.DOMParser().parseFromString(await response.text(),'text/html');
      const node=next.getElementById('locale-config');
      if(!node)throw new Error('language-config');
      const conf=JSON.parse(node.textContent);
      if(conf.route!==config.route||!valid(conf.locale))throw new Error('language-route');
      const data={doc:next,config:conf,url};cache.set(key,data);return data;
    }
    function notice(text) {const n=doc.getElementById('notice');if(n)n.textContent=text;}
    async function change(locale,{pop=false,href=null}={}) {
      if(!valid(locale))return;
      if(locale===config.locale){++sequence;if(fetcher)fetcher.abort();doc.querySelectorAll('[data-site-lang]').forEach(a=>a.removeAttribute('aria-busy'));if(!pop)write(storage,LANGUAGE_KEY,locale);return;}
      const ticket=++sequence;
      if(fetcher)fetcher.abort();fetcher=new AbortController();
      const oldHref=controller?controller.href:win.location.href;
      const target=href?new URL(href):destination(base,config.route,locale,win.location.search,win.location.hash);
      const links=[...doc.querySelectorAll('[data-site-lang]')];links.forEach(a=>a.setAttribute('aria-busy','true'));
      try {
        await win.AtlasPage.ready;
        if(ticket!==sequence)return;
        const next=await load(target);
        let snapshot=controller?controller.snapshot():{};
        let prepared=await win.AtlasPage.prepare(next.doc,base,snapshot,fetcher.signal);
        // Capture edits made while the alternate page was loading.
        let latest=controller?controller.snapshot():{};
        while(latest.source!==snapshot.source){snapshot=latest;prepared=await win.AtlasPage.prepare(next.doc,base,snapshot,fetcher.signal);latest=controller?controller.snapshot():{};}
        snapshot=latest;
        if(ticket!==sequence)return;
        const focused=doc.activeElement&&doc.activeElement.id;
        const focusedLanguage=doc.activeElement&&doc.activeElement.dataset.siteLang;
        const scroll=win.scrollY;
        if(controller)controller.destroy();
        // Keep the initial analytics instance. No scripts from the parsed page execute.
        for(const selector of ['.skip-link','.site-header','#main','.site-footer','#lightbox']){
          const old=doc.querySelector(selector),replacement=next.doc.querySelector(selector);
          if(old&&replacement)old.replaceWith(doc.importNode(replacement,true));
        }
        for(const key of ['root','assets','page','locale','route'])doc.body.dataset[key]=next.doc.body.dataset[key];
        doc.documentElement.lang=next.doc.documentElement.lang;doc.title=next.doc.title;
        for(const selector of ['meta[name="description"]','meta[property="og:title"]','meta[property="og:description"]','meta[property="og:image"]','link[rel="canonical"]','link[hreflang="en"]','link[hreflang="zh-CN"]','link[hreflang="x-default"]']){
          const old=doc.querySelector(selector),replacement=next.doc.querySelector(selector);if(old&&replacement)old.replaceWith(doc.importNode(replacement,true));
        }
        for(const id of ['locale-config','ui-config','analytics-config'])doc.getElementById(id).textContent=next.doc.getElementById(id).textContent;
        config=next.config;
        if(!pop)win.history.pushState({atlasLocale:locale},'',target.href);
        controller=win.AtlasPage.mount(prepared,snapshot);
        if(!pop)write(storage,LANGUAGE_KEY,locale);
        const focus=focused?doc.getElementById(focused):focusedLanguage?doc.querySelector('[data-site-lang="'+focusedLanguage+'"]'):null;if(focus)focus.focus({preventScroll:true});
        win.requestAnimationFrame(()=>win.scrollTo({top:scroll,behavior:'instant'}));
        notice('');
      } catch(error) {
        if(error.name==='AbortError'||ticket!==sequence)return;
        if(pop)win.history.replaceState(null,'',controller?controller.href:oldHref);
        notice(JSON.parse(doc.getElementById('ui-config').textContent)['语言切换失败，当前页面与输入已保留，请重试。']);
      } finally {if(ticket===sequence)doc.querySelectorAll('[data-site-lang]').forEach(a=>a.removeAttribute('aria-busy'));}
    }
    doc.addEventListener('click',event=>{
      const a=event.target.closest('[data-site-lang]');
      if(!a||event.button!==0||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
      event.preventDefault();change(a.dataset.siteLang);
    });
    win.addEventListener('popstate',()=>{
      const relative=win.location.pathname.slice(base.pathname.length);
      const locale=relative.startsWith('zh/')?'zh':'en';
      if(locale!==config.locale)change(locale,{pop:true,href:win.location.href});
      else if(controller)controller.popstate();
    });
    win.addEventListener('hashchange',()=>{
      const id=win.location.hash.slice(1);
      if(config.route===''&&config.cases.includes(id))
        win.location.replace(destination(base,'cases/'+id+'/',config.locale,win.location.search,'').href);
    });
    win.AtlasLocale.runtime={base,storage,get config(){return config;},setController:c=>{controller=c;},change};
  }
  return {LANGUAGE_KEY,PROMPT_KEY,valid,read,write,destination,initial,start};
});
