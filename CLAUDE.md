# CLAUDE.md — Claude Code 入口

> 本项目的 AI 编码规则统一在 [`AGENTS.md`](./AGENTS.md)。
> 本文件仅为满足 Claude Code 工具的加载约定而存在,实际规则请阅读 AGENTS.md。
>
> 补充:Claude Code 在长会话中可能遗忘本规则,请在每次会话初期主动 `Read AGENTS.md`。

## 项目结构

- 业务页面:`pages/**/*.uvue`(蒸汽模式,Vapor)
- 全局入口:`main.uts` / `App.uvue`
- 工具脚本:`store/index.uts`、`i18n.uts`、`common/uni.css`
- 经验沉淀:`LESSONS_LEARNED.md`(只在达到 DoD 后追加)
- AI 工具快捷方式:`AGENTS.md` `CLAUDE.md` `.cursorrules` `.windsurfrules` `.github/copilot-instructions.md` `GEMINI.md` `CONVENTIONS.md`——任一文件被你的工具读到,先去读 AGENTS.md

## 必读规则

**先读完 [`AGENTS.md`](./AGENTS.md) 再动手写代码。** 项目特殊性(uni-app x 蒸汽模式、UTS 强类型、条件编译、HBuilderX 编译)决定了很多"看起来通用"的做法在这里行不通。