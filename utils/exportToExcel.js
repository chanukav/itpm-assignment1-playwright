const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function exportResults(results = []) {
    if (!results || results.length === 0) {
        console.log("No results to export.");
        return;
    }

    const templatePath = path.resolve(__dirname, '../test-data/Test_Results_Template.xlsx');
    const outputPath = path.resolve(__dirname, '../test-results/Test_Results_Final.xlsx');

    const workbook = new ExcelJS.Workbook();

    try {
        if (fs.existsSync(templatePath)) {
            await workbook.xlsx.readFile(templatePath);
        } else {
            console.log("Template not found, creating new workbook.");
            const sheet = workbook.addWorksheet('Test cases');
            sheet.addRow(["TC ID", "Test case name", "Input length type", "Input", "Expected output", "Actual output", "Status", "Accuracy justification/ Description of issue type", "What is covered by the test"]);
        }

        // Get the sheet - assume 'Test cases' or first sheet
        let worksheet = workbook.getWorksheet('Test cases');
        if (!worksheet) {
            worksheet = workbook.worksheets[0];
        }

        // Add rows
        results.forEach(r => {
            const inputLen = r.input ? r.input.length : 0;
            let lengthType = "L";
            if (inputLen <= 30) lengthType = "S";
            else if (inputLen <= 100) lengthType = "M";

            const justification = r.status === 'Pass'
                ? "The sentence is converted correctly as expected."
                : r.error || "Issue identified during testing.";

            // Default coverage or from annotation
            let coverage = r.coverage || "Accuracy validation";
            if (r.testId && r.testId.startsWith("Neg")) {
                coverage = "Negative Scenario";
            } else if (lengthType === 'S') {
                coverage = "Simple sentence";
            }

            const rowData = [
                r.testId,
                r.testName,
                lengthType,
                r.input,
                r.expected,
                r.actual,
                r.status,
                justification,
                coverage
            ];

            // Add row
            const row = worksheet.addRow(rowData);

            // Style the new row slightly to match common Excel expectations (vertical align center, wrap text)
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                let horizontal = 'left';
                // Center align specific columns: TC ID (1), Input length type (3), Status (7)
                if ([1, 3, 7].includes(colNumber)) {
                    horizontal = 'center';
                }

                cell.alignment = { wrapText: true, vertical: 'top', horizontal: horizontal };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
        });

        // Ensure output directory exists
        if (!fs.existsSync(path.dirname(outputPath))) {
            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        }

        await workbook.xlsx.writeFile(outputPath);
        console.log(`Results exported to ${outputPath}`);

    } catch (err) {
        console.error("Error exporting to excel:", err);
    }
}

module.exports = { exportResults };
