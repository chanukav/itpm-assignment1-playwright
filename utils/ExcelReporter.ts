import { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
const { exportResults } = require('./exportToExcel');

class ExcelReporter implements Reporter {
    private results: any[] = [];

    onTestEnd(test: TestCase, result: TestResult) {
        // Skip if not part of the functional suite we care about (optional filter)
        // For now collect all that match the ID pattern or have annotations

        // Extract ID and Name from title "Pos_Fun_0001 - Convert a simple sentence"
        // Or use annotations if we add them. 
        // Title format: "ID - Name"
        const titleRegex = /^([A-Za-z0-9_]+)\s-\s(.+)$/;
        const match = test.title.match(titleRegex);

        let testId = "";
        let testName = test.title;

        if (match) {
            testId = match[1];
            testName = match[2];
        }

        // Capture annotations
        const inputAnnotation = test.annotations.find(a => a.type === 'input');
        const expectedAnnotation = test.annotations.find(a => a.type === 'expected');
        const coverageAnnotation = test.annotations.find(a => a.type === 'coverage');

        // Capture actual result from attachment if exists
        // We will attach 'actual' in the test
        const actualAttachment = result.attachments.find(a => a.name === 'actual');
        let actual = "";
        if (actualAttachment && actualAttachment.body) {
            actual = actualAttachment.body.toString();
        } else if (result.error) {
            actual = result.error.message || "Error";
        }

        const input = inputAnnotation ? inputAnnotation.description : "";
        const expected = expectedAnnotation ? expectedAnnotation.description : "";
        const coverage = coverageAnnotation ? coverageAnnotation.description : "";

        const status = result.status === 'passed' ? 'Pass' : 'Fail';

        this.results.push({
            testId,
            testName,
            input,
            expected,
            actual,
            status,
            coverage,
            error: result.error ? result.error.message : null
        });
    }

    async onEnd(result: FullResult) {
        console.log(`Exporting ${this.results.length} results to Excel...`);
        await exportResults(this.results);
    }
}

export default ExcelReporter;
