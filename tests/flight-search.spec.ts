import { test, expect } from '@playwright/test';
import { FlightSearchPage } from '../pages/FlightSearchPage';
import { FlightResultsPage } from '../pages/FlightResultsPage';
import { PriceHelper } from '../helpers/PriceHelper';
import { TestHelper } from '../helpers/TestHelper';
import { config } from '../config';

test.describe('FirstTrip Flight Search Automation', () => {
    let flightSearchPage: FlightSearchPage;
    let flightResultsPage: FlightResultsPage;
    let usBanglaFlightPrices: string[] = [];
    let novoAirFlightPrices: string[] = [];

    test.beforeEach(async ({ page }) => {
        flightSearchPage = new FlightSearchPage(page);
        flightResultsPage = new FlightResultsPage(page);
        
        // Ensure screenshots directory exists
        await TestHelper.ensureDirectoryExists('screenshots');
        
        TestHelper.logStep('Starting flight search test');
    });

    test('Complete flight search and price comparison workflow', async ({ page }) => {
        // Step 1: Navigate to flight search page
        TestHelper.logStep('Step 1: Navigating to flight search page');
        await flightSearchPage.goto();
        await TestHelper.waitForPageLoad(page);
        await TestHelper.takeScreenshot(page, 'flight-search-page');

        // Step 2: Use the existing search (Dhaka to Cox's Bazar) or modify if needed
        TestHelper.logStep('Step 2: Using existing search or performing new search');
        
        // Check if we're already on results page, if not perform search
        const currentUrl = page.url();
        if (!currentUrl.includes('/flights?')) {
            await flightSearchPage.performFlightSearch(
                "Chattogram",
                "Dhaka", 
                "23 September, 2025",
                config.flightSearch.travelers,
                config.flightSearch.class
            );
        }

        // Wait for search results to load
        await page.waitForTimeout(3000)
        await TestHelper.waitForPageLoad(page);
        await TestHelper.takeScreenshot(page, 'search-results');


        TestHelper.logStep('Step 4: Filtering by US-Bangla Airlines');
        // await flightResultsPage.filterByAirline(config.airlines.usBangla);
        // await TestHelper.takeScreenshot(page, 'us-bangla-filtered');
        await page.getByTestId('airline-filter-list').locator('div').filter({ hasText: 'US Bangla Airlines৳' }).first().click();

        

        TestHelper.logStep('Step 6: Scrolling and selecting last flight');
        //await flightResultsPage.scrollToLoadAllFlights();
        await flightResultsPage.selectLastFlight();
        await TestHelper.takeScreenshot(page, 'last-flight-selected');

        // Step 7: Verify Sign In page appears
        TestHelper.logStep('Step 7: Verifying Sign In modal appears');
        const isSignInVisible = await flightResultsPage.isSignInModalVisible();
        expect(isSignInVisible).toBeTruthy();
        await TestHelper.takeScreenshot(page, 'sign-in-modal');

        // Step 8: Close Sign In modal (navigate back)
        TestHelper.logStep('Step 8: Closing Sign In modal');
        await page.goBack();
        await TestHelper.waitForPageLoad(page);
        await TestHelper.takeScreenshot(page, 'back-to-results');

        // Step 9: Deselect US-Bangla Airlines and select Novo Air
        TestHelper.logStep('Step 9: Switching from US-Bangla to Novo Air');
        await flightResultsPage.deselectAirline(config.airlines.usBangla);
        await flightResultsPage.filterByAirline(config.airlines.novoAir);
        await TestHelper.takeScreenshot(page, 'novo-air-filtered');

        // Step 10: Capture Novo Air flight prices
        TestHelper.logStep('Step 10: Capturing Novo Air flight prices');
        novoAirFlightPrices = await flightResultsPage.getAllVisiblePrices();
        console.log('Novo Air Prices:');
        console.log(PriceHelper.formatPricesForLog(novoAirFlightPrices));

        // Step 11: Compare prices and assert difference
        TestHelper.logStep('Step 11: Comparing prices between airlines');
        
        // Ensure we have prices for both airlines
        expect(usBanglaFlightPrices.length).toBeGreaterThan(0);
        expect(novoAirFlightPrices.length).toBeGreaterThan(0);
        
        const pricesAreDifferent = PriceHelper.arePricesDifferent(usBanglaFlightPrices, novoAirFlightPrices);
        
        console.log(`Price comparison result: ${pricesAreDifferent ? 'DIFFERENT' : 'SAME'}`);
        console.log(`US-Bangla average price: ${PriceHelper.getAveragePrice(usBanglaFlightPrices)}`);
        console.log(`Novo Air average price: ${PriceHelper.getAveragePrice(novoAirFlightPrices)}`);
        
        expect(pricesAreDifferent).toBeTruthy();
        
        TestHelper.logStep('Test completed successfully');
        await TestHelper.takeScreenshot(page, 'test-completed');
    });

    test.afterEach(async ({ page }, testInfo) => {
        // Take final screenshot if test failed
        if (testInfo.status !== testInfo.expectedStatus) {
            await TestHelper.takeScreenshot(page, `failed-${testInfo.title.replace(/\s+/g, '-')}`);
        }
    });
});

