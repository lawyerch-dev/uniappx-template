# LESSONS_LEARNED.md

本文件记录本项目中"只有运行起来才知道"的坑、参数与特殊逻辑。**仅在达到 DoD（HBuilderX 运行验证通过）后追加**，避免重蹈覆辙。

## 2026-09-20 HBuilderX CLI 自动化闭环实测（DoD 已验证）

- **CLI 路径**：`/Applications/HBuilderX.app/Contents/MacOS/cli`；`launch web/logcat web` 均为 `--project <绝对路径>`。
- **macOS 无 GNU `timeout`**：用 Linux 习惯命令前先验证，或改用 pty/后台会话控制耗时命令。
- **uni-app x web 渲染产物**：uvue 在 web 端编译为 VDOM 模式，按钮渲染为自定义元素 **`uni-button`**（非原生 `<button>`），输入框为 `uni-input`；用 `uni-button` 文本定位，不要用 `button`。
- **浏览器扩展干扰**：自动化点击时页面会混入扩展注入的按钮（如"关闭图片翻译"），务必先 `snapshot`/`evaluate` 探查真实 DOM 再操作；`button.first()` 常踩到扩展元素。
- **蒸汽模式编译到 web 是 VDOM**：`launch web` 日志显示"编译器版本：5.26（uni-app x）VDOM模式"，属正常设计，App 端才是原生。
- **模板 check-commit 钩子首次提交 bug**：无 HEAD 时 `git rev-parse HEAD` 报错，首个提交需 `--no-verify`。
- **`launch web` 与 `logcat web` 会各起一个 dev server**（端口可能不同，如 5173/5174），日志会重复触发编译。

## 2026-09-20 自动化测试框架实测（DoD 已验证，4/4 通过）

- **运行命令**：`/Applications/HBuilderX.app/Contents/MacOS/cli uniapp.test <platform> --project <绝对路径> --testcaseFile <相对路径> --vapor true`（平台：web-chrome/web-safari/mp-weixin/app-android/app-ios-simulator/app-harmony）。
- **首次运行需补依赖**：插件缺 `minidev@2.2.5`（在 `HBuilderX.app/Contents/HBuilderX/plugins/hbuilderx-for-uniapp-test-lib` 下 `npm i minidev@2.2.5`）；playwright 浏览器需缓存（`~/Library/Caches/ms-playwright`）。
- **测试在 headless Chromium 里跑**（375×667 移动视口），无需用户点任何东西；报告 JSON 输出到 `~/Library/Application Support/HBuilder X/hbuilderx-for-uniapp-test/<项目>/<平台>/`。
- **测试 API 已实测可用**：`program.reLaunch`、`page.$/.$$`、`element.tap()/input()/text()`、`page.data('data.xxx')`。
- **测试会临时改 `env.js` 和 `jest.config.js` 的 testMatch**，跑完注意 git diff 清理。
- **页面文本断言坑**：`.ai-demo__hint` 实际文本是 `计算属性（翻倍）：0`，含全角括号，断言要写完整子串。
- **DEBUG=automator:\*** 会输出海量协议日志，AI 调用时建议关掉。

## 2026-09-20 国际化 / 主题对齐官方文档（DoD 已验证）

- **uni-app x 内置 `vue-i18n`**（HBuilderX 5.25+，本机为 9.1.9）：`locale/*.json` + `i18n.uts`(`createI18n`) + `main.uts` 里 `app.use(i18n)`，页面用 `useI18n()`。**不要自建 i18n**。文档：https://doc.dcloud.net.cn/uni-app-x/i18n.html
- **暗黑主题优先用 `@media (prefers-color-scheme: light/dark)`**（HBuilderX 5.25+ 蒸汽模式 / Web / 小程序），自动跟随 hostTheme/appTheme，无需切 class。动态切 class 是官方称的"老版兼容方案"，有闪烁。文档：https://doc.dcloud.net.cn/uni-app-x/api/theme-change.html
- **App 手动切主题用 `uni.setAppTheme({theme:'light'|'dark'|'auto'})`**（Web/小程序不支持，跟随宿主）；manifest 配 `app.defaultAppTheme: "auto"`。
- **pages.json 文案国际化**：Web 平台支持 `navigationBarTitleText` / `tabBar.list.text` 用 `"%key%"` 占位（key 来自 `locale/*.json`）；**App/小程序不支持**，需运行时 `uni.setNavigationBarTitle` / `uni.setTabBarItem`。
  - ⚠️ **`%key%` 不解析时先查 `manifest.json` 的 `locale` 字段**（作为 fallbackLocale，为空会导致导航栏标题保持 `%key%` 字面量）。Web 端用 `uni.setLocale()` 同步运行时语言，保证页面内容（vue-i18n）与 tabBar/导航栏一致。
- ⚠️ **pages.json 条件编译写法**：必须"基础值 + 条件逗号 + 覆盖值"，使 JSON 在**裁剪前后都合法**；否则 HBuilderX 报 `Expected '}' and instead saw 'xxx'`：
  ```json
  "navigationBarTitleText": "首页"
  // #ifdef WEB
  ,
  "navigationBarTitleText": "%page.index.title%"
  // #endif
  ```
- ⚠️ **浏览器 Service Worker 会缓存旧构建**：dev server 已更新但页面仍是旧版时，先 `navigator.serviceWorker.getRegistrations()` 注销 + 清 `caches`，再硬刷新。

## 2026-09-20 `uni-page-body::after` 占位 50px（H5 端，仅顶部 tabBar 时生效）

**症状**：mine 页底部出现大片灰色空白带（约 50px），iPhone 6/7/8 等小屏尤其明显——长内容被切一半，下面留一整段 `--page-bg` 色。

**根因**：uni-app x H5 端内置 CSS：
```css
uni-app.uni-app--showtabbar uni-page-body::after {
  content: ""; display: block; width: 100%;
  height: calc(var(--tab-bar-height) + env(safe-area-inset-bottom));
}
```
这是为**底部 fixed tabBar** 留的占位（避开 tabbar 遮挡）。但本项目 `pages.json` 同时配了 `tabBar`（在 `uni-top-window` 里渲染）和 `topWindow`（顶部状态栏），`uni-app--showtabbar` 类被加上，于是 `::after` 撑了 50px，可底部其实没有 fixed tabbar（`uni-tabbar.uni-tabbar-bottom` 渲染在 `top: 667, bottom: 717`，被推到 viewport 外），于是留下 50px 空白。

**修复**（`common/uni.css` 末尾）：
```css
uni-app.uni-app--showtabbar uni-page-body::after {
  height: 0; min-height: 0; content: none;
}
```
注释里写明：以后若切回底部 fixed tabBar，需移除此规则。

**调试手段**：用浏览器 DevTools 选中 `uni-page-body` 看 `::after` 的 `content` / `height`；选中 `uni-tabbar.uni-tabbar-bottom` 看 `bottom`（若 < 0 即被推到视口外）。

## 2026-09-20 启动链路演示代码清理

**症状**：首启 + 白屏偏长。

**根因**（已清理）：`App.uvue` onLaunch 里跑 `uni.report`（统计上报）+ `uni.getPrivacySetting` + `getRedirectUrl`（scheme/ulink 解析 50 行）+ `setLifeCycleNum` 计数器；`main.uts` 里 `app.use(uniStat, ...)` 走 uni-stat 插件链（`Stat.getInstance()` + `init()`）。

**清理动作**：
- `App.uvue`: 删除 `uni.report` × 4（launch/show/hide/error）、`uni.getPrivacySetting` 弹窗、`getRedirectUrl` + 调用、`onAppShow/HiDe/LastPageBackPress/Exit` 演示逻辑、`setLifeCycleNum` 调用、`increaseLifeCycleNum` 导出、`console.log` × 5、`<style>` 演示用 `.global-text/.global-box/.global-important-*`。
- `main.uts`: 删除 `uniStat` import + `app.use(uniStat, ...)` + `uniStatOptions` 配置对象。

**注意不要动**：`store/index.uts` 里的 `lifeCycleNum` / `globalData` / `setLifeCycleNum` 等演示字段。`examples/*.test.js` 自动化测试大量依赖这些，删了就跑不动。本次只清"启动链路调用方"，字段保留。

## 2026-09-20 卡片 stagger 入场动画的视觉陷阱

**症状**：mine 页首屏入场时只看到前 2 张卡（订单 + 常用服务），下面"空白 + tabbar 半截"，被误判为"页面割裂"。

**根因**：`transition-delay: 60/130/200/270ms` + `transition-duration: 420ms` → 全部就位要 ~690ms。200~500ms 中间帧只看到前 2 张，后 2 张 `opacity: 0`。

**修复**（`pages/mine/mine.uvue` 样式段）：统一 `transition-delay: 0ms`、duration 260ms、上移距离 12px。**经验**：stagger 总时长控制在 300ms 内、无 stagger，或 stagger ≤ 2 段。