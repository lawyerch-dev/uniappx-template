---
name: uni-app-x-ui-design
description: Use when designing or implementing ANY UI in this uni-app x project — pages, components, layouts, styles, colors, typography, spacing, responsive behavior, interaction, or reviewing UI quality. Enforces uni-app x constraints (uvue/uts/ucss, vapor mode, style isolation 2.0, no DOM) and translates generic web UI guidance (ui-ux-pro-max / design-system / ui-styling / shadcn / Tailwind) into valid uvue + ucss. Use BEFORE ui-ux-pro-max, design-system, ui-styling, design, brand, banner-design, or slides in this repo.
---

# uni-app x UI 设计规范（本项目专用）

**本项目是 uni-app x（uni-app 2.0），不是 Web，也不是 uni-app 1.0。**
Android / iOS / HarmonyOS 为**原生渲染**（无 DOM、无 WebView）；小程序 / H5 以 VDOM 运行。
所有 UI 产出必须是 **`.uvue` + `.uts` + `ucss`**。

## 使用顺序（重要）

1. 需要**设计决策**（配色 / 字体 / 布局 / UX 规则）时，可以用 `ui-ux-pro-max` / `design-system` / `brand` 等技能查询，但**只取"设计意图"**（例如"暖色主色 + 8px 间距网格 + 大圆角"）。
2. **落地实现**必须按本文件翻译成 uvue + ucss，**禁止照搬 Web 方案**（Tailwind / shadcn / React / DOM）。
3. 写代码前先确认可用组件（`uni_modules/uni-ui-x`、easycom），并遵守 `.opencode/rules/ucss.md`、`.opencode/rules/uvue.md`。

## 一、硬约束（违反即编译/运行出错）

### 文件与语法
- 页面/组件用 `.uvue`；逻辑/类型用 `.uts`。禁止用 `.vue`、业务逻辑用 `.js`。
- 只用 `<script setup lang="uts">`（组合式 API）。禁止选项式写法、禁止 mixin。
- 所有变量/函数/参数带**完整类型标注**（`: string`、`UTSJSONObject`、`Foo | null`、`T[]`）；禁止裸 `any`。
- 用 `null` 表示空值（**不支持 `undefined`**）；条件语句必须布尔。
- 路径别名 `@/` = 项目根。

### CSS（ucss，约束最强）
- **仅支持简单类选择器与分组选择器**。禁止后代（`.a .b`）、子代（`>`）、伪类（`:hover`/`:focus`）、伪元素。
- 用 **BEM**：`.block__element--modifier`。
- **文字样式（color / font-size / font-weight / text-align / line-height / letter-spacing …）只能写在 `<text>` / `<button>` 上**；写在 `view` 上无效；文字样式**不继承**。
- 布局**只用 flex 或绝对定位**；flex 默认方向**垂直**（横向必须 `flex-direction: row`）；禁止 `float`、`grid`。
- 长度单位仅 **`px` / `rpx` / 百分比**（`line-height` 支持 `em`）；**禁止 `vh`/`vw`/`rem`**。
  - 仅当宽度需随屏幕变化才用 `rpx`；仅当长度需随父容器变化才用百分比。
- `z-index` **仅对同级兄弟节点生效**。
- 不使用 `scoped`。样式隔离 **2.0**：**组件默认隔离**，页面/全局 CSS 影响不到组件内部；需要外部影响时用 `defineOptions({ styleIsolation: 'app' | 'app-and-page' })`。
- CSS 函数仅 `url()` / `rgb()` / `rgba()` / `var()` / `env()`。
- 禁止 `inherit` / `unset`。

### 运行时
- **无 DOM / BOM**：禁止 `document`、`window`、`localStorage`、`navigator`、`v-html`、任何 DOM 操作。
- 统一用 `uni.*` API。**禁止编造 API**，使用前查文档或项目内现有用法。
- 可滚动内容必须放 `scroll-view` / `list-view`；整页滚动时一级子节点放 `<scroll-view style="flex:1">`。

### 组件
- 用 uni-app x **内置组件** + `uni_modules/uni-ui-x`（easycom，无需 import/注册）。
- **禁止 Web 组件库**（shadcn/ui、Radix、MUI、Ant Design、Element、Vant-Web…）。
- `list-view` / `list-item`：`v-for` 必须带 `:key`；二者必须写在同一 `.uvue`；不支持横向滚动；`list-item` 宽度固定 100%；不支持 margin；文字必须包 `<text>`。
- `flatten`：`view`/`text`/`image` 可加，但拍平后**不能有事件**、不支持部分 CSS（visibility / z-index / background-image / box-shadow inset 等）。不确定就不加。

## 二、Web 设计建议 → uni-app x 落地对照（重点）

拿到通用 UI 技能的建议后，按此表转换，**不要照搬**：

| 通用技能可能给的建议 | uni-app x 正确做法 |
|---|---|
| Tailwind / 原子类 | 写 ucss 类 + BEM；复用 `uni.scss` 的 `$uni-*` 变量 |
| shadcn/ui / Radix / MUI / Element | `uni_modules/uni-ui-x` 或内置组件；无对应则用 `view`+`text` 自己组合 |
| `<div>` / `<span>` / `<p>` / `<ul>` | `<view>` / `<text>` / `<text>` / `list-view`+`list-item` |
| `<img>` | `<image>` |
| `<a href>` 页面跳转 | `<navigator>` 或 `uni.navigateTo` |
| CSS Grid | flex（或绝对定位） |
| `vh` / `vw` / `rem` | `px` / `rpx` / `%` |
| `@media` 响应式 | `uni.getWindowInfo()` 取宽度后用代码适配 |
| `@keyframes` 动画 | `UniElement.animate()`，或 `<swiper>` / `<movable-view>` |
| `:hover` / `:focus` | `hover-class` 属性 |
| CSS 变量 + class 切暗黑 | `uni.scss` / `theme.json` + `uni.onAppThemeChange`（见 `composables/useDark.uts`） |
| CSS Modules / styled-components / CSS-in-JS | 不支持，写 ucss |
| `document.querySelector` 测量/操作 | `uni.createSelectorQuery()` |
| `@font-face` 自定义字体 | 支持；字体放 `static/`，用绝对路径 |
| 内联 SVG 图标 | 用 `uni_modules/uni-icons` 或 `static/` 图片（uni-app x 对 SVG 支持有限） |

## 三、设计落地的通用做法

- 颜色 / 间距 / 圆角 / 字号优先抽成 `uni.scss` 变量或 `theme.json`，避免散落硬编码。
- 布局：外层 `view` 用 flex 列；行内元素用 `flex-direction: row` + `align-items: center`。
- 卡片：`background-color` + `border-radius` + `padding`；阴影用 `box-shadow`（注意拍平节点不支持 inset 阴影）。
- 文字：字号/颜色/粗细写在 `<text>` 上。
- 图标：`uni_modules/uni-icons` 或 `static/` 图片。
- 交互反馈：用 `hover-class`，不要 `:hover`。
- 参考标准实现：`examples/template/`、`uni_modules/uni-ui-x/`、`components/page-head/page-head.uvue`、`pages/index/index.uvue`。

## 四、交付前自检

- [ ] 全是 `.uvue`/`.uts`，`<script setup lang="uts">`，类型完整
- [ ] 没有后代/伪类/`>` 选择器；用 BEM
- [ ] 文字样式都在 `<text>`/`<button>` 上
- [ ] 只有 flex/绝对定位；没有 float/grid/vh/vw/rem
- [ ] 没有 `document`/`window`/`localStorage`/`v-html`
- [ ] 组件来自内置或 `uni_modules/uni-ui-x`，没有引入 Web 组件库
- [ ] 已在 HBuilderX 编译验证（不能只做静态检查）
