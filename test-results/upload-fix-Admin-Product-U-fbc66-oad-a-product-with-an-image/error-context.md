# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: upload-fix.spec.js >> Admin Product Upload >> should successfully upload a product with an image
- Location: tests\e2e\upload-fix.spec.js:11:7

# Error details

```
Test timeout of 120000ms exceeded while running "beforeEach" hook.
```

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "http://localhost:3000/admin?testAuth=1", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import path from 'path';
  3  | 
  4  | test.describe('Admin Product Upload', () => {
  5  |   test.beforeEach(async ({ page }) => {
  6  |     // Navigate to admin page with testAuth=1 to bypass authentication
> 7  |     await page.goto('/admin?testAuth=1');
     |                ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  8  |     await expect(page.locator('h2')).toContainText('Inventory Management');
  9  |   });
  10 | 
  11 |   test('should successfully upload a product with an image', async ({ page }) => {
  12 |     // Open the "New Product" modal
  13 |     await page.click('button:has-text("New Product")');
  14 |     await expect(page.locator('h2')).toContainText('Add Luxury Product');
  15 | 
  16 |     // Fill in product details
  17 |     const uniqueSlug = `test-product-${Date.now()}`;
  18 |     await page.fill('input[placeholder="Luxury Table Lamp"]', 'Test Product');
  19 |     await page.fill('input[placeholder="luxury-table-lamp"]', uniqueSlug);
  20 |     await page.fill('input[placeholder="Luxury"]', 'Luxury');
  21 |     await page.fill('input[placeholder="Premium Pick"]', 'New Arrival');
  22 |     await page.fill('input[placeholder="$2,500"]', '$99');
  23 |     await page.fill('input[placeholder="https://amazon.com/..."]', 'https://example.com/test');
  24 |     await page.fill('textarea', 'This is a test product description.');
  25 | 
  26 |     // Upload an image
  27 |     const filePath = path.join(process.cwd(), 'tests', 'fixtures', 'test-image.png');
  28 |     await page.setInputFiles('input[type="file"]', filePath);
  29 | 
  30 |     // Click submit
  31 |     await page.click('button[type="submit"]:has-text("Acquire Now")');
  32 | 
  33 |     // Verify loading states (might be fast, but we can wait for success toast)
  34 |     // The Acquire Now text changes or a toast appears.
  35 |     // Based on the code, a success toast "Product added successfully" should appear.
  36 |     await expect(page.locator('div:has-text("Product added successfully")')).toBeVisible({ timeout: 15000 });
  37 | 
  38 |     // Verify form resets and modal closes (or success message is visible)
  39 |     await expect(page.locator('h2')).toContainText('Inventory Management');
  40 |     
  41 |     // Check if the product appears in the inventory list
  42 |     await expect(page.locator(`h3:has-text("Test Product")`)).toBeVisible();
  43 |   });
  44 | 
  45 |   test('should successfully upload a product without an image (using fallback)', async ({ page }) => {
  46 |     // Open the "New Product" modal
  47 |     await page.click('button:has-text("New Product")');
  48 | 
  49 |     // Fill in product details
  50 |     const uniqueSlug = `test-product-no-image-${Date.now()}`;
  51 |     await page.fill('input[placeholder="Luxury Table Lamp"]', 'Test Product No Image');
  52 |     await page.fill('input[placeholder="luxury-table-lamp"]', uniqueSlug);
  53 |     await page.fill('input[placeholder="Luxury"]', 'Luxury');
  54 |     await page.fill('input[placeholder="Premium Pick"]', 'New Arrival');
  55 |     await page.fill('input[placeholder="$2,500"]', '$49');
  56 |     await page.fill('input[placeholder="https://amazon.com/..."]', 'https://example.com/test');
  57 |     await page.fill('textarea', 'Description for no image test.');
  58 | 
  59 |     // Click submit without uploading an image
  60 |     await page.click('button[type="submit"]:has-text("Acquire Now")');
  61 | 
  62 |     // Verify success toast
  63 |     await expect(page.locator('div:has-text("Product added successfully")')).toBeVisible({ timeout: 10000 });
  64 |     
  65 |     // Check if the product appears in the inventory list
  66 |     await expect(page.locator(`h3:has-text("Test Product No Image")`)).toBeVisible();
  67 |   });
  68 | });
  69 | 
```