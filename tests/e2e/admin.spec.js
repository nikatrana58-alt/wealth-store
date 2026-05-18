const { test, expect } = require('@playwright/test');
const path = require('path');

test('admin can add product with image and see success', async ({ page }) => {
  // Stub Cloudinary upload API
  await page.route('**/api/cloudinary/upload', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        uploads: [
          {
            url: 'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg',
            publicId: 'demo/sample',
            width: 800,
            height: 800,
            format: 'jpg',
            bytes: 12345,
          },
        ],
      }),
    });
  });

  // Stub Firestore commit endpoint used by Firebase SDK
  await page.route('https://firestore.googleapis.com/**/documents:commit', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        writeResults: [{ updateTime: new Date().toISOString() }],
        commitTime: new Date().toISOString(),
      }),
    });
  });

  // Navigate with testAuth to bypass real Firebase auth
  await page.goto('/admin?testAuth=1');

  // Open add product modal
  await page.click('text=New Product');

  // Fill the form
  await page.fill('input[placeholder="Luxury Table Lamp"]', 'Playwright Test Lamp');
  await page.fill('input[placeholder="luxury-table-lamp"]', 'playwright-test-lamp');
  await page.fill('input[placeholder="$99"]', '$123');
  await page.fill('input[placeholder="Type any category manually"]', 'Testing');
  await page.fill('input[placeholder="Premium Pick"]', 'Playwright Pick');
  await page.fill('input[placeholder="https://..."]', 'https://example.com/product');
  await page.fill('textarea[placeholder*="Describe the product"]', 'A test product added by Playwright.');

  // Attach image
  const filePath = path.join(__dirname, '..', 'fixtures', 'test-image.png');
  await page.setInputFiles('input[type=file]', filePath);

  // Submit
  await page.click('text=Confirm & List Product');

  // Expect toast and success message
  await expect(page.locator('text=Product added successfully')).toBeVisible({ timeout: 15000 });

  // Expect the new product title to appear in inventory list
  await expect(page.locator('text=Playwright Test Lamp')).toBeVisible({ timeout: 10000 });
});
