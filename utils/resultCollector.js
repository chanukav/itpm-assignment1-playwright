const results = [];

function addResult({
    testId,
    testName,
    input,
    expected,
    actual,
    status,
    type
}) {
    results.push({
        testId,
        testName,
        input,
        expected,
        actual,
        status,
        type
    });
}

function getResults() {
    return results;
}

module.exports = { addResult, getResults };
