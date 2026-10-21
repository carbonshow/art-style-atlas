# AS-006–AS-010 交叉语义审校

审校日期：2026-10-21。按 refined 流程的 review 阶段，对已完成译稿逐段进行中英对照及英文阅读。审校者未起草这五份译稿；这是 agent 交叉审校，不代表独立人工或美术史专家审校。本轮仅写本记录，没有修改内容 JSON。

## 实际覆盖

| 条目 | 中英字段对 | 不重复文本对 | 覆盖 |
|---|---:|---:|---|
| AS-006 | 106 | 88 | 完整概述、3 张已对应参考、1 张待核实对照、6 段分析、8 个特征、完整提示词与来源 |
| AS-007 | 151 | 127 | 完整概述、6 张已对应参考、2 张待核实对照、6 段分析、8 个特征、1 组改绘案例、完整历史提示词阅读译文 |
| AS-008 | 100 | 78 | 5 张不同归属核实程度的参考、8 段分析、8 个特征、完整迁移提示词 |
| AS-009 | 120 | 84 | 8 张古诗主题海报、诗人与插画作者区别、8 段分析、8 个特征、完整迁移提示词 |
| AS-010 | 89 | 66 | 4 张人物图、角色身份与题签阅读译文、8 段分析、8 个特征、完整迁移提示词 |
| 合计 | 566 | 443 | 26 张主要参考、3 张待核实对照、36 段分析、40 个特征、5 段完整迁移提示词、1 段历史阅读译文 |

443 对不同文本逐项对读；123 组重复字段以同一中英文本对核对关联路径（例如 analysis 与 feature evidence），没有把重复次数当作额外的独立审校。AS-007 历史执行原文另完整阅读，并逐段对照中文阅读译文。

## 具体建议

### A. 需消除的新增判断与范围偏差

1. **AS-009 `references[1].focus.en`：翠瓦不能增加釉面判断。**
   - 中文：`粉花与翠瓦使画面偏明丽……`
   - 当前：`Pink blossoms and green glazed tiles make the image bright…`
   - 建议：`Pink blossoms and green roof tiles make the image bright…`
   - `glazed` 增加了原文没有的材质／处理判断，且本组明确没有核实制作和媒介。

2. **AS-007 `references[2].alt.en`、`legacy_prompts.en`：霞光不宜统一收窄为日落。**
   - 中文分别为：`金色霞光……`、`柔和霞光……`。
   - 当前分别为：`golden sunset light…`、`soft sunset light…`。
   - 建议分别用 `golden sky glow…`、`soft sky glow…`。这里不应从整个条目的“暮色”主题倒推每个画面／通用提示词都必须是日落；明确写了夕照、晚霞的其他句子可以保留 sunset/evening。

3. **AS-008 `legacy_prompts.en`：白地条件被扩大为任意浅色底。**
   - 中文：`白地场景可让装饰集中于原有边缘和形体……`
   - 当前：`on a light ground, concentrate ornament within existing forms and edges…`
   - 建议：`on a white ground, concentrate ornament within existing forms and edges…`

4. **AS-010 `features[3].en` 与 `features[3].explanation.en`：不追求不等于避免。**
   - 中文：`以平涂为主，局部排线说明体积，不追求写实高光`
   - 当前：`Use mostly flat color with local hatching for volume, avoiding realistic highlights`
   - 建议：`Use mostly flat color with local hatching to describe volume, without aiming for naturalistic highlights`。

5. **AS-010 `features[0].en` 与 `features[0].explanation.en`：动作范围再次被缩为姿态。**
   - 中文：`保持原动作与透视，将主体概括为清楚有力的剪影`
   - 当前：`Keep the original pose and perspective and simplify subjects into clear, forceful silhouettes`
   - 建议：`Keep the original action and perspective and simplify subjects into clear, forceful silhouettes`。此处与早一轮指南交叉审校的 actions/poses 问题一致；描述原文“姿态”的地方仍应保留 pose。

### B. 需补齐的对象和术语一致性

6. **AS-009 `legacy_prompts.en`：砖瓦清单漏了砖。**
   - 中文：`砖瓦、石阶、栏杆、叶脉以节制细线表达。`
   - 当前：`Describe tiles, steps, railings and leaf veins with economical fine lines.`
   - 建议：`Describe brickwork, roof tiles, stone steps, railings and leaf veins with economical fine lines.` 同时补回“石阶”的 stone，避免把具体清单泛化。

7. **AS-009 的“新中式”与 taxonomy 的译名不统一。**
   - 路径：`name.en`、`classification.en`、`recognition.en` 中的分类引号、`legacy_prompts.en` 开头；`sources[0].title.en` 中相同类别也应按统一规则处理。
   - 当前：`Contemporary Chinese Illustration` / `Contemporary Chinese decorative landscape illustration`。
   - taxonomy 已用：`Contemporary Chinese-style Illustration`。
   - 建议统一为 `Contemporary Chinese-style Illustration`，山水时为 `contemporary Chinese-style decorative landscape illustration`。保留“当代采用中式设计语言”的类别含义，避免变成不限定风格的“当代中国插画”。这不是确认了插画作者的国籍或历史流派。

8. **AS-009 `legacy_prompts.en` 花海配色：青绿应保持 blue-green。**
   - 中文：`花海可用桃粉主调和少量青绿……`
   - 当前：`peach-pink masses with small cool-green accents for blossom scenes…`
   - 建议：`peach-pink masses with small blue-green accents for blossom scenes…`，与本条及分类中的青绿对应一致。

### C. 否定范围、阅读译文与英文句法

9. **AS-008 `analysis[0].text.en`（及复用它的 `features[0].evidence.en`）：明确“并非所有细节一起争夺注意”。**
   - 中文：`……避免所有细节争夺注意。`
   - 当前：`…so every detail does not compete for attention.`
   - 建议：`…so the details do not all compete for attention.` 当前 `every … does not` 容易被读成完全没有细节参与吸引注意，否定辖域不稳。

10. **AS-007 `examples[0].execution_prompt_reading.zh`：cloud canopy 不是云顶。**
    - 历史原文：`Keep the layered overcast cloud arrangement and broad dark cloud canopy occupying the upper frame.`
    - 当前阅读译文：`保留层叠阴云的布局，以及占据画面上部的大面积暗云顶。`
    - 建议：`保留层叠阴云的布局，以及覆盖画面上部的大片暗云层。`
    - canopy 指覆盖式的云层，`云顶` 会引出云体顶部这一不同观察对象。实际 `execution_prompt` 不应改动。

11. **AS-009 `references[6].focus.en`：明确的冠词错误。**
    - 中文：`复用重点是把真实观察到的细小动作画清楚……`
    - 当前：`The reusable lesson is to show a actually observed small action clearly…`
    - 建议：`The reusable lesson is to depict a small action actually observed in real life clearly, not mechanically copy grand architecture.` 或最小改成 `an actually observed small action`。

### D. 次要精度建议

- AS-006 `references[1].alt.en` 将“金黄色碎叶”写作 `broken golden leaves`，容易被理解为叶片真的折断。可改为 `golden foliage in small patches`，让“碎”继续指画面色形。
- AS-007 `features[0].en` 与 `features[0].explanation.en` 中，中文“主体轮廓”译作 `silhouettes`，可改 `subject contours`，使 contour 与 silhouette 的项目术语分工一致。
- AS-010 `analysis[1].text.en` 的 `exaggerated perspective must not all be treated…` 不够自然，也容易使否定范围模糊；建议 `Do not treat every instance of exaggerated perspective as a fixed convention of traditional ukiyo-e.`

## 已确认保持一致的重点

- AS-006 的 3 张用户复现、原作与局部画幅区别、DailyArt 二手来源限制、AGO 现行题名和复现品检索用名区分、单独待核实旋纹图等信息都完整。
- AS-007 六张已对应图与两张待核实图分开；哈佛竖幅与大都会横幅、MFA 与 NGA 野牛题材、Haggin 与 Birmingham 的不同作品限制未混写。未把旧拍卖记录升级为当前持有人信息。原作签名与 ArtYouhua 复现品水印明确区分。
- AS-007 历史阅读译文完整覆盖 20:9、4080:1836、底部五分之一城市、建筑／飞机位置与数量、无人物／山／前景植被、原有阴云、禁止增加太阳／改成炽烈日落、必须全幅绘画化等条件。除上述 cloud canopy 用词外，未发现段落或禁用对象遗漏。
- AS-008 用户标注、可见姓名与官网对应三种归属依据未混同；出版年没有当作插画创作年，图像外观没有升级成水粉、丝网印刷、拼贴或软件证明。
- AS-009 保留诗人与插画作者区分、题名阅读译名而非正式作品标题、部分诗句而非全诗、品鉴判断而非已核验事实、禁止强制古代场景／狭长竖幅及原图没有的对象等限制。八组诗题和诗人对应在中英中一致。
- AS-010 保留 Jin Yong／Water Margin 区别、ukiyo-e-inspired 而非历史归属认证、musha-e 及北斋比较不是附件来源证明、真实木版工艺不能凭肌理确定、杨过独臂设定不能靠遮挡确认等边界。没有把近大远小直接误写成 foreshortening。

## 实际校验

- JSON 解析 5 份文件成功。
- AS-007 `execution_prompt` 与 Git HEAD 原记录逐字相等；`execution_prompt_reading.en` 与实际历史执行文本逐字相等。
- 所有双语字段的数字串对照，只有中文日期同时保留两次同年数（约 1867 / about 1867、约 1870 年代 / circa 1870s）在英文合并为一次，以及“三维”对应 3D；这些没有数值差异。
- 本记录 `git diff --check` 通过。上述内容修改由主线程或原译稿负责人整合，并在修改后复核；本审校不声称已执行这些修订。
