# 指南、词典、分类、路线与 UI 交叉语义审校

审校日期：2026-10-21。范围为本 checkout 的 8 篇 `content/guides/*.json`、`content/terms.json`、`content/taxonomy.json`、`content/learning.json` 和 `content/ui.json`。本轮仅修改本审校记录，未编辑被审文件。

本轮由未起草这些字段的 agent 逐项对读中文与英文，重点核对艺术术语、否定与限制范围、作品与作者专名、媒介不确定性、视觉效果与真实材料的区别，以及 UI 所陈述的功能。不是独立人工或专家审校。未重复外部艺术史事实调查，也不把字段齐全当成语义准确的证据。

## 实际检查范围

- 8 篇指南：410 对文本，包含完整定义、识别问题、变化、混淆边界、9 张参考图及元数据、64 个特征的提示词／标签／说明／观察依据和 8 组避免项。
- 词典：102 对文本，包括 48 个名称、48 个解释、5 组名称与 1 段总说明。
- 分类：48 对维度、类别与筛选值名称；特别检查 Nihonga、ukiyo-e、Arts and Crafts、Mid-century Modern、厚重笔触与真实 impasto 技法的界限。
- 学习路线：14 对文本，包括名称、概述、8 个观察问题和4个练习步骤。
- UI：214 对文案，包括导航、筛选、详情、历史提示词、创作器、失败提示、复制、隐私说明与插值文本。
- 共逐项阅读 788 对；重复特征说明也对照了其提示词字段，未只检查唯一字符串。

## 建议修订

### 1. 把“方向不同”加强成了“方向相反”

- 路径：`content/guides/expressionism.json` → `features[6].evidence.en`
- 中文：`直视的眼神与偏转的头部方向不同，增添敏感而紧张的感受。`
- 当前英文：`The direct gaze opposes the direction of the turned head, adding a sensitive, tense feeling.`
- 问题：`opposes` 比“不同”更强，额外断言了方向相反。
- 建议：`The eyes look directly at the viewer while the head turns aside, adding a sensitive, tense feeling.`

### 2. “干净”与“光滑”不是同一个表面特征

- 路径：`content/ui.json` → `表面是干净、干涩、颗粒化，还是有可见笔触？.en`
- 中文：`表面是干净、干涩、颗粒化，还是有可见笔触？`
- 当前英文：`Is the surface smooth, dry, grainy, or marked by visible brushwork?`
- 问题：`smooth` 对应光滑，不能覆盖“干净”的整洁／无多余痕迹含义。
- 建议：`Is the surface clean, dry, grainy, or marked by visible brushwork?`

### 3. 保留“动作”的范围不宜统一缩为静态 poses

- 路径：8 篇 `content/guides/*.json` 的 `avoid.en`；`content/ui.json` → `动作及物件关系.en`；另见 `expressionism.json` 和 `nihonga.json` 的 `features[0].en`、`features[0].explanation.en`。
- 中文分别为：`不改变原图的动作与物件关系`、`动作及物件关系`、`在保留身份与动作的前提下……`、`保留原有动作……`。
- 当前英文分别用：`poses`、`Poses and relationships between objects`、`Preserve identity and pose…`、`Preserve the original pose…`。
- 问题：绘画语境中 pose 可表达姿态，但“动作”还包括人物正在进行的行为；保留约束需要覆盖该含义，与 AS 案例里的 `actions` 一致。
- 最小修订：在上述保留约束处用 `actions` 代替 `poses/pose`。也可统一为 `actions and poses`，但应将中文同步明确成“动作与姿态”。描述具体作品的“姿态”则继续使用 pose，不做全局机械替换。
- 实现提醒：`assets/core.js` 的 preservation id `relationships` 也有 `Preserve poses and relationships between objects`。若采用该修订，需要同步组装出的英文提示词；本轮未修改此代码文件。

### 4. “柔和的印刷色”不应表达成柔和地执行印刷

- 路径：`content/guides/art-nouveau.json` → `variations.en`
- 中文：`可以是柔和的印刷色，也可以是鲜明的装饰配色。金线、金箔、圆形花框都是可选变化，不是定义。`
- 当前英文：`Colors can be softly printed or brightly decorative. Gold lines, gold leaf and circular floral frames are optional variations, not defining requirements.`
- 问题：`softly printed` 把色彩的视觉性质写成印刷动作的方式；容易使读者理解为工艺要求。
- 建议：`The palette can be soft and print-like or vividly decorative. Gold lines, gold leaf and circular floral frames are optional variations, not defining requirements.`

### 5. 小标题的对象发生了替换

- 路径：`content/ui.json` → `从作品到应用.en`
- 中文：`从作品到应用`
- 当前英文：`From observation to application`
- 问题：从“作品”变成了“观察”，意思接近，但不是同一对象。
- 建议：`From artwork to application`。

## 已确认一致及可选术语检查

- learning 的 8 个问题与相应 guide 的问题一致；否定、可选变化、不是同一分类层级等限定均保留。
- 日本画与美人画／浮世绘的区别、极简不等于矢量媒介、图像外观不证明实际工具、Moebius 黑白样例不意味着作者只画黑白等边界完整。
- 原作名称、版权、日期与媒介的双语信息相符；阅读译名与原题的呈现方式不同，但未发现含义冲突。未将中文本地化名称误记为正式英文标题。
- taxonomy 与 UI 保留了“未核实”“视觉借鉴”“非整流派定义”等限制。统计说明中的 14 个月、未采集内容、不开启广告及 User-ID 等中文条件在英文中完整。
- 初次读取 `terms[39].meaning.en` 时为 `layered colors`；再次读取时已由负责 agent 修订成 `Broad shapes, carved lines and relationships between separately printed colors`，后者能体现“套色”，不再列为待改。
- 可选名称收敛：`terms[3].name` 的“新艺术人物”对应 `Art Nouveau Figure Painting`。`Painting` 比中文泛指的人物艺术略窄，尤其本站入口是彩色石版海报；若严格保持媒介范围，可用 `Art Nouveau Figure Art`。同类“人物”词条可在术语表中统一规则，但不应把明确的“日本画人物／水粉人物”等名称机械改掉。此项属于命名范围精度建议，不是已确认作品归属错误。
