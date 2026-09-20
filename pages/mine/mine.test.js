const PAGE_PATH = '/pages/mine/mine'

describe('mine-profile', () => {
  let page

  beforeEach(async () => {
    page = await program.reLaunch(PAGE_PATH)
    await page.waitFor('view')
    await page.waitFor(700)
  })

  it('renders hero / orders / services / settings / menus', async () => {
    const title = await page.$('.uc__bar-title')
    expect((await title.text()).length).toBeGreaterThan(0)

    const orders = await page.$$('.uc__rowitem')
    expect(orders.length).toBeGreaterThanOrEqual(4)

    const services = await page.$$('.uc__gitem')
    expect(services.length).toBeGreaterThanOrEqual(8)

    // 设置(语言/主题) + 菜单(3) = 5 行
    const lines = await page.$$('.uc__line')
    expect(lines.length).toBeGreaterThanOrEqual(5)
  })

  it('language / theme rows show current values', async () => {
    const vals = await page.$$('.uc__linevaltext')
    expect(vals.length).toBeGreaterThanOrEqual(2)
    expect((await vals[0].text()).length).toBeGreaterThan(0)
    expect((await vals[1].text()).length).toBeGreaterThan(0)
  })

  it('switching locale updates text', async () => {
    const title = await page.$('.uc__bar-title')

    await page.callMethod('setLocale', 'zh-Hans')
    await page.waitFor(400)
    const zh = await title.text()
    expect(zh).toBe('个人中心')

    await page.callMethod('setLocale', 'en')
    await page.waitFor(400)
    const en = await title.text()
    expect(en).toBe('Profile')
    expect(en).not.toBe(zh)

    await page.callMethod('setLocale', 'zh-Hant')
    await page.waitFor(400)
    expect(await title.text()).toBe('個人中心')

    await page.callMethod('setLocale', 'zh-Hans')
    await page.waitFor(300)
  })

  it('switching theme toggles root class', async () => {
    const root = await page.$('.uc')

    await page.callMethod('setThemeMode', 'dark')
    await page.waitFor(400)
    expect(await root.attribute('class')).toContain('theme-dark')

    await page.callMethod('setThemeMode', 'light')
    await page.waitFor(400)
    expect(await root.attribute('class')).toContain('theme-light')

    await page.callMethod('setThemeMode', 'system')
    await page.waitFor(300)
  })
})
