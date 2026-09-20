# AGENTS.md — uni-app x（蒸汽模式）开发规范

本文件约束所有 AI 在此仓库的编码行为。**先读完再动手，写代码前先看"参考标准答案"章节。**

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
- `uvue.md`、`ucss.md`、`conditional-compilation.md`、`api.md`、`uni-app-x-best-practices.md` → 已通过 `opencode.json` 的 `instructions` 常驻上下文。

## 8. 反模式清单（禁止项）

1. 新建 `.vue` 文件、用选项式 API、用 mixin。
2. 出现任何 `document` / `window` / `localStorage` / `v-html` / DOM 操作。
3. 编写复杂 CSS 选择器（后代、伪类、`>`）、或依赖 Web 独有 CSS 属性。
4. 直接 `npm install` 普通 Web 库当依赖（uni-app x 用 `uni_modules` + uts 插件体系）。
5. 套用 uni-app 1.0 或 Web 项目里不存在的 API/组件（如 `list-view` 的旧写法、`v-for` 无 key）。
6. 编造 `uni.*` API 或组件属性，未验证即使用。
7. 把 `VUE3-VAPOR` 当成"只能用于 vapor"的页面层限制来过度裁剪功能——小程序/H5 端也要正常工作。

## 9. 开发与验证工作流

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

## 10. 官方文档（不确定就查这里）

- 总览：https://doc.dcloud.net.cn/uni-app-x/
- 蒸汽模式详解：https://doc.dcloud.net.cn/uni-app-x/app-vapor.html
- UTS 语言：https://doc.dcloud.net.cn/uni-app-x/uts/
- CSS 选择器支持：https://doc.dcloud.net.cn/uni-app-x/css/common/selector.html
- 样式隔离：https://doc.dcloud.net.cn/uni-app-x/css/common/style-isolation.html
- AI 专题（官方 AI 工作流）：https://doc.dcloud.net.cn/uni-app-x/ai/