# FirstTrip Flight Search Automation Framework

A comprehensive test automation framework built with Playwright TypeScript for testing FirstTrip's flight search functionality. This framework implements the Page Object Model pattern and includes UI testing capabilities with detailed reporting.

## 🎯 Project Overview

This automation framework was developed as part of a QA Automation Engineer assessment to test FirstTrip's flight booking system. The framework covers:

- Flight search functionality
- Airline filtering and selection
- Price comparison between different airlines
- Sign-in modal verification
- Comprehensive test reporting with screenshots

## 🏗️ Framework Architecture

### Design Patterns Used
- **Page Object Model (POM)**: Separates page elements and actions from test logic
- **Helper Classes**: Utility functions for price comparison and test operations
- **Configuration Management**: Centralized test data and settings

### Project Structure
```
firsttrip-automation/
├── pages/                      # Page Object classes
│   ├── FlightSearchPage.ts     # Flight search form interactions
│   └── FlightResultsPage.ts    # Flight results and filtering
├── helpers/                    # Utility classes
│   ├── PriceHelper.ts          # Price comparison utilities
│   └── TestHelper.ts           # Common test operations
├── tests/                      # Test specifications
│   └── flight-search.spec.ts   # Main test suite
├── screenshots/                # Test execution screenshots
├── config.ts                   # Test configuration
├── playwright.config.ts        # Playwright configuration
└── package.json               # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation
1. Clone or download the project
2. Navigate to the project directory:
   ```bash
   cd firsttrip-automation
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

### Running Tests

#### Basic Test Execution
```bash
# Run all tests
npm test

# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests with UI mode
npm run test:ui
```

#### Browser-Specific Tests
```bash
# Run tests on Chromium only
npm run test:chromium

# Run tests on Firefox only
npm run test:firefox

# Run tests on WebKit only
npm run test:webkit
```

#### View Test Reports
```bash
# Open HTML test report
npm run test:report
```

## 🧪 Test Scenarios

### Main Test Suite: Flight Search and Price Comparison

The primary test suite (`flight-search.spec.ts`) covers the following workflow:

1. **Navigation**: Navigate to FirstTrip flight search page
2. **Search Execution**: Perform flight search with specified criteria
3. **Price Capture**: Capture initial flight prices (mixed airlines)
4. **Airline Filtering**: Filter results by US-Bangla Airlines
5. **Flight Selection**: Select the last available flight
6. **Sign-in Verification**: Verify sign-in modal appears
7. **Modal Handling**: Close sign-in modal
8. **Airline Switching**: Switch from US-Bangla to Novo Air
9. **Price Comparison**: Compare prices between airlines
10. **Assertion**: Verify price differences exist

### Test Data Configuration

Test parameters are configured in `config.ts`:
```typescript
export const config = {
    baseUrl: "https://firsttrip.com",
    flightSearch: {
        from: "Chattogram",
        to: "Dhaka",
        departureDate: "23 September, 2025",
        travelers: "2 Adults",
        class: "Economy / Premium Economy"
    },
    airlines: {
        usBangla: "US-Bangla Airlines",
        novoAir: "Novo Air"
    }
};
```

## 📊 Reporting and Logging

### Test Reports
- **HTML Reports**: Comprehensive test execution reports with pass/fail status
- **Screenshots**: Automatic screenshot capture at key test steps
- **Console Logs**: Detailed step-by-step execution logs with timestamps

### Screenshot Capture
Screenshots are automatically captured at:
- Page navigation points
- Before and after filtering operations
- Sign-in modal appearance
- Test completion or failure

### Log Output Example
```
[2025-07-09T06:28:57.634Z] Step 1: Navigating to flight search page
[2025-07-09T06:29:06.882Z] Step 2: Using existing search or performing new search
[2025-07-09T06:29:20.123Z] Step 3: Capturing all current flight prices
All visible flight prices:
1. Starts from BDT 9,889
2. Starts from BDT 10,340
3. Starts from BDT 4,899
...
```

## 🔧 Framework Components

### Page Objects

#### FlightSearchPage
- Handles flight search form interactions
- Manages location input, date selection, traveler configuration
- Executes search operations

#### FlightResultsPage
- Manages flight result filtering and selection
- Handles airline-specific filtering
- Captures price information
- Manages sign-in modal interactions

### Helper Classes

#### PriceHelper
- Extracts numeric values from price strings
- Compares price arrays for differences
- Calculates average prices
- Formats prices for logging

#### TestHelper
- Provides common test utilities
- Manages screenshot capture
- Handles page loading and scrolling
- Provides step logging functionality

## 🎛️ Configuration

### Playwright Configuration
The framework is configured to run on multiple browsers:
- Chromium (Desktop Chrome)
- Firefox (Desktop Firefox)
- WebKit (Desktop Safari)

### Test Settings
- **Base URL**: https://firsttrip.com
- **Timeout**: 30 seconds per test
- **Retries**: 2 retries on CI, 0 locally
- **Reporter**: HTML reporter with trace collection

## 🚨 Known Issues and Limitations

### Current Implementation Status
1. **UI Tests**: Partially working - successfully captures prices and performs filtering
2. **API Tests**: Not implemented (no public APIs identified)
3. **CI/CD Integration**: Ready for implementation

### Areas for Improvement
1. **Selector Robustness**: Some selectors may need refinement for different page states
2. **Error Handling**: Enhanced error recovery mechanisms
3. **Test Data Management**: Dynamic test data generation
4. **Cross-browser Compatibility**: Additional testing on different browsers

## 🔄 CI/CD Integration

### GitHub Actions (Optional)
The framework is ready for CI/CD integration. Example workflow:

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 18
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

### Jenkins Integration
For Jenkins integration:
1. Install Node.js plugin
2. Configure pipeline with npm and Playwright commands
3. Archive test reports and screenshots as artifacts

## 📈 Test Results Summary

### Successful Test Components
✅ Page navigation and loading  
✅ Price capture and extraction  
✅ Airline filtering functionality  
✅ Sign-in modal detection  
✅ Screenshot capture  
✅ Detailed logging  
✅ Price comparison logic  

### Partially Working Components
⚠️ Complete end-to-end workflow (timeout issues)  
⚠️ Dynamic element selection (needs refinement)  

## 🤝 Contributing

### Development Guidelines
1. Follow TypeScript best practices
2. Maintain Page Object Model pattern
3. Add comprehensive logging for new features
4. Include screenshot capture for visual verification
5. Update documentation for new functionality

### Testing Guidelines
1. Test on multiple browsers before committing
2. Ensure all screenshots are captured correctly
3. Verify price comparison logic with different datasets
4. Test error scenarios and edge cases

For questions or issues with this automation framework:
1. Check the test reports in `playwright-report/`
2. Review screenshots in `screenshots/` directory
3. Examine console logs for detailed error information
4. Verify configuration settings in `config.ts`
# firsttrip-playwright-qa-automation
