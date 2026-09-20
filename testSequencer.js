const Sequencer = require("@jest/test-sequencer").default
const startTestFilePaths = [
  "examples/API/get-launch-options-sync/get-launch-options-sync.test.js",
  "examples/API/get-current-pages/get-current-pages.test.js",
  "examples/component/view/view.test.js",
  "examples/API/pull-down-refresh/pull-down-refresh.test.js",
  "examples/component/global-events/global-events.test.js",
  "examples/component/list-view/list-view-refresh.test.js",
  "examples/component/scroll-view/scroll-view-refresher.test.js",
  "examples/component/global-events/touch-events.test.js",
  "examples/component/global-events/touch-events-bubbles.test.js",
  "examples/component/global-events/touch-events-case.test.js",
  "examples/component/global-events/touch-events-preventDefault.test.js",
  "examples/component/swiper/swiper2.test.js",
  "examples/component/slider/slider-maxValue.test.js",
  "examples/CSS/overflow/overflow-visible-event.test.js",
  "examples/API/create-selector-query/create-selector-query-onScroll.test.js",
  "examples/component/scroll-view/scroll-view-custom-refresher-props.test.js",
  "examples/component/waterflow/waterflow.test.js",
  "examples/component/text/text-props.test.js",
  "examples/component/rich-text/rich-text-complex.test.js",
  "examples/component/web-view/web-view/web-view-local.test.js"
]
const endTestFilePaths = [
  "examples/API/navigator/new-page/onLoad.test.js",
  "examples/API/modal/modal.test.js",
  "examples/API/storage/storage.test.js",
  "examples/component/web-view/web-view.test.js"
]

class CustomSequencer extends Sequencer {
  sort(tests) {
    const startTests = startTestFilePaths
      .map((filePath) => {
        return tests.find((test) => test.path.endsWith(filePath))
      })
      .filter(Boolean)
    const endTests = endTestFilePaths
      .map((filePath) => {
        return tests.find((test) => test.path.endsWith(filePath))
      })
      .filter(Boolean)

    const middleTests = tests.filter((test) =>
      !startTests.includes(test) && !endTests.includes(test)
    );

    return [...startTests, ...middleTests, ...endTests]
  }
}

module.exports = CustomSequencer
