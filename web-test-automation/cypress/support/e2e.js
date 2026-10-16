// Errors thrown by third-party scripts (ads) on the demo site must not fail the test
Cypress.on('uncaught:exception', () => false);
