---
name: slides
description: Create strategic HTML presentations with Chart.js, design tokens, responsive layouts, copywriting formulas, and contextual slide strategies.
argument-hint: "[topic] [slide-count]"
metadata:
  author: claudekit
  version: "1.0.0"
---

> ⚠️ **本项目是 uni-app x（uvue / uts / ucss，蒸汽模式），不是 Web，也不是 uni-app 1.0。**
> 使用本技能前，先读 `.opencode/skills/uni-app-x-ui-design/SKILL.md`。
> 本技能给出的所有建议都必须落地为 **uvue + ucss**：禁用 Tailwind / shadcn / Radix / React / DOM / CSS Grid / vh-vw / @media / @keyframes / :hover 等 Web 方案。


# Slides

Strategic HTML presentation design with data visualization.

## When to Use

- Marketing presentations and pitch decks
- Data-driven slides with Chart.js
- Strategic slide design with layout patterns
- Copywriting-optimized presentation content

## Subcommands

| Subcommand | Description | Reference |
|------------|-------------|-----------|
| `create` | Create strategic presentation slides | `references/create.md` |

## References (Knowledge Base)

| Topic | File |
|-------|------|
| Layout Patterns | `references/layout-patterns.md` |
| HTML Template | `references/html-template.md` |
| Copywriting Formulas | `references/copywriting-formulas.md` |
| Slide Strategies | `references/slide-strategies.md` |

## Routing

1. Parse subcommand from `$ARGUMENTS` (first word)
2. Load corresponding `references/{subcommand}.md`
3. Execute with remaining arguments
