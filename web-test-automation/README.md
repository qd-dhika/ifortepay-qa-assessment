# Web Test Automation - Sign Up & Sign In

**Target:** https://automationexercise.com (public demo e-commerce site for test automation practice)
**Tools:** Cypress 13 + Cucumber (Gherkin BDD, `@badeball/cypress-cucumber-preprocessor`), Page Object Model, Chrome.

Test case IDs (`TC-SU-xxx`, `TC-SI-xxx`) refer to the Sign Up / Sign In test case spreadsheet (submitted separately).

## Structure

```
web-test-automation/
├── cypress.config.js                      # baseUrl (.env), Cucumber, blocked ad hosts, retry
├── cypress/
│   ├── e2e/
│   │   ├── 01_sign_up.feature             # Sign Up scenarios
│   │   └── 02_sign_in.feature             # Sign In scenarios
│   ├── fixtures/user.json                 # account data (email is generated per test)
│   └── support/
│       ├── pages/                         # Page Objects: LoginPage, SignupPage, Header
│       ├── api/accountApi.js              # create / delete test account via site API
│       ├── step_definitions/auth.steps.js # Given / When / Then
│       └── e2e.js                         # ignore errors from third-party ads
└── package.json
```

## Test data rule

- Every scenario uses a **new unique email** (`qa.xxx+<timestamp>@mailinator.com`).
- Accounts needed as precondition are created through the site API (`POST /api/createAccount`).
- After every scenario, **only the accounts created by that scenario** are deleted (`DELETE /api/deleteAccount`).
  Existing data on the site is never touched.

## Scenarios

| Feature | Test case |
|---|---|
| Sign Up | TC-SU-001 valid sign up (full flow until "Logged in as"), TC-SU-012 all empty, TC-SU-013 empty name, TC-SU-016 empty email, TC-SU-017 invalid email, TC-SU-018 registered email, TC-SU-019 registered email in uppercase, TC-SU-020 empty password, TC-SU-027 password masked |
| Sign In | TC-SI-001 valid sign in, TC-SI-002 uppercase email, TC-SI-003 Enter key, TC-SI-009 logout, TC-SI-012 wrong password, TC-SI-013 unregistered email, TC-SI-014/015/016 empty fields, TC-SI-017 invalid email, TC-SI-018 password case-sensitive, TC-SI-023 no user enumeration, TC-SI-024 SQL injection, TC-SI-025 password masked |

## Setup & run

```bash
cp .env.example .env     # PowerShell: Copy-Item .env.example .env
npm install
npm test                 # headless Chrome
npm run test:open        # Cypress UI
npm run test:report      # + HTML report in reports/
npx cypress run --browser chrome --env tags="@CRITICAL"
npx cypress run --browser chrome --env tags="@sign-in and @negative"
```

> VS Code terminal: run `Remove-Item Env:ELECTRON_RUN_AS_NODE` first if Cypress fails with `bad option: --smoke-test`.

## Execution result (2026-10-16)

**23 scenarios: 21 passed, 2 failed.**

| Test | Expected | Actual |
|---|---|---|
| TC-SU-019 | Sign up with registered email in uppercase is rejected ("Email Address already exist!") | Not rejected, user goes to "Enter Account Information" (same email can be registered twice with different letter case) |
| TC-SI-002 | Sign in with registered email in uppercase succeeds | Rejected with "Your email or password is incorrect!" (email treated as case-sensitive) |
