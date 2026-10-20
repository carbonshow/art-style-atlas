#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Deterministic static site builder and public-content validator (Python 3.9+)."""
import argparse
import hashlib
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import string
import sys
from urllib.parse import urlsplit, unquote, quote

ROOT = Path(__file__).resolve().parents[1]
FORBIDDEN_HASHES = {
    '2e777e5ad89a665be156da64f2cafd0f0460a5691d47fd2ce777596d5102cac1',
    '20117bb13e37090ed7fe6beb521a7e160e83662f750779470a6cd90fc6ca9fbd',
}
PRIVATE_KEYS = {'source_thread', 'source_threads', 'source_batch', 'source_time',
                'historical_prompt_file', 'local_path', 'private_photo', 'internal_note'}
PRIVATE_TEXT = re.compile(r'/Users/|/private/|file://|iCloud|chatgpt\.com/c/|chatgpt-conversation:', re.I)
PRIVATE_VALUE_HASHES = {
    (3, 'e147079ba5f0e9e25218e4c6d36448f6b19392210ec6151485e9cb80e26c7361'),
    (4, 'dad8c2e913cc9257bed194c81f70808d30f5c6b324ebddf8fe78d978d68954de'),
    (9, '57bc720ad879e2e1a5e3fda7e88e17813197e8e22e967c88d685a6f5c0a4c06e'),
}
RELATIONS = {'代表作品', '代表作品（本页观察入口）', '变体', '视觉借鉴'}
e = lambda value: html.escape(str(value), quote=True)

def read(path):
    return json.loads((ROOT / path).read_text(encoding='utf-8'))

def serialized(value):
    return json.dumps(value, ensure_ascii=False, indent=2) + '\n'

def has_private_text(value):
    if PRIVATE_TEXT.search(value): return True
    lowered = value.casefold()
    for length in {n for n, _ in PRIVATE_VALUE_HASHES}:
        for start in range(len(lowered)-length+1):
            digest = hashlib.sha256(lowered[start:start+length].encode('utf-8')).hexdigest()
            if (length, digest) in PRIVATE_VALUE_HASHES: return True
    return False

def walk(value):
    if isinstance(value, dict):
        for key, item in value.items():
            yield key, item
            yield from walk(item)
    elif isinstance(value, (list,tuple)):
        for item in value:
            yield from walk(item)

def all_strings(value):
    if isinstance(value, str):
        yield value
    elif isinstance(value, dict):
        for item in value.values():
            yield from all_strings(item)
    elif isinstance(value, (list,tuple)):
        for item in value:
            yield from all_strings(item)

def load():
    site, taxonomy, terms, learning, media = [read('content/' + n + '.json')
        for n in ['site', 'taxonomy', 'terms', 'learning', 'media']]
    # Learning order also provides an intentional introductory catalog order.
    guides = [json.loads(p.read_text(encoding='utf-8')) for p in sorted((ROOT/'content/guides').glob('*.json'))]
    order = [s['id'] for s in learning['steps']]
    guides.sort(key=lambda g: order.index(g['id']) if g['id'] in order else len(order))
    cases = [json.loads(p.read_text(encoding='utf-8')) for p in sorted((ROOT/'content/cases').glob('*.json'))]
    return site, taxonomy, terms, learning, media, guides + cases

def validate(data):
    site, taxonomy, terms, learning, media, entries = data
    errors = []
    analytics = site.get('analytics', {'enabled': False, 'measurement_id': ''})
    if not isinstance(analytics, dict) or type(analytics.get('enabled')) is not bool:
        errors.append('analytics.enabled 必须为布尔值')
    elif analytics['enabled']:
        measurement_id = analytics.get('measurement_id', '')
        if not isinstance(measurement_id, str) or not re.fullmatch(r'G-[A-Z0-9]+', measurement_id) or measurement_id in {'G-XXXXXXXXXX', 'G-EXAMPLE', 'G-PLACEHOLDER', 'G-TEST', 'G-1234567890'}:
            errors.append('启用统计时必须填写真实的 GA4 Measurement ID，不能使用占位符')
        production = urlsplit(site['url'])
        if production.scheme != 'https' or not production.hostname or production.username or production.password or production.query or production.fragment or not production.path.endswith('/'):
            errors.append('统计生产地址必须为无参数且以 / 结尾的 HTTPS URL')
    ids = [entry['id'] for entry in entries]
    if len(set(ids)) != len(ids): errors.append('重复内容标识')
    for kind in ['guides', 'cases']:
        for path in (ROOT/'content'/kind).glob('*.json'):
            if read(path.relative_to(ROOT))['id'] != path.stem: errors.append('文件名与内容标识不一致：'+str(path.name))
    dimensions = [d['id'] for d in taxonomy['dimensions']]
    if len(dimensions) != 7 or len(set(dimensions)) != 7: errors.append('必须声明七个不同的特征维度')
    for facet in taxonomy['facets'].values():
        values = [v['id'] for v in facet['values']]
        if len(values) != len(set(values)): errors.append('分类标识重复')
    for key, value in walk(data):
        if key in PRIVATE_KEYS: errors.append('公开内容含私人字段：'+key)
    for value in all_strings(data):
        if has_private_text(value): errors.append('公开内容含私人姓名、路径或内部会话信息')
        if value.startswith('media/') and value not in media: errors.append('未登记媒体：'+value)
    for path, meta in media.items():
        file = ROOT/path
        if not path.startswith('media/') or '..' in Path(path).parts:
            errors.append('媒体路径越界：'+path); continue
        if not file.is_file(): errors.append('缺失媒体：'+path); continue
        digest = hashlib.sha256(file.read_bytes()).hexdigest()
        if digest != meta['sha256']: errors.append('媒体清单摘要过期：'+path)
        if digest in FORBIDDEN_HASHES: errors.append('发现已排除的私人媒体')
    actual = {str(p.relative_to(ROOT)) for p in (ROOT/'media').rglob('*') if p.is_file()}
    if actual != set(media): errors.append('media 目录与公开媒体清单不一致')
    for entry in entries:
        eid = entry['id']
        if not re.fullmatch(r'[A-Za-z0-9-]+', eid): errors.append('不安全的标识：'+eid)
        if entry['cover'] not in media: errors.append(eid+' 缺少封面')
        if not entry['references']: errors.append(eid+' 缺少作品支撑')
        for key, values in entry['facets'].items():
            if key not in taxonomy['facets']: errors.append(eid+' 未知分类维度：'+key); continue
            valid = {v['id'] for v in taxonomy['facets'][key]['values']}
            if not set(values) <= valid: errors.append(eid+' 无效分类值')
        if set(entry['facets']) != {'tradition','subject','effect'}: errors.append(eid+' 分类不完整')
        features = entry['features']
        if len({f['id'] for f in features}) != len(features): errors.append(eid+' 特征标识重复')
        if {f['dimension'] for f in features} != set(dimensions): errors.append(eid+' 特征维度不完整')
        if any(not any(f['dimension']==d and f.get('default') for f in features) for d in dimensions): errors.append(eid+' 每个维度至少需要一项推荐特征')
        groups = {}
        for f in features:
            for k in ['id','label','explanation','evidence','zh','en']:
                if not f.get(k): errors.append(eid+' 特征缺少 '+k)
            if f.get('group') and f.get('default'): groups[f['group']] = groups.get(f['group'],0)+1
        if any(v > 1 for v in groups.values()): errors.append(eid+' 互斥组存在多个默认项')
        for relation in entry.get('relations', []):
            if relation['id'] not in ids or relation['relationship'] not in RELATIONS:
                errors.append(eid+' 无效内容关联')
        for ref in entry['references'] + entry.get('unverified_references', []):
            if not ref.get('credit') or not ref.get('alt'): errors.append(eid+' 参考图缺少署名或替代文本')
    for step in learning['steps']:
        if step['id'] not in ids: errors.append('学习路线引用不存在的内容')
    tids = [t['id'] for t in terms['terms']]
    if len(set(tids)) != len(tids): errors.append('词典标识重复')
    for term in terms['terms']:
        if not set(term['related']) <= set(ids): errors.append('词典无效关联：'+term['id'])
    if errors: raise ValueError('\n'.join(sorted(set(errors))))

def entry_url(entry):
    return ('guides/' if entry['type']=='guide' else 'cases/') + entry['id'] + '/'

def paragraph(text, cls=''):
    if not text: return ''
    if isinstance(text, list): return ''.join(paragraph(t,cls) for t in text)
    return '<p'+(' class="'+cls+'"' if cls else '')+'>'+e(text)+'</p>'

def bullets(items):
    return '<ul>'+''.join('<li>'+e(x)+'</li>' for x in items)+'</ul>'

def link(url, text, cls=''):
    return '<a href="'+e(url)+'"'+(' class="'+cls+'"' if cls else '')+'>'+e(text)+'</a>'

def render(data):
    site, taxonomy, terms, learning, media, entries = data
    by_id = {x['id']:x for x in entries}
    labels = {key:{v['id']:v['name'] for v in facet['values']} for key,facet in taxonomy['facets'].items()}
    outputs = {}
    public_paths = ['', 'catalog/', 'learn/', 'learn/portrait/', 'learn/glossary/', 'compose/', 'about/', '404.html']
    public_paths += [entry_url(entry) for entry in entries]
    template = string.Template((ROOT/'templates/base.html').read_text(encoding='utf-8'))
    def image(path, alt, prefix, cls='', eager=False):
        size = media[path]
        return '<img src="'+e(prefix+'/'+path)+'" alt="'+e(alt)+'" width="'+str(size['width'])+'" height="'+str(size['height'])+'" loading="'+('eager' if eager else 'lazy')+'" decoding="async"'+(' class="'+cls+'"' if cls else '')+'>'
    def cards(items, prefix):
        out = '<div class="cards">'
        for entry in items:
            kind = ('风格指南 · '+entry['kind']) if entry['type']=='guide' else '参考案例 · '+entry['id']
            out += '<article class="card"><a href="'+e(prefix+'/'+entry_url(entry))+'">'+image(entry['cover'],entry['name']+'参考作品',prefix)
            out += '<div class="card-body"><span class="eyebrow">'+e(kind)+'</span><h3>'+e(entry['name'])+'</h3>'+paragraph(entry['artist'],'artist')+paragraph(entry['summary'],'card-summary')+'</div></a></article>'
        return out+'</div>'
    def page(path, title, content, page_type='', description=None, cover=None):
        prefix = '.' if len(Path(path).parts)==1 else '/'.join(['..']*(len(Path(path).parts)-1))
        nav = [('catalog/','风格库','catalog'),('learn/','入门学习','learn'),('compose/','创作提示词','compose')]
        navigation = ''.join('<a href="'+prefix+'/'+url+'"'+(' aria-current="page"' if page_type==kind else '')+'>'+name+'</a>' for url,name,kind in nav)
        canonical = site['url']+(path[:-10] if path.endswith('index.html') else path)
        analytics = dict(site.get('analytics', {'enabled': False, 'measurement_id': ''}),
            site_url=site['url'], page_location=canonical, page_title=title+' · 美术风格图鉴',
            public_paths=public_paths)
        outputs[path] = template.substitute(title=e(title),description=e(description or site['description']),root=prefix,
            canonical=e(canonical),og_image=e(site['url']+(cover or entries[1]['cover'])),page=page_type,content=content,
            navigation=navigation,updated_at=e(site['updated_at']),
            analytics_config=json.dumps(analytics, ensure_ascii=False).replace('<', '\\u003c'))
    def intro(kicker,title,text):
        return '<div class="page-intro"><p class="eyebrow">'+e(kicker)+'</p><h1>'+e(title)+'</h1>'+paragraph(text,'lead')+'</div>'
    def prompt_link(entry,prefix,label='选择特征，开始创作 →'):
        return link(prefix+'/compose/?source='+quote(entry['id']),label,'button primary')
    def source_list(sources):
        return '<ul class="source-list">'+''.join('<li>'+link(s['url'],s['title']+' ↗')+'</li>' for s in sources)+'</ul>'
    def reference(ref,prefix):
        title = ref['caption']
        out = '<figure class="reference"><button type="button" class="zoom-button" data-zoom="'+e(prefix+'/'+ref['file'])+'" data-caption="'+e(title)+'" aria-label="放大：'+e(title)+'">'+image(ref['file'],ref['alt'],prefix)+'<span class="zoom-hint">点击放大 ↗</span></button><figcaption><h3>'+e(title)+'</h3>'
        meta = ref.get('artwork',{})
        meta_text = ' · '.join(str(meta[k]) for k in ['artist','date_label','medium_label','dimensions_label','collection','accession_number'] if meta.get(k))
        out += paragraph(meta_text,'muted')+paragraph(ref.get('focus',''))
        for key in ['verification_note']:
            out += paragraph(meta.get(key,''),'note')
        for key in ['visible_poem_credit','attribution_basis','title_status','attribution_status']:
            out += paragraph(ref.get(key,''),'note')
        out += paragraph(ref['credit'],'credit')
        if ref.get('credit_url'): out += link(ref['credit_url'],'查看作品来源 ↗','text-link')
        if ref.get('relationship'):out += paragraph(ref['relationship'],'note')
        out += '</figcaption>'
        if ref.get('motion'):
            m=ref['motion']
            out += '<div class="motion"><video controls loop playsinline preload="none" poster="'+e(prefix+'/'+ref['file'])+'" aria-label="原参考动态"><source src="'+e(prefix+'/'+m['file'])+'" type="video/mp4"></video>'+paragraph(m.get('duration_label','')+' · 点击播放原参考短循环','note')+'</div>'
        return out+'</figure>'
    # Homepage: concise introduction + authentic examples + one clear learning route.
    hero_images = ''.join('<a href="./'+entry_url(by_id[i])+'">'+image(by_id[i]['cover'],by_id[i]['name']+'作品示例','.',eager=True)+'<span>'+e(by_id[i]['name'])+'</span></a>' for i in ['art-nouveau','painterly-portrait','minimalism'])
    home='<section class="hero"><div><p class="eyebrow">看见作品，也看懂风格</p><h1>把喜欢的画面，<br>变成说得清的特征。</h1><p class="lead">从线条、色彩与构图出发，理解不同的视觉语言，再组合成自己的创作提示词。</p><form class="search-bar" action="./catalog/"><label class="sr-only" for="home-search">搜索风格、艺术家或视觉特征</label><input id="home-search" name="q" type="search" placeholder="搜索新艺术、Mucha、金线……"><button type="submit">搜索 →</button></form><div class="suggestions"><span>试试</span>'+link('./catalog/?q=Art+Nouveau','Art Nouveau')+link('./catalog/?q=金线','金线')+link('./catalog/?subject=people&effect=flat','人物 + 平面色块')+'</div></div><div class="hero-gallery">'+hero_images+'</div></section>'
    home+='<section class="route-banner"><div><p class="eyebrow">从这里开始 · 8 个观察入口</p><h2>同样是人物，为什么气质如此不同？</h2><p>从 Sargent 的笔触，到 Favre 的负空间。每次学会看出三个特点，再试着把它们说清楚。</p>'+link('./learn/portrait/','走进人物画风入门 →','button primary')+'</div><div class="route-steps"><span>01 看作品</span><span>02 说特点</span><span>03 做取舍</span><span>04 去创作</span></div></section>'
    home+='<section><div class="section-heading"><div><p class="eyebrow">精选风格</p><h2>先从不同的视觉语言看起</h2></div>'+link('./catalog/?type=guide','查看全部风格指南 →')+'</div>'+cards([by_id[k] for k in ['art-nouveau','art-deco','mid-century','minimalism']],'.')+'</section>'
    home+='<section><div class="section-heading"><div><p class="eyebrow">从作品到应用</p><h2>一个案例，细看它怎样成立</h2></div>'+link('./catalog/?type=case','浏览参考案例 →')+'</div>'+cards([by_id[k] for k in ['AS-002','AS-007','AS-010']],'.')+'</section><script id="legacy-ids" type="application/json">'+json.dumps([x['id'] for x in entries if x['type']=='case'])+'</script>'
    page('index.html','理解风格，提取特征，辅助创作',home,'home')
    # Catalog. All initial content remains readable without JavaScript.
    filters=''
    for key,facet in taxonomy['facets'].items():
        filters+='<fieldset><legend>'+e(facet['name'])+'</legend><div class="filter-options">'
        for value in facet['values']:
            filters+='<label><input type="checkbox" name="'+key+'" value="'+value['id']+'"><span>'+e(value['name'])+'</span></label>'
        filters+='</div></fieldset>'
    catalog=intro('浏览与探索','风格库','按名字找，也按看得见的特征找。同一维度多选取并集，不同维度组合取交集；参考题材只说明当前样例。')
    catalog+='<form id="catalog-form"><div class="search-bar"><label class="sr-only" for="catalog-search">搜索风格、艺术家、术语与视觉特征</label><input id="catalog-search" name="q" type="search" placeholder="搜索名字、艺术家、术语或特征"><button type="submit">搜索 →</button></div><details class="filters"><summary id="filter-summary">分类筛选</summary>'+filters+'<button type="button" id="reset-filters" class="button subtle">清空搜索与筛选</button></details></form>'
    catalog+='<noscript><p class="note">启用 JavaScript 后可使用组合筛选。下方仍可查看全部内容。</p></noscript><div class="result-heading"><p id="result-count" role="status">全部 '+str(len(entries))+' 条内容</p><span class="muted">每页最多 24 条</span></div><div id="results" class="cards">'
    catalog+=cards(entries[:24],'..').removeprefix('<div class="cards">')[:-6]+'</div><nav id="pagination" class="pagination" aria-label="结果分页"></nav>'
    catalog+='<section id="term-results-wrap" hidden><h2>词典中的探索入口</h2><div id="term-results" class="term-results"></div></section><div class="quiet-callout">还想拓展更多方向？'+link('../learn/glossary/','查看 48 个搜索关键词 →')+'</div>'
    page('catalog/index.html','风格库',catalog,'catalog')
    # Detail pages, shared dimensions and source metadata.
    for entry in entries:
        prefix='../..'; isguide=entry['type']=='guide'
        detail='<div class="breadcrumbs">'+link(prefix+'/catalog/','风格库')+' / '+('风格指南' if isguide else e(entry['id']))+'</div>'
        detail+='<section class="detail-hero"><div><p class="eyebrow">'+e(entry.get('kind','参考案例 · '+entry['id']))+'</p><h1>'+e(entry['name'])+'</h1><p class="english-name">'+e(entry['english_name'])+'</p><p class="artist">'+e(entry['artist'])+'</p>'+paragraph(entry['summary'],'lead')+prompt_link(entry,prefix)
        detail+='<div class="facet-tags">'+''.join('<span>'+e(labels[k][v])+'</span>' for k,vs in entry['facets'].items() for v in vs)+'</div></div><div class="detail-cover"><button class="zoom-button" data-zoom="'+prefix+'/'+entry['cover']+'" data-caption="'+e(entry['name'])+'" aria-label="放大参考封面">'+image(entry['cover'],next(r['alt'] for r in entry['references'] if r['file']==entry['cover']),prefix,eager=True)+'<span class="zoom-hint">点击放大 ↗</span></button></div></section>'
        if isguide:
            detail+='<section class="reading"><h2>先认清这个方向</h2>'+paragraph(entry['definition'])+'<h3>三个识别线索</h3>'+bullets(entry['recognition'])+'<div class="two-notes"><div><h3>常见变化</h3>'+paragraph(entry['variations'])+'</div><div><h3>容易混淆</h3>'+paragraph(entry['confusion'])+'</div></div>'+source_list(entry['sources'])+'</section>'
        else:
            detail+='<section class="reading"><h2>怎样看这组作品</h2>'+paragraph(entry['classification'],'eyebrow')+paragraph(entry['recognition'])+paragraph(entry['judgment_note'],'note')+'</section>'
        detail+='<section><div class="section-heading"><div><p class="eyebrow">具体作品中的证据</p><h2>'+('参考作品' if isguide else '逐图品鉴')+'</h2></div><span class="muted">完整画幅 · 点击放大</span></div><div class="references">'+''.join(reference(r,prefix) for r in entry['references'])+'</div></section>'
        if entry.get('unverified_references'):
            detail+='<section><h2>待核实的对照资料</h2><p class="note">这些图片保留用于视觉比较，不作为该艺术家的已核实作品。</p><div class="references">'+''.join(reference(r,prefix) for r in entry['unverified_references'])+'</div></section>'
        detail+='<section id="features"><div class="section-heading"><div><p class="eyebrow">七个观察维度</p><h2>把特点转成可迁移的描述</h2></div>'+prompt_link(entry,prefix,'选取这些特征 →')+'</div><p class="note">下面是一套可取舍的建议。配色来自本页示例，可以改为沿用原图；形状、构图的表述以保留原内容为前提。</p><div class="feature-grid">'
        for dim in taxonomy['dimensions']:
            f=next(x for x in entry['features'] if x['dimension']==dim['id'] and x['default'])
            detail+='<article class="feature-card"><p class="eyebrow">'+e(dim['name'])+'</p><h3>'+e(f['label'])+'</h3>'+paragraph(f['explanation'])+'<details><summary>观察依据与英文描述</summary>'+paragraph(f['evidence'],'note')+paragraph(f['en'],'feature-english')+'</details></article>'
        detail+='</div></section>'
        if not isguide:
            detail+='<section class="reading"><h2>完整品鉴笔记</h2>'
            for f in entry['analysis']:detail+='<h3>'+e(f['label'])+'</h3>'+paragraph(f['text'])
            detail+='<h3>复用时的取舍</h3>'+paragraph(entry['reuse_focus'])+'<h3>需要避开的倾向</h3>'+paragraph(entry['observed_avoid'])+'</section>'
        for i,ex in enumerate(entry.get('examples',[])):
            detail+='<section><h2>'+e(ex['title'])+'</h2>'+paragraph(ex['caption'])+'<div class="comparison" data-comparison><div class="comparison-images">'+image(ex['after'],'AI 改绘结果',prefix,'after')+image(ex['before'],'输入原图',prefix,'before')+'<span class="before-label">原图</span><span class="after-label">AI 改绘</span></div><label>拖动比较<input type="range" min="0" max="100" value="50" aria-label="调整原图与改绘的分界"></label></div><div class="comparison-links">'+link(prefix+'/'+ex['before'],'查看完整原图 ↗')+link(prefix+'/'+ex['after'],'查看完整改绘 ↗')+'</div>'+bullets(ex['observations'])+paragraph(ex['credit'],'credit')
            if ex.get('execution_prompt'):detail+='<details class="reading"><summary>查看这一次改绘实际使用的提示词</summary><p class="note">这是一份历史案例记录，包含当次对象和构图；新的改绘请使用上方可选特征组装。</p><pre>'+e(ex['execution_prompt'])+'</pre></details>'
            detail+='</section>'
        if entry.get('pipeline'):
            detail+='<section class="reading"><h2>制作思路</h2>'+''.join('<h3>'+e(p['label'])+'</h3>'+paragraph(p['text']) for p in entry['pipeline'])+'</section>'
        for key,title in [('legacy_prompts','原有完整迁移模板'),('motion_prompts','动态扩展模板')]:
            if entry.get(key):
                detail+='<details class="legacy reading"><summary>'+title+'</summary><p class="note">保留的完整模板独立于特征选择器，适合阅读与对照。若只想迁移部分特征，请使用“创作提示词”。</p>'
                for lang,label in [('zh','中文'),('en','English')]:
                    ident=key+'-'+lang
                    detail+='<div class="section-heading"><h3>'+label+'</h3><button type="button" data-copy="'+ident+'">复制'+label+'</button></div><pre id="'+ident+'">'+e(entry[key][lang])+'</pre>'
                detail+='</details>'
        related=[by_id[r['id']] for r in entry['relations']]
        inverse=[x for x in entries if any(r['id']==entry['id'] for r in x['relations'])]
        if related or inverse:
            detail+='<section><h2>相关内容 · 视觉借鉴</h2><p class="note">这里说明视觉语言的联系，不据此判断历史归属或原作作者。</p>'+cards(related+inverse,prefix)+'</section>'
        if not isguide:detail+='<section class="reading"><h2>出处与背景资料</h2>'+source_list(entry['sources'])+paragraph('逐图出处与尚未确定的信息见各图说明；背景资料不自动成为本图的作者证据。','note')+'</section>'
        detail+='<div class="detail-end">'+prompt_link(entry,prefix)+link(prefix+'/catalog/','返回风格库','button subtle')+'</div>'
        page(entry_url(entry)+'index.html',entry['name'],detail,'detail',entry['summary'],entry['cover'])
    # Learning route and dictionary.
    learn=intro('给初学者的观察路径','先学会看，再学会描述','不急着记住所有流派。每次比较两张作品，把“感觉不同”拆成看得见的区别。')
    learn+='<section class="route-banner"><div><p class="eyebrow">入门路线</p><h2>人物画风：8 个观察入口</h2><p>从写实到图形化，从外在形体到内在情绪，探索彼此独立的视觉方向。</p>'+link('./portrait/','开始人物路线 →','button primary')+'</div>'+image(by_id['art-deco']['cover'],'装饰艺术人物参考','..')+'</section><section class="reading"><h2>一次练习，四个步骤</h2><ol>'+''.join('<li>'+e(s)+'</li>' for s in learning['exercise'])+'</ol><h2>七个维度怎么观察？</h2>'
    prompts=['形体是准确、拉长、几何化，还是只剩关键剪影？','轮廓清楚还是柔和？线条是否说明动作或体积？','哪些颜色占大面积？什么颜色只用作焦点？','明暗塑造体积，还是让位给平涂色块？','形体怎样重叠？哪里密，哪里空？','表面是干净、干涩、颗粒化，还是有可见笔触？','前六个选择共同造成了什么观看感受？']
    learn+='<dl>'+''.join('<dt>'+e(d['name'])+'</dt><dd>'+e(t)+'</dd>' for d,t in zip(taxonomy['dimensions'],prompts))+'</dl></section><section class="quiet-callout"><div><h2>把视野继续打开</h2><p>48 个搜索关键词，覆盖流派、地域、漫画、插画与媒介。</p></div>'+link('./glossary/','打开学习词典 →','button')+'</section>'
    page('learn/index.html','入门学习',learn,'learn')
    portrait=intro('人物画风入门','同样画人物，观察八种选择','这些方向并非同一层级的艺术分类。沿着作品观察各自的形、线、色，再决定你想迁移什么。')
    portrait+='<div class="learning-list">'
    for i,step in enumerate(learning['steps']):
        g=by_id[step['id']]
        portrait+='<article><span class="step-number">'+str(i+1).zfill(2)+'</span><a href="../../'+entry_url(g)+'">'+image(g['cover'],g['name']+'作品示例','../..')+'</a><div><p class="eyebrow">'+e(g['artist'])+'</p><h2>'+link('../../'+entry_url(g),g['name'])+'</h2>'+paragraph(g['summary'])+'<p class="question">观察题：'+e(step['question'])+'</p>'+link('../../'+entry_url(g),'读懂特点，再选取特征 →','text-link')+'</div></article>'
    portrait+='</div><section class="reading"><h2>做一次自己的比较</h2>'+bullets(learning['exercise'])+link('../../compose/?source=art-nouveau','组装一份自己的提示词 →','button primary')+'</section>'
    page('learn/portrait/index.html','人物画风入门',portrait,'learn')
    glossary=intro('搜索词与观察语言','学习词典',terms['intro'])
    glossary+='<div class="glossary-controls"><label>查找关键词<input type="search" id="glossary-search" placeholder="中文、英文或视觉线索"></label><label>探索方向<select id="glossary-group"><option value="">全部方向</option>'+''.join('<option value="'+g['id']+'">'+e(g['name'])+'</option>' for g in terms['groups'])+'</select></label><span id="glossary-count" role="status">48 个探索词</span></div><div class="terms-table">'
    for t in terms['terms']:
        glossary+='<article class="term-row" id="'+t['id']+'" data-group="'+t['group']+'"><div><h2>'+e(t['name'])+'</h2><code id="query-'+t['id']+'">'+e(t['query'])+'</code>'+paragraph(t['meaning'])+'</div><div class="term-actions"><button type="button" data-copy="query-'+t['id']+'">复制搜索词</button>'+link('https://www.google.com/search?tbm=isch&q='+quote(t['query']),'搜索图片 ↗')
        for eid in t['related']:glossary+=link('../../'+entry_url(by_id[eid]),'阅读 '+by_id[eid]['name']+' →')
        glossary+='</div></article>'
    glossary+='</div><section class="reading"><h2>怎样组合搜索词？</h2><p>从“风格或艺术家 + portrait / figure drawing / character design / sketchbook + 视觉效果”开始。一次只改变一个词，比较结果。搜索结果的标题不能代替作品出处。</p><p class="note">例如：Art Nouveau portrait linework、Mary Blair character design color。Mid-century 在这里指 20 世纪中叶。</p></section>'
    page('learn/glossary/index.html','学习词典',glossary,'glossary')
    # Composer scaffold; profiles are loaded one at a time, not all case prose.
    compose=intro('选择，而不是堆砌','创作提示词','从一份参考开始，只带走需要的视觉特征。默认保留原图内容；你填写的要求在中英文版本中均保留原文。')
    compose+='<noscript><p>提示词组装需要 JavaScript；也可回到详情页阅读完整描述。</p></noscript><a class="mobile-prompt-jump button" href="#prompt-panel">查看实时提示词 ↓</a><div class="composer-layout" id="composer-main"><div class="composer-form"><section class="source-picker"><label for="source-select">01 · 从风格或案例开始</label><select id="source-select">'
    for kind,title in [('guide','风格指南'),('case','参考案例')]:
        compose+='<optgroup label="'+title+'">'+''.join('<option value="'+x['id']+'">'+e(x['name'])+'</option>' for x in entries if x['type']==kind)+'</optgroup>'
    compose+='</select><div class="source-preview"><img id="source-image" alt=""><div><a id="source-link" href="../catalog/">回看参考作品 →</a><p id="source-note" class="note"></p></div></div></section><section><div class="section-heading"><h2>02 · 选择视觉特征</h2><button id="reset-recommended" type="button">恢复推荐组合</button></div><p class="note">同一配色组只能选一项。恢复推荐组合不会清除你的文字要求。</p><div id="feature-options"></div></section><section class="requirements"><h2>03 · 写下这次的目标与取舍</h2><label for="goal">本次改绘目标</label><textarea id="goal" rows="3" placeholder="例如：把这张人物合照改成适合明信片的平面插画"></textarea><fieldset><legend>需要保留的原图内容</legend>'
    for ident,label in [('identity','主体身份与数量'),('relationships','动作及物件关系'),('viewpoint','构图与视角'),('aspect','画幅比例')]:
        compose+='<label class="check-row"><input type="checkbox" name="preserve" value="'+ident+'" checked><span>'+label+'</span></label>'
    compose+='</fieldset><label for="custom-keep">补充保留要求</label><textarea id="custom-keep" rows="2" placeholder="例如：保留衣服上的校徽位置，但不生成文字"></textarea><label class="check-row"><input type="checkbox" id="base-avoid" checked><span>使用建议避免项</span></label><p id="avoid-description" class="note"></p><label for="custom-avoid">补充避免项</label><textarea id="custom-avoid" rows="2" placeholder="例如：避免把皮肤处理成明显的裂纹表面"></textarea></section></div><aside class="prompt-panel" id="prompt-panel"><div class="section-heading"><h2>你的提示词</h2><span id="selected-count" class="note"></span></div><div class="language-toggle" role="group" aria-label="提示词语言"><button type="button" data-lang="zh" aria-pressed="true">中文</button><button type="button" data-lang="en" aria-pressed="false">English</button></div><pre id="prompt-output" lang="zh-CN" aria-live="polite">正在加载推荐特征……</pre><button id="copy-prompt" type="button" class="button primary" disabled>复制当前提示词</button><p class="note">英文版只切换已编写的特征与固定说明；你的自由输入保持原文。本站不上传图片，也不调用生成模型。</p><a class="mobile-prompt-jump" href="#feature-options">返回调整特征 ↑</a></aside></div>'
    page('compose/index.html','创作提示词',compose,'compose')
    about=intro('关于这个图鉴','学习入口，也是一套观察方法','面向美术初学者与 AI 创作爱好者，用作品理解风格，用可观察的特征辅助创作。')
    about+='<section class="reading"><h2>内容怎样组织</h2><p>风格指南说明共性、变化和边界；参考案例保留具体作品的逐图观察；视觉特征把两者连接到创作提示词。分类与题材各自独立，视觉相似不作为历史归属的证据。</p><h2>来源与作品</h2><p>参考作品保留完整画幅、署名与出处。无法确认作者、题名或媒介时明确注明；“油画般”“版画感”等描述仅指可见效果。背景资料与作品来源分别标注。公开可见不等于作品获开放许可；版权仍归相应权利人，商业复用前请向来源方核对。</p><h2>新增与更正</h2><p>网站代码、公开的风格指南、案例和分类词表统一在独立 GitHub 仓库维护。每条内容有稳定标识，新增条目后自动进入目录与检索；加入人物路线需同时登记学习路线。发现出处错误或希望移除图片，可以通过仓库 Issue 提交对应页面与依据。</p>'+link('https://github.com/carbonshow/art-style-atlas','打开维护仓库 ↗','button')+' '+link('https://github.com/carbonshow/art-style-atlas/issues','反馈与更正 ↗','button subtle')+'<h2>如何理解生成的提示词</h2><p>提示词由浏览器根据勾选项组装，不会生成或保存图片，也不会自动读取原图。它是一份可修改的创作描述，不保证任何生成工具都能完全执行。人物、建筑和道具以你的原图为准，不从参考作品自动加入。</p></section>'
    about+='<section class="reading" id="privacy"><h2>访问统计与隐私</h2><p>本站使用 Google 提供的 Google Analytics 4 了解访问人数、页面浏览、分享来源、设备、国家或地区及阅读参与度。只有在你选择“允许统计”后，浏览器才会加载 Google 统计脚本并发送数据；未选择或拒绝时不发送统计请求。</p><p>统计包含本页公开地址与标题、经过精简的来源地址和标准技术信息，不采集站内搜索词、创作提示词、表单文字、图片或剪贴板内容。本站不启用广告个性化、Google signals 或 User-ID，不将统计数据用于识别你的身份。</p><p>允许统计后，Google 会在本网站路径下设置以 atlas 为前缀的第一方 Cookie，用于区分浏览器与会话。你的选择在本浏览器中保留 180 天；存储不可用时仅在当前页面生效。你可以随时在页脚“统计设置”中拒绝统计；撤回会停止后续采集并清理本站统计 Cookie，不会清除你正在填写的创作文字，也不会自动删除此前已提交的数据。</p><p>报表只覆盖同意统计且成功上报的访问，不能还原接入前的流量，也不等于精确的实际人数。事件及用户级数据保留 14 个月，汇总报告遵循 Google Analytics 的处理方式。有关 Google 如何处理数据，见 <a href="https://policies.google.com/privacy">Google 隐私政策</a>。</p></section>'
    page('about/index.html','关于与内容维护',about,'about')
    page('404.html','暂时找不到这一页',intro('404','这一页可能换了位置','可以回到风格库按名称或 AS 编号查找。')+link('./catalog/','打开风格库','button primary'),'404')
    # The GitHub Pages 404 page may be served at an arbitrary depth: use a site base.
    outputs['404.html']=outputs['404.html'].replace('<head>','<head>\n<base href="'+e(site['url'])+'">')
    index=[]
    for entry in entries:
        field_labels=[labels[k][v] for k,vs in entry['facets'].items() for v in vs]
        matching_terms=[t for t in terms['terms'] if entry['id'] in t['related']]
        search_text=' '.join([entry['name'],entry['english_name'],entry['artist'],entry['summary'],*entry['aliases'],*field_labels,
            *[f['zh']+' '+f['en']+' '+f['label'] for f in entry['features']],
            *[r['caption']+' '+r.get('artwork',{}).get('title','') for r in entry['references']],
            *[t['query']+' '+t['name'] for t in matching_terms]])
        index.append({k:entry[k] for k in ['id','type','name','english_name','artist','aliases','summary','cover','facets']} | {'url':entry_url(entry),'kind':entry.get('kind',''),'search_text':search_text})
        outputs['data/profiles/'+entry['id']+'.json']=serialized({k:entry[k] for k in ['id','name','features','avoid']})
    for name,obj in [('search',index),('taxonomy',taxonomy),('terms',terms)]:outputs['data/'+name+'.json']=serialized(obj)
    outputs['sitemap.xml']='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join('<url><loc>'+e(site['url']+p[:-10])+'</loc></url>' for p in outputs if p.endswith('index.html'))+'</urlset>\n'
    return outputs

class Links(HTMLParser):
    def __init__(self):
        super().__init__(); self.links=[]; self.ids=set(); self.duplicates=[]
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        if attrs.get('id'):
            if attrs['id'] in self.ids: self.duplicates.append(attrs['id'])
            self.ids.add(attrs['id'])
        for key in ['href','src','poster','data-zoom']:
            if attrs.get(key):self.links.append(attrs[key])

def validate_outputs(outputs):
    parsers={};errors=[]
    for path,text in outputs.items():
        if has_private_text(text): errors.append('生成结果包含私人内容：'+path)
        if path.endswith('.html'):
            parser=Links();parser.feed(text);parsers[path]=parser
            if parser.duplicates:errors.append('HTML 标识重复：'+path)
    for path,parser in parsers.items():
        for url in parser.links:
            parsed=urlsplit(url)
            if parsed.scheme or parsed.netloc:continue
            target=(ROOT/Path(path).parent/unquote(parsed.path)).resolve() if parsed.path else ROOT/path
            if not target.is_relative_to(ROOT):errors.append('内部路径越界：'+url);continue
            rel=str(target.relative_to(ROOT))
            if parsed.path.endswith('/') or (target.is_dir() and rel not in outputs):rel=rel.rstrip('/')+'/index.html' if rel!='.' else 'index.html'
            if rel not in outputs and not (ROOT/rel).is_file():errors.append(path+' 断链：'+url)
            if parsed.fragment and rel in parsers and unquote(parsed.fragment) not in parsers[rel].ids:
                errors.append(path+' 缺失锚点：'+url)
    if errors:raise ValueError('\n'.join(sorted(set(errors))))

def build(check=False):
    data=load();validate(data);outputs=render(data);validate_outputs(outputs)
    source_files=sorted(p for folder in ['content','templates','assets','scripts'] for p in (ROOT/folder).rglob('*') if p.is_file() and '__pycache__' not in p.parts)
    digest=hashlib.sha256()
    for p in source_files:digest.update(str(p.relative_to(ROOT)).encode());digest.update(p.read_bytes())
    outputs['.build-manifest.json']=serialized({'schema_version':1,'source_sha256':digest.hexdigest(),'generated':sorted(outputs)})
    stale=[p for p,text in outputs.items() if not (ROOT/p).is_file() or (ROOT/p).read_text(encoding='utf-8')!=text]
    old=read('.build-manifest.json')['generated'] if (ROOT/'.build-manifest.json').is_file() else []
    removed=set(old)-set(outputs)
    if check:
        if stale or removed:raise ValueError('生成文件未同步：\n'+'\n'.join(sorted(stale+list(removed))))
    else:
        for p in removed:
            target=(ROOT/p).resolve()
            if target.is_relative_to(ROOT) and target.is_file():target.unlink()
        for path,text in outputs.items():
            target=ROOT/path;target.parent.mkdir(parents=True,exist_ok=True);target.write_text(text,encoding='utf-8')
    print(('CHECK OK' if check else 'BUILD OK')+': '+str(len(data[-1]))+' entries, '+str(len(data[2]['terms']))+' terms, '+str(len(outputs))+' generated files')

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--check',action='store_true');args=parser.parse_args()
    try:build(args.check)
    except (ValueError,KeyError,FileNotFoundError,json.JSONDecodeError) as exc:
        print(str(exc),file=sys.stderr);sys.exit(1)
