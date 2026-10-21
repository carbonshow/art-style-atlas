# AS-006—AS-010 中英翻译审校记录

审校日期：2026-10-21。范围仅为五条公开案例 JSON 与本记录。执行方式为同一智能体的全文翻译、逐段中英对照、英文单独通读和修订；不声称经过独立人工复核。

## 覆盖范围

所有展示文本均成对保存。新增 515 个展示用双语字段；另逐条复核 40 组特征提示词、5 组 avoid 与 5 组 legacy_prompts，并增加 1 份历史执行提示词的完整阅读译文。26 张主要参考、3 张未核实对照、36 段分析、16 个来源标题以及公开改绘案例的 3 条观察均保留完整信息。

| 案例 | 新成对展示字段 | 分析段落 | 主要参考 | 未核实对照 | 特征组 | 来源标题 |
|---|---:|---:|---:|---:|---:|---:|
| AS-006 | 96 | 6 | 3 | 1 | 8 | 5 |
| AS-007 | 140 | 6 | 6 | 2 | 8 | 5 |
| AS-008 | 90 | 8 | 5 | 0 | 8 | 3 |
| AS-009 | 110 | 8 | 8 | 0 | 8 | 1 |
| AS-010 | 79 | 8 | 4 | 0 | 8 | 2 |

## 对照后修正的具体问题

- AS-006：旧英文标题增加了中文名没有的 Rhythmic，现展示名与“秋色风景”一致，旧 english_name 仍是共享搜索别名。完整提示词恢复“整张”“短笔触”“橙红”“树冠”“连续等距刻槽”等限定，不把“后印象派式”提升为历史归属。
- AS-006：保留 Autumn 的裁切事实、DailyArt 的二手资料地位和缺少登记号的说明；Festive Autumn 使用 AGO 现行题名，Autumn in the Northland 仅作复现品检索名。旋纹森林仍为作者、媒介、制作方法和 AI 情况未知的独立对照。
- AS-007：旧英文提示词把“庄严”处理成 grandeur，并略去水中具体反射对象，现分别恢复 solemnity 及山树／建筑／亮天。图 7、8 未进入风格提示词的边界保留。
- AS-007：哈佛竖幅 Lander’s Peak 与大都会横幅、MFA 的 The Buffalo Trail 与 NGA 的同类题名、Haggin 的 Sunset 与 Birmingham 的 Looking Down Yosemite Valley 均继续明确区分，尺寸和登记号不互用。拍卖记录不能确认当前持有人。
- AS-007：历史 execution_prompt 未覆盖、未改标点或空白。execution_prompt_reading.en 保留原英文，zh 完整译出用途、图片角色、主要请求及全部具体不变项，包括 20:9、4080:1836、底部约五分之一、飞机位置、楼群细节和天气限制；阅读译文不会冒充实际执行原文。
- AS-008：新展示名 Hidden Worlds in Bloom 对应“繁花秘境”，旧 Ornamental Dream Gardens 留作别名。保留 1、2、4 按用户标注、3 匹配官网、5 仅另有可读姓名的不同证据等级，未把统一画风当作者认证。
- AS-008：补足“大形后分层安排小纹样”和“三尺度中的小点线”，恢复亮色焦点的位置与数量控制。既有英文 heavy oil-paint impasto 比“厚重油画笔触”更具体，改成 heavy oil-painting-like brushwork；正文不据外观认定水粉、丝网印刷、拼贴或数字软件。
- AS-009：英文名与“古诗山水”对齐；旧英文提示词补足 classical Chinese poetry 与“参考仅提供视觉语言”。“蓝灰”不用较窄的 slate blue；“荷塘”保留 lotus pond；补足水面“只用”疏朗细纹与颗粒“不覆盖细节”。
- AS-009：明确八个诗题的英文仅为阅读译名。诗人题注不等于插画作者，作者、原帖、媒介、软件及 AI 均未核实；“长卷”只描述观看节奏，八张仍是竖幅海报。原先对乌衣巷、枫桥夜泊装饰性盖过诗意的批评未弱化或省略。
- AS-010：统一 ukiyo-e-inspired 与 musha-e (warrior prints)。四人仍属于金庸武侠，Water Margin 仅用于国芳的历史比较；未把馆藏背景链接写成附件出处。Hokusai 作品采用馆方英文题名，不把浪纹相似升级为直接摹写。
- AS-010：旧提示词 full aspect ratio 不足以表达“完整画幅”，改为 complete frame；原英文 martial heroes 将“不新增人物”缩窄，birds 将“雕”扩大，现分别为 people 与 eagles。删去英文独有的局部纹理约束，按中文恢复“主体细节与安静背景之间”的疏密关系；保留不改姿势、只在原动作与近景物件支持时增强尺度的前提。
- AS-010：题签英文是阅读释义，不伪称官方书名、招式译名或作品题名；杨过独臂设定不能凭遮挡确认的提醒保留。
- 全部案例：可读的 attribution_basis/title_status 改为双语说明；ID、kind、维度、互斥组、默认值、媒体、URL、日期、来源编号、aliases、tags 与 english_name 保留。观察、判断、出处与实际材料的边界不相互替代。

## 本次查阅的原始来源

仅以下页面进行了本次在线复核。其余来源及历史图片对应结论按原稿记录保留；没有冒称本次重新逐像素比对所有附件，也没有确认原稿仍标为未核实的归属。

- [AGO · Festive Autumn](https://art.ago.ca/objects/3776/festive-autumn)：核对英文题名、1921、oil on canvas、76.4 × 91.7 cm 与 AGOID.104085。
- [Haggin Museum · Sunset in the Yosemite Valley](https://hagginmuseum.org/collections/bierstadt-albert/sunset-in-the-yosemite-valley/)：核对题名、1868、oil on canvas 与 36¼ × 52¼ in.。
- [Smithsonian · Valley of the Yosemite](https://americanart.si.edu/exhibitions/humboldt/online/albert-bierstadt-valley-yosemite)：核对 1864、oil on paperboard、11⅞ × 19¼ in.、MFA 和 47.1236，保留厘米为近似换算。
- [Peggy Nille · Cachés dans les rêves](https://www.peggynille.com/copie-de-caches-dans-la-mer)：核对书名和 Actes Sud Junior 出版背景，不推断插画创作年份或媒介。
- [British Museum via Google Arts & Culture · 国芳英雄版画](https://artsandculture.google.com/asset/utagawa-kuniyoshi-the-wrestler-roshi-ensei-a-colour-woodblock-print/rAGE5oXDDiv5Og?hl=en)：核对 Water Margin 英雄系列的历史背景，不用于证明四张武侠图的归属。
- [The Met · Under the Wave off Kanagawa](https://www.metmuseum.org/art/collection/search/39799)：核对馆方英文题名以及该馆藏确为木版画；附件本身仍只描述视觉借鉴。

## 检查结果与复核指纹

已完成：五个 JSON 解析、scripts/i18n.py 的 validate_pairs 检查、基线逐字段对比、原文数字 token 保留检查、历史执行文本与 HEAD 的逐字节等值检查、目标文件 git diff --check。基线对比确认中文正文没有删减；中文改写仅为把公开显示的归属状态码解释为可读说明。除这些说明外，实际修改的旧文字仅为审校后的英文提示词。所有媒体、来源 URL 与结构值均保持原值。

全站构建、浏览器切换状态及手机/桌面展示由主线程集成验证，本分工未单独运行整站构建。

以下为 scripts.i18n.digest 的规范化 JSON SHA-256。任一内容更新后，必须重新逐段对照并更新该条记录；哈希只能证明审校覆盖的版本，不能证明译文语义正确。

| 案例 | 审校版本 SHA-256 |
|---|---|
| AS-006 | `2dfa50bce586fc60336cb6fd284d867ecb2a2fb608b2c819ad87cbba112addf7` |
| AS-007 | `000a8d26e95f3fc5801f6ffc084b3793ea82e5c2c402b38719d5a98b3b4b36f5` |
| AS-008 | `8541c4a74d73528355d512bede68d9e5053b61ce4ee80dc9acb21008930fabd5` |
| AS-009 | `40dfe7c1a012c72e9375f8003012bc09850be78efbf9c935d3df8d7a8389db44` |
| AS-010 | `249b14cd4215f4c19eb1567eaee6c9fd2c836e9c67dc9cd5b05261c8367d7645` |

AS-007 历史执行提示词 UTF-8 SHA-256：`7fca184d85f32641e65ddc3f0176a7a8907d46853bcbfedeaafab30d1c5798d3`。
