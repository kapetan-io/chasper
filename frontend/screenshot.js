const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport for mobile-like view
  await page.setViewport({ width: 375, height: 667 });
  
  try {
    // Navigate to the local Expo web app
    await page.goto('http://localhost:8081', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    // Wait for React to render
    await page.waitForTimeout(2000);
    
    // Take screenshot
    await page.screenshot({ 
      path: 'chasper-app-screenshot.png',
      fullPage: true 
    });
    
    console.log('Screenshot saved as chasper-app-screenshot.png');
    
  } catch (error) {
    console.error('Error taking screenshot:', error.message);
  } finally {
    await browser.close();
  }
})();