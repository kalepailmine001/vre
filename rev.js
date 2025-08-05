const { chromium } = require('playwright');

function getRandomDigits(min, max) {
  const length = Math.floor(Math.random() * (max - min + 1)) + min;
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

(async () => {
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  // Step 1: Visit URL
  await page.goto('https://frosti.pro/?inv=2346200', { waitUntil: 'networkidle' });

  // Step 2: Fill random number into input.moo
  await page.waitForSelector('input.moo');
  const randomNumber = getRandomDigits(10, 15);
  console.log(`[INFO] Generated random number: ${randomNumber}`);
  await page.fill('input.moo', randomNumber);


  // Step 3: Click "Login / Sign up"
  await page.click('input[type="submit"][value="Login / Sign up"]');
  await page.waitForLoadState('networkidle');

  // Step 4: Click "Earn" link to go to /bonus
  await page.waitForSelector('a[href="/bonus"]');
  await page.click('a[href="/bonus"]');
  await page.waitForLoadState('networkidle');

  // Step 5: Start 65-sec loop for clicking "Get money"
  while (true) {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] Checking for 'Get money' button...`);
      const button = await page.$('a[href="/get.php"].button');
      if (button) {
        await button.click();
        console.log(`[${new Date().toLocaleTimeString()}] Clicked 'Get money' button`);
      } else {
        console.log(`[${new Date().toLocaleTimeString()}] Button not found. Will retry in 5 seconds`);
      }
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }

    // Wait 65 seconds before next check
    await page.waitForTimeout(65000);
  }

  // browser.close(); // Optional if you want to close after loop (not used here)
})();
