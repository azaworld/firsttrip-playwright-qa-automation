import { Page } from '@playwright/test';

export class TestHelper {
    /**
     * Wait for page to load completely
     * @param page - Playwright page object
     * @param timeout - Timeout in milliseconds (default: 30000)
     */
    static async waitForPageLoad(page: Page, timeout: number = 30000): Promise<void> {
        await page.waitForLoadState('networkidle', { timeout });
    }

    /**
     * Take screenshot with timestamp
     * @param page - Playwright page object
     * @param name - Base name for screenshot
     * @returns Path to screenshot file
     */
    static async takeScreenshot(page: Page, name: string): Promise<string> {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const screenshotPath = `screenshots/${name}-${timestamp}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        return screenshotPath;
    }

    /**
     * Scroll page to ensure all content is loaded
     * @param page - Playwright page object
     * @param scrollCount - Number of scroll actions (default: 3)
     */
    static async scrollToLoadContent(page: Page, scrollCount: number = 3): Promise<void> {
        for (let i = 0; i < scrollCount; i++) {
            await page.evaluate(() => window.scrollBy(0, window.innerHeight));
            await page.waitForTimeout(1000);
        }
        
        // Scroll back to top
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(500);
    }

    /**
     * Wait for element to be visible with retry logic
     * @param page - Playwright page object
     * @param selector - CSS selector or locator
     * @param timeout - Timeout in milliseconds (default: 10000)
     * @param retries - Number of retries (default: 3)
     */
    static async waitForElementWithRetry(page: Page, selector: string, timeout: number = 10000, retries: number = 3): Promise<boolean> {
        for (let i = 0; i < retries; i++) {
            try {
                await page.waitForSelector(selector, { timeout, state: 'visible' });
                return true;
            } catch (error) {
                if (i === retries - 1) {
                    console.log(`Element ${selector} not found after ${retries} retries`);
                    return false;
                }
                await page.waitForTimeout(1000);
            }
        }
        return false;
    }

    /**
     * Handle dynamic content loading
     * @param page - Playwright page object
     * @param expectedElementSelector - Selector for element that should appear
     * @param maxWaitTime - Maximum wait time in milliseconds (default: 30000)
     */
    static async waitForDynamicContent(page: Page, expectedElementSelector: string, maxWaitTime: number = 30000): Promise<void> {
        const startTime = Date.now();
        
        while (Date.now() - startTime < maxWaitTime) {
            try {
                await page.waitForSelector(expectedElementSelector, { timeout: 2000, state: 'visible' });
                return;
            } catch (error) {
                // Scroll a bit and wait
                await page.evaluate(() => window.scrollBy(0, 200));
                await page.waitForTimeout(1000);
            }
        }
        
        throw new Error(`Dynamic content with selector ${expectedElementSelector} did not load within ${maxWaitTime}ms`);
    }

    /**
     * Log test step with timestamp
     * @param step - Description of the test step
     */
    static logStep(step: string): void {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${step}`);
    }

    /**
     * Create directory if it doesn't exist
     * @param dirPath - Directory path
     */
    static async ensureDirectoryExists(dirPath: string): Promise<void> {
        const fs = require('fs').promises;
        try {
            await fs.access(dirPath);
        } catch (error) {
            await fs.mkdir(dirPath, { recursive: true });
        }
    }
}

