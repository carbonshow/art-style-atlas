# 指南、探索词与学习路线双语审校记录

审校日期：2026-10-21（Asia/Shanghai）
版本：`guides-i18n-v1`
方式：Codex 完整读取原文、逐段中英对照、修改既有英文提示词、英文单语通读，再做结构校验；不是独立人工终审。
基线提交：`fc1379ac7f2cf42ed6e719729574503e9cab64ba`

## 覆盖与结果

- 8 篇指南全部正文、24 条识别问题、9 幅参考图的说明与元数据；没有将正文概括为短摘要。
- 48 个探索词的名称与解释、5 组词典分组、分类与 7 个特征维度、8 步学习路线和 4 条练习、站点标题与描述。
- 新增 504 组展示用 `{zh,en}` 字段；审校 64 组既有特征提示词与 8 组避免项。54 条特征英文经修订，10 条保留。8 条避免项统一把题字译为 inscriptions，保留人物、建筑、道具、动作与物件关系的全部限制。
- 公开范围、ID、分类 ID、所有关系、媒体与来源 URL、原始检索 query、既有别名、english_name、版本号和日期字段不变。数字日期的展示标签在两种语言中保留同一日期；“约”“馆藏记录”“未注明媒介”等限定完整翻译。
- 按当前 source JSON 逐项检查，展示字段全部有两种语言；64 个特征的中文提示词保持原文，术语、否定与限定逐项对照。学习路线问题直接采用对应指南的同一双语值。

## 发现与修订

| 位置 | 发现 | 已落实修订 |
|---|---|---|
| 新艺术线条 | 原英文没有“粗细有节奏” | 补入 rhythmically varied thickness，并保留随形转折 |
| 新艺术空间 | 原英文的 balanced flat rhythm 弱化了“疏密有序” | 改为 flat rhythm of orderly dense and open areas |
| 装饰艺术造型与光影 | 原英文未明确几何体块，controlled gradients 弱化连续渐变 | 明确 geometric volumes、continuous tonal gradients；未把几何化归为立体主义 |
| 幻想漫画 | 原英文未明确细墨线，阅读路径被泛化为可读性 | 补入 fine ink lines 与 clear visual path；媒介未标明、黑白不是作者全部实践的边界完整保留 |
| 日本画设色 | 原英文遗漏“避免颜色平均争夺注意” | 补回完整限制；姿态描述不再替换为更窄的 silhouette |
| 日本画定义 | 中文“美人画是人物题材”不够具体 | 中英同步明确为描绘美丽女性的人物题材，不等同于 Nihonga |
| 日本画来源题名 | 原两条来源标签与所链页面实际展览题名不符 | 依据馆方页面同步改正；2018 展览的“東西”明确为日本东西部；英文标为展览题名阅读译文 |
| 世纪中叶 | Mid-century 易误成中世纪；材料未标明 | 保留 20 世纪中叶与中世纪的明确区分；不从哑光手绘外观推断水粉媒介 |
| 极简插画 | 平滑表面容易被误读为矢量制作 | 中英都保留“不能据此判断软件或媒介”；参考图刊名日期保留、不进入创作提示词 |
| 笔触写实 | 原英文省略“大比例”“减少零碎高光”的精度 | 明确 overall proportions 与 reducing scattered highlights；保留晚期非正式人物习作的范围 |
| 作品标题与署名 | 既有中文页有未本地化的英文说明；译名可能被当成官方名 | 保留原作标题及版权主体；中文译名标注为译名，英文无已核实官方译名时注明 reading translation；提供方、捐赠与公共领域说明本地化 |
| term-43 | 原中文“孔版印刷”比 query 的 Risograph 范围更宽 | 中文改为“Riso 孔版印刷肖像”，英文为 Risograph Portrait；query 保持原值 |
| 分类 | effect ID `impasto` 不能证明真实厚涂媒介 | 展示标签按原文“厚重笔触”译为 Heavy Brushwork；真正的媒介词条 term-46 才使用 Impasto |

## 核对来源与边界

以下均为本次读取的一手来源。作品视觉观察仍按网站原有文字翻译，未由一般风格资料推定具体作品材料或历史归属。

| 条目 | 来源与核对事项 |
|---|---|
| Art Deco | [Centre Pompidou 馆藏记录](https://www.centrepompidou.fr/fr/ressources/oeuvre/c9nb7x4)：原题、别题、[1927–1930]、胶合板油画与图片署名。英文标题附阅读译文，不替换法文原题。 |
| Art Nouveau | [Mucha Foundation](https://www.muchafoundation.org/en/gallery/browse-works/object_type/decorative-designs/object/78)：Rêverie、1898、彩色石版画；[V&A](https://www.vam.ac.uk/articles/art-nouveau-an-international-style)：历史运动、自然形态与流动线条的语境。 |
| Expressionism | [Leopold Museum](https://onlinecollection.leopoldmuseum.org/en/object/528-self-portrait-with-chinese-lantern-plant/)：官方英文题名、1912、木板油彩与不透明颜料、馆藏编号。未擅改为 gouache。 |
| Fantasy Comics | [Moebius 官网](https://www.moebius.fr/Arzak)：Arzak/Arzach 与作者；网页没有给这幅角色图的具体年代或媒介，继续明确未标明。没有使用页面互相冲突的系列年代说明为此图断代。 |
| Mid-century | [馆方 PDF 图像索引，第 1 页](https://www.waltdisney.org/sites/default/files/Mary-Blair-Image-Index-Final.pdf)：两幅概念图原题、1951 与约 1951、提供方、捐赠与 © Disney。网页工具受文件大小限制，随后只读获取 PDF 并提取首页文本核实；未落盘外部媒体。[馆方展览页](https://www.waltdisney.org/exhibitions/magic-color-flair-world-mary-blair)核对展览与概念设计语境。 |
| Minimalism | [Malika Favre 官网](https://www.malikafavre.com/pages/new-yorker-covers)：The Laureate、The New Yorker、2016；不从商品版画或光滑图形推断原图制作媒介。 |
| Nihonga | [东京艺术大学 2009 馆藏展](https://museum.geidai.ac.jp/exhibit/2009/07/collection200907.html)：上村松園《序の舞》、1936、绢本设色；[2018 展览页](https://museum.geidai.ac.jp/exhibit/2018/bijinga/bijinga_ja.htm)：展览原题与东京、关西的美人画语境。 |
| Painterly Portrait | [National Gallery of Art](https://www.nga.gov/artworks/35080-nonchaloir-repose)：Nonchaloir (Repose)、1911、布面油画、捐赠、馆藏编号与公共领域；馆方说明它是非正式人物习作。 |
| Risograph | [RISO 技术说明](https://www.riso.co.jp/english/tech_portal/dd.html)：Risograph 使用孔版原理，但不代表所有孔版工艺。 |
| Naïve art | [香港教育局视觉艺术词汇表](https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/arts-edu/resources/va-curri/visual_arts_glossary20171206.pdf)：英文标准写作 naïve art；中文存在“天真艺术／稚拙艺术”等译名。条目保留既有“素人艺术”称呼，不替换为 Outsider art。Tate 页面本次返回 403，未记为已读取依据。 |

9 幅图的作者和历史信息采用已给来源；没有增加新的作者、媒介、年代或许可判断。作者原名、原作标题、官方机构名、版权主体等允许以原语言保留；画面中的题字、署名与水印未改动。

## 复核与版本

已运行：JSON 全量解析；每个展示字段的成对非空检查；基线递归对比（ID、URL、媒体、别名、枚举、日期、顺序与原中文提示词不变）；48 条词典及 8×8 特征计数；`git diff --check`。构建、浏览器功能、视觉与统计回归由集成任务执行，本记录不把这些检查记为已完成。

以下散列覆盖本次审校版本。任何源文或译文变化都须重新做该条目语义审校，再更新散列；程序配对检查不等于语义审校。

| 文件 | 新增展示语言对 | 审校后文件 SHA-256 |
|---|---:|---|
| `content/guides/art-deco.json` | 41 | `23da91ba2d4d06dc337346403cbe29fa0849adf4c5e339c3a6ab22a9793e4fd7` |
| `content/guides/art-nouveau.json` | 42 | `951d667a78b92de58b1b14c9b42a4896ce3b061f1aa46c254408537dd8ca8d59` |
| `content/guides/expressionism.json` | 41 | `4759b8c314cadafcdecac13792dae1ffb07f0039a7f1bad36874f01fbfd53c2a` |
| `content/guides/fantasy-comics.json` | 41 | `8c8066f1f52297cc1a4aa83855b48062e66d2ce50c37282c7a952484d2f91fb6` |
| `content/guides/mid-century.json` | 49 | `a64f5a8ed095f30d31294b289cea8492d2c916c25cb31aa71eb6c65de7f7d62c` |
| `content/guides/minimalism.json` | 41 | `c4b0aac818f44f096c850967d2f18d448ee6b1f8b4632d7d22a99e8d2de108f5` |
| `content/guides/nihonga.json` | 42 | `0058356224e2e6095ac1e1034fd3c28ee88b889c6893ddf5ec9dead6c2c305ec` |
| `content/guides/painterly-portrait.json` | 41 | `b2ccf198ceb9ccc790cc09092028d5abe5d1e18709b40d90425bf57a74d453e7` |
| `content/terms.json` | 102 | `bc7a71969d0c80abfe96e7e1fba389c5b0dfe3f6c889d52589ad7f4bf464115d` |
| `content/taxonomy.json` | 48 | `947c41fb99fd491ebf219e4d1b40e419bf4a101b609a072711b768216e49b01c` |
| `content/learning.json` | 14 | `30abf753681e2cf030b20077d5943ba6635817d0d8ecf1bf6168352f7605858b` |
| `content/site.json` | 2 | `3a798555d48ba9a7bada220022506b7bce44e2466589ac26cc5a7cfba9ac873e` |

词典每条按排序键、UTF-8、无额外空白的 JSON 计算 SHA-256；共同审校版本均为 `guides-i18n-v1`。

| 条目 | 中英名称 | 条目 SHA-256 |
|---|---|---|
| term-01 | 巴洛克人物 / Baroque Figure Painting | `564b95d20c4d8a75186ab1b540f8715d3a071ffa112886ee6064baa71542ef4c` |
| term-02 | 前拉斐尔派人物 / Pre-Raphaelite Figure Painting | `ace69c8be783bc8f1ea626fb8bdf1a447add73ec992ed8b8e53ef0a23528e2cd` |
| term-03 | 象征主义人物 / Symbolist Figure Painting | `d67bd6f64c5e623bfdffc8a6f8a1b6bbb790f2cbaa7b1fb774951692b68c0d68` |
| term-04 | 新艺术人物 / Art Nouveau Figure Painting | `106f3eabb13217ed30c4803ede52e21ac978fc9e6db86da33257d4de717c3265` |
| term-05 | 装饰艺术人物 / Art Deco Figure Painting | `a6aed8adabe76ec3dac46265eaed5d700a7a710bb659c3e63a1abfee5047b1d5` |
| term-06 | 野兽派肖像 / Fauvist Portrait | `81726809018f9f9f469d613170a1328168ff2f4722482d40ea0ff84e17e520c6` |
| term-07 | 表现主义人物 / Expressionist Figure Painting | `a382a30ba16d8ac33af181e08c65a11568a1c62363dd9bfcfada7c33850c6eae` |
| term-08 | 立体主义肖像 / Cubist Portrait | `51a2e3e0e93389c8ff34381d0d785a578a89b813564fb793824066d2f134f095` |
| term-09 | 新客观主义肖像 / New Objectivity Portrait | `873844089db5e802ba5f44fdf680a3c60c2751d77b13dc67d7ba05539897abab` |
| term-10 | 素人艺术肖像 / Naïve Art Portrait | `bec31f67b026ae25e0093d75703653c2454c5b0c66db79313ea0447a5dbd110e` |
| term-11 | 中国工笔人物 / Chinese Gongbi Figure Painting | `f3ec90ef4a02b6fa60c22f1cd5a0031ccb45c4b65e7e04818c40922a8e5f475c` |
| term-12 | 中国白描人物 / Chinese Baimiao Figure Drawing | `21220cce669d296154765ca72ba362f582750cadbbb5f0fa6fe2dca3139cb4ef` |
| term-13 | 中国写意人物 / Chinese Xieyi Figure Painting | `ad8d5d7255da4835fe851d667388dae7314ebbcd13c955b0193f550cb8fb4b27` |
| term-14 | 敦煌壁画人物 / Figures in Dunhuang Murals | `81ae2ca730ac9e832e33b3e83cd9ac433daf3cb3c0daa81b4fc92530b202837e` |
| term-15 | 陈洪绶人物 / Chen Hongshou’s Figure Painting | `086d4361579da3abc374b2b6b40d33678c112741e0f3212c169f769ac341b14d` |
| term-16 | 浮世绘美人画 / Ukiyo-e Bijin-ga | `6de821db1080660b4ac6ea22ddea6eea8ac2814336b69a8d8c305a7a3194ed13` |
| term-17 | 日本画人物 / Nihonga Figure Painting | `f43b7204f6d010e6445dcd50cbd2c45bd153651f1016d84093487b0a894df08a` |
| term-18 | 新版画美人画 / Shin-hanga Bijin-ga | `59c96cea0d7aae4f7b22d0f739f2a493fd6c8be2a786deaa5552aeac80bce53c` |
| term-19 | 日本剧画 / Japanese Gekiga | `54c6ad1117b9bf20d0d574da6b28c40220042addf1bed386d49c36a54893af49` |
| term-20 | 法比漫画 / Franco-Belgian Comics | `98be3ce165b5ec499a685fe628cac2e27dbb5fb1a9d453642f879cd042c86236` |
| term-21 | 清晰线条风格 / Ligne Claire | `e00a6d98732e6437195f58c17480cceba9e9e10a27d765bb7acf66a6dc4eab6a` |
| term-22 | 美式漫画 / American Comics | `3a73c7e602c7dadaf2d5e6dbefd135f78cb0ba15a93c7fe4a0dc485bc5ecf019` |
| term-23 | 高对比黑白漫画 / High-contrast Black-and-white Comics | `6f088e633a879bf40e1b0c61a5d41077cadadcb41141c0e8e2869b81e461f177` |
| term-24 | Moebius 幻想漫画 / Moebius Fantasy Comics | `f3992c179bd688341bf0d4c0e05458b74e8275b1fe464ff7505f4c406b525c78` |
| term-25 | 复古日本动画 / Retro Japanese Animation | `dafc061f7bf728ee3d57e2872d6bd0b253944b7eb1c56ae9071de17997239f65` |
| term-26 | 少女漫画 / Shōjo Manga | `367331cfce2e0235a060c51d4499f128bbdc10371041383abb3790e0eb2ebd61` |
| term-27 | 美国动画现代主义 / American Modernist Animation | `a363ab65dfce8895525d3c8c75f2792166d70e5d6854f8cbb9cc7ce17b7c018d` |
| term-28 | 另类漫画 / Alternative Comics | `1f38be900820b527e74ab9e2ae4aef9415d0e9791c33449d5f4416b258d7d63b` |
| term-29 | 黄金时代插画 / Golden Age Illustration | `3d3a23acf2a0ada1a7f67131b1287569bf3da2aa5097b892483a9fcbf8f47ec0` |
| term-30 | 世纪中叶现代主义插画 / Mid-century Modern Illustration | `809e808ea959869e61de4d3fc75908bb71df2173ba1eb5acdeb9486b8ebb24b2` |
| term-31 | 编辑肖像插画 / Editorial Portrait Illustration | `bace0f1e7b3d0f2ffb6b3e68ad0b6b9291cbb264b38e53c23f05d96c81ab858c` |
| term-32 | 极简矢量肖像 / Minimalist Vector Portrait | `f9e72ebc8b78949130a029ad8ed1259dd518b7a55ecf9b05d9fadb2a58c1e2da` |
| term-33 | 图形化角色设计 / Graphic Character Design | `a89c6fbfd6c471cf5f4a866eab304e1b79f87523688d1fe835e775c40b8c3d31` |
| term-34 | 绘画感角色概念设计 / Painterly Character Concept Art | `813c276e7107d851caf56cc17f786e4fca1543647d2fcbf48225718f79aa4b3d` |
| term-35 | 风格化写实角色 / Stylized Realist Characters | `e8ed19e7a4cfab538969ffeff257555536d3ee4e7f4b7b834334646e55818bc0` |
| term-36 | 手绘角色艺术 / Hand-painted Character Art | `b978cebfaebd75e47ad009cc462c3a57e73e49e38ede4f0c80b2fa5faefee528` |
| term-37 | 风格化 3D 角色 / Stylized 3D Characters | `2438c2c60484aa51fadbc68173d04b1fdeb076a6bc028da63fca134bac901889` |
| term-38 | 波普超现实人物 / Pop Surrealist Figure Painting | `0d3f9475d0553e92cfeb2771a2ba504e72dc772621c8ce01683603a201b2312f` |
| term-39 | 木刻肖像 / Woodcut Portrait | `a26d737dae1b2a19837adb619db6ff3ad9bdfc4b28ca93aba9b1b61f31c227c1` |
| term-40 | 油毡版画肖像 / Linocut Portrait | `830d850fdd49c0c46f348585d71559f8b997f22aa91db43c81d22b9c23636950` |
| term-41 | 蚀刻肖像 / Etched Portrait | `aca7d579e215b77f571529f636778f2384099b8c166d548fe98bd3d1ce4523d0` |
| term-42 | 丝网印刷肖像 / Screenprinted Portrait | `df24e22dd4b372bf42b79e421df13ef26c0444556ed18c33e5ddf74d767e3b4c` |
| term-43 | Riso 孔版印刷肖像 / Risograph Portrait | `f74e27c8298554bf5908c3f7c41de8a7a17de436ad3cd55df57ac11c4afbc2d1` |
| term-44 | 粉彩肖像 / Pastel Portrait | `274614f978b3e8246c0be319ded49c5bdb6504bc06508a9b9e7a95309f8d6cac` |
| term-45 | 水粉人物 / Gouache Figure Painting | `3dc1d6685903f0120477a3e407ce8157b58212a773272e1b79a948be23ff26c2` |
| term-46 | 厚涂肖像 / Impasto Portrait | `cd193d8aa1b93d51b66bdabddda885cf5766395afd8dbbaf1643d7c31d0fe39b` |
| term-47 | 炭笔人物 / Charcoal Figure Drawing | `7d9566b90c7908994739da9d87cf19613c15380d2ddefbcc581da0404a56d616` |
| term-48 | 拼贴肖像 / Collage Portrait | `982c81f97db3dc3be60c381750dc122c2b382590dd59d1eb99033090c2134e21` |
