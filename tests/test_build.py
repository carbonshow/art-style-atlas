import copy
import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('build', Path(__file__).resolve().parents[1]/'scripts/build.py')
build = importlib.util.module_from_spec(spec)
spec.loader.exec_module(build)

class PublicContentChecks(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = build.load()

    def assertInvalid(self, change, message):
        data = copy.deepcopy(self.data)
        change(data)
        with self.assertRaisesRegex(ValueError, message):
            build.validate(data)

    def test_current_content_and_all_links(self):
        build.validate(self.data)
        build.validate_outputs(build.render(self.data))

    def test_duplicate_identifier_is_rejected(self):
        self.assertInvalid(lambda d: d[-1].append(d[-1][0]), '重复内容标识')

    def test_missing_image_is_rejected(self):
        self.assertInvalid(lambda d: d[-1][0].update(cover='media/missing.webp'), '缺少封面')

    def test_invalid_relationship_is_rejected(self):
        self.assertInvalid(lambda d: d[-1][0]['relations'].append({'id':'missing','relationship':'视觉借鉴'}), '无效内容关联')

    def test_private_nested_field_is_rejected(self):
        self.assertInvalid(lambda d: d[-1][0]['references'][0].update(source_thread='internal'), '私人字段')

    def test_local_path_is_rejected(self):
        self.assertInvalid(lambda d: d[-1][0].update(summary='/Users/example/private.png'), '私人姓名、路径')

    def test_private_name_fingerprint_is_rejected_without_storing_the_name(self):
        sample = 'privateperson'
        fingerprint = (len(sample), build.hashlib.sha256(sample.encode()).hexdigest())
        build.PRIVATE_VALUE_HASHES.add(fingerprint)
        try:
            self.assertInvalid(lambda d: d[-1][0].update(summary='A '+sample+' example'), '私人姓名、路径')
        finally:
            build.PRIVATE_VALUE_HASHES.remove(fingerprint)

    def test_conflicting_recommendations_are_rejected(self):
        self.assertInvalid(lambda d: d[-1][0]['features'][-1].update(default=True), '互斥组')

    def test_excluded_media_digest_is_rejected(self):
        digest = next(iter(self.data[4].values()))['sha256']
        build.FORBIDDEN_HASHES.add(digest)
        try:
            with self.assertRaisesRegex(ValueError, '已排除的私人媒体'):
                build.validate(self.data)
        finally:
            build.FORBIDDEN_HASHES.remove(digest)

    def test_broken_internal_link_and_fragment_are_rejected(self):
        for url in ['missing/', '#not-here']:
            with self.assertRaises(ValueError):
                build.validate_outputs({'index.html':'<a href="'+url+'">broken</a>'})

    def test_original_case_ids_and_media_are_preserved(self):
        ids = {x['id'] for x in self.data[-1] if x['type']=='case'}
        self.assertEqual(ids, {'AS-%03d'%i for i in range(1,11)})
        case4 = next(x for x in self.data[-1] if x['id']=='AS-004')
        self.assertNotIn('examples',case4)
        self.assertEqual(len(case4['references']),4)
        self.assertEqual(len(self.data[2]['terms']),48)

    def test_analytics_requires_a_real_id_and_https_production_url(self):
        for measurement_id in ['', 'G-XXXXXXXXXX', 'G-EXAMPLE', 'G-TEST', '</script>']:
            self.assertInvalid(lambda d: d[0].update(analytics={'enabled':True,'measurement_id':measurement_id}), 'Measurement ID')
        self.assertInvalid(lambda d: d[0].update(analytics={'enabled':'true'}), '布尔值')
        for url in ['http://example.com/', 'https://example.com/no-slash', 'https://example.com/?q=secret']:
            self.assertInvalid(lambda d: d[0].update(url=url,analytics={'enabled':True,'measurement_id':'G-A1B2C3D4E5'}), 'HTTPS URL')

    def test_analytics_is_optional_and_all_pages_supply_safe_metadata_before_site_js(self):
        data = copy.deepcopy(self.data)
        data[0].pop('analytics', None)
        for path, text in build.render(data).items():
            if not path.endswith('.html'): continue
            parser = build.Links()
            parser.feed(text)
            self.assertIn('analytics-settings', parser.ids)
            self.assertIn('"enabled": false', text)
            self.assertLess(text.index('assets/analytics.js'), text.index('assets/site.js'))
            self.assertNotIn('googletagmanager.com', text)
            self.assertIn('strict-origin-when-cross-origin', text)

if __name__=='__main__':unittest.main()
