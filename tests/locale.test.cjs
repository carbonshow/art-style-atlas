const assert=require('node:assert/strict');
const test=require('node:test');
const L=require('../assets/locale.js');
const A=require('../assets/core.js');
const en=require('../data/search.json'),zh=require('../zh/data/search.json');
const base=new URL('https://example.com/art-style-atlas/');
const home={locale:'en',route:'',cases:['AS-001','AS-007'],asset_root:'./'};

test('English first visit; only neutral home consults a manually saved preference',()=>{
  assert.equal(L.initial(home,base,base,null),null);
  assert.equal(L.initial(home,base,base,'invalid'),null);
  assert.equal(L.initial(home,base,base,'zh'),base+'zh/');
  assert.equal(L.initial(home,base+'?lang=en',base,'zh'),null);
  assert.equal(L.initial(home,base+'?lang=zh',base,'en'),base+'zh/');
  for(const locale of ['en','zh'])assert.equal(L.initial({...home,locale,route:'compose/'},base+(locale==='zh'?'zh/':'')+'compose/',base,locale==='en'?'zh':'en'),null);
});
test('switch links preserve query, filters, pagination, source and fragment at any mount path',()=>{
  const search='?q=%E9%87%91%E7%BA%BF&effect=flat&effect=grain&page=3&source=AS-007&lang=en';
  const url=L.destination(base,'catalog/','zh',search,'#results');
  assert.equal(url.pathname,'/art-style-atlas/zh/catalog/');
  assert.equal(url.searchParams.get('q'),'金线');
  assert.deepEqual(url.searchParams.getAll('effect'),['flat','grain']);
  assert.equal(url.searchParams.get('page'),'3');
  assert.equal(url.searchParams.get('source'),'AS-007');
  assert.equal(url.searchParams.has('lang'),false);
  assert.equal(url.hash,'#results');
  assert.equal(L.destination(base,'','en').href,base+'?lang=en');
});
test('legacy anchors go directly to the final localized case; unknown anchors remain',()=>{
  assert.equal(L.initial(home,base+'#AS-001',base,'zh'),base+'zh/cases/AS-001/');
  assert.equal(L.initial(home,base+'?lang=en#AS-001',base,'zh'),base+'cases/AS-001/');
  assert.equal(L.initial(home,base+'#AS-999',base,null),null);
  assert.equal(L.initial({...home,route:'404.html'},base+'zh/missing/',base,null),base+'zh/404.html');
});
test('unavailable or corrupt storage is harmless; page and output choices are independent',()=>{
  const broken={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}};
  assert.equal(L.read(broken,L.LANGUAGE_KEY),null);
  assert.doesNotThrow(()=>L.write(broken,L.PROMPT_KEY,'en'));
  const store=new Map(),storage={getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)};
  L.write(storage,L.LANGUAGE_KEY,'zh');L.write(storage,L.PROMPT_KEY,'en');
  assert.equal(L.read(storage,L.LANGUAGE_KEY),'zh');assert.equal(L.read(storage,L.PROMPT_KEY),'en');
  storage.setItem(L.LANGUAGE_KEY,'unrecognized');assert.equal(L.read(storage,L.LANGUAGE_KEY),null);
});
test('bilingual search returns identical IDs and ranking for names, aliases and combined features',()=>{
  const queries=['金线','Mucha','日本画','Art Nouveau','AS-007','blue green','古诗','print-like','新中式','Gouache','landscape','姿态'];
  en.forEach(e=>queries.push(...e.search_names,...e.aliases));
  for(const q of queries){
    for(const state of [{q},{q,type:['case']},{q,effect:['flat']}])assert.deepEqual(A.search(en,state).map(x=>x.id),A.search(zh,state).map(x=>x.id),q);
  }
});

function fixture({prepareFails=false,pending=false}={}){
  const config={...home,route:'compose/',asset_root:'../'},store=new Map(),notice={textContent:''},links=[{setAttribute(){},removeAttribute(){}}];
  const location=new URL(base+'compose/?source=AS-007#prompt-output');
  let destroyed=0,historyWrites=0,resolveFetch;
  const doc={baseURI:location.href,getElementById:id=>id==='locale-config'?{textContent:JSON.stringify(config)}:id==='ui-config'?{textContent:JSON.stringify({'语言切换失败，当前页面与输入已保留，请重试。':'Failed; input retained.'})}:notice,
    querySelectorAll:()=>links,addEventListener(){}};
  const alternate={getElementById:()=>({textContent:JSON.stringify({...config,locale:'zh'})})};
  const win={location,AtlasLocale:{},localStorage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},addEventListener(){},
    history:{replaceState(_a,_b,url){historyWrites++;location.href=url;},pushState(){historyWrites++;}},
    DOMParser:class{parseFromString(){return alternate;}},
    fetch:()=>pending?new Promise(resolve=>{resolveFetch=resolve;}):Promise.resolve({ok:prepareFails,text:async()=>''}),
    AtlasPage:{ready:Promise.resolve(),prepare:async()=>{throw Error('missing localized profile');},mount(){throw Error('must not mount');}}};
  L.start(win,doc);
  const state={goal:'保留原文 / original text',source:'AS-007',selected:['shape'],baseAvoid:false};
  win.AtlasLocale.runtime.setController({href:location.href,snapshot:()=>({...state}),destroy:()=>destroyed++});
  return {win,doc,state,store,notice,resolve:()=>resolveFetch({ok:false}),counts:()=>({destroyed,historyWrites})};
}
test('failed alternate HTML or profile load leaves document, draft and preference untouched',async()=>{
  for(const prepareFails of [false,true]){
    const f=fixture({prepareFails}),before={...f.state};
    await f.win.AtlasLocale.runtime.change('zh');
    assert.deepEqual(f.state,before);assert.equal(f.store.size,0);
    assert.deepEqual(f.counts(),{destroyed:0,historyWrites:0});assert.match(f.notice.textContent,/input retained/);
  }
});
test('failed history language transition restores the last visible URL',async()=>{
  const f=fixture();const original=f.win.location.href;
  f.win.location.href=base+'zh/compose/?source=AS-007#prompt-output';
  await f.win.AtlasLocale.runtime.change('zh',{pop:true,href:f.win.location.href});
  assert.equal(f.win.location.href,original);assert.equal(f.counts().destroyed,0);
});
test('selecting the current language cancels an unfinished alternate switch',async()=>{
  const f=fixture({pending:true});const transition=f.win.AtlasLocale.runtime.change('zh');
  await Promise.resolve();
  await f.win.AtlasLocale.runtime.change('en');f.resolve();await transition;
  assert.equal(f.store.get(L.LANGUAGE_KEY),'en');assert.equal(f.notice.textContent,'');assert.equal(f.counts().destroyed,0);
});
