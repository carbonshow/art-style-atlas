import copy
import json
from pathlib import Path
import sys
import unittest
from unittest.mock import patch

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
import build
from i18n import localize, validate_pairs, digest


class BilingualChecks(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data=build.load()
        cls.outputs=build.render(cls.data)

    def test_every_page_has_both_complete_static_versions_and_metadata(self):
        pages=[p for p in self.outputs if p.endswith('.html') and not p.startswith('zh/')]
        self.assertEqual(len(pages),26)
        for path in pages:
            for prefix,lang in [('', 'en'),('zh/','zh-CN')]:
                html=self.outputs[prefix+path]
                route=path[:-10] if path.endswith('index.html') else path
                self.assertIn('<html lang="'+lang+'">',html)
                self.assertIn('rel="canonical" href="'+self.data[0]['url']+prefix+route+'"',html)
                for alternate in ['en','zh-CN','x-default']:self.assertIn('hreflang="'+alternate+'"',html)
                self.assertIn('data-site-lang="en"',html);self.assertIn('data-site-lang="zh"',html)
                self.assertLess(html.index('assets/locale.js'),html.index('assets/analytics.js'))
        self.assertIn('Choose features',self.outputs['compose/index.html'])
        self.assertIn('选择视觉特征',self.outputs['zh/compose/index.html'])
        self.assertEqual(self.outputs['learn/glossary/index.html'].count('class="term-row"'),48)
        self.assertEqual(self.outputs['zh/learn/glossary/index.html'].count('class="term-row"'),48)

    def test_paired_prose_and_current_language_plain_fields(self):
        for locale,prefix in [('en',''),('zh','zh/')]:
            terms=json.loads(self.outputs[prefix+'data/terms.json'])
            self.assertTrue(all(isinstance(t['name'],str) and isinstance(t['meaning'],str) for t in terms['terms']))
            profile=json.loads(self.outputs[prefix+'data/profiles/AS-007.json'])
            self.assertIsInstance(profile['name'],str)
            self.assertIsInstance(profile['features'][0]['label'],str)
            self.assertEqual(set(profile['avoid']),{'zh','en'})
            self.assertIn('zh',profile['features'][0]);self.assertIn('en',profile['features'][0])

    def test_missing_blank_and_partial_translations_are_rejected(self):
        for value in [{'name':'中文'}, {'name':{}}, {'name':{'zh':'中文'}}, {'name':{'zh':'中文','en':''}}, {'features':[{'zh':'中文','en':''}]}]:
            self.assertTrue(validate_pairs(value),value)
        self.assertFalse(validate_pairs({'artist':'Mary Blair'}))
        self.assertTrue(validate_pairs({'artist':'未核实'}))

    def test_ui_placeholders_must_match(self):
        self.assertTrue(validate_pairs({'count':{'zh':'共 {count} 条','en':'{total} entries'}}))
        self.assertFalse(validate_pairs({'count':{'zh':'共 {count} 条','en':'{count} entries'}}))

    def test_review_fingerprint_must_cover_current_version(self):
        original=build.read
        def changed(path):
            value=original(path)
            if path=='content/guides/art-nouveau.json':value['name']['zh']+='修订'
            return value
        with patch.object(build,'read',side_effect=changed):
            with self.assertRaisesRegex(ValueError,'review is stale'):build.validate_translations(self.data)

    def test_private_text_in_either_language_is_rejected(self):
        data=copy.deepcopy(self.data);data[-1][0]['summary']['en']='file://'+'private/test'
        with self.assertRaisesRegex(ValueError,'私人姓名、路径'):build.validate(data)

    def test_historical_execution_records_and_shared_media_are_identical(self):
        for entry in self.data[-1]:
            for example in entry.get('examples',[]):
                if 'execution_prompt' not in example:continue
                self.assertEqual(example['execution_prompt'],example['execution_prompt_reading']['en'])
                for prefix in ['', 'zh/']:
                    page=self.outputs[prefix+'cases/'+entry['id']+'/index.html']
                    self.assertIn(build.e(example['execution_prompt']),page)
                    self.assertIn(build.e(example['execution_prompt_reading']['en' if not prefix else 'zh']),page)
        self.assertFalse(any(p.startswith('zh/media/') for p in self.outputs))
        build.validate_outputs(self.outputs)

    def test_sitemap_and_analytics_include_chinese_pages(self):
        sitemap=self.outputs['sitemap.xml']
        self.assertEqual(sitemap.count('<loc>'),50)
        for path in ['zh/compose/','zh/learn/glossary/','zh/cases/AS-010/']:
            self.assertIn(self.data[0]['url']+path,sitemap)
            self.assertIn('"'+path+'"',self.outputs['index.html'])


if __name__=='__main__':unittest.main()
