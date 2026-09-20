# GitHub Copilot 入口

> 本项目的 AI 编码规则统一在 [`AGENTS.md`](../AGENTS.md)。
> 本文件仅为满足 GitHub Copilot 工具的加载约定而存在,实际规则请阅读 AGENTS.md。

## 项目特殊性

- **uni-app x(蒸汽模式)**——`.uvue` + `.uts`,UTS 强类型,蒸汽模式 CSS 子集
- **编译只能在 HBuilderX 完成**——其他 AI 工具无法独立编译运行
- **多语言 / 多主题是硬性要求**——业务页面默认必须同时支持 vue-i18n 与 `@media (prefers-color-scheme)`
- **DoD 以运行时为准**——HBuilderX 编译运行 + 自动化测试通过

## 阅读入口

主规则:[`AGENTS.md`](../AGENTS.md) 全部 11 节
经验沉淀:[`LESSONS_LEARNED.md`](../LESSONS_LEARNED.md)(只有 DoD 通过后才追加)