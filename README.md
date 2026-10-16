# 美术风格图鉴

[打开网站](https://carbonshow.github.io/art-style-atlas/) · [人物画风入门](https://carbonshow.github.io/art-style-atlas/learn/portrait/)

面向美术初学者与 AI 创作爱好者：看到作品，理解风格，比较案例，选择特征，再带着提示词去创作。

本仓库是网站代码与可公开风格内容的唯一维护入口。私人照片、个人创作记录及内部来源档案留在私人资料库；不要将整份私人档案或会话导出复制到这里。原有离线图鉴是历史资料，不再与网站持续同步。

## 内容目录

- `content/guides/`：每篇风格指南一个 JSON，说明共性、变化、识别线索与作品证据。
- `content/cases/`：每组参考案例一个 JSON，保留 AS-001 至 AS-010 标识、逐图品鉴、已公开对照和出处。
- `content/taxonomy.json`：独立的风格与传统、参考题材、画面效果分类，以及七个特征维度。
- `content/terms.json`：48 个探索词。它们不是 48 个已完成的风格指南。
- `content/learning.json`：人物入门路线，引用内容标识，不复制指南全文。
- `content/media.json`：公开媒体路径、尺寸与 SHA-256 摘要。
- `media/`：公开参考媒体；旧文件名和地址继续保留。
- `templates/`、`assets/`、`scripts/`：页面模板、浏览器代码与 Python 静态构建。
- `data/`、各页面 `index.html`、`sitemap.xml` 和 `.build-manifest.json` 为构建输出，不直接编辑。

## 本地构建与检查

Python 3.9+，构建使用标准库，无第三方运行依赖。Node.js 18+ 仅用于交互逻辑测试。

```sh
python3 scripts/build.py
python3 -m unittest discover -s tests
node --test tests/core.test.cjs
python3 scripts/build.py --check
git diff --check
python3 -m http.server 8000 --bind 127.0.0.1
```

浏览 `http://127.0.0.1:8000/`。不要用 `file://` 打开：目录检索与提示词按需加载 JSON。检查首页、组合筛选、详情大图、改绘滑块、中英文提示词、手机布局和旧链接 `/#AS-001`。

`--check` 不写文件：核对内容和媒体，检查全部内部链接、锚点，以及输出是否与源码同步。新增媒体后按 `content/media.json` 格式登记尺寸和 SHA-256；不得修改摘要来放行私人图片。构建程序保留已排除图片的摘要阻断规则。

## 新增或修改一条内容

1. 在对应内容目录中复制一条同类型 JSON，使用新的稳定标识及同名文件。案例延续 AS 编号；指南用英文短标识。
2. 填写名称、中英文别名、艺术家、摘要、独立分类、来源和具体作品。没有足够作品证据时，先作为词典探索词。
3. 为七个维度分别填写 `features`：通俗标签、解释、观察依据、中文与英文创作描述。互斥项使用同一个 `group`，最多一项 `default: true`。不要让特征自动引入参考作品中的人物或道具。
4. 用 `relations` 标明“代表作品”“变体”或“视觉借鉴”。不要把相似外观当作历史归属；“油画般质感”也不代表核实了真实材料。
5. 加入经过公开范围核对的媒体及清单。原图保持完整画幅、署名与水印；图片版权不因进入仓库而转移。开放许可与未明确开放的参考图分别依其来源约定使用。
6. 构建后条目自动进入风格库、搜索索引和提示词选择器。需要加入人物路线时，在 `content/learning.json` 添加标识。

浏览器仅组装已编写的描述，不调用生成模型、不上传图片。自由输入不会被翻译，切换语言与恢复推荐特征都保留用户的文字要求。

## 发布

GitHub Pages 继续从 `main` 分支的仓库根目录发布，`.nojekyll` 保留。生成文件须随源码一起提交。网页不依赖 Sites 或其他托管服务。

固定流程：修改内容 → 构建与检查 → 本地浏览并查看发布差异 → 提交推送 → 查看 Pages 部署 → 核对线上页面。

提交格式为 `feat|fix|docs|refactor|chore(scope): 简短描述`。推送前先确认远端没有新提交；不要强制推送。发布后记录提交 SHA 和部署结果。需要回退时，对发布提交执行 `git revert <sha>`，推送回退提交并重新核对部署，避免改写历史。

## 来源与更正

指南说明与具体画面观察分开，逐图保留来源与归属说明。尚未核实的对照图不计为相关艺术家的原作。若有错误或希望移除图片，请通过 [Issues](https://github.com/carbonshow/art-style-atlas/issues) 提供页面链接与依据。
