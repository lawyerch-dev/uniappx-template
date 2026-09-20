# uni-app x Template（Vapor Mode + iOS HIG Design System）

> uni-app x（uni-app 2.0）跨端模板：Web / 微信小程序 / iOS App / HarmonyOS App（Android App 兼容待发布）
> 基于蒸汽模式（Vapor Mode）+ iOS HIG 设计令牌系统。

- 📖 [uni-app x 官方文档](https://doc.dcloud.net.cn/uni-app-x/)
- 🤖 [AI 行为规范（AGENTS.md）](./AGENTS.md)
- 🏷 [变更记录（CHANGELOG）](#变更记录)

---

## 一、项目定位

本工程是 **uni-app x**（uni-app 2.0，**非 uni-app 1.0**）演示工程，已开启**蒸汽模式（Vapor Mode）**：

- 编译目标：**Android / iOS / HarmonyOS 为原生渲染**（无虚拟 DOM、无 WebView）
- **小程序 / H5** 以 VDOM 方式运行
- 逻辑层 UTS 强类型，必须写全类型标注
- UI 必须使用 `.uvue` + `<script setup lang="uts">`

主要场景：**多端用一套代码运行**到 Web、微信小程序、iOS、鸿蒙 4 个及以上核心平台。Android 平台代码已就绪但暂不发布。

---

## 二、快速开始

### 环境要求

- **HBuilderX** 5.25+（蒸汽模式 + App 端 `@media (prefers-color-scheme)` 必须此版本）
- Node.js（用于 npm scripts）
- 真机调试：iOS（Xcode 15+）、HarmonyOS（DevEco Studio 4.0+）、微信开发者工具

### 开发流程

1. 用 HBuilderX 打开本项目根目录
2. **运行** → 选择目标平台（web / mp-weixin / app-ios / app-harmony）
3. 修改代码后保存即可热更新

### 自动化测试（HBuilderX CLI）

```bash
# 通用格式
/Applications/HBuilderX.app/Contents/MacOS/cli uniapp.test <platform> \
  --project <项目绝对路径> \
  --testcaseFile <相对路径> \
  --vapor true

# 平台参数
#   web-chrome / web-safari / mp-weixin / app-android / app-ios-simulator / app-harmony

# 示例：跑 mine 页测试
/Applications/HBuilderX.app/Contents/MacOS/cli uniapp.test web-chrome \
  --project /Users/bluer/Documents/HBuilderProjects/uni-app-x \
  --testcaseFile pages/mine/mine.test.js \
  --vapor true
```

测试报告输出到 `~/Library/Application Support/HBuilder X/hbuilderx-for-uniapp-test/<项目>/<平台>/`。

---

## 三、设计系统

本项目以 **iOS Human Interface Guidelines（HIG）** 为视觉锚点，封装了一套 6 大类设计令牌（**Design Token**），定义在 [`common/uni.css`](./common/uni.css)，并通过 [`AGENTS.md §8.5`](./AGENTS.md#85业务页面设计系统ios-hig-锚点) 强制约束所有业务页面。

### 设计令牌一览

| 类别 | Token | 取值 | iOS HIG 对应 |
|---|---|---|---|
| **Spacing** | `--space-1..16` + `--space-xs..3xl` | 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 px | 8/16/24 三档主节奏 |
| **Radius** | `--radius-sm..2xl` + `--radius-pill` | 6 / 10 / 14 / 20 / 28 / 999 px | 卡片 14 / 按钮 10 / 头像 pill |
| **Typography** | `--type-caption..large-title` | 11 / 12 / 13 / 15 / 16 / 17 / 20 / 22 / 28 / 34 px | iOS Dynamic Type |
| **Motion** | `--motion-fast/base/slow` | 160 / 240 / 360 ms | iOS 反馈时长 |
| **Elevation** | `--elev-0..4` | none / 0 1px 2px .. 0 16px 40px | 5 档阴影 |
| **Opacity** | `--opacity-press/disabled/overlay` | 0.7 / 0.4 / 0.55 | iOS 反馈透明度 |
| **Component** | `--card-pad-x/y/radius/elev/gap` `--list-item-h` `--press-scale` | 组件级默认 | 卡片、列表项规范 |

### 核心设计决策

| 维度 | 取值 | 来源 |
|---|---|---|
| **主色** | `--accent: #007AFF` | iOS 系统蓝（与原生 nav bar / tabBar 同源） |
| **卡片** | 白底 + 14px 圆角 + 几乎无阴影 | iOS 靠层次而非阴影 |
| **字重** | 标题 600、正文 400 | iOS 不超过 2 种字重 |
| **按压反馈** | scale(0.97) + opacity 0.7 | iOS HIG 反馈规范 |

### 使用示例

```css
/* 写业务页面时 */
.my-card {
  padding: var(--card-pad-y) var(--card-pad-x);
  border-radius: var(--card-radius);
  background-color: var(--card-bg);
  box-shadow: var(--card-elev);
  transition-property: opacity, transform;
  transition-duration: var(--motion-base);
  transition-timing-function: var(--motion-ease);
}
.my-card-title {
  font-size: var(--type-title-3);
  font-weight: var(--type-weight-semibold);
  color: var(--text-primary);
}
```

```vue
<view class="my-card" hover-class="my-card--press">
  <text class="my-card-title">{{ t('home.title') }}</text>
</view>
```

### 禁止的"AI 凭感觉"反模式

1. ❌ 字号用 `14px / 18px / 19px`（必须从 10 档阶梯选）
2. ❌ 间距用 `6px / 10px / 14px`（必须从 8 档阶梯选）
3. ❌ 圆角用 `8px / 12px / 16px`（必须从 6 档阶梯选）
4. ❌ 阴影用 `box-shadow: 0 4px 16px rgba(0,0,0,0.1)`（必须从 5 档 elevation 选）
5. ❌ 简写 `transition: all 0.3s`（必须从 3 档 motion 选，并指定属性）
6. ❌ 纯紫 `#6d5bff` / 纯粉做主色（用 `--accent`）
7. ❌ 多 tile 用 5 种渐变色（用 `--accent-soft` 单色）
8. ❌ 字重用 500 / 700 / 800（只用 400 / 600）

详见 [`AGENTS.md §8.5`](./AGENTS.md#85业务页面设计系统ios-hig-锚点)。

---

## 四、跨端兼容性

### 平台支持矩阵

| 能力 | Web | 微信小程序 | iOS App | Android App | HarmonyOS App |
|---|---|---|---|---|---|
| `@media (prefers-color-scheme)` | ✅ | ✅ | ✅ 5.25+ | ✅ 5.25+ | ✅ 5.25+ |
| `var(--*)` 自定义属性 | ✅ | ✅ | ✅ | ✅ | ✅ |
| `transition` 长写属性 + `var()` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `cubic-bezier()` timing-function | ✅ | ✅ | ✅ | ✅ | ⚠️ 5.14+ |
| `box-shadow` / `linear-gradient` | ✅ | ✅ | ✅ | ✅ | ✅ |
| `flatten` 节点 + 复杂 CSS | ⚠️ 部分 | — | ⚠️ 部分 | ⚠️ | ⚠️ |

### 跨平台写法铁律

```css
/* ✅ 跨平台：用 page 选择器定义变量，不用 :root */
@media (prefers-color-scheme: light) {
  page { --accent: #007AFF; }
}

/* ✅ 跨平台：transition 展开写 */
transition-property: opacity;
transition-duration: var(--motion-base);
transition-timing-function: var(--motion-ease);

/* ❌ App 端不生效：transition 简写 + var() */
transition: opacity var(--motion-base);

/* ✅ 跨平台：padding 展开 */
padding-top: var(--space-md);
padding-bottom: var(--space-md);

/* ❌ App 端不生效：padding 简写 + var() */
padding: var(--space-md) 0;

/* ✅ 跨平台：rgba 透明度 */
--accent-soft: rgba(0, 122, 255, 0.10);

/* ❌ App 兼容性差：8 位十六进制 */
--accent-soft: #007AFF10;
```

详见 [`AGENTS.md §8.5 跨平台兼容性矩阵`](./AGENTS.md#跨平台兼容性矩阵核心约束必看)。

---

## 五、多语言与多主题

### 多语言（i18n）

- 文案统一走 `t('key')`，**禁止硬编码**
- 词典：`locale/zh-Hans.json`、`locale/zh-Hant.json`、`locale/en.json`
- 切换：`setAppLocale(l)`（自动持久化）
- Web 平台 pages.json 支持 `"%key%"` 占位；App 端运行时需 `uni.setNavigationBarTitle`

### 多主题

- **优选 `@media (prefers-color-scheme)`**（HBuilderX 5.25+ / Web / 小程序 / 蒸汽模式 App 全支持）
- App 手动切换：`uni.setAppTheme({ theme: 'light' | 'dark' | 'auto' })`
- `theme.json` 配 navBar / tabBar 在双主题下的颜色（`pages.json` 用 `@变量` 引用）
- `manifest.json` 配 `app.defaultAppTheme: "auto"` + `web/mp-weixin.darkmode: true`

详见 [`AGENTS.md §8`](./AGENTS.md#8业务页面多语言与多主题必做)。

---

## 六、项目结构

```
.
├── AGENTS.md          # AI 编码规则（必读）
├── LESSONS_LEARNED.md # 经验沉淀（仅 DoD 通过后追加）
├── package.json
├── manifest.json      # 应用配置（vueVersion / vapor / app / 各平台）
├── pages.json         # 页面与 tabBar 配置
├── theme.json         # navBar / tabBar 多主题色板
├── uni.scss           # 编译期变量（$uni-*）
│
├── common/
│   └── uni.css        # ⭐ 设计令牌 @media + 通用样式
│
├── App.uvue           # 应用入口
├── main.uts           # 应用初始化 + i18n 注册
├── i18n.uts           # vue-i18n 配置 + locale 切换
│
├── pages/
│   ├── index/         # 业务页示例（首页）
│   └── mine/          # 业务页示例（个人中心）含 design system 全套 token
│
├── components/        # 业务组件示例
├── composables/        # 组合式函数（如 useDark）
│
├── examples/          # 官方组件 / API / 模板示例（不在 i18n+主题约束范围）
│   ├── API/
│   ├── component/
│   └── template/
│
├── uni_modules/       # easycom 组件库
│
├── docs/              # 项目文档
├── static/            # 静态资源（图片、字体）
└── locale/            # 多语言词典
    ├── en.json
    ├── zh-Hans.json
    └── zh-Hant.json
```

---

## 七、AI 编码规则

所有 AI 在本仓库的编码行为由 [`AGENTS.md`](./AGENTS.md) 统一约束。**先读 AGENTS.md，再写代码**。

11 节核心内容：

1. **项目定位**——uni-app x（Vapor）+ UTS 强类型
2. **文件与语法铁律**——`.uvue` / `<script setup lang="uts">` / 完整类型标注
3. **条件编译**——`// #ifdef APP-IOS` 等
4. **CSS 规范**——BEM、简单类选择器、flex-only、`text` 才能写文字样式
5. **组件规则**——easycom / list-view / flatten 注意事项
6. **API 与原生能力**——禁止 DOM/BOM，统一用 `uni.*`
7. **参考标准答案**——先看 `examples/` + `uni_modules/uni-ui-x/`
8. **业务页面：多语言与多主题**——`t()` + `@media`
9. **设计系统（iOS HIG 锚点）**——**本 README 第三节**
10. **反模式清单**——禁止项 1-9 条
11. **开发与验证工作流**——HBuilderX 编译 + CLI 自动化测试

---

## 八、变更记录

### 2026-09-20 设计系统重构

- **新增** 6 大类设计令牌（spacing / radius / typography / motion / elevation / opacity）+ 组件级别名
- **新增** iOS HIG 美学锚点（10 档字号、8 档间距、6 档圆角、3 档动效、5 档阴影、3 档透明度）
- **新增** 跨平台兼容性矩阵（Web / 微信小程序 / iOS / Android / Harmony）
- **改写** `--accent` 从紫色 `#6d5bff` 改为 iOS 蓝 `#007AFF`
- **迁移** `pages/mine/mine.uvue` 与 `pages/index/index.uvue` 至全面 token 化（视觉无回归）
- **新增** 9 项"AI 凭感觉"反模式清单

### 2026-09-20 mine 页 hero 视觉统一

- mine 页 hero 渐变由紫蓝三色 135° 改为 `#007AFF → #5aa9ff` 同色相蓝渐变
- 移除 hero 内 uc__blob 光斑及相关动画
- 8 色糖果色 tile / 红 badge 统一为 `accent-soft` + `accent`
- 自动化测试 mine 3/3 + index 2/2 全通过

---

## 九、参考文档

- [uni-app x 官方文档](https://doc.dcloud.net.cn/uni-app-x/)
- [蒸汽模式](https://doc.dcloud.net.cn/uni-app-x/app-vapor.html)
- [UTS 语言约束](https://doc.dcloud.net.cn/uni-app-x/uts/)
- [暗黑主题适配](https://doc.dcloud.net.cn/uni-app-x/api/theme-change.html)
- [theme.json](https://doc.dcloud.net.cn/uni-app-x/collocation/themejson.html)
- [CSS 函数支持矩阵](https://github.com/dcloudio/uni-app/blob/uni-app-x/docs/css/common/function.md)
- [@media 媒体查询支持](https://doc.dcloud.net.cn/uni-app-x/css/common/at-rules.html)