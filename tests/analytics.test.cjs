const assert = require('node:assert/strict');
const test = require('node:test');
const A = require('../assets/analytics.js');
const site = 'https://carbonshow.github.io/art-style-atlas/';
const config = {enabled:true, measurement_id:'G-A1B2C3D4E5', site_url:site,
  page_location:site+'catalog/', page_title:'风格库 · 美术风格图鉴',
  public_paths:['', 'catalog/', 'compose/', 'about/', 'cases/AS-001/', '404.html']};
const epoch = Date.UTC(2026, 9, 20);
const legacyChoiceKey = 'atlas.analytics.consent.v1';
const choice = value => JSON.stringify({version:1, choice:value, expires:epoch+180*24*60*60*1000});

function fixture({href=site+'catalog/', referrer='', saved, disabled=false, brokenStorage=false, localeRedirect=false,
  options={}, legacy=null}={}) {
  class Target {
    constructor() { this.listeners={}; }
    addEventListener(name, fn) { (this.listeners[name] ||= []).push(fn); }
    emit(name, event={}) { for (const fn of this.listeners[name] || []) fn(event); }
  }
  const elements={};
  if (legacy) elements['legacy-ids']={textContent:JSON.stringify(legacy)};
  const scripts=[], deletedCookies=[], store=new Map();
  if (saved) store.set(legacyChoiceKey,saved);
  if (disabled) store.set(A.DISABLED_KEY,'1');
  const win=new Target(), doc=new Target();
  win.location={href};
  win.atlasLocaleRedirecting=localeRedirect;
  win.Date=class extends Date { constructor() {super(epoch);} };
  win.localStorage={
    getItem(key) { if (brokenStorage) throw Error('blocked'); return store.get(key) ?? null; },
    setItem(key,value) { if (brokenStorage) throw Error('blocked'); store.set(key,value); }
  };
  doc.referrer=referrer;
  // No consent UI or free-input elements exist in the fixture.
  doc.getElementById=id=>{ assert.ok(['legacy-ids','analytics-config'].includes(id)); return elements[id] || null; };
  doc.createElement=()=>({});
  doc.head={appendChild(script) {scripts.push(script);}};
  Object.defineProperty(doc,'cookie',{set:value=>deletedCookies.push(value)});
  A.create(win,doc,{...config,...options}).start();
  const commands=()=>Array.from(win.atlasDataLayer || [], args=>Array.from(args));
  return {win,doc,elements,scripts,store,deletedCookies,commands,
    pvs:()=>commands().filter(x=>x[0]==='event' && x[1]==='page_view'),
    storage(value,key=A.DISABLED_KEY) {
      if (value === null) store.delete(key); else store.set(key,value);
      win.emit('storage',{key,newValue:value});
    }
  };
}

test('production starts automatically regardless of old consent choices',()=>{
  for (const saved of [undefined, choice('denied'), choice('granted'), 'malformed']) {
    const f=fixture({saved});
    assert.equal(f.scripts.length,1);
    f.scripts[0].onload();
    assert.equal(f.pvs().length,1);
    assert.equal(f.store.get(legacyChoiceKey),saved);
  }
});

test('non-production, disabled configuration and maintainer opt-out never load Google',()=>{
  for (const params of [{disabled:true},
    {href:'http://127.0.0.1:8000/catalog/'}, {href:'http://carbonshow.github.io/art-style-atlas/catalog/'},
    {href:'https://example.com/art-style-atlas/catalog/'},
    {href:'https://carbonshow.github.io/another-project/'},
    {options:{enabled:false}}, {options:{measurement_id:''}}]) {
    const f=fixture(params);
    assert.equal(f.scripts.length,0);
    assert.deepEqual(f.commands(),[]);
  }
});

test('load once, disable advertising and send exactly one explicit page view',()=>{
  const f=fixture();
  f.win.emit('focus'); f.doc.emit('visibilitychange');
  assert.equal(f.scripts.length,1);
  assert.match(f.scripts[0].src,/^https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-A1B2C3D4E5&l=atlasDataLayer$/);
  assert.equal(f.pvs().length,0);
  assert.deepEqual(f.commands()[0],['consent','default',{analytics_storage:'granted',
    ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'}]);
  f.scripts[0].onload();
  f.win.emit('pageshow',{persisted:false}); f.win.emit('focus');
  assert.equal(f.pvs().length,1);
  const setup=f.commands().find(x=>x[0]==='config')[2];
  assert.equal(setup.send_page_view,false);
  assert.equal(setup.cookie_domain,'none');
  assert.equal(setup.cookie_prefix,'atlas');
  assert.equal(setup.cookie_path,'/art-style-atlas/');
  assert.equal(setup.allow_google_signals,false);
  assert.equal(setup.allow_ad_personalization_signals,false);
  for (const cmd of f.commands().filter(x=>x[0]==='consent')) {
    for (const key of ['ad_storage','ad_user_data','ad_personalization']) assert.equal(cmd[2][key],'denied');
  }
});

test('capture sanitized landing URL before catalog rewrites it; drop unknown/private values',()=>{
  const f=fixture({href:site+'catalog/?q=secret&source=AS-001&page=2&unknown=private&utm_source=x&utm_medium=social&utm_campaign=atlas_intro#private',
    referrer:'https://external.example/path?secret=hidden#fragment'});
  f.win.location.href=site+'catalog/?q=another-secret';
  f.scripts[0].onload();
  const setup=f.commands().find(x=>x[0]==='config')[2];
  assert.equal(setup.page_location,site+'catalog/?utm_source=x&utm_medium=social&utm_campaign=atlas_intro');
  assert.equal(setup.page_referrer,'https://external.example');
  assert.equal(f.pvs()[0][2].page_location,setup.page_location);
  assert.ok(!JSON.stringify(f.commands()).match(/secret|private|fragment|AS-001|unknown/));
  for (const query of ['utm_source=UPPER','utm_source=a%40b.com','utm_source='+ 'a'.repeat(65),
    'utm_source=x&utm_source=y','utm_source=','utm_source=%E4%B8%AD%E6%96%87']) {
    assert.equal(A.cleanLocation(site+'?'+query,site),site);
  }
  assert.equal(A.cleanLocation(site+'?utm_source=valid_1-2&utm_content=ignored',site),site+'?utm_source=valid_1-2');
});

test('referrers retain only known internal public paths or an external origin',()=>{
  const base=new URL(site);
  assert.equal(A.cleanReferrer(site+'compose/index.html?source=private#text',base,config.public_paths),site+'compose/');
  assert.equal(A.cleanReferrer(site+'catalog?q=private',base,config.public_paths),site+'catalog/');
  assert.equal(A.cleanReferrer(site+'unknown/private-name',base,config.public_paths),base.origin);
  assert.equal(A.cleanReferrer('https://other.example/private?q=hidden',base,[]),'https://other.example');
  for (const invalid of ['', 'not a URL', 'file:///tmp/test', 'about:blank']) {
    assert.equal(A.cleanReferrer(invalid,base,config.public_paths),'');
  }
});

test('history changes do not create PVs; BFCache restores recheck maintainer opt-out',()=>{
  const f=fixture();
  f.scripts[0].onload();
  f.win.location.href=site+'catalog/?q=typed-text&page=2';
  f.win.emit('popstate'); f.win.emit('hashchange'); f.doc.emit('visibilitychange');
  assert.equal(f.pvs().length,1);
  f.win.emit('pageshow',{persisted:true});
  assert.equal(f.pvs().length,2);
  f.store.set(A.DISABLED_KEY,'1');
  f.win.emit('pageshow',{persisted:true});
  assert.equal(f.pvs().length,2);
  assert.equal(f.win['ga-disable-'+config.measurement_id],true);
});

test('a new document counts once; redirect intermediates never load, 404 paths are fixed',()=>{
  for (let i=0;i<2;i++) {
    const f=fixture();
    f.scripts[0].onload(); assert.equal(f.pvs().length,1);
  }
  const redirect=fixture({href:site+'#AS-001',legacy:['AS-001'],
    options:{page_location:site}});
  assert.equal(redirect.scripts.length,0);
  const missing=fixture({href:site+'arbitrary-private-path?q=secret#hidden',
    options:{page_location:site+'404.html'}});
  missing.scripts[0].onload();
  assert.equal(missing.pvs()[0][2].page_location,site+'404.html');
});

test('maintainer opt-out stops collection, clears only this stream cookies and preserves the page',()=>{
  const f=fixture();
  f.scripts[0].onload();
  f.storage('1');
  assert.equal(f.win['ga-disable-'+config.measurement_id],true);
  assert.deepEqual(new Set(f.deletedCookies.map(x=>x.split('=')[0])),new Set(['atlas_ga','atlas_ga_A1B2C3D4E5']));
  assert.ok(f.deletedCookies.every(x=>x.includes('Path=/art-style-atlas/')));
  f.win.emit('focus'); f.doc.emit('visibilitychange');
  assert.equal(f.pvs().length,1);
  f.storage(null);
  assert.equal(f.win['ga-disable-'+config.measurement_id],false);
  assert.equal(f.pvs().length,1);
  assert.equal(f.scripts.length,1);
});

test('maintainer opt-out during loading prevents queued views after script arrival',()=>{
  const f=fixture();
  f.storage('1');
  f.scripts[0].onload();
  assert.equal(f.pvs().length,0);
  assert.ok(!f.commands().some(x=>x[0]==='config'));
  assert.equal(f.win['ga-disable-'+config.measurement_id],true);
});

test('unavailable storage does not prevent default tracking; blocked script is nonfatal',()=>{
  const f=fixture({brokenStorage:true});
  f.scripts[0].onload();
  assert.equal(f.pvs().length,1);
  assert.equal(f.store.size,0);
  const blocked=fixture();
  assert.doesNotThrow(()=>blocked.scripts[0].onerror());
  blocked.win.emit('focus');
  assert.equal(blocked.scripts.length,1);
  assert.equal(blocked.pvs().length,0);
});

test('language preference redirect does not load analytics or send an intermediate PV',()=>{
  const f=fixture({href:site,localeRedirect:true,options:{page_location:site}});
  assert.equal(f.scripts.length,0);assert.deepEqual(f.commands(),[]);
});

test('Chinese landing and known referrer paths are retained; language history adds no PV',()=>{
  const f=fixture({href:site+'zh/compose/?source=AS-007&lang=zh#private',referrer:site+'zh/catalog/?q=private',
    options:{page_location:site+'zh/compose/',page_title:'创作提示词 · 美术风格图鉴',public_paths:['compose/','zh/compose/','zh/catalog/']}});
  f.scripts[0].onload();
  assert.equal(f.pvs()[0][2].page_location,site+'zh/compose/');
  assert.equal(f.pvs()[0][2].page_referrer,site+'zh/catalog/');
  f.win.location.href=site+'compose/';f.win.emit('popstate');
  f.win.location.href=site+'zh/compose/';f.win.emit('popstate');
  assert.equal(f.pvs().length,1);assert.doesNotMatch(JSON.stringify(f.commands()),/private|source=|lang=/);
  f.win.location.href=site+'compose/?source=private';
  f.elements['analytics-config']={textContent:JSON.stringify({page_location:site+'compose/',page_title:'Prompt builder · Art Style Atlas'})};
  f.win.emit('pageshow',{persisted:true});
  assert.equal(f.pvs().length,2);assert.equal(f.pvs()[1][2].page_location,site+'compose/');
  assert.equal(f.pvs()[1][2].page_title,'Prompt builder · Art Style Atlas');
});
