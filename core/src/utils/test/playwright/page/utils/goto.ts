import { Page, TestInfo } from '@playwright/test';

/**
 * This is an extended version of Playwright's
 * page.goto method. In addition to performing
 * the normal page.goto work, this code also
 * automatically waits for the Stencil components
 * to be hydrated before proceeding with the test.
 */
export const goto = async (page: Page, url: string, testInfo: TestInfo, originalFn: typeof page.goto) => {
  const { mode, rtl } = testInfo.project.metadata;

  const splitUrl = url.split('?');
  const paramsString = splitUrl[1];

  /**
   * This allows developers to force a
   * certain mode or LTR/RTL config per test.
   */
  const urlToParams = new URLSearchParams(paramsString);
  const formattedMode = urlToParams.get('ionic:mode') ?? mode;
  const formattedRtl = urlToParams.get('rtl') ?? rtl;

  const formattedUrl = `${splitUrl[0]}?ionic:_testing=true&ionic:mode=${formattedMode}&rtl=${formattedRtl}`;

  const [_, response] = await Promise.all([
    page.waitForFunction(() => (window as any).stencilAppLoaded === true, { timeout: 4750 }),
    originalFn(formattedUrl)
  ]);

  return response;
}