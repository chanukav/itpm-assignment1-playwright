# ITPM Assignment 1 - Playwright Automation

This repository contains automated tests for the ITPM Assignment 1 using [Playwright](https://playwright.dev/).

## About the Project

This project is an automated testing suite designed for **SwiftTranslator** (https://www.swifttranslator.com/). Its primary goal is to validate the accuracy and functionality of the **Singlish to Sinhala** translation feature. The suite includes:

- **Functional Tests**: Verifies that various Singlish inputs are correctly translated into Sinhala.
- **UI Tests**: Ensures the user interface elements (input boxes, output areas) are functioning as expected.
- **Negative Testing**: Checks how the application handles invalid or edge-case inputs.

## Excel Exportation

This project includes a custom **Excel Reporter** that automatically exports test execution results into an Excel file. This allows for easy tracking and analysis of test outcomes.

- **How it works**: A custom reporter (`utils/ExcelReporter.ts`) captures test metadata (input, expected output, actual output, status) during execution and writes it to an Excel sheet.
- **Output Location**: After running the tests, the Excel report is generated at:
  
  `test-results/Test_Results_Final.xlsx`

- **Report Content**: The Excel file includes details such as Test Case ID, Name, Input, Expected vs. Actual Output, Status (Pass/Fail), and justification for the result.

## Prerequisites

Ensure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (usually comes with Node.js)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd itpm-assignment1-playwright
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Running Tests

### Run all tests
To run all tests in headless mode:
```bash
npm test
# or
npx playwright test
```

### Run tests in UI Mode
To run tests with the interactive UI wrapper:
```bash
npm run test:ui
# or
npx playwright test --ui
```

### Run specific tests
To run a specific test file:
```bash
npx playwright test tests/example.spec.ts
```

## Viewing Reports

After running the tests, you can view the execution report by running:
```bash
npm run report
# or
npx playwright show-report
```

## Project Structure

- `tests/`: Contains the test files (`.spec.ts`).
- `test-data/`: Contains data files used for testing.
- `utils/`: Utility functions and helper classes, including the Excel reporter.
- `test-results/`: Directory where test artifacts and the **final Excel report** are saved.
- `playwright.config.ts`: Playwright configuration file.
