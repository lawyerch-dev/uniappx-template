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

    // 语言行 + 菜单 3 行 = 4 行（主题行仅 App 显示）
    const lines = await page.$$('.uc__line')
    expect(lines.length).toBeGreaterThanOrEqual(4)
  })

  it('language row shows current locale', async () => {
    const vals = await page.$$('.uc__linevaltext')
    expect(vals.length).toBeGreaterThanOrEqual(1)
    expect((await vals[0].text()).length).toBeGreaterThan(0)
  })

  it('switching locale updates text', async () => {
    const title = await page.$('.uc__bar-title')

    await page.callMethod('setAppLocale', 'zh-Hans')
    await page.waitFor(400)
    expect(await title.text()).toBe('个人中心')

    await page.callMethod('setAppLocale', 'en')
    await page.waitFor(400)
    expect(await title.text()).toBe('Profile')

    await page.callMethod('setAppLocale', 'zh-Hant')
    await page.waitFor(400)
    expect(await title.text()).toBe('個人中心')

    await page.callMethod('setAppLocale', 'zh-Hans')
    await page.waitFor(300)
  })
})
