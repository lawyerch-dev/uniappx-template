const PAGE_PATH = '/pages/index/index'

describe('home-index', () => {
  let page

  beforeEach(async () => {
    page = await program.reLaunch(PAGE_PATH)
    await page.waitFor('view')
    await page.waitFor(300)
  })

  it('home page renders (i18n text non-empty)', async () => {
    const title = await page.$('.home__title')
    expect((await title.text()).length).toBeGreaterThan(0)

    const btn = await page.$('.home__btn')
    expect((await btn.text()).length).toBeGreaterThan(0)
  })

  it('tapping button opens examples catalog', async () => {
    const btn = await page.$('.home__btn')
    await btn.tap()
    await page.waitFor(800)

    const current = await program.currentPage()
    expect(current.path).toBe('examples/tabBar/component')
  })
})
