# 美术风格图鉴项目术语表

版本：`atlas-terminology-v1`；核对日期：2026-10-21。面向美术初学者与 AI 创作爱好者。此表约束项目的中英表达，不能单凭一个词为图片认定作者、历史归属、真实媒介或制作软件。

## 使用规则与依据等级

- 展示标准名以当前 `name.zh` / `name.en` 为准。`english_name`、`aliases` 和词典 `query` 为保留检索入口；艺术家名、旧译名和关联题材能帮助检索，但不是风格的同义定义。
- 泛指人物艺术的词典入口采用 **Figure Art**：`term-01`、`02`、`03`、`04`、`05`、`07`、`38`。明确绘画、素描或插画语境的条目保留 **Painting / Drawing / Illustration**；“人物”不机械改成 Portrait，Portrait 用于原文的肖像。
- **[P] = 项目命名约定**。48 个探索词并非同一层级的艺术分类；未逐项取得外部术语依据的条目明确标 P，不宣称已完成独立艺术史核验。已核对词根或有关作品也不等于整个组合名称、简介或所有搜索结果都获官方认证。参见[词典源码][P]、[指南与词典审校记录][R1]、[名称范围交叉审校][R2]。
- **S01—S15** 是本轮实际读取的一手资料；下文逐项写明它们支持的范围。S14、S15 来自[后五案例审校记录][R3]中已执行的核对，本表未重新打开这些页面。S13 已补充读取 PDF 正文的相关词项；不是把搜索结果当成全书复核。未成功访问的 Tate 页面不作为本表来源。
- 同义句可以按语言自然表达，但数字、对象范围、否定强度和不确定性必须相同。原题、署名、版权主体保留原语言；没有官方译名时用阅读译名标识。

## 八个指南方向

下表名称与当前指南 JSON 一致。来源主要支持具体作品、作者与媒介信息；指南标题、观察角度与面向初学者的组织方式由项目编写。

| 指南 ID | 中文标准名 | 英文标准名 | 适用语境与边界 | 保留检索名／别名 | 已核对依据 |
|---|---|---|---|---|---|
| `art-deco` | 装饰艺术 | Art Deco | 艺术与设计风格；以 Lempicka 人物绘画观察几何体块，不把金黑配色等同整个风格。 | 莱姆皮卡；蓝碧嘉；Lempicka；装饰艺术运动 | [S01] |
| `art-nouveau` | 新艺术 | Art Nouveau | 历史艺术与设计运动；以 Mucha 海报观察自然形态与曲线，花框和金色并非必备。 | 穆夏；Mucha；新艺术运动 | [S02]、[S03] |
| `expressionism` | 表现主义人物 | Expressionist Figure Painting | 本指南聚焦 Schiele 人物绘画，因此保留 Painting；词典的泛指入口另用 Figure Art。 | 席勒；Schiele；表现主义 | [S04] |
| `fantasy-comics` | 幻想漫画线描 | Fantasy Comics Linework | 叙事与视觉语言；以 Arzach 角色线描观察线条，不把所有清楚墨线都叫 Ligne claire。 | Fantasy Comics（旧英文名）；墨比乌斯；莫比斯；Jean Giraud；Arzach；Arzak；欧洲幻想漫画 | [S05] |
| `mid-century` | 世纪中叶现代主义插画 | Mid-century Modern Illustration | 20 世纪中叶的设计语境；Mary Blair 概念设计只是观察入口。 | 玛丽·布莱尔；玛丽布莱尔；Mary Blair；20 世纪中叶现代主义；中世纪现代主义插画（仅纠错检索，禁作标准名） | [S06]、[S07] |
| `minimalism` | 极简人物插画 | Minimalist Figure Illustration | 视觉信息的简化方法；平整表面不证明用了矢量软件。 | 马利卡·法夫尔；Malika Favre；极简插画；负空间；Minimalist Vector Portrait | [S08] |
| `nihonga` | 日本画人物 | Nihonga Figure Painting | 日本画传统中的人物绘画；不等于所有日本绘画，也不与美人画或浮世绘互换。 | 上村松园；上村松園；Uemura Shoen；日本画；美人画 | [S09]、[S10] |
| `painterly-portrait` | 笔触写实肖像 | Painterly Realist Portrait | 本项目的观察型名称，强调可信形体与可见笔触；不命名独立历史画派。 | 萨金特；萨金特写实肖像；古典写实油画；Sargent | [S11] |

“中世纪现代主义插画”仅保留为旧错误译名的检索入口，正确标准名始终是“世纪中叶现代主义插画”。同样，搜索别名 `Minimalist Vector Portrait` 不代表已确认 Malika Favre 参考图的矢量制作媒介。

## 48 个探索词标准名称

每条均记录当前展示名、原有探索范围与实际 `query`，没有改写检索词来迁就展示名。P 链接直接指向词典源码；相关来源只补充该行明确写出的核对范围，逐段审校见 [R1]。

| ID | 中文标准名 | 英文标准名 | 本项目探索范围 | 保留检索词 | 依据与状态 |
|---|---|---|---|---|---|
| `term-01` | 巴洛克人物 | Baroque Figure Art | 戏剧性的明暗与人物姿态 | `Baroque Portrait` | [P]：项目命名约定 |
| `term-02` | 前拉斐尔派人物 | Pre-Raphaelite Figure Art | 文学题材、细密描绘与象征细节 | `Pre-Raphaelite Portrait` | [P]：项目命名约定 |
| `term-03` | 象征主义人物 | Symbolist Figure Art | 象征性形象与心理联想 | `Symbolist Figure Painting` | [P]：项目命名约定 |
| `term-04` | 新艺术人物 | Art Nouveau Figure Art | 自然曲线与装饰秩序 | `Art Nouveau Portrait` | [P]；方向见 [S02]、[S03] |
| `term-05` | 装饰艺术人物 | Art Deco Figure Art | 几何秩序与摩登形体 | `Art Deco Portrait` | [P]；作品语境见 [S01] |
| `term-06` | 野兽派肖像 | Fauvist Portrait | 主观而鲜明的色彩 | `Fauvist Portrait` | [P]：项目命名约定 |
| `term-07` | 表现主义人物 | Expressionist Figure Art | 主观形体与情绪表达 | `Expressionist Figure Painting` | [P]；作品及流派标注见 [S04] |
| `term-08` | 立体主义肖像 | Cubist Portrait | 拆解形体与多视角组织 | `Cubist Portrait` | [P]：项目命名约定 |
| `term-09` | 新客观主义肖像 | New Objectivity Portrait | 冷静描绘与现实观察 | `New Objectivity Portrait` | [P]：项目命名约定 |
| `term-10` | 素人艺术肖像 | Naïve Art Portrait | 非学院化的比例与空间表达 | `Naive Art Portrait` | [P]；词根及其他中文译名见 [S13] |
| `term-11` | 中国工笔人物 | Chinese Gongbi Figure Painting | 精细线描与层层设色 | `工笔人物画` | [P]：项目命名约定 |
| `term-12` | 中国白描人物 | Chinese Baimiao Figure Drawing | 以线条组织形体 | `白描人物画` | [P]：项目命名约定 |
| `term-13` | 中国写意人物 | Chinese Xieyi Figure Painting | 概括笔墨与人物神态 | `写意人物画` | [P]：项目命名约定 |
| `term-14` | 敦煌壁画人物 | Figures in Dunhuang Murals | 衣带、姿态与壁画设色 | `Dunhuang Figure Painting` | [P]：项目命名约定 |
| `term-15` | 陈洪绶人物 | Chen Hongshou’s Figure Painting | 古拙造型与富于个性的比例 | `陈洪绶 人物画` | [P]：项目命名约定 |
| `term-16` | 浮世绘美人画 | Ukiyo-e Bijin-ga | 美人题材与版画的平面语言 | `Ukiyo-e Bijin-ga` | [P]：项目命名约定 |
| `term-17` | 日本画人物 | Nihonga Figure Painting | 日本画传统中的人物题材 | `Nihonga Figure Painting` | [P]；具体日本画作品见 [S09]、[S10] |
| `term-18` | 新版画美人画 | Shin-hanga Bijin-ga | 新版画语境中的人物与光色 | `Shin-hanga Bijin-ga` | [P]：项目命名约定 |
| `term-19` | 日本剧画 | Japanese Gekiga | 叙事分镜与较写实的人物表现 | `Gekiga Manga Art` | [P]：项目命名约定 |
| `term-20` | 法比漫画 | Franco-Belgian Comics | 地区与出版传统，涵盖多种画法 | `Franco-Belgian Comics` | [P]：项目命名约定 |
| `term-21` | 清晰线条风格 | Ligne Claire | 均衡清楚的轮廓与易读空间 | `Ligne Claire Illustration` | [P]：项目命名约定 |
| `term-22` | 美式漫画 | American Comics | 宽泛出版传统，可继续按作者细分 | `American Comic Book Art` | [P]：项目命名约定 |
| `term-23` | 高对比黑白漫画 | High-contrast Black-and-white Comics | 大块黑形与有选择的细节 | `Mike Mignola Ink Art` | [P]：项目命名约定 |
| `term-24` | Moebius 幻想漫画 | Moebius Fantasy Comics | 精密线描与幻想形体 | `Moebius Character Art` | [P]；作者和系列见 [S05] |
| `term-25` | 复古日本动画 | Retro Japanese Animation | 时代语境中的角色比例与设色 | `90s Anime Character Design` | [P]：项目命名约定 |
| `term-26` | 少女漫画 | Shōjo Manga | 装饰版面与人物情绪 | `1970s Shojo Manga Art` | [P]：项目命名约定 |
| `term-27` | 美国动画现代主义 | American Modernist Animation | 图形概括与平面设计 | `UPA Animation Style` | [P]：项目命名约定 |
| `term-28` | 另类漫画 | Alternative Comics | 独立叙事与多样个人语言 | `Alternative Comics Art` | [P]：项目命名约定 |
| `term-29` | 黄金时代插画 | Golden Age Illustration | 出版插画的历史观察入口 | `Golden Age Illustration` | [P]：项目命名约定 |
| `term-30` | 世纪中叶现代主义插画 | Mid-century Modern Illustration | 20 世纪中叶的色块与形状设计 | `Mid-century Modern Illustration` | [P]；Mary Blair 语境见 [S06]、[S07] |
| `term-31` | 编辑肖像插画 | Editorial Portrait Illustration | 为文章观点服务的肖像设计 | `Editorial Portrait Illustration` | [P]：项目命名约定 |
| `term-32` | 极简矢量肖像 | Minimalist Vector Portrait | 少量色块与清楚轮廓；媒介需另核实 | `Minimalist Vector Portrait` | [P]；相关图像见 [S08]，不据此确认矢量媒介 |
| `term-33` | 图形化角色设计 | Graphic Character Design | 用形状节奏建立角色识别 | `Graphic Shape Character Design` | [P]：项目命名约定 |
| `term-34` | 绘画感角色概念设计 | Painterly Character Concept Art | 可见笔触与角色形体 | `Painterly Character Concept Art` | [P]：项目命名约定 |
| `term-35` | 风格化写实角色 | Stylized Realist Characters | 可信体积与选择性的比例概括 | `Stylized Realism Character Art` | [P]：项目命名约定 |
| `term-36` | 手绘角色艺术 | Hand-painted Character Art | 手绘表面与角色设计的组合 | `Hand-painted Character Art` | [P]：项目命名约定 |
| `term-37` | 风格化 3D 角色 | Stylized 3D Characters | 立体造型、渲染与表面分别观察 | `Stylized 3D Character Art` | [P]：项目命名约定 |
| `term-38` | 波普超现实人物 | Pop Surrealist Figure Art | 流行图像与超现实联想 | `Pop Surrealism Portrait` | [P]：项目命名约定 |
| `term-39` | 木刻肖像 | Woodcut Portrait | 刀刻形状与印刷边缘 | `Woodcut Portrait` | [P]；woodcut 词根见 [S13]；实际木版实例见 [S14] |
| `term-40` | 油毡版画肖像 | Linocut Portrait | 块面、刻线与套色关系 | `Linocut Portrait` | [P]：项目命名约定 |
| `term-41` | 蚀刻肖像 | Etched Portrait | 细密线条与明暗排线 | `Etching Portrait` | [P]：项目命名约定 |
| `term-42` | 丝网印刷肖像 | Screenprinted Portrait | 分色与平整色面 | `Screenprint Portrait` | [P]：项目命名约定 |
| `term-43` | Riso 孔版印刷肖像 | Risograph Portrait | 叠色与印刷颗粒 | `Risograph Portrait` | [P]；Risograph 工艺范围见 [S12] |
| `term-44` | 粉彩肖像 | Pastel Portrait | 干性擦痕与柔和边缘 | `Pastel Portrait` | [P]；pastel 词根见 [S13] |
| `term-45` | 水粉人物 | Gouache Figure Painting | 不透明色面与概括笔触 | `Gouache Figure Painting` | [P]；gouache 词根见 [S13] |
| `term-46` | 厚涂肖像 | Impasto Portrait | 颜料堆叠与可见笔触 | `Impasto Portrait` | [P]；impasto 词根见 [S13] |
| `term-47` | 炭笔人物 | Charcoal Figure Drawing | 明暗大形、擦抹与线性痕迹 | `Charcoal Figure Drawing` | [P]：项目命名约定 |
| `term-48` | 拼贴肖像 | Collage Portrait | 剪切形状、材料对比与重组 | `Collage Portrait` | [P]：项目命名约定 |

`Naïve art` 的本项目显示名保留“素人艺术”，允许“稚拙艺术／天真艺术”作释义性别名；`Naive` 是不带变音符的既有检索拼写。[S13] 支持后两种中文译名，不代表它把“素人艺术”确定为唯一译名；不要据此把所有自学者作品或 Outsider art 自动并入同一类别。

## 技法、媒介与判断限定

以下“项目约定”指本站写作和翻译规则，须结合具体原文使用。S 类来源用于标明已读到的标准词或馆藏材料，不为所有未知图片补上工艺结论。

| 中文／用途 | 首选英文 | 允许替换与适用边界 | 依据 |
|---|---|---|---|
| 造型；形体；形状 | Form and Shape；form；shape | 维度名保留 Form and Shape；体积结构用 form，平面形状用 shape。 | [分类源码][T]；[S13] 的 form 词项 |
| 轮廓；剪影 | contour；silhouette | outline 可用于一般外轮廓或描边；silhouette 用于整体外形的平面读法，不机械替换 contour。 | 项目约定；[R2]、[R4] |
| 笔触；肌理 | brushwork；texture | 单个笔痕可用 brushstroke / stroke；painterly 表示可见绘画处理，不能证明实体颜料或具体软件。 | [S13] 的 brush strokes / brush work；[R1] |
| 不透明干刷 | opaque dry-brush marks | 干刷与粉彩般擦痕可分别写 dry-brush marks / pastel-like scuffs；有“效果／般”时保留该限定。 | 项目约定；[前五案例审校][R5] |
| 排线 | hatching | 仅当原文或画面明确交叉排线时才用 cross-hatching。 | [S13] 的 hatching；项目范围规则 |
| 版画质感 | printmaking-like texture | print-like appearance 可用于较一般的印刷／版画观感；**不是 woodcut 的同义词**。 | [R5] 中 AS-004 修订 |
| 木刻；木版画 | woodcut；woodblock print | 属于具体技法／作品类别；仅来源确认时用于实际材料说明，不能从毛糙轮廓或刻线般效果倒推。 | [S13] 的 woodcut / wood-block；[S14] 的实际馆藏木版画 |
| 油毡版画；蚀刻；丝网印刷 | linocut；etching；screenprint / screenprinting | 与木刻分别使用；上述词典的完整肖像标题仍以第 3 节为准。本次没有为这些词逐项新增外部工艺核验。 | [P]；项目约定 |
| Riso 孔版印刷 | Risograph printing | Riso / Risograph 可作检索别称；Risograph 使用孔版原理，不代表所有 stencil printing。 | [S12] |
| 水粉；粉彩 | gouache；pastel | 不透明水彩为 gouache 的可用解释；项目沿用“水粉”。粉彩不自动译为油画棒／oil pastel。只描述外观时用 gouache-like / pastel-like。 | [S13] 的 gouache / pastel；项目用词选择 |
| 厚涂（实际技法） | impasto | “厚重笔触”仅用 heavy brushwork；只见厚涂外观可用 impasto-like texture。**Heavy Brushwork 筛选标签和其内部 `impasto` ID 不证明实际厚涂。** | [S13] 的 impasto；[T]；[R3] 的 AS-008 修订 |
| 油彩般质感 | oil-paint-like texture | 油画媒介已核实时可写 oil painting / oil on canvas；视觉比较保留 -like。 | [S11] 的真实布面油画；[R5] 的 AS-005 |
| 金箔效果；金线 | gold-leaf effect；gold lines | golden outlines 可指金色轮廓；gold leaf 只有在明确实际材料时才省略 effect / -like。 | [R5] 的 AS-001；项目约定 |
| 彩色石版画 | color lithograph | British spelling colour lithograph 可作来源原文；不替换为 woodcut。 | [S02] |
| 胶合板油画；木板油彩与不透明颜料；绢本设色；布面油画 | oil on plywood；oil and opaque color on wood；color on silk；oil on canvas | 按各自馆藏记录保留材料，不把 opaque color 擅改为 gouache。 | [S01]、[S04]、[S09]、[S11] |
| 留白；负空间 | open space / blank space；negative space | 一般空场按语境选 open / blank space；强调形与周边空白互补关系时用 negative space。 | [S13] 的 negative space；[R1]、[R2] |
| 空气透视；缩短透视 | atmospheric perspective；foreshortening | aerial perspective 可作前者别名；后者不是泛指近大远小，也不是所有夸张透视。 | [S13] 对应词项；[R4] 的 AS-010 |
| 有限配色；色相；色阶 | limited palette；hue；tonal values / value | 保留色相而只改色阶不等于换配色；value 为绘画明暗值语境，避免误写 hue。 | [T]；[R1]、[R5]；项目约定 |
| 平涂；色面 | flat color；color fields / color areas | color shapes 强调色块作为形状；平涂或平整表面不证明矢量软件。 | [R1]、[R2]；项目约定 |
| 工艺美术 | Arts and Crafts | 在运动语境中可写 Arts and Crafts movement；不泛译为 arts and crafts 手工活动。 | [S03] 中与 Art Nouveau 的关联 |
| 浮世绘；浮世绘风 | ukiyo-e；ukiyo-e-inspired | 后者保留“视觉借鉴”限定，不能改为历史归属认证。 | [R3]、[R4]；[S14]、[S15] 仅支持背景作品 |
| 武者绘 | musha-e (warrior prints) | 首次出现保留括号解释；术语写法按项目约定，不能把当代武侠角色认作历史版画人物。 | 项目约定；[R3]、[R4]；[S15] 的历史英雄题材背景 |
| 新中式插画 | Contemporary Chinese-style Illustration | 保留 -style；不是泛指当代中国插画或对作者国籍的判断。 | [T]；[R4] 的 AS-009 |
| 原作；复现图；AI 改绘 | original artwork；reproduction；AI reinterpretation | reproduction 不自动证明为原作者作品；AI reinterpretation 不改标为 original artwork。 | [R3]、[R4]；项目约定 |
| 视觉借鉴；历史归属 | visual influence / visual borrowing；historical affiliation / classification | `-inspired`、`-like` 和 visual influence 不可省成确定属于某艺术运动；“相关内容”链接也不是归属证据。 | [界面源码][U]；[R2]、[R4] |
| 动作；姿态 | actions；poses | 保留约束中的“动作”用 actions；原文“姿态”用 poses。分析线条传达运动感时 movement 可按语境使用，不做全站机械替换。 | [U]；[R2]、[R4] |
| 未核实；未标明 | unverified；not stated / not specified | 未核实不是错误／伪作；未标明只是所用来源没有给出该信息。待补材料不可自动补成常见媒介。 | [R1]、[R3]、[R5] |
| 发布者；作者；署名可读 | posted by；artist / creator；a readable signature / name | 发布账号、用户标注、可读姓名与来源对应是不同证据，不互换。 | [R3]、[R4]、[R5] |
| 阅读译文；历史执行原文 | Reading translation (not the executed text)；original execution prompt | `execution_prompt` 原样保留；`execution_prompt_reading` 供阅读。未核实的作品、题签或诗题译名不伪称官方标题。 | [U]；[R3]、[R4]、[R5] |
| 避免；不追求；减少 | avoid；without aiming for；reduce | 保留否定和强度差别；“不追求写实高光”不能强化为绝不出现高光，“减少”不改为禁止。 | [R4] 的 AS-010；项目约定 |

## 已核对来源与维护

来源核对日期为本轮工作日期，不把历史网页的更新时间当成作品创作时间。这里不列未读来源，也不把链接存在当作内容已核对。

| 编号 | 实际查阅来源 | 支持范围及核对记录 |
|---|---|---|
| S01 | [Centre Pompidou · Jeune fille en vert][S01] | 原题／别题、[1927–1930]、油画／胶合板、版权署名及页面 Art Déco 标签；见 [R1]。 |
| S02 | [Mucha Foundation · Rêverie][S02] | 1898、彩色石版画及原题；不把这张海报的特征当作全部新艺术定义；见 [R1]。 |
| S03 | [V&A · Art Nouveau – an international style][S03] | 国际运动、自然形态与线条，以及与 Arts and Crafts 的关联；见 [R1]。 |
| S04 | [Leopold Museum · Self-Portrait with Chinese Lantern Plant][S04] | 题名、1912、木板油彩与不透明颜料、Expressionism 标签；见 [R1]。 |
| S05 | [Moebius 官方 Arzak 页面][S05] | 作者与系列名称；不确认单张角色图年代或媒介；见 [R1]。 |
| S06 | [The Walt Disney Family Museum · Mary Blair 图像索引][S06] | 只读提取并核对 PDF 第 1 页的两幅概念图题名、日期与署名；该页未说明材料；见 [R1]。 |
| S07 | [The Walt Disney Family Museum · MAGIC, COLOR, FLAIR][S07] | Mary Blair 展览与概念设计语境；不把展览中提及的通用媒介自动赋给每张图；见 [R1]。 |
| S08 | [Malika Favre · New Yorker covers][S08] | The Laureate、The New Yorker、2016；不确认原图软件或矢量制作；见 [R1]。 |
| S09 | [东京艺术大学大学美术馆 · 2009 馆藏展][S09] | 上村松園《序の舞》、1936、绢本设色；见 [R1]。 |
| S10 | [东京艺术大学大学美术馆 · 2018 美人画展][S10] | 展览题名与东京、关西的美人画发展语境；见 [R1]。 |
| S11 | [National Gallery of Art · Nonchaloir (Repose)][S11] | 1911、布面油画、非正式人物习作、馆藏编号与公共领域说明；见 [R1]。 |
| S12 | [RISO · Digital Duplicating Technology][S12] | Risograph 与孔版原理的关系；见 [R1]。 |
| S13 | [香港教育局《视觉艺术科学与教常用英汉辞汇》][S13] | 本次补读 PDF 相关词项：Art Nouveau、brush strokes/work、atmospheric perspective、form、gouache、hatching、foreshortening、impasto、naïve art、negative space、pastel、woodcut / wood-block。仅用于词项对照，不宣称全 64 页逐条审校；地区译名与本项目选词区别见上表。 |
| S14 | [The Met · Under the Wave off Kanagawa][S14] | 北斋馆藏英文题名与真实木版画媒介；查阅记录为 [R3]，不用于证明当代参考图归属。 |
| S15 | [British Museum 经 Google Arts & Culture · 国芳英雄版画][S15] | Water Margin 英雄版画的历史背景；查阅记录为 [R3]，不用于证明四张当代武侠图的作者或工艺。 |

维护时先修改对应内容源，再核对术语表。凡增加历史归属、媒介、年代、作者或官方译名结论，须读到可支持该结论的来源；若只有项目命名理由，继续标为 P。更新原文或译文后，重做受影响条目的语义对照，并更新审校记录；成对字段检查和名称比对只证明结构／同步情况。

本次生成表项后已逐一核对：8 个指南标准名、48 个词典标准名及 48 个保留 query 与当前内容完全一致。未修改内容 JSON、构建或浏览器代码。

[P]: ../../content/terms.json "项目命名约定与现行词典"
[T]: ../../content/taxonomy.json "现行分类与维度"
[U]: ../../content/ui.json "现行界面文案"
[R1]: guides-review.md "指南与词典审校"
[R2]: cross-review-guides-ui.md "指南、词典与界面交叉审校"
[R3]: cases-late-review.md "后五案例翻译审校及实际读取来源"
[R4]: cross-review-late-cases.md "后五案例交叉审校"
[R5]: cases-early-review.md "前五案例翻译审校"
[S01]: https://www.centrepompidou.fr/fr/ressources/oeuvre/c9nb7x4
[S02]: https://www.muchafoundation.org/en/gallery/browse-works/object_type/decorative-designs/object/78
[S03]: https://www.vam.ac.uk/articles/art-nouveau-an-international-style
[S04]: https://onlinecollection.leopoldmuseum.org/en/object/528-self-portrait-with-chinese-lantern-plant/
[S05]: https://www.moebius.fr/Arzak
[S06]: https://www.waltdisney.org/sites/default/files/Mary-Blair-Image-Index-Final.pdf
[S07]: https://www.waltdisney.org/exhibitions/magic-color-flair-world-mary-blair
[S08]: https://www.malikafavre.com/pages/new-yorker-covers
[S09]: https://museum.geidai.ac.jp/exhibit/2009/07/collection200907.html
[S10]: https://museum.geidai.ac.jp/exhibit/2018/bijinga/bijinga_ja.htm
[S11]: https://www.nga.gov/artworks/35080-nonchaloir-repose
[S12]: https://www.riso.co.jp/english/tech_portal/dd.html
[S13]: https://www.edb.gov.hk/attachment/tc/curriculum-development/kla/arts-edu/resources/va-curri/visual_arts_glossary20171206.pdf
[S14]: https://www.metmuseum.org/art/collection/search/39799
[S15]: https://artsandculture.google.com/asset/utagawa-kuniyoshi-the-wrestler-roshi-ensei-a-colour-woodblock-print/rAGE5oXDDiv5Og?hl=en
