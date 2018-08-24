import { newPage, TestPage } from '../../../../dist/testing';


describe('@Prop', () => {

  let page: TestPage;
  beforeEach(async () => {
    page = await newPage();
  });

  it('should set props from property', async () => {
    // create a new puppeteer page
    // load the page with html content
    await page.setContent(`
      <prop-cmp></prop-cmp>
    `);

    // select the "prop-cmp" element
    // and run the callback in the browser's context
    await page.$eval('prop-cmp', (elm: any) => {
      // within the browser's context
      // let's set new property values on the component
      elm.first = 'Marty';
      elm.lastName = 'McFly';
    });

    // we just made a change and now the async queue need to process it
    // make sure the queue does its work before we continue
    await page.waitForQueue();

    // select the "prop-cmp" element within the page (same as querySelector)
    // and once it's received, then return the element's "textContent" property
    const textContent = await page.$eval('prop-cmp', elm => elm.textContent);
    expect(textContent).toEqual('Hello, my name is Marty McFly');
  });

  it('should set props from attributes', async () => {
    await page.setContent(`
      <prop-cmp first="Marty" last-name="McFly"></prop-cmp>
    `);

    const textContent = await page.$eval('prop-cmp', elm => elm.textContent);
    expect(textContent).toEqual('Hello, my name is Marty McFly');
  });

});