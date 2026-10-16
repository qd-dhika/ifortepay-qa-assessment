# API Test Automation - Create VA

Target: `POST https://api-stage.mcpayment.id/va`
Tools: Cypress + Cucumber (Gherkin BDD)

## Run

```bash
npm install
cp .env.example .env      # fill credentials from the assessment document
npm test                  # run all
npm run test:report       # run + HTML report (reports/)
npm run signature:test    # check signature generator
```

Run by tag: `npx cypress run --env tags="@CRITICAL"`

## Structure

- `cypress/e2e/create_va/*.feature` - test scenarios
- `cypress/support/step_definitions/` - step implementation
- `cypress/fixtures/va_request.json` - default request body
- `scripts/generate_signature.js` - Authorization & x-req-signature generator
- `TestCases_API_Create_VA.xlsx` - test cases, actual result, bug list
