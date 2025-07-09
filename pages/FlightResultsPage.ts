import { Page, Locator } from '@playwright/test';

export class FlightResultsPage {
    readonly page: Page;
    readonly airlineFilters: Locator;
    readonly flightCards: Locator;
    readonly priceElements: Locator;
    readonly signInModal: Locator;
    readonly closeModalButton: Locator;
    readonly usBanglaFilter: Locator;
    readonly novoAirFilter: Locator;

    constructor(page: Page) {
        this.page = page;
        // Updated selectors based on actual UI structure
        this.airlineFilters = page.locator('button:has-text("BS"), button:has-text("VQ"), button:has-text("BG"), button:has-text("2A")');
        this.flightCards = page.locator('[class*="flight"], .flight-card, div:has-text("BDT"):has-text("Airlines")');
        this.priceElements = page.locator('text=/BDT \\d+,?\\d+/');
        this.signInModal = page.locator('text="Sign In"').first();
        this.closeModalButton = page.locator('text="Back"');
        
        // Specific airline filters based on observed codes
        this.usBanglaFilter = page.locator('button:has-text("BS")'); // BS = US-Bangla Airlines
        this.novoAirFilter = page.locator('button:has-text("VQ")'); // VQ = Novo Air
    }

    async filterByAirline(airlineName: string) {
        if (airlineName.includes("US-Bangla")) {
            if (await this.usBanglaFilter.isVisible({ timeout: 3000 })) {
                await this.usBanglaFilter.click();
            }
        } else if (airlineName.includes("Novo")) {
            if (await this.novoAirFilter.isVisible({ timeout: 3000 })) {
                await this.novoAirFilter.click();
            }
        }
        
        // Wait for results to update
        await this.page.waitForTimeout(2000);
    }

    async deselectAirline(airlineName: string) {
        // Click the same filter again to deselect
        if (airlineName.includes("US-Bangla")) {
            if (await this.usBanglaFilter.isVisible({ timeout: 3000 })) {
                await this.usBanglaFilter.click();
            }
        } else if (airlineName.includes("Novo")) {
            if (await this.novoAirFilter.isVisible({ timeout: 3000 })) {
                await this.novoAirFilter.click();
            }
        }
        
        // Wait for results to update
        await this.page.waitForTimeout(2000);
    }

    // async selectLastFlight() {
    //     await this.page.waitForTimeout(2000);
        
    //     // Scroll to bottom to ensure all flights are loaded
    //     await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    //     await this.page.waitForTimeout(1000);
        
    //     // Get all "View Package" buttons and click the last one
    //     const viewPackageButtons = this.page.locator('button:has-text("View Package")');
    //     const buttonCount = await viewPackageButtons.count();
        
    //     if (buttonCount > 0) {
    //         const lastButton = viewPackageButtons.nth(buttonCount - 1);
    //         await lastButton.scrollIntoViewIfNeeded();
    //         await lastButton.click();
    //     }
    // }

    async selectLastFlight(): Promise<void> {
        // Wait a bit to ensure flight cards are rendered
        await this.page.waitForTimeout(2000);
      
        // // Scroll to the bottom to load all results
        // await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        // await this.page.waitForTimeout(1000); // Wait for lazy loading
      
        // Locate all "View Package" buttons
        // const viewPackageButtons = this.page.locator('button:has-text("View Package")');
        // const buttonCount = await viewPackageButtons.count();
      
        // if (buttonCount > 0) {
        //   const lastButton = viewPackageButtons.nth(buttonCount - 1);
        //   await lastButton.scrollIntoViewIfNeeded();
        //   await lastButton.click();
        // } else {
        //   throw new Error('No "View Package" buttons found.');
        // }

        await this.page.getByTestId('flight_card_6').getByRole('button', { name: 'View Package' }).click();
        await this.page.waitForTimeout(1000);
      }
      

    async isSignInModalVisible(): Promise<boolean> {
        await this.page.waitForTimeout(2000);
        return await this.signInModal.isVisible();
    }

    async closeSignInModal() {
        if (await this.isSignInModalVisible()) {
            await this.closeModalButton.click();
        }
    }

    async captureFlightPrices(): Promise<string[]> {
        await this.page.waitForTimeout(2000);
        
        // Get all visible price elements
        const prices: string[] = [];
        const priceElements = this.priceElements;
        const count = await priceElements.count();
        
        for (let i = 0; i < count; i++) {
            const priceText = await priceElements.nth(i).textContent();
            if (priceText && priceText.trim()) {
                prices.push(priceText.trim());
            }
        }
        
        return prices;
    }

    async getAirlineFlightPrices(airlineName: string): Promise<string[]> {
        await this.page.waitForTimeout(2000);
        
        // Look for flight cards that contain the airline name and extract their prices
        let airlineSelector = '';
        if (airlineName.includes("US-Bangla")) {
            airlineSelector = 'text="US Bangla Airlines"';
        } else if (airlineName.includes("Novo")) {
            airlineSelector = 'text="Novo Air"';
        }
        
        const prices: string[] = [];
        
        if (airlineSelector) {
            // Find all elements containing the airline name
            const airlineElements = this.page.locator(airlineSelector);
            const count = await airlineElements.count();
            
            for (let i = 0; i < count; i++) {
                // For each airline element, find the nearest price
                const airlineElement = airlineElements.nth(i);
                const parentCard = airlineElement.locator('xpath=ancestor::*[contains(@class, "flight") or contains(text(), "BDT")]').first();
                const priceElement = parentCard.locator('text=/BDT \\d+,?\\d+/').first();
                
                const priceText = await priceElement.textContent();
                if (priceText && priceText.trim()) {
                    prices.push(priceText.trim());
                }
            }
        }
        
        return prices;
    }

    async getAllVisiblePrices(): Promise<string[]> {
        await this.page.waitForTimeout(2000);
        
        // Get all BDT prices visible on the page
        const priceElements = this.page.locator('text=/BDT \\d+,?\\d+/');
        const prices: string[] = [];
        const count = await priceElements.count();
        
        for (let i = 0; i < count; i++) {
            const priceText = await priceElements.nth(i).textContent();
            if (priceText && priceText.trim() && !priceText.includes('BDT5,199')) {
                // Filter out crossed-out prices
                prices.push(priceText.trim());
            }
        }
        
        return prices;
    }

    async scrollToLoadAllFlights() {
        // Scroll down multiple times to ensure all flights are loaded
        for (let i = 0; i < 5; i++) {
            await this.page.evaluate(() => window.scrollBy(0, window.innerHeight));
            await this.page.waitForTimeout(1000);
        }
    }
}

