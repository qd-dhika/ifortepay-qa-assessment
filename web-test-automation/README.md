# Web Test Automation - Sign Up & Sign In

Target: https://automationexercise.com
Tools: Cypress + Cucumber (Gherkin BDD), Page Object Model

## Run

```bash
npm install
cp .env.example .env
npm test                  # run all (Chrome)
npm run test:report       # run + HTML report (reports/)
```

Run by tag: `npx cypress run --browser chrome --env tags="@sign-in"`

## Structure

- `cypress/e2e/*.feature` - test scenarios
- `cypress/support/pages/` - page objects
- `cypress/support/step_definitions/` - step implementation
- `cypress/support/api/accountApi.js` - create / delete test account

Each test uses a new account and deletes only that account after the test.

## Result

23 tests: 21 passed, 2 failed.

| Bug | Test case |
|---|---|
| Email is case-sensitive (uppercase email can be registered again and cannot sign in) | TC-SU-019, TC-SI-002 |
