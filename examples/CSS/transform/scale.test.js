const platformInfo = process.env.uniTestPlatformInfo.toLocaleLowerCase()
const isMP = platformInfo.startsWith('mp')

describe('/examples/CSS/transform/scale.uvue', () => {
  if (isMP) {
    it('skip', () => {
      expect(1).toBe(1)
    })
    return
  }

	let page;
	beforeAll(async () => {
	  page = await program.reLaunch('/examples/CSS/transform/scale')
	  await page.waitFor(1000);
	});

	it("snap scale", async () => {
	  const image = await program.screenshot({
	    fullPage: true
	  })
	  expect(image).toSaveImageSnapshot()
	})
});
