jest.setTimeout(50000);

const platformInfo = process.env.uniTestPlatformInfo.toLocaleLowerCase()
const isAndroid = platformInfo.startsWith('android')
const isIos = platformInfo.startsWith('ios')
const isHarmony = platformInfo.startsWith('harmony')
const isApp = isAndroid || isIos || isHarmony
const isWeb = platformInfo.startsWith('web')
const isMP = platformInfo.startsWith('mp')
const isAppWebView = process.env.UNI_AUTOMATOR_APP_WEBVIEW == 'true'
const isDom2 = process.env.UNI_APP_X_DOM2 === "true"
// 【勿动】此项目，某些设备，在自动化测试系统中，不需要运行pages.test.js。其值由自动化测试系统动态控制。
const skipPagesTestJs = process.env.UNI_ACTION_SKIP_PAGES_TEST_JS;
// 【勿动】pages 由 const 改为 let，因为在其它任务会修改 pages 的值
let pageIndex = 0

const component = [
  '/examples/component/swiper/swiper',
  '/examples/component/progress/progress',
  '/examples/component/radio/radio',
  '/examples/component/checkbox/checkbox',
  // 单独测试例截图
  // 'examples/component/scroll-view/scroll-view',
  // 单独测试例截图
  // '/examples/component/scroll-view/scroll-view-refresher',
  // 单独测试例截图
  // '/examples/component/scroll-view/scroll-view-props',
  // 单独测试例截图
  // '/examples/component/scroll-view/scroll-view-refresher-props',
  // 单独测试例截图
  // '/examples/component/scroll-view/scroll-view-custom-refresher-props',
  // '/examples/component/list-view/list-view',
  // 单独测试例截图
  // '/examples/component/list-view/list-view-refresh',
  // 单独测试例截图
  // '/examples/component/list-view/list-view-multiplex',
  // '/examples/component/list-view/list-view-multiplex-input',
  // '/examples/component/list-view/list-view-multiplex-video',
  // '/examples/component/list-view/list-view-children-in-slot',
  // 单独测试例截图
  // '/examples/component/sticky-section/sticky-section',
  // 单独测试例截图
  // '/examples/component/sticky-header/sticky-header',
  // 单独测试例截图
  // '/examples/component/text/text-props',
  // 单独测试例截图
  // '/examples/component/rich-text/rich-text-complex',
  // 单独测试例截图
  // '/examples/component/form/form',
  // 单独测试例截图
  // '/examples/component/button/buttonstatus',
  // 自动获取焦点，单独测试例截图
  // '/examples/component/input/input',
  //动态内容
  // '/examples/component/picker-view/picker-view',
  // 单独测试例截图
  // '/examples/component/image/image',
  // 单独测试例截图
  // '/examples/component/image/image-format',
  // 判断CPU类型，单独测试例截图
  // '/examples/component/image/image-mode',
  // 网络资源加载，单独测试例截图
  // '/examples/component/image/image-path',
  // 截图过大
  // '/examples/component/image/image-large',
  // 动态内容（视频封面）
  // '/examples/component/video/video',
  // 单独测试例截图
  // '/examples/component/video/video-format',
  // 动态内容
  // '/examples/component/web-view/web-view',
  // 依赖加载完成回调，单独测试例截图
  // '/examples/component/web-view/web-view/web-view-local',
  // 动态内容
  // '/examples/component/unicloud-db/unicloud-db',
  // 动态内容
  // '/examples/component/unicloud-db/unicloud-db/contacts/edit',
  // 动态内容
  // '/examples/component/unicloud-db/unicloud-db/contacts/detail',
  // 动态内容
  // '/examples/component/unicloud-db/unicloud-db/mixin-datacom/mixin-datacom',
  // 单独测试例截图
  // '/examples/component/global-properties/global-properties',
  // 单独测试例截图
  // '/examples/component/global-events/touch-events',
  // 单独测试例截图
  // '/examples/component/nested-scroll-header/nested-scroll-header',
  // 单独测试例截图
  // '/examples/component/nested-scroll-body/nested-scroll-body',
  // 单独测试例截图
  // '/examples/component/swiper/swiper-list-view',
  // 动态内容
  // '/examples/component/waterflow/waterflow-fit-height',
  // 动态内容
  // '/examples/component/canvas/canvas/ball',
]

const API = [
  '/examples/API/navigator/new-page/onLoad',
  '/examples/API/storage/storage',
  // 非 UI 相关不截图
  // '/examples/API/get-app/get-app',
  // 单独测试例截图
  // '/examples/API/get-current-pages/get-current-pages',
  // 单独测试例截图
  // '/examples/API/get-current-pages/set-page-style-disable-pull-down-refresh',
  // 非 UI 相关不截图
  // '/examples/API/get-launch-options-sync/get-launch-options-sync',
  // 动态时间戳
  // '/examples/API/navigator/navigator',
  // 单独测试例截图
  // '/examples/API/set-navigation-bar-color/set-navigation-bar-color',
  // 单独测试例截图
  // '/examples/API/set-navigation-bar-title/set-navigation-bar-title',
  // 单独测试例截图
  // '/examples/API/set-page-backgroundColorContent/set-page-backgroundColorContent',
  // 单独测试例截图
  // '/examples/API/navigator/new-page/new-page-1',
  // 非 UI 相关不截图
  // '/examples/API/navigator/new-page/new-page-3',
  // 单独测试例截图
  // '/examples/API/pull-down-refresh/pull-down-refresh',
  // 单独测试例截图
  // '/examples/API/get-element-by-id/get-element-by-id',
  // 单独测试例截图
  // '/examples/API/get-element-by-id/get-element-by-id-multiple-root-node',
  // 单独测试例截图
  // '/examples/API/create-selector-query/create-selector-query',
  // 单独测试例截图
  // '/examples/API/action-sheet/action-sheet',
  // 单独测试例截图
  // '/examples/API/show-modal/show-modal',
  // 单独测试例截图
  // '/examples/API/show-loading/show-loading',
  // 单独测试例截图
  // '/examples/API/show-toast/show-toast',
  // 单独测试例截图
  // '/examples/API/load-font-face/load-font-face',
  // 单独测试例截图
  // '/examples/API/load-font-face/load-font-face-child',
  // 非 UI 相关不截图
  // '/examples/API/interceptor/interceptor',
  // 非 UI 相关不截图
  // '/examples/API/interceptor/page1',
  // 非 UI 相关不截图
  // '/examples/API/interceptor/page2',
  // 非 UI 相关不截图
  // '/examples/API/request/request',
  // 非 UI 相关不截图
  // '/examples/API/upload-file/upload-file',
  // 非 UI 相关不截图
  // '/examples/API/download-file/download-file',
  // 非 UI 相关不截图
  // '/examples/API/websocket/socketTask',
  // 页面销毁时会关闭socket连接，所以规避
  // '/examples/API/websocket/websocket',
  // 页面只是按钮，且平台间存在差异
  // '/examples/API/unicloud/unicloud/cloud-function',
  // 非 UI 相关不截图
  // '/examples/API/unicloud/unicloud/cloud-object',
  // 非 UI 相关不截图
  // '/examples/API/unicloud/unicloud/database',
  // 非 UI 相关不截图
  // '/examples/API/unicloud/unicloud/cloud-storage',
  // 非 UI 相关不截图
  // '/examples/API/get-system-info/get-system-info',
  // 非 UI 相关不截图
  // '/examples/API/get-device-info/get-device-info',
  // 非 UI 相关不截图
  // '/examples/API/get-app-base-info/get-app-base-info',
  // 单独测试例截图
  // '/examples/API/preview-image/preview-image',
  // 单独测试例截图
  // '/examples/API/choose-image/choose-image',
  // 单独测试例截图
  // '/examples/API/choose-video/choose-video',
  // 非 UI 相关不截图
  // '/examples/API/get-network-type/get-network-type',
  // 非 UI 相关不截图
  // '/examples/API/page-scroll-to/page-scroll-to',
  // 非 UI 相关不截图
  // '/examples/API/event-bus/event-bus',
  // '/examples/API/get-battery-info/get-battery-info',
  // 非 UI 相关不截图
  // '/examples/API/get-window-info/get-window-info',
  // 非 UI 相关不截图
  // '/examples/API/rpx2px/rpx2px',
  // 非 UI 相关不截图
  // '/examples/API/request-payment/request-payment/order-detail',
  // 单独测试例截图
  // '/examples/API/resize-observer/resize-observer',
  // 单独测试例截图
  // '/examples/API/map/map',
  // 非 UI 相关不截图
  // '/examples/API/get-file-system-manager/get-file-system-manager',
  // 非 UI 相关不截图
  // '/examples/API/get-system-setting/get-system-setting',
  // 非 UI 相关不截图
  // '/examples/API/element-takesnapshot/element-takesnapshot',
  // 非 UI 相关不截图
  // '/examples/API/get-app-authorize-setting/get-app-authorize-setting',
  // 非 UI 相关不截图
  // '/examples/API/get-uni-verify-manager/get-uni-verify-manager',
  // 非 UI 相关不截图
  // '/examples/API/request-payment/request-payment',
  // 非 UI 相关不截图
  // '/examples/API/theme-change/theme-change',
  // 非 UI 相关不截图
  // '/examples/API/facial-recognition-meta-info/facial-recognition-meta-info',
  // 非 UI 相关不截图
  // '/examples/API/env/env',
  // 非 UI 相关不截图
  // '/examples/API/element-draw/element-draw',
  // 非 UI 相关不截图
  // '/examples/API/share-with-system/share-with-system',
  // 非 UI 相关不截图
  // '/examples/API/request-payment/request-payment/request-payment-uni-pay',
  // 非 UI 相关不截图
  // '/examples/API/get-location/get-location',
  // 非 UI 相关不截图
  // '/examples/API/exit/exit',
  // 非 UI 相关不截图
  // '/examples/API/install-apk/install-apk',
  // 动态内容，单独测试例截图
  // '/examples/API/get-image-info/get-image-info',
  // 动态内容，不需要截图
  // '/examples/API/create-rewarded-video-ad/create-rewarded-video-ad',
  // 非 UI 相关不截图
  // '/examples/API/create-request-permission-listener/create-request-permission-listener',
  // 非 UI 相关不截图
  // '/examples/API/compress-image/compress-image',
  // 单独测试例截图
  // '/examples/API/compress-video/compress-video',
  // 单独测试例截图
  // '/examples/API/get-image-info/get-image-info',
  // 非 UI 相关不截图
  // '/examples/API/make-phone-call/make-phone-call',
  // 单独测试例截图
  // '/examples/API/create-inner-audio-context/create-inner-audio-context',
  // 单独测试例截图
  // '/examples/API/create-inner-audio-context/inner-audio-format',
  // 单独测试例截图
  // '/examples/API/create-inner-audio-context/inner-audio-path',
  // 单独测试例截图
  // '/examples/API/clipboard/clipboard',
  // 单独测试例截图
  // '/examples/API/compass/compass',
]

const CSS = [
  '/examples/CSS/border/border-color',
  '/examples/CSS/border/border-top',
  '/examples/CSS/border/border-bottom',
  '/examples/CSS/border/border-left',
  '/examples/CSS/border/border-right',
  '/examples/CSS/border/border-radius',
  '/examples/CSS/border/border-style',
  '/examples/CSS/border/border-width',
  '/examples/CSS/border/complex-border/complex-border',
  '/examples/CSS/box-sizing/box-sizing',
  '/examples/CSS/display/flex',
  '/examples/CSS/display/none',
  '/examples/CSS/flex/flex',
  '/examples/CSS/flex/align-content',
  '/examples/CSS/flex/align-items',
  '/examples/CSS/flex/align-self',
  '/examples/CSS/flex/flex-basis',
  '/examples/CSS/flex/flex-direction',
  '/examples/CSS/flex/flex-flow',
  '/examples/CSS/flex/flex-grow',
  '/examples/CSS/flex/flex-shrink',
  '/examples/CSS/flex/flex-wrap',
  '/examples/CSS/flex/justify-content',
  '/examples/CSS/layout/height',
  '/examples/CSS/layout/min-height',
  '/examples/CSS/layout/max-height',
  '/examples/CSS/layout/min-width',
  '/examples/CSS/layout/max-width',
  '/examples/CSS/layout/position',
  '/examples/CSS/layout/width',
  '/examples/CSS/layout/opacity',
  '/examples/CSS/layout/visibility',
  '/examples/CSS/margin/margin',
  '/examples/CSS/margin/margin-top',
  '/examples/CSS/margin/margin-bottom',
  '/examples/CSS/margin/margin-left',
  '/examples/CSS/margin/margin-right',
  '/examples/CSS/padding/padding',
  '/examples/CSS/padding/padding-top',
  '/examples/CSS/padding/padding-bottom',
  '/examples/CSS/padding/padding-left',
  '/examples/CSS/padding/padding-right',
  // 单独测试例中截图
  // '/examples/CSS/background/background-image',
  // '/examples/CSS/border/border',
  // 单独测试例中截图
  // '/examples/CSS/border/dynamic-border',
  // 单独测试例中截图
  // '/examples/CSS/layout/z-index',
  // 单独测试例中截图
  // '/examples/CSS/overflow/overflow',
  // 网络资源加载，单独测试例截图
  // '/examples/CSS/text/font-family',
  // 单独测试例截图
  // '/examples/CSS/text/font-size',
  // 单独测试例截图
  // '/examples/CSS/transition/transition',
  // 单独测试例截图
  // '/examples/CSS/transform/translate',
  // 单独测试例截图
  // '/examples/CSS/transform/scale',
  // 单独测试例截图
  // '/examples/CSS/transform/rotate',
  // 单独测试例截图
  // '/examples/CSS/variable/variable',
]

const template = [
  '/examples/template/swipe-tabs-underline/swipe-tabs-underline',
  '/examples/template/swipe-tabs-scale-highlight/swipe-tabs-scale-highlight',
  // 单独测试例截图
  // '/examples/template/keyboard-adjust/keyboard-adjust',
  // 网络资源加载，单独测试例截图
  // '/examples/template/news-feed-list/news-feed-list',
  // 依赖网络资源加载
  // '/examples/template/news-feed-list/detail/detail',
  // 动画页面
  // '/examples/template/swipe-card-stack/swipe-card-stack',
  // 单独测试例截图
  // '/examples/template/vertical-video-feed/vertical-video-feed',
  // 单独测试例截图
  // '/examples/template/scroll-collapse-navbar/scroll-collapse-navbar',
  // 单独测试例截图
  // '/examples/template/draggable-half-modal/draggable-half-modal',
  // 动态内容
  // '/examples/template/search-header-long-list/search-header-long-list',
  // 动态内容
  // '/examples/template/banner-tabs-feed-nested-scroll/banner-tabs-feed-nested-scroll',
  // harmony 整体测试时截图异常，单独测试例截图
  // '/examples/template/pull-zoom-profile-page/pull-zoom-profile-page',
  // 动态内容
  // '/examples/template/calendar/calendar',
  // 不同平台存在差异，且页面简单
  // '/examples/template/external-link-launch/external-link-launch',
  // '/uni_modules/uni-pay-x/pages/success/success',
  // 依赖 onload 参数获取 web-view src
  // '/uni_modules/uni-pay-x/pages/ad-interactive-webview/ad-interactive-webview',
  // '/uni_modules/uni-pay-x/pages/pay-desk/pay-desk',
  // 页面内容不稳定
  // '/examples/template/recycle-long-list/recycle-long-list',
  // 单独测试例截图
  // '/examples/template/slider-100/slider-100',
  // 动态内容
  // '/examples/template/banner-tabs-long-list-nested-scroll/banner-tabs-long-list-nested-scroll',
  // 非 UI 相关不截图
  // '/examples/template/native-button-bridge/native-button-bridge'
]

if (!isMP) {
  component.push(
    '/examples/component/view/view',
    '/examples/component/text/text',
    '/examples/component/rich-text/rich-text',
    '/examples/component/button/button',
    '/examples/component/textarea/textarea',
    '/examples/component/slider/slider',
    '/examples/component/slider/slider-in-swiper',
    '/examples/component/switch/switch',
    '/examples/component/image/image-orientation',
    '/examples/component/navigator/navigator',
    '/examples/component/navigator/navigate',
    '/examples/component/navigator/redirect',
    '/examples/component/unicloud-db/unicloud-db/contacts/add',
    '/examples/component/global-events/global-events',
    '/examples/component/global-events/transition-events',
    '/examples/component/global-events/global-events-transform',
  )

  CSS.push(
    '/examples/CSS/text/color',
    '/examples/CSS/text/font-style',
    '/examples/CSS/text/font-weight',
    '/examples/CSS/text/letter-spacing',
    '/examples/CSS/text/line-height',
    '/examples/CSS/text/text-align',
    '/examples/CSS/text/text-overflow',
    '/examples/CSS/text/text-decoration-line',
    '/examples/CSS/text/text-shadow',
    '/examples/CSS/text/white-space',
    '/examples/CSS/pointer-events/pointer-events',
    '/examples/CSS/background/background-color',
    '/examples/CSS/box-shadow/box-shadow',
    '/examples/CSS/overflow/overflow-visible-event',
  )
}

const pages = [
  // tabBar  //改动频繁，不再测试
  // '/examples/tabBar/component',
  // '/examples/tabBar/API',
  // '/examples/tabBar/CSS',
  // '/examples/tabBar/template',

  ...component,
  ...API,
  ...CSS,
  ...template,
]

if(!isMP && !isAppWebView) {
  pages.push(
    '/examples/component/list-view/list-view',
  )
}

if (!isAppWebView) {
  if (isApp) {
    pages.push(
      '/examples/template/scroll-view-sticky-section/scroll-view-sticky-section',
    )
  }
}


if (isWeb) {
  pages.push(
    '/examples/component/movable-view/movable-view',
    '/examples/component/label/label',
    '/examples/component/picker/picker',
    '/examples/component/canvas/canvas',
    '/examples/template/browser-built-in-elements/browser-built-in-elements',
  )
}

let page;
let windowInfo

function getWaitForTagName(pagePath) {
  if (pagePath === '/examples/component/list-view/list-view-multiplex-input') {
    return 'input'
  }
  if (pagePath === '/examples/component/list-view/list-view-multiplex-video') {
    return 'video'
  }
  if (
    pagePath === '/examples/component/global-events/transition-events' ||
    pagePath === '/examples/API/env/env'
  ) {
    return 'text'
  }
  if (
    pagePath === '/examples/component/unicloud-db/unicloud-db/contacts/edit' ||
    pagePath === '/examples/component/unicloud-db/unicloud-db/contacts/detail'
  ) {
    return 'scroll-view'
  }
  return 'view'
}

async function preparePageForScreenshot(pagePath, page) {
  if (pagePath === '/examples/component/picker/picker') {
    await page.setData({
      data: {
        dayDate: '2026-08-05',
        monthDate: '2026-08',
        yearDate: '2026',
        startDate: '1936-08-05',
        endDate: '2036-08-05',
      }
    })
    await page.waitFor(100)
  }
}

// 将页面数组分组
const BATCH_SIZE = 20;
const pageBatches = [];
for (let i = 0; i < pages.length; i += BATCH_SIZE) {
  pageBatches.push(pages.slice(i, i + BATCH_SIZE));
}

// 为每个批次创建独立的测试套件
pageBatches.forEach((batch, batchIndex) => {
  describe(`Page Screenshot Batch ${batchIndex + 1}`, () => {
    if (skipPagesTestJs == "Y") {
      it('skip-current-device', async () => {
        expect(1).toBe(1);
      });
      return;
    };
    let localPageIndex = 0;

    beforeAll(async () => {
      console.log(`Starting batch ${batchIndex + 1} with ${batch.length} pages`);
      windowInfo = await program.callUniMethod('getWindowInfo');
    });

    afterAll(async () => {
      console.log(`Finished batch ${batchIndex + 1}`);
    });

    test.each(batch)("%s", async () => {
      const currentPagePath = batch[localPageIndex];
      page = await program.reLaunch(currentPagePath);
      await page.waitFor(getWaitForTagName(currentPagePath));
      await page.waitFor(500)
      await preparePageForScreenshot(currentPagePath, page)
      console.log("Taking screenshot: ", pageIndex, currentPagePath);
      let fullPage = true;

      const screenshotParams = {
        fullPage
      }
      if (!fullPage && !isAppWebView) {
        screenshotParams.offsetY = isApp ? `${windowInfo.safeAreaInsets.top + 44}` : '0'
      }

      const image = await program.screenshot(screenshotParams);
      expect(image).toSaveImageSnapshot({
        customSnapshotIdentifier() {
          return `__pages_test__/${currentPagePath.replace(/\//g, "-").substring(1)}`
        }
      })
      await page.waitFor(800);
      localPageIndex++;
    });
  });
});
