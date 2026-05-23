import { test, expect } from '@playwright/test';
import path from 'path';

test.describe('Admin Product Upload', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin page with testAuth=1 to bypass authentication
    await page.goto('/admin?testAuth=1');
    await expect(page.locator('h1')).toContainText('Control Center');
  });

  test('should successfully upload a product with an image', async ({ page }) => {
    // Open the "New Product" modal
    await page.click('button:has-text("New Product")');
    await expect(page.locator('h2')).toContainText('Add Luxury Product');

    // Fill in product details
    const uniqueSlug = `test-product-${Date.now()}`;
    await page.fill('input[placeholder="Luxury Table Lamp"]', 'Test Product');
    await page.fill('input[placeholder="luxury-table-lamp"]', uniqueSlug);
    await page.fill('input[placeholder="Type any category manually"]', 'Gadgets');
    await page.fill('input[placeholder="Premium Pick"]', 'New Arrival');
    await page.fill('input[placeholder="$99"]', '$99');
    await page.fill('input[placeholder="https://..."]', 'https://example.com/test');
    await page.fill('textarea', 'This is a test product description.');

    // Upload an image
    const filePath = path.join(process.cwd(), 'tests', 'fixtures', 'test-image.png');
    await page.setInputFiles('input[type="file"]', filePath);

    // Click submit
    await page.click('button[type="submit"]:has-text("Confirm & List Product")');

    // Verify success toast appears
    // The toast message is "Product listed successfully!"
    await expect(page.locator('div:has-text("Product listed successfully!")')).toBeVisible({ timeout: 30000 });

    // Verify form resets and modal closes
    await expect(page.locator('h2')).toContainText('Inventory Management');
    
    // Check if the product appears in the inventory list
    await expect(page.locator(`h3:has-text("Test Product")`)).toBeVisible();
  });

  test('should successfully upload a product without an image (using fallback)', async ({ page }) => {
    // Open the "New Product" modal
    await page.click('button:has-text("New Product")');

    // Fill in product details
    const uniqueSlug = `test-product-no-image-${Date.now()}`;
    await page.fill('input[placeholder="Luxury Table Lamp"]', 'Test Product No Image');
    await page.fill('input[placeholder="luxury-table-lamp"]', uniqueSlug);
    await page.fill('input[placeholder="Type any category manually"]', 'Gadgets');
    await page.fill('input[placeholder="Premium Pick"]', 'New Arrival');
    await page.fill('input[placeholder="$99"]', '$49');
    await page.fill('input[placeholder="https://..."]', 'https://example.com/test');
    await page.fill('textarea', 'Description for no image test.');

    // Click submit without uploading an image
    await page.click('button[type="submit"]:has-text("Confirm & List Product")');

    // Verify success toast
    await expect(page.locator('div:has-text("Product listed successfully!")')).toBeVisible({ timeout: 20000 });
    
    // Check if the product appears in the inventory list
    await expect(page.locator(`h3:has-text("Test Product No Image")`)).toBeVisible();
  });
});
