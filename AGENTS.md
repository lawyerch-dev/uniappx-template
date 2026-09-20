# AGENTS.md — uni-app x（蒸汽模式）开发规范

本文件约束所有 AI 在此仓库的编码行为。**先读完再动手，写代码前先看"参考标准答案"章节。**

> **AI agent 兼容性**:本文件是项目唯一的规则源。仓库根目录同时存在以下工具的入口文件,均指向本文:
>
> | AI agent | 入口文件 |
> |---|---|
> | Codex、Claude Code、Amp、OpenCode | `AGENTS.md`（本文） |
> | Claude Code | `CLAUDE.md` |
> | Cursor | `.cursorrules` |
> | Windsurf | `.windsurfrules` |
> | GitHub Copilot | `.github/copilot-instructions.md` |
> | Gemini CLI | `GEMINI.md` |
> | Aider | `CONVENTIONS.md` |
>
> 任一文件被工具加载后,实际规则都在本文。**修改规则只改本文件即可,不要在其他入口写各工具特有的规则变体,否则会双源事实**。

## 1. 项目定位（最重要的认知）

- 本工程是 **uni-app x**（uni-app 2.0，`hello-uniapp-x` 演示工程），**不是 uni-app 1.0**。
- 已开启**蒸汽模式（Vapor Mode）**：`manifest.json` 中 `"uni-app-x.vapor": true`、`styleIsolationVersion: "2"`。
- 编译目标：Android / iOS / HarmonyOS 为**原生渲染**（无虚拟 DOM、无 Webview）；小程序与 H5 以 VDOM 方式运行。
- 逻辑层为 JS 驱动（uts2js），但本项目代码规范仍为 **UTS 强类型**写法，必须写全类型标注。

## 2. 文件与语法铁律

| 类型 | 使用 | 禁止 |
|---|---|---|
| 页面/组件 | `.uvue` | `.vue` |
| 逻辑/工具/类型 | `.uts` | 业务逻辑用 `.js` |
| 全局入口 | `main.uts`、`App.uvue` | `main.js`、`App.vue` |

- 页面统一 `<script setup lang="uts">`（仅组合式 API）。**禁止选项式写法、禁止 mixin。**
- 所有变量/函数/参数必须带完整类型标注（`: string`、`: number`、`UTSJSONObject`、`Foo | null`、`T[]` 等），禁止裸 `any`。
- 复杂对象用 `type X = { ... }` 定义，可单独放 `.uts` 类型文件再 `import`。
- 状态优先 `reactive()`（本工程自动化测试依赖其可访问性），计算属性用 `computed((): T => {...})`。
- 对外暴露用 `defineExpose({ ... })`；组件入参用 `defineProps`（见 `components/page-head/page-head.uvue`）。
- 路径别名 `@/` 指向项目根目录。

### UTS 核心约束（高频踩坑，务必遵守）

- 对象字面量默认推断为 `UTSJSONObject`，赋给结构化类型时需 `as T` 显式转换。
- 用 `null` 表示空值，**不支持 `undefined`**；条件语句必须用布尔类型。
- 类型转换仅支持 `as T` 语法；用 `instanceof` / `as` 做类型收窄。
- 不支持变量/函数声明提升（hoisting）；用 `let`/`const`，不用 `var`。
- 不支持命名空间、`enum` 成员仅限数字或字符串、class 不能被当对象用。
- 大段完整 UTS 语言约束见 `.opencode/rules/uts.md`，写 UTS 细节不确定时先读该文件。

## 3. 条件编译

按平台/模式裁剪代码时使用条件编译，**不许靠运行时判断**：

```ts
// #ifdef APP-ANDROID || APP-IOS || APP-HARMONY || WEB || MP-WEIXIN
// #ifndef MP-WEIXIN
// #ifdef VUE3-VAPOR
```

- `VUE3-VAPOR` = 蒸汽模式特有代码；`VUE2`/`VUE3` 是 Vue 版本，不是模式。
- 插件需同时兼容 VDOM/蒸汽时用 `VUE3-VAPOR` 做区分。
- 条件编译同样可用于 `pages.json`、`uni.scss` 等文件。
- 常用平台标识符：`APP`（三个 App 平台）、`APP-ANDROID`、`APP-IOS`、`APP-HARMONY`（鸿蒙）、`WEB`（同 H5）、`MP`（各小程序）、`MP-WEIXIN`。

## 4. CSS 规范（蒸汽模式约束强）

- **仅支持简单 class 选择器与分组选择器**，不支持后代/复杂关系选择器（`.a .b`、`:hover` 等伪类、`>` 组合符）。
- 用 **BEM 命名**表达层级：`.parent__child`（不要写 `.parent .child`）。
- 样式隔离 2.0：**组件默认隔离，页面/全局 CSS 无法影响组件内部**。如需外部影响，在 `<script setup>` 用 `defineOptions({ styleIsolation: 'app' | 'app-and-page' })`。
- 全局变量用 `uni.scss` 中的 `$uni-*` 变量；scss 是编译期方案，可正常使用。
- 优先使用现有类名风格（`.uni-padding-wrap`、`.uni-common-mt`、`.uni-title-text` 等）。
- **文字样式（color、font-size 等）只能写在 `<text>` / `<button>` 上**，其他组件（如 `view`）上无效；文字样式不继承。
- 布局只用 **flex 或绝对定位**，禁用浮动、grid；flex 默认方向为垂直。
- 长度单位仅支持 `px`、`rpx`、百分比（`line-height` 支持 `em`），禁止 `vh`/`vw` 等；`z-index` 仅对同级兄弟节点生效。
- 不使用 `scoped`；CSS 函数仅用 `url()`/`rgb()`/`rgba()`/`var()`/`env()`。

## 5. 组件规则（蒸汽模式差异）

- **拍平 `flatten`**：`view`/`text`/`image` 可加 `flatten` 提升性能。拍平后**不能有事件、不支持 `takeSnapshot`、不支持部分 CSS**（visibility、z-index、background-image、box-shadow inset 等）。不确定就不加。
- `list-view` / `list-item`：
  - `v-for` 必须带 `:key`，否则不复用。
  - `list-item` 必须与 `list-view` 写在**同一个 .uvue 文件**内。
  - 不支持横向滚动；`list-item` 宽度固定 100%；不支持 margin；文字必须包 `<text>`。
- 布尔属性注意：`scroll-view`、`swiper` 等部分组件默认值在蒸汽模式从 `true` 改为 `false`。
- `swiper`：可用 `indicator-class` / `v-slot:indicator` 自定义指示器，支持 3D 轮播与 `auto-height`。
- 组件仅支持 uts 标准模式（native-view 开发方式），不支持旧的"uts 兼容模式"组件。
- **easycom 组件无需 import/注册**，模板可直接用。写代码前先通过 MCP 工具 `Query all components under the project`（或 `uni_modules/`）确认项目可用组件，再决定用哪个。
- 页面可滚动内容必须放在 `scroll-view` / `list-view` 等滚动容器中；需要整页滚动时，template 一级子节点放 `<scroll-view style="flex:1">`。

## 6. API 与原生能力

- 运行时无 DOM/BOM：**禁止 `document`、`window`、`localStorage`、`navigator`、`v-html`**。
- 统一使用 `uni.xxx` 系列 API（`uni.request`、`uni.getStorageSync`、`uni.navigateTo`…）。**禁止编造 API**，使用前查文档或搜项目内现有用法。
- 需要原生能力（线程、原生 UI、系统能力）时走 **uts 插件 / `uni_modules`**，不要试图在 uvue 页面里直接调原生。
- 数据用 `UTSJSONObject` / 结构化类型，避免随意 `JSON.parse` 后当对象用。
- 跨页面通信优先使用 `uni.$emit` / `uni.$on`（eventbus）。

## 7. 参考标准答案（写之前先看）

本项目是官方最佳实践库，**先模仿再创作**：

- 页面组件用法 → `examples/component/`、`examples/API/`、`examples/template/`
- 官方 UI 组件库写法 → `uni_modules/uni-ui-x/`（其组件本身即最佳实现）
- 状态管理 → `store/index.uts`、`composables/useDark.uts`
- 自定义组件骨架 → `components/page-head/page-head.uvue`、`components/boolean-data/`
- 类型定义规范 → `components/enum-data/enum-data-types.uts`

### 官方 AI Rules（DCloud 维护）

`.opencode/rules/` 存放 DCloud 官方 [uni-app-x-ai-rules](https://gitcode.com/dcloud/uni-app-x-ai-rules) 的规则文件：

- `uts.md`（完整 UTS 语言约束，约 2400 行）→ **按需阅读**，写 UTS 细节不确定时先读。
- `core-protocol.md`（opencode 专属 AI 行为协议：DoD、谋定而后动、无人值守）→ opencode 通过 `opencode.json` 常驻。

> ⚠️ 其他 5 份规则已合并到本文（uvue / ucss / conditional-compilation / api / uni-app-x-best-practices）。如需查阅 DCloud 原始版本，从 [uni-app-x-ai-rules 仓库](https://gitcode.com/dcloud/uni-app-x-ai-rules) 直接拉取。

## 8. 业务页面：多语言与多主题（必做）

**`pages/` 下的业务页面默认必须同时支持多语言（i18n）与多主题（深/浅色）。** 示例页（`examples/`）不在此约束内。

### 多语言（官方 vue-i18n）
- 文案统一走 `t('key')`，**禁止硬编码中文/英文**。
- 词典：`locale/zh-Hans.json`、`locale/zh-Hant.json`、`locale/en.json`（同时供 pages.json 的 `%key%` 占位）。
- 初始化：`i18n.uts`（`createI18n`）→ `main.uts` 里 `app.use(i18n)`。
- 页面用法：`import { useI18n } from 'vue-i18n'`，`const { t, locale } = useI18n()`。
- 切换：`setAppLocale(l)`（`@/i18n.uts`，含持久化）；`App.uvue` 已调用 `watchSystemLocale()`。
- `pages.json` 文案（`navigationBarTitleText`、`tabBar.list.text`）：**Web 平台用 `"%key%"` 占位**；App/小程序不支持，需用 `uni.setNavigationBarTitle` / `uni.setTabBarItem` 运行时设置。
- 文档：https://doc.dcloud.net.cn/uni-app-x/i18n.html

### 多主题（官方推荐 @media）
- **优先用 `@media (prefers-color-scheme: light/dark)`**（HBuilderX 5.25+ 蒸汽模式 / Web / 小程序均支持），自动跟随 hostTheme/appTheme，**无需切 class、无闪烁**。
- 语义变量定义在 `common/uni.css` 的 `@media` 块中（`page` 选择器），页面直接用 `var(--*)`，**禁止硬编码颜色**：
  `--page-bg` `--card-bg` `--card-border` `--text-primary` `--text-secondary` `--text-tertiary` `--divider` `--chip-bg` `--accent` `--accent-soft` `--hero-from/--hero-mid/--hero-to` `--shadow-color`
- App 端手动切换：`uni.setAppTheme({ theme: 'light' | 'dark' | 'auto' })`（Web/小程序不支持，跟随宿主）；`manifest.json` 已配 `app.defaultAppTheme: "auto"`。
- `pages.json` 的 tabBar/导航栏颜色走 `theme.json`（`@变量` 引用）。
- 老版动态 class 方案（`.theme-light`/`.theme-dark`）仅为兼容示例页保留，**新页面不要用**。
- 文档：https://doc.dcloud.net.cn/uni-app-x/api/theme-change.html

### 8.5 业务页面：设计系统（iOS HIG 锚点）

**本项目视觉风格基准是 iOS Human Interface Guidelines（HIG）** ——系统感、克制、留白优先。所有业务页面必须按本节规范产出，禁止凭感觉写 px / 字号 / 颜色 / 阴影。

#### 美学锚点（写新页面前先看）

| 维度 | iOS HIG 取值 | 对应 token |
|---|---|---|
| 主色 | 系统蓝 `#007AFF`（与 native nav / tabBar 同源） | `--accent` |
| 主背景 | 极淡灰白 `#F2F2F7` 系列 | `--page-bg` |
| 卡片 | 白底 + 14px 圆角 + 几乎不用阴影（靠层次） | `--card-bg` + `--card-radius` + `--elev-2` |
| 圆角 | 卡片 14 / 按钮 10 / 头像 pill | `--radius-lg` / `--radius-md` / `--radius-pill` |
| 字重 | 不超过 2 种：标题 600、正文 400 | `--type-weight-semibold` / `--type-weight-regular` |
| 阴影 | 弱阴影、深色用更深阴影；默认 none | `--elev-0` ~ `--elev-4` |
| 按压反馈 | `scale(0.97) + opacity 0.7`（约 160ms） | `--press-scale` + `--opacity-press` |
| 间距节奏 | 4 / 8 / 12 / 16 / 24 / 32 | `--space-1/2/3/4/6/8` |
| 字号阶梯 | caption 11 / footnote 12 / subhead 13 / body 15 / callout 16 / headline 17 / title-3 20 / title-2 22 / title-1 28 / large-title 34 | `--type-*` |

#### 字号阶梯（type scale）

页面文字**只能**用以下 10 档之一，禁止 14px / 18px / 19px 等"中间值"：

```text
caption    11px  → 最小注释、tab 角标、版权
footnote   12px  → 次要标签、列表元数据
subhead    13px  → 行尾说明文字
body       15px  → 正文（首选）
callout    16px  → 强调正文
headline   17px  → 列表项标题
title-3    20px  → 卡片大标题（如"我的订单"）
title-2    22px  → 二级页面标题
title-1    28px  → 一级页面标题
large-title 34px → 营销页 hero
```

**字重**：标题用 `--type-weight-semibold` (600)，正文用 `--type-weight-regular` (400)；**禁用 500 / 700 / 800**（iOS 不用过粗字重）。

#### 间距阶梯（spacing scale）

页面间距**只能**用以下 8 档之一，禁止 6px / 10px / 14px / 18px / 20px 等"中间值"：

```text
xs   4px   → 极小间隙（图标与文字）
sm   8px   → 紧凑元素之间
md   12px  → 列表项与列表项
lg   16px  → 卡片 padding、段落间距（最常用）
xl   20px  → 区块间距
2xl  24px  → 大区块间距
3xl  32px  → 页面边距、卡片组间隔
4xl  40px+ → Hero 区域间距
```

**卡片推荐 padding**：`--card-pad-x` (16) 横向 + `--card-pad-y` (12) 纵向。
**页面左右边距**：固定 `--space-lg` (16px)，与卡片对齐。

#### 圆角阶梯（radius scale）

```text
sm    6px   → 小标签、徽章内
md   10px   → 按钮、输入框、小卡片（默认）
lg   14px   → 标准卡片（最常用）
xl   20px   → 大卡片、底部弹出
2xl  28px   → 顶部圆角 hero
pill 999px  → 头像、胶囊按钮
```

#### 动效时长（motion scale）

```text
fast  160ms  → hover / press 反馈
base  240ms  → 卡片入场、状态切换、toast
slow  360ms  → 页面级过渡、模态弹出
ease        → cubic-bezier(0.22, 1, 0.36, 1) — iOS 风格 ease-out
```

**stagger 入场总时长 ≤ 300ms**：超过 300ms 会出现"卡片还没出现"的空白感（见 `LESSONS_LEARNED.md` 卡片 stagger 入场陷阱）。建议：全部用 `--motion-base` + `transition-delay: 0`（无 stagger），或最多 2 段 stagger。

#### 阴影 / 高度（elevation scale）

iOS 风格**弱阴影**，靠背景层次区分而非阴影。卡片默认 `--elev-0`（无阴影），需要悬浮时才用 `--elev-1` / `--elev-2`：

```text
elev-0 none                 → 默认（绝大多数卡片）
elev-1 0 1px 2px ...0.06    → 悬浮小元素
elev-2 0 2px 8px ...0.08    → 卡片悬浮态（推荐）
elev-3 0 8px 24px ...0.10   → 弹层、底部弹窗
elev-4 0 16px 40px ...0.14  → 模态框、悬浮操作面板
```

**规则**：卡片默认无阴影；hover/press 时短暂出现 `--elev-1`，浮动在更高位置的元素用 `--elev-3`。

#### 交互态（state scale）

| 状态 | 推荐表现 | 实现 |
|---|---|---|
| press 按压 | scale(0.97) + opacity 0.7 | `hover-class="xxx--press"` + CSS `transform: scale(var(--press-scale)); opacity: var(--opacity-press)` |
| hover 悬停（指针设备） | 仅背景轻变（`var(--chip-bg)`） | `hover-class="xxx--hover"` |
| disabled 禁用 | opacity 0.4 + `pointer-events: none` | CSS `opacity: var(--opacity-disabled)` |
| loading 加载中 | 不阻塞布局的骨架或 spinner | `<uni-load-more>` 或自家 spinner |

#### 排版规则

- 卡片标题：字号 `--type-title-3` (20) + 字重 600 + 颜色 `--text-primary`
- 列表项：字号 `--type-headline` (17) + 字重 400 + 颜色 `--text-primary`，最小高度 `--list-item-h` (44px)（HIG 最小可点击区域）
- 辅助文字：字号 `--type-footnote` (12) + 字重 400 + 颜色 `--text-secondary`
- 行高：iOS 文本默认 1.4~1.5 倍；标题 1.2~1.3 倍

#### 跨平台兼容性矩阵（核心约束，必看）

**目标平台**：Web / 微信小程序（MP-WEIXIN）/ iOS App / HarmonyOS App（蒸汽模式）。Android App 代码已就绪但暂不发布，需保持兼容。

设计 token 跨平台使用必须遵守下表（数据来源：uni-app x 官方文档，HBuilderX 5.25+ 蒸汽模式为基准）：

| 写法 | Web | 微信小程序 | iOS App | Android App | Harmony App | 备注 |
|---|---|---|---|---|---|---|
| `@media (prefers-color-scheme)` | ✅ | ✅ | ✅ | ✅ | ✅ | **必须用这个**做深色适配，不要切 class |
| `var(--*)` 引用 token | ✅ 4.0+ | ✅ 4.41+ | ✅ 4.11+ | ⚠️ 4.0+ 需 VAPOR 5.25+ 全支持 | ✅ 4.61+ | **不能用 `:root`**，要用 `page` 选择器 |
| `rgba()` 颜色函数 | ✅ | ✅ | ✅ | ✅ | ✅ | token 值优先用 rgba 形式 |
| `transition-timing-function: cubic-bezier(...)` | ✅ | ✅ | ✅ 4.13+ | ✅ 4.13+ | ⚠️ 5.14+ | 保守起见可降级为 `ease`/`ease-in-out` |
| `transition` 简写 + `var()` | ✅ | ✅ | ❌ VDOM / ⚠️ VAPOR 仅长写支持 | ❌ / ⚠️ | ❌ / ⚠️ | **必须展开写** `transition-property`/`-duration`/`-timing-function` |
| `box-shadow` | ✅ | ✅ | ✅ | ✅ | ✅ | hero/卡片默认无阴影，需要时用 `--elev-*` |
| `linear-gradient` / `background-image` | ✅ | ✅ | ✅ | ✅ | ✅ | 但 **`flatten` 节点不支持**，hero 不能加 `flatten` |
| `border-radius` 圆角 | ✅ | ✅ | ✅ | ✅ | ✅ | 用 `--radius-*` |
| `font-size` / `font-weight` | ✅ | ✅ | ✅ | ✅ | ✅ | 仅在 `<text>` / `<button>` 上写 |
| `padding` / `margin` 简写 + `var()` | ✅ | ✅ | ❌ VDOM / ⚠️ VAPOR 长写 | ❌ / ⚠️ | ❌ / ⚠️ | **必须展开** `padding-top`/`-right`/`-bottom`/`-left` |

##### 跨平台写法铁律（写样式前先看）

1. **不要用 `:root` 定义变量**——App 平台不支持。改用 `page` 选择器：
   ```css
   /* ✅ 跨平台 */
   @media (prefers-color-scheme: light) { page { --accent: #007AFF; } }

   /* ❌ App 不支持 */
   :root { --accent: #007AFF; }
   ```

2. **不要写 `transition` / `padding` / `margin` 简写**——App VAPOR 仅长写支持 `var()`：
   ```css
   /* ✅ 跨平台 */
   transition-property: opacity;
   transition-duration: var(--motion-base);
   transition-timing-function: var(--motion-ease);
   padding-top: var(--space-md);
   padding-bottom: var(--space-md);

   /* ❌ App 不生效 */
   transition: opacity var(--motion-base) var(--motion-ease);
   padding: var(--space-md) 0;
   ```

3. **不要把 `linear-gradient` 背景放在 `flatten` 节点上**——`flatten` 不支持 `background-image`：
   ```css
   /* ✅ 跨平台 */
   <view class="hero">...</view>  /* .hero 用 background-image */
   <view class="card" flatten>...</view>  /* flatten 仅用于纯色简单节点 */
   ```

4. **不要写 `--accent-soft: #007AFF10`**——App 平台部分版本不支持 `#RRGGBBAA` 8 位十六进制：
   ```css
   /* ✅ 跨平台 */
   --accent-soft: rgba(0, 122, 255, 0.10);

   /* ⚠️ App 兼容性差 */
   --accent-soft: #007AFF10;
   ```

5. **`transition-timing-function: cubic-bezier(...)` 在 HarmonyOS (VAPOR) 需 5.14+**——若目标设备 HarmonyOS 版本不可控，用枚举 `ease` / `ease-in-out` 替代。

6. **`cubic-bezier()` 不能写在 `transition` 简写里**——同 2，必须分开写。

7. **不要给拍平节点（`flatten`）加 `box-shadow`**——拍平节点不支持部分 CSS。box-shadow 给非拍平节点即可。

8. **hover/press 反馈用 `hover-class` + `transition-property`**，不要用 `:hover` 伪类（蒸汽模式不支持）：
   ```vue
   <view class="card" hover-class="card--press"></view>
   ```
   ```css
   .card { transition-property: transform, opacity; transition-duration: var(--motion-fast); }
   .card--press { opacity: var(--opacity-press); }
   ```

##### 平台能力速查（不要凭感觉）

| 想做的事 | 正确做法 | 错误做法 |
|---|---|---|
| 暗黑主题 | `@media (prefers-color-scheme)` + `var(--*)` | `.theme-dark` 动态切 class（闪烁） |
| 按压反馈 | `hover-class` + `transition-property` + `opacity` | `:hover` 伪类 |
| 入场动画 | `transition-property: opacity, transform` + `--motion-base` | `@keyframes`（App 端 CSS 不支持） |
| 主题切换（App） | `uni.setAppTheme({ theme: 'light'\|'dark'\|'auto' })` | 切 class |
| 跟随系统主题（App） | `manifest.app.defaultAppTheme: "auto"` + `@media` | 手动写 JS 监听 osTheme |
| 跟随宿主主题（Web/小程序） | `manifest.web/mp-weixin.darkmode: true` + `@media` | 手动监听 hostTheme |
| 跨页面状态 | `uni.$emit`/`uni.$on` + `store/index.uts` reactive | props 钻洞 |
| 全局样式 | `common/uni.css` 的 `@media` 块定义 token，页面用 `var(--*)` | 在每个页面硬编码颜色/字号 |
| 深色检测（业务逻辑） | `uni.getAppBaseInfo().appTheme` (App) / `hostTheme` (Web/小程序) | `prefers-color-scheme` JS 监听（不存在此 API） |

#### 禁止的"AI 凭感觉"反模式

1. ❌ 字号用 14px / 18px / 19px（必须从 10 档阶梯选）
2. ❌ 间距用 6px / 10px / 14px / 18px / 20px（必须从 8 档阶梯选）
3. ❌ 圆角用 8px / 12px / 16px（必须从 6 档阶梯选）
4. ❌ 阴影用 `box-shadow: 0 4px 16px rgba(0,0,0,0.1)`（必须从 5 档 elevation 选）
5. ❌ 动画用 `transition: all 0.3s`（必须从 3 档 motion 选，并指定属性）
6. ❌ 用纯紫 `#6d5bff` / 纯粉 `#ec4899` 做主色（用 `--accent` 即 iOS 蓝）
7. ❌ 多个 tile 用 5 种不同渐变色做"视觉丰富"（用 `--accent-soft` 单色）
8. ❌ 卡片间距用随机数值（如 13px / 17px）
9. ❌ 字重用 500 / 700 / 800（只用 400 / 600）

#### 自检

- [ ] 页面无硬编码文案（全走 `t()`）
- [ ] 页面无硬编码颜色（全走 `var(--*)`）
- [ ] 页面无硬编码间距/圆角/字号/阴影/动效（全走 `var(--space-*)` / `var(--radius-*)` / `var(--type-*)` / `var(--elev-*)` / `var(--motion-*)`）
- [ ] 字号只在 10 档阶梯中选
- [ ] 间距只在 8 档阶梯中选
- [ ] 圆角只在 6 档阶梯中选
- [ ] 深色 + 浅色、中文 + 英文下均正常

## 9. 反模式清单（禁止项）

1. 新建 `.vue` 文件、用选项式 API、用 mixin。
2. 出现任何 `document` / `window` / `localStorage` / `v-html` / DOM 操作。
3. 编写复杂 CSS 选择器（后代、伪类、`>`）、或依赖 Web 独有 CSS 属性。
4. 直接 `npm install` 普通 Web 库当依赖（uni-app x 用 `uni_modules` + uts 插件体系）。
5. 套用 uni-app 1.0 或 Web 项目里不存在的 API/组件（如 `list-view` 的旧写法、`v-for` 无 key）。
6. 编造 `uni.*` API 或组件属性，未验证即使用。
7. 把 `VUE3-VAPOR` 当成"只能用于 vapor"的页面层限制来过度裁剪功能——小程序/H5 端也要正常工作。

## 10. 开发与验证工作流

- **编译/运行/发布只能在 HBuilderX 完成**（编译器在 HBuilderX 内，opencode 无法独立编译）。改完代码由用户在 HBuilderX 编译真机预览。
- **自动化测试（已验证可用）**：页面级测试写在 `pages/**/*.test.js`（Jest + `program`/`page` 全局对象）。用 HBuilderX CLI 运行：
  ```
  /Applications/HBuilderX.app/Contents/MacOS/cli uniapp.test web-chrome --project <项目绝对路径> --testcaseFile pages/xxx/xxx.test.js --vapor true
  ```
  平台参数：`web-chrome` / `web-safari` / `mp-weixin` / `app-android` / `app-ios-simulator` / `app-harmony`。测试报告输出到 HBuilderX 的 `hbuilderx-for-uniapp-test` 目录。
- 测试 API：`program.reLaunch(path)`、`page.$('.cls')`/`page.$$('.cls')`、`element.tap()`、`element.input('文本')`、`element.text()`、`page.data('data.xxx')`、`page.waitFor()`。断言错误直接反馈到测试输出，AI 据此修复迭代。
- 提交约束：`git-hooks/check-commit.cjs` 禁止直接提交到 `master`/`alpha` 分支；开发请开特性分支。
- 改 `manifest.json` / `pages.json` 时保持 JSON 合法（pages.json 内允许条件编译注释）。

### 完成标准（DoD，以运行验证为准）

任务是否完成**取决于运行时表现，而非代码静态检查**。回复"已完成"前必须确认：

- [ ] 代码已保存、无语法错误
- [ ] 已在 HBuilderX 实际编译运行（无编译报错）
- [ ] 日志/测试已验证：关键逻辑输出正确、无运行时错误
- [ ] 现场已清理：移除了仅用于调试的临时 `console.log` / 断点

### AI 行为规范

- **辩证执行**：发现用户指令有逻辑漏洞或技术风险时先提出异议，不盲从。
- **禁止占位实现**：不许 `return true` 蒙混过关，必须调用真实 API/逻辑；受阻时征得同意后记入"技术债清单"。
- **禁止盲目自信**：未在 HBuilderX 验证运行前，不许声称"已完成/已修复"。
- **禁止过度工程**：不加未要求的功能与注释。
- **先讨论再动手**：用户说"先讨论/谋定而后动"时，先输出计划清单待确认，再逐项执行。
- **涉及 HBuilderX CLI 操作禁止幻觉构造命令**：拿不准就先查官方文档，不凭空编命令。
- 完整版见 `.opencode/rules/core-protocol.md`。

### 经验沉淀

- 达到 DoD 后，把"只有运行起来才知道"的坑、参数、特殊逻辑追加到根目录 `LESSONS_LEARNED.md`，避免重蹈覆辙。

## 11. 官方文档（不确定就查这里）

- 总览：https://doc.dcloud.net.cn/uni-app-x/
- 蒸汽模式详解：https://doc.dcloud.net.cn/uni-app-x/app-vapor.html
- UTS 语言：https://doc.dcloud.net.cn/uni-app-x/uts/
- CSS 选择器支持：https://doc.dcloud.net.cn/uni-app-x/css/common/selector.html
- 样式隔离：https://doc.dcloud.net.cn/uni-app-x/css/common/style-isolation.html
- AI 专题（官方 AI 工作流）：https://doc.dcloud.net.cn/uni-app-x/ai/