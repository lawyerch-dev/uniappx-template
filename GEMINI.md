# GEMINI.md — Gemini CLI 入口

> 本项目的 AI 编码规则统一在 [`AGENTS.md`](./AGENTS.md)。
> 本文件仅为满足 Gemini CLI 工具的加载约定而存在,实际规则请阅读 AGENTS.md。

## 项目速览

- **uni-app x 蒸汽模式**(uni-app 2.0),不是 uni-app 1.0
- 文件:`.uvue` 页面 + `.uts` 逻辑,禁用 `.vue` 业务逻辑、禁止裸 `any`
- 编译:仅 HBuilderX 可编译运行;AI 工具改完代码后,需用户在 HBuilderX 编译真机预览
- 主题:i18n + `@media (prefers-color-scheme)` 自动适配,业务页不要写硬编码文案/颜色
- 经验沉淀:`LESSONS_LEARNED.md`,DoD 通过后才追加

## 阅读入口

主规则:[`AGENTS.md`](./AGENTS.md) 全部 11 节,尤其是:
- 第 1 节(项目定位)
- 第 9 节(反模式清单)
- 第 10 节(开发与验证工作流)