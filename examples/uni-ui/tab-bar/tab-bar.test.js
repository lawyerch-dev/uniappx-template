const PAGE_PATHS = [
  '/examples/uni-ui/tab-bar/tab-bar',
  '/examples/uni-ui/tab-bar/tab-bar-dark',
  '/examples/uni-ui/tab-bar/tab-bar-custom',
  '/examples/uni-ui/tab-bar/tab-bar-midbutton',
  '/examples/uni-ui/tab-bar/tab-bar-midbutton-notch'
]

describe('tab-bar', () => {
  let page

  async function launchPage(pagePath) {
    page = await program.reLaunch(pagePath)
    await page.waitFor('view')
    await page.waitFor(1000)
  }

  it.each(PAGE_PATHS)('%s snapshot', async (pagePath) => {
    await launchPage(pagePath)

    const image = await program.screenshot({
      fullPage: true
    })
    expect(image).toSaveImageSnapshot()
  })
})
