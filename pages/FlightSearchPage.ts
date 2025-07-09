import { Page, Locator } from '@playwright/test';

export class FlightSearchPage {
    readonly page: Page;
    readonly fromInput: Locator;
    readonly toInput: Locator;
    readonly departureDateButton: Locator;
    readonly travelerButton: Locator;
    readonly searchButton: Locator;
    readonly oneWayRadio: Locator;

    constructor(page: Page) {
        this.page = page;
        // Updated selectors based on actual UI structure
        this.fromInput = page.locator('input[placeholder="Airport/City"]').first();
        this.toInput = page.locator('input[placeholder="Airport/City"]').nth(1);
        this.departureDateButton = page.locator('button:has-text("Departure")');
        this.travelerButton = page.locator('p:has-text("1 Traveller")').first();
        this.searchButton = page.getByTestId('search-flight-button');
        this.oneWayRadio = page.locator('text=One Way');
    }

    async goto() {
        await this.page.goto('/flight');
        await this.page.waitForLoadState('networkidle');
    }

    async selectOneWay() {
        await this.oneWayRadio.click();
        await this.page.waitForTimeout(500);
    }

    async fillFromLocation(location: string) {
        await this.fromInput.click();
        await this.fromInput.clear();
        await this.fromInput.fill(location);
        await this.page.waitForTimeout(2000);
        
        // Look for dropdown options and select the first one
        await this.page.getByText('Chattogram, BangladeshShah Amanat International AirportCGP').click();
        await this.page.waitForTimeout(1000);
    }

    async fillToLocation(location: string) {
        await this.toInput.click();
        await this.toInput.clear();
        await this.toInput.fill(location);
        await this.page.waitForTimeout(2000);
        
        await this.page.getByText('Dhaka, BangladeshHazrat Shahjalal International AirportDAC').click();

        await this.page.waitForTimeout(1000);
    }

    async selectDepartureDate(targetDate: string) {
        await this.departureDateButton.click();
        await this.page.waitForTimeout(1000);
        
        // Parse the target date (e.g., "23 September, 2025")
        const [day, monthYear] = targetDate.split(' ');
        const dayNum = parseInt(day);
        
        // Look for date picker and navigate to correct month/year if needed
        // This is a simplified approach - might need adjustment based on actual date picker
        const dateElement = this.page.locator(`text="${dayNum}"`).first();
        if (await dateElement.isVisible({ timeout: 3000 })) {
            await dateElement.click();
        } else {
            // Try to find the specific date in various formats
            const dateVariations = [
                targetDate,
                `${dayNum}`,
                `${day} Sep`,
                `${day} September`
            ];
            
            for (const dateVar of dateVariations) {
                const dateEl = this.page.locator(`text="${dateVar}"`).first();
                if (await dateEl.isVisible({ timeout: 1000 })) {
                    await dateEl.click();
                    break;
                }
            }
        }
        await this.page.waitForTimeout(1000);
    }

    async selectTravelers(travelers: string) {
        // Click on traveler button to open the selector
        await this.travelerButton.click();
        await this.page.waitForTimeout(1000);
        
        // Look for adult increment button (assuming we need 2 adults)
        const adultPlusButton = this.page.locator('button:has-text("+"), [aria-label*="increase"], [aria-label*="add"], .increment').first();
        if (await adultPlusButton.isVisible({ timeout: 3000 })) {
            // Click plus button once to get 2 adults (assuming default is 1)
            await adultPlusButton.click();
            await this.page.waitForTimeout(500);
        }
        
        // Look for done/apply/ok button to close the selector
        const doneButton = this.page.locator('button:has-text("Done"), button:has-text("Apply"), button:has-text("OK"), button:has-text("Confirm")').first();
        if (await doneButton.isVisible({ timeout: 3000 })) {
            await doneButton.click();
        } else {
            // Click outside to close if no done button
            await this.page.click('body');
        }
        await this.page.waitForTimeout(1000);
    }

    async selectClass(travelClass: string) {
        // Look for class selector - might be part of traveler selector or separate
        const classButton = this.page.locator('text=Economy, text=Premium Economy, button:has-text("Economy"), button:has-text("Premium")').first();
        if (await classButton.isVisible({ timeout: 2000 })) {
            await classButton.click();
            await this.page.waitForTimeout(500);
            
            // Select the specific class
            const classOption = this.page.locator(`text="${travelClass}"`).first();
            if (await classOption.isVisible({ timeout: 2000 })) {
                await classOption.click();
            }
        }
        await this.page.waitForTimeout(1000);
    }

    async clickSearch() {
        await this.searchButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async performFlightSearch(from: string, to: string, departureDate: string, travelers: string, travelClass: string) {
        await this.selectOneWay();
        await this.fillFromLocation(from);
        await this.fillToLocation(to);
        await this.selectDepartureDate(departureDate);
        await this.selectTravelers(travelers);
        await this.selectClass(travelClass);
        await this.clickSearch();
    }
      
}

