const PAGE_PATH = '/examples/tabBar/component'

describe('category-tabs', () => {
  let page

  beforeEach(async () => {
    page = await program.reLaunch(PAGE_PATH)
    await page.waitFor('view')
    await page.waitFor(500)
  })

  it('renders 5 category tabs', async () => {
    const tabs = await page.$$('.category-tabs__text')
    expect(tabs.length).toBeGreaterThanOrEqual(5)
    const texts = []
    for (let i = 0; i < 5; i++) {
      texts.push(await tabs[i].text())
    }
    expect(texts).toEqual(['组件', '接口', 'CSS', 'uni-ui', '模板'])
  })

  it('switching category navigates to that catalog', async () => {
    const tabs = await page.$$('.category-tabs__text')
    await tabs[1].tap()
    await page.waitFor(1500)

    const current = await program.currentPage()
    expect(current.path).toBe('examples/tabBar/API')
  })
})
