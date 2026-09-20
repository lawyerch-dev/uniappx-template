# CONVENTIONS.md — Aider 入口

> 本项目的 AI 编码规则统一在 [`AGENTS.md`](./AGENTS.md)。
> 本文件仅为满足 Aider 工具的加载约定而存在,实际规则请阅读 AGENTS.md。

## 关键约束(Aider 必读)

- **文件类型**:页面用 `.uvue`,逻辑/类型用 `.uts`,禁止 `.vue` / `.js` 业务逻辑
- **类型**:UTS 强类型,所有变量/函数/参数必须带完整类型标注,禁止裸 `any`、禁止 `var`
- **CSS**:仅支持简单 class 选择器,蒸汽模式下后代/子域名/伪类选择器全部无效
- **API**:禁止 `document` / `window` / `localStorage` / `v-html`,统一用 `uni.xxx`
- **多语言/多主题**:业务页面必须 i18n + `@media (prefers-color-scheme)`,禁止硬编码文案/颜色
- **DoD**:完成 = HBuilderX 编译通过 + 实际运行验证 + 关键日志/测试通过

完整规则见 [`AGENTS.md`](./AGENTS.md)。