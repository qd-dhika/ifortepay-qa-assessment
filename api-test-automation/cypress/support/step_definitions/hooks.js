// Save pass/fail status per scenario for the Actual Result & Status columns in the test case xlsx.
// Plain mocha afterEach is used because it also runs when a step fails.
afterEach(function () {
  const test = this.currentTest;
  cy.task('recordStatus', {
    id: test.title.split(' - ')[0],
    state: test.state,
    error: test.err ? test.err.message.split(' | ')[0] : '',
  }, { log: false });
});
