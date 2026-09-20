import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()

// 纯 JSON 配置
const jsonFiles = ['manifest.json', 'package.json', 'theme.json']
// 允许注释的 JSONC 配置
const jsoncFiles = ['pages.json', 'platformConfig.json']

function stripJsonc(text) {
  let out = ''
  let inStr = false
  let q = ''
  let inLine = false
  let inBlock = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    const n = text[i + 1]
    if (inLine) {
      if (c === '\n') {
        inLine = false
        out += c
      }
      continue
    }
    if (inBlock) {
      if (c === '*' && n === '/') {
        inBlock = false
        i++
      }
      continue
    }
    if (inStr) {
      if (c === '\\') {
        out += c + n
        i++
        continue
      }
      if (c === q) inStr = false
      out += c
      continue
    }
    if (c === '"' || c === "'") {
      inStr = true
      q = c
      out += c
      continue
    }
    if (c === '/' && n === '/') {
      inLine = true
      i++
      continue
    }
    if (c === '/' && n === '*') {
      inBlock = true
      i++
      continue
    }
    out += c
  }
  return out
}

let failed = false

for (const f of jsonFiles) {
  const p = path.join(root, f)
  if (!fs.existsSync(p)) {
    console.log(`SKIP (missing): ${f}`)
    continue
  }
  try {
    JSON.parse(fs.readFileSync(p, 'utf8'))
    console.log(`OK: ${f}`)
  } catch (e) {
    failed = true
    console.error(`FAIL: ${f} — ${e.message}`)
  }
}

for (const f of jsoncFiles) {
  const p = path.join(root, f)
  if (!fs.existsSync(p)) {
    console.log(`SKIP (missing): ${f}`)
    continue
  }
  try {
    JSON.parse(stripJsonc(fs.readFileSync(p, 'utf8')))
    console.log(`OK (jsonc): ${f}`)
  } catch (e) {
    failed = true
    console.error(`FAIL: ${f} — ${e.message}`)
  }
}

if (failed) {
  console.error('\n配置校验未通过。')
  process.exit(1)
}
console.log('\n配置校验通过。')
