"""Explicit content localization and reviewed translation validation."""
import hashlib
import json
import re

LOCALES = ('en', 'zh')
PROMPT_PAIRS = {'avoid', 'legacy_prompts', 'motion_prompts', 'execution_prompt_reading'}
DISPLAY_KEYS = {'name','artist','kind','summary','definition','recognition','variations','confusion',
 'classification','reuse_focus','judgment_note','caption','alt','focus','credit','attribution_basis',
 'title_status','attribution_status','visible_poem_credit','date_label','medium_label','dimensions_label',
 'collection','verification_note','duration_label','frame_time_label','format_note','label','text',
 'explanation','evidence','observed_avoid','question','exercise','intro','meaning','description','title'}
CJK = re.compile(r'[\u4e00-\u9fff]')

def is_pair(value):
    return isinstance(value, dict) and set(value) == {'zh','en'}

def localize(value, locale, key=''):
    if is_pair(value):
        if key in PROMPT_PAIRS: return value.copy()
        return value[locale]
    if isinstance(value, dict): return {k:localize(v,locale,k) for k,v in value.items()}
    if isinstance(value, (list,tuple)): return [localize(v,locale,key) for v in value]
    return value

def translator(messages, locale):
    # Only explicitly wrapped template literals pass through this function.
    # Content translations, source titles, URLs and historical originals do not.
    keys = sorted(messages, key=len, reverse=True)
    pattern = re.compile('|'.join(re.escape(k) for k in keys))
    def translate(fragment):
        remaining = pattern.sub('', fragment)
        if CJK.search(remaining):
            raise ValueError('Untranslated UI literal: '+remaining)
        result=pattern.sub(lambda m: messages[m.group()][locale], fragment)
        return result.replace('。','.') if locale=='en' else result
    return translate

def digest(value):
    return hashlib.sha256(json.dumps(value,ensure_ascii=False,sort_keys=True,separators=(',',':')).encode()).hexdigest()

def validate_pairs(value, path='', parent='', errors=None):
    errors = [] if errors is None else errors
    if is_pair(value):
        for lang in LOCALES:
            if not isinstance(value[lang],str) or not value[lang].strip():errors.append(path+': missing '+lang)
        if all(isinstance(value[l],str) for l in LOCALES):
            placeholders=lambda s:set(re.findall(r'\{([a-z_]+)\}',s))
            if placeholders(value['zh'])!=placeholders(value['en']):errors.append(path+': translation placeholders differ')
        return errors
    if isinstance(value,dict):
        if 'zh' in value and 'en' not in value:errors.append(path+': missing en')
        if 'en' in value and 'zh' not in value:errors.append(path+': missing zh')
        for k,v in value.items():
            q=path+'.'+k
            # Keep structural relation enums and canonical media metadata unchanged.
            shared_name=k=='artist' and isinstance(v,str) and not CJK.search(v)
            relation_text=k=='relationship' and '.relations[' not in q
            paired_list=k in {'recognition','exercise','observations'} and isinstance(v,list)
            if (k in DISPLAY_KEYS or relation_text) and not is_pair(v) and not paired_list and k!='kind' and not shared_name:
                errors.append(q+': display field must contain zh and en')
            if k in {'zh','en'}:
                if not isinstance(v,str) or not v.strip():errors.append(path+': missing '+k)
                continue
            validate_pairs(v,q,k,errors)
    elif isinstance(value,list):
        for i,v in enumerate(value):
            if parent in {'recognition','exercise','observations'} and not is_pair(v):errors.append(path+f'[{i}]: bilingual text required')
            validate_pairs(v,path+f'[{i}]',parent,errors)
    return errors
