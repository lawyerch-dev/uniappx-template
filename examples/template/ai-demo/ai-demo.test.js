const PAGE_PATH = '/examples/template/ai-demo/ai-demo'

describe('template-ai-demo', () => {
	let page

	beforeEach(async () => {
		page = await program.reLaunch(PAGE_PATH)
		await page.waitFor('view')
		await page.waitFor(300)
	})

	it('counter increments and decrements', async () => {
		expect(await page.data('data.count')).toBe(0)

		const buttons = await page.$$('.ai-demo__btn')
		expect(buttons.length).toBe(3)
		const decreaseBtn = buttons[0]
		const increaseBtn = buttons[1]

		await increaseBtn.tap()
		await page.waitFor(200)
		expect(await page.data('data.count')).toBe(1)

		await increaseBtn.tap()
		await page.waitFor(200)
		expect(await page.data('data.count')).toBe(2)

		await decreaseBtn.tap()
		await page.waitFor(200)
		expect(await page.data('data.count')).toBe(1)
	})

	it('doubled text follows count', async () => {
		const hint = await page.$('.ai-demo__hint')
		expect(await hint.text()).toContain('计算属性（翻倍）：0')

		const buttons = await page.$$('.ai-demo__btn')
		await buttons[1].tap()
		await page.waitFor(200)
		expect(await hint.text()).toContain('计算属性（翻倍）：2')
	})

	it('todo list add and remove', async () => {
		expect((await page.data('data.todos')).length).toBe(0)

		const inputEl = await page.$('.ai-demo__input')
		const buttons = await page.$$('.ai-demo__btn')
		const addBtn = buttons[2]

		await inputEl.input('第一个待办')
		await page.waitFor(200)
		await addBtn.tap()
		await page.waitFor(300)

		let todos = await page.data('data.todos')
		expect(todos.length).toBe(1)
		expect(todos[0].text).toBe('第一个待办')
		expect(await page.data('data.inputText')).toBe('')

		let firstItem = await page.$('.ai-demo__item')
		expect(await firstItem.text()).toContain('1. 第一个待办')

		await inputEl.input('第二个待办')
		await page.waitFor(200)
		await addBtn.tap()
		await page.waitFor(300)

		todos = await page.data('data.todos')
		expect(todos.length).toBe(2)
		expect(todos[1].text).toBe('第二个待办')

		firstItem = await page.$('.ai-demo__item')
		await firstItem.tap()
		await page.waitFor(300)

		todos = await page.data('data.todos')
		expect(todos.length).toBe(1)
		expect(todos[0].text).toBe('第二个待办')
	})

	it('empty input does not add todo', async () => {
		const buttons = await page.$$('.ai-demo__btn')
		await buttons[2].tap()
		await page.waitFor(300)

		expect((await page.data('data.todos')).length).toBe(0)
	})
})