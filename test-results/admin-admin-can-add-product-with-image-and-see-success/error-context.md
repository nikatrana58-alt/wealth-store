# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin.spec.js >> admin can add product with image and see success
- Location: tests\e2e\admin.spec.js:4:1

# Error details

```
Error: page.goto: Page crashed
Call log:
  - navigating to "http://localhost:3000/admin?testAuth=1", waiting until "load"

```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | const path = require('path');
  3  | 
  4  | test('admin can add product with image and see success', async ({ page }) => {
  5  |   // Stub Cloudinary upload API
  6  |   await page.route('**/api/cloudinary/upload', async (route) => {
  7  |     await route.fulfill({
  8  |       status: 200,
  9  |       contentType: 'application/json',
  10 |       body: JSON.stringify({
  11 |         uploads: [
  12 |           {
  13 |             url: 'https://res.cloudinary.com/demo/image/upload/v1/sample.jpg',
  14 |             publicId: 'demo/sample',
  15 |             width: 800,
  16 |             height: 800,
  17 |             format: 'jpg',
  18 |             bytes: 12345,
  19 |           },
  20 |         ],
  21 |       }),
  22 |     });
  23 |   });
  24 | 
  25 |   // Stub Firestore commit endpoint used by Firebase SDK
  26 |   await page.route('https://firestore.googleapis.com/**/documents:commit', async (route) => {
  27 |     await route.fulfill({
  28 |       status: 200,
  29 |       contentType: 'application/json',
  30 |       body: JSON.stringify({
  31 |         writeResults: [{ updateTime: new Date().toISOString() }],
  32 |         commitTime: new Date().toISOString(),
  33 |       }),
  34 |     });
  35 |   });
  36 | 
  37 |   // Navigate with testAuth to bypass real Firebase auth
> 38 |   await page.goto('/admin?testAuth=1');
     |              ^ Error: page.goto: Page crashed
  39 | 
  40 |   // Open add product modal
  41 |   await page.click('text=New Product');
  42 | 
  43 |   // Fill the form
  44 |   await page.fill('input[placeholder="Luxury Table Lamp"]', 'Playwright Test Lamp');
  45 |   await page.fill('input[placeholder="luxury-table-lamp"]', 'playwright-test-lamp');
  46 |   await page.fill('input[placeholder="$99"]', '$123');
  47 |   await page.fill('input[placeholder="Type any category manually"]', 'Testing');
  48 |   await page.fill('input[placeholder="Premium Pick"]', 'Playwright Pick');
  49 |   await page.fill('input[placeholder="https://..."]', 'https://example.com/product');
  50 |   await page.fill('textarea[placeholder*="Describe the product"]', 'A test product added by Playwright.');
  51 | 
  52 |   // Attach image
  53 |   const filePath = path.join(__dirname, '..', 'fixtures', 'test-image.png');
  54 |   await page.setInputFiles('input[type=file]', filePath);
  55 | 
  56 |   // Submit
  57 |   await page.click('text=Confirm & List Product');
  58 | 
  59 |   // Expect toast and success message
  60 |   await expect(page.locator('text=Product added successfully')).toBeVisible({ timeout: 15000 });
  61 | 
  62 |   // Expect the new product title to appear in inventory list
  63 |   await expect(page.locator('text=Playwright Test Lamp')).toBeVisible({ timeout: 10000 });
  64 | });
  65 | 
```