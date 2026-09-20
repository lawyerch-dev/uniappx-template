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