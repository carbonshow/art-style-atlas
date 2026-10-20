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
node --test tests/*.test.cjs
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

## 访问统计

采用 GA4 标准版，由 `content/site.json` 的 `analytics.enabled` 和 `analytics.measurement_id` 控制。启用时填入本站正式 Web 数据流的真实 `G-…` ID，再构建与发布；缺省或关闭时不加载 Google 脚本。Measurement ID 是公开站点标识，不是 API 密钥。正式主机与路径从 `site.url` 推导，只在相同 HTTPS origin 和站点路径下生效，本地预览不采集。

访客允许后才加载 Google tag（Basic Consent Mode）。选择在本浏览器保存 180 天，页脚“统计设置”可随时撤回；撤回保留创作输入并删除本站 `atlas_ga` / `atlas_ga_<stream ID>` Cookie。Cookie 使用 `atlas` 前缀、host-only domain 和站点路径，避免混用其他项目。存储不可用时选择仅在当前页面生效，脚本被拦截不影响网站功能。

每份 HTML 文档只手动发送一次 `page_view`，BFCache 返回重新计一次。搜索、筛选、分页、切换创作参考、重复点击允许不增加 PV；旧 AS 链接仅计最终页面，404 统一为 `/404.html`。统计在页面逻辑运行前保存净化后的落地地址：仅保留合法的 `utm_source`、`utm_medium`、`utm_campaign`（1—64 位小写英文字母、数字、下划线或短横线），不采集搜索词、提示词及未知参数。外部来源仅保留 origin，站内来源仅保留已知公开路径。

GA4 后台必须同时配置：在“增强型衡量 → 网页浏览量 → 高级设置”中取消“根据浏览器历史记录事件判断的页面更改”，并关闭站内搜索、表单、外链、滚动、视频和下载事件。界面中的“网页加载次数”是不可取消的基础项，由代码的 `send_page_view:false` 关闭自动发送；不要仅凭增强型衡量总开关判断历史事件是否关闭。另外关闭 Google signals、用户提供的数据、广告个性化，不关联广告或启用 User-ID。事件与用户数据保留 14 个月，关闭“新活动重置”。

维护者在本站浏览器控制台执行 `localStorage.setItem('atlas.analytics.disabled', '1')` 后刷新，可排除自己的浏览；恢复使用 `localStorage.removeItem('atlas.analytics.disabled')` 后刷新。只影响当前浏览器，不配置 GA4 永久排除过滤。跨标签页收到撤回或停用时立即停采。

上线验收：先确认未选择和拒绝均无 Google 请求，再允许、刷新、跨页访问，在 Network 核对 `g/collect` 中的 `en=page_view`、净化后的 `dl` / `dr`、正确的 `tid` 和每页次数；在同一 GA4 资源的 Realtime 中核对页面。真实上报受网络、访客选择和拦截影响，不能只凭 HTTP 200/204 宣布后台验收通过。标准报告可能需要 24—48 小时；不永久启用 `debug_mode`。

外部分享示例：[带来源的网站链接](https://carbonshow.github.io/art-style-atlas/?utm_source=x&utm_medium=social&utm_campaign=atlas_intro)。来源字段只写公开渠道与批次，站内链接不添加 UTM。查看“网页和屏幕”“流量获取”“用户获取”“技术详情”，区分 Total users、Active users、Views 等指标，数据只覆盖同意且成功上报的访问。

## 来源与更正

指南说明与具体画面观察分开，逐图保留来源与归属说明。尚未核实的对照图不计为相关艺术家的原作。若有错误或希望移除图片，请通过 [Issues](https://github.com/carbonshow/art-style-atlas/issues) 提供页面链接与依据。
