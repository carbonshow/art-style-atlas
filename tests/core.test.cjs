const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const root = path.resolve(__dirname, '..');
const A = require('../assets/core.js');
const read = p => JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const entries = read('data/search.json');
const taxonomy = read('data/taxonomy.json');
const state = q => ({q,page:1,tradition:[],subject:[],effect:[],type:[]});

test('exact names, artist aliases, gold lines and combined terms find the expected entries',()=>{
  assert.equal(A.search(entries,state('Art Nouveau'))[0].id,'art-nouveau');
  assert.equal(A.search(entries,state('Mucha'))[0].id,'art-nouveau');
  assert.equal(A.search(entries,state('AS-010'))[0].id,'AS-010');
  assert.ok(A.search(entries,state('金线')).some(x=>x.id==='AS-002'));
  const results=A.search(entries,state('人物＋平面色块'));
  assert.ok(results.some(x=>x.id==='minimalism'));
  assert.ok(results.every(x=>x.facets.subject.includes('people') && x.facets.effect.includes('flat')));
});
test('facet selection is OR within one dimension and AND across dimensions',()=>{
  const s={...state(''),subject:['people','architecture'],effect:['flat'],type:['case']};
  const result=A.search(entries,s);
  assert.ok(result.some(x=>x.id==='AS-009'));
  assert.ok(result.every(x=>x.type==='case' && x.facets.effect.includes('flat') && x.facets.subject.some(y=>s.subject.includes(y))));
  assert.ok(!result.some(x=>x.id==='AS-003'));
});
test('URL round-trips search, repeated filters and pagination; drops unknown facets',()=>{
  const original={...state('人物 + 平面色块'),subject:['people','plants'],effect:['flat'],page:2};
  assert.deepEqual(A.readState('?'+A.stateQuery(original),taxonomy),original);
  assert.deepEqual(A.readState('?subject=bogus&subject=people&subject=people&page=-5',taxonomy).subject,['people']);
  assert.equal(A.readState('?page=-5',taxonomy).page,1);
});
test('pagination limits actual visible cards to 24 and clamps stale pages',()=>{
  const many=Array.from({length:49},(_,i)=>({id:i}));
  assert.equal(A.paginate(many,1).items.length,24);
  assert.equal(A.paginate(many,2).items[0].id,24);
  assert.equal(A.paginate(many,99).page,3);
  assert.equal(A.paginate([],9).page,1);
});
test('prompt contains only selected features; rejects contradictory palette selections',()=>{
  for(const entry of entries){
    const profile=read('data/profiles/'+entry.id+'.json');
    const line=profile.features.find(f=>f.dimension==='line');
    const s={goal:'我的目标\nKeep this exact text.',selected:[line.id],preserve:['identity','aspect'],customKeep:'保留标志 A&B',customAvoid:'avoid neon',baseAvoid:false};
    for(const lang of ['zh','en']){
      const text=A.compose(profile,s,lang);
      assert.ok(text.includes(line[lang]));
      for(const f of profile.features.filter(f=>f.id!==line.id))assert.ok(!text.includes(f[lang]),entry.id+' unselected '+f.id);
      assert.ok(text.includes(s.goal));assert.ok(text.includes(s.customKeep));assert.ok(text.includes(s.customAvoid));
      assert.ok(text.includes(A.PRESERVE[0][lang]));assert.ok(text.includes(A.PRESERVE[3][lang]));
    }
    assert.equal(A.selectedFeatures(profile,profile.features.map(f=>f.id)).filter(f=>f.group==='palette').length,1);
    assert.equal(A.selectedFeatures(profile,['color-original'])[0].id,'color-original');
    assert.equal(A.selectedFeatures(profile,['not-a-feature']).length,0);
  }
});
test('all 18 entries have exactly one default in each dimension and default preservation stays intact',()=>{
  assert.equal(entries.length,18);
  for(const entry of entries){
    const p=read('data/profiles/'+entry.id+'.json'),selected=p.features.filter(f=>f.default).map(f=>f.id);
    assert.equal(A.selectedFeatures(p,selected).length,7);
    const s={goal:'',selected,preserve:A.PRESERVE.map(x=>x.id),customKeep:'原文保留',customAvoid:'',baseAvoid:true};
    const text=A.compose(p,s,'en');
    for(const k of A.PRESERVE)assert.ok(text.includes(k.en));
    assert.ok(text.includes('原文保留'));
  }
});
