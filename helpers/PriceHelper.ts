export class PriceHelper {
    /**
     * Extract numeric price from price string
     * @param priceString - String containing price (e.g., "৳ 12,500", "$250", "12500 BDT")
     * @returns Numeric price value
     */
    static extractNumericPrice(priceString: string): number {
        // Remove currency symbols and non-numeric characters except decimal points
        const numericString = priceString.replace(/[^\d.,]/g, '');
        
        // Handle comma as thousands separator
        const cleanedString = numericString.replace(/,/g, '');
        
        return parseFloat(cleanedString) || 0;
    }

    /**
     * Compare two arrays of prices and check if they are different
     * @param prices1 - First array of price strings
     * @param prices2 - Second array of price strings
     * @returns True if prices are different, false otherwise
     */
    static arePricesDifferent(prices1: string[], prices2: string[]): boolean {
        if (prices1.length !== prices2.length) {
            return true;
        }

        const numericPrices1 = prices1.map(price => this.extractNumericPrice(price));
        const numericPrices2 = prices2.map(price => this.extractNumericPrice(price));

        for (let i = 0; i < numericPrices1.length; i++) {
            if (numericPrices1[i] !== numericPrices2[i]) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get the average price from an array of price strings
     * @param prices - Array of price strings
     * @returns Average price as number
     */
    static getAveragePrice(prices: string[]): number {
        if (prices.length === 0) return 0;

        const numericPrices = prices.map(price => this.extractNumericPrice(price));
        const sum = numericPrices.reduce((acc, price) => acc + price, 0);
        
        return sum / numericPrices.length;
    }

    /**
     * Format price array for logging
     * @param prices - Array of price strings
     * @returns Formatted string for logging
     */
    static formatPricesForLog(prices: string[]): string {
        return prices.map((price, index) => `${index + 1}. ${price}`).join('\n');
    }

    /**
     * Validate that prices array is not empty
     * @param prices - Array of price strings
     * @param airlineName - Name of airline for error message
     * @throws Error if prices array is empty
     */
    static validatePricesNotEmpty(prices: string[], airlineName: string): void {
        if (prices.length === 0) {
            throw new Error(`No prices found for ${airlineName} flights`);
        }
    }
}

