# iFortepay QA Assessment

Answers and automation for the iFortepay QA Assessment.

| Section | Deliverable | Tools |
|---|---|---|
| QA Basic | Submitted separately (document) | - |
| API Test Automation | [api-test-automation/](api-test-automation/): test scenarios, bug list, automation, signature generator | Cypress + Cucumber (Gherkin BDD), Node.js `crypto` |
| Front End: test cases & UI elements | Submitted separately (spreadsheet) | - |
| Front End: Web automation | [web-test-automation/](web-test-automation/) | Cypress + Cucumber (Gherkin BDD), Page Object Model |
| Front End: Mobile automation | [mobile-test-automation/](mobile-test-automation/) | Appium 2 (UiAutomator2) + WebdriverIO + Cucumber (Gherkin BDD) |

## Summary of results (2026-10-16)

| Project | Target | Scenarios | Passed | Failed | Notes |
|---|---|---|---|---|---|
| API | `POST https://api-stage.mcpayment.id/va` (staging) | 60 | 51 | 9 | 7 defects found, 2 blocked by staging merchant config |
| Web | https://automationexercise.com | 23 | 21 | 2 | email is handled case-sensitively |
| Mobile | WebdriverIO Native Demo App (Android 14 emulator) | 17 | 17 | 0 | |

### API defects

| Bug | Test case |
|---|---|
| `x-version` header not validated (missing or `v2` is accepted) | TC-API-018, TC-API-019 |
| Mandatory `phone` not validated (request without phone is accepted) | TC-API-032 |
| `phone` length (8-15 digits) and numeric format not validated | TC-API-054, TC-API-055, TC-API-056 |
| `transaction_description` longer than 100 chars is accepted | TC-API-050 |
| `OPEN` / `PARTIAL` need undocumented `is_multi_use: true`, then return `04 payment channel is not found` (blocked) | TC-API-002, TC-API-003 |

Full details (steps, expected, actual, evidence) are in the **Bug List** sheet of
[api-test-automation/TestCases_API_Create_VA.xlsx](api-test-automation/TestCases_API_Create_VA.xlsx).

### Web defect

Email is case-sensitive: the same email can be registered again in uppercase (TC-SU-019) and sign in with
the registered email in uppercase fails (TC-SI-002).

## Repository structure

```
.
├── api-test-automation/          # API: Cypress BDD + signature generator
├── web-test-automation/          # Web: Cypress BDD + Page Object Model
└── mobile-test-automation/       # Mobile: Appium + WebdriverIO BDD
```

Every project has its own README with setup and run commands.
Credentials are not committed: copy `.env.example` to `.env` in each project and fill in the values
(for the API, use the credentials from the assessment document).

## Quick start

```bash
# API
cd api-test-automation && npm install && cp .env.example .env   # fill credentials
npm test

# Web
cd web-test-automation && npm install && cp .env.example .env
npm test

# Mobile (Android SDK + emulator required, see mobile-test-automation/README.md)
cd mobile-test-automation && npm install && cp .env.example .env
npm run setup && npm test
```
