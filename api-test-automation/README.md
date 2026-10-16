# iFortepay - Create VA API Test Automation

**Tools:** Cypress 13 + Cucumber (Gherkin BDD, `@badeball/cypress-cucumber-preprocessor`),
Node.js `crypto` (signature generator).

## Structure

```
api-test-automation/
├── TestCases_API_Create_VA.xlsx                     # 60 test cases + Actual Result + Status
├── cypress.config.js                                # baseUrl, credentials (.env), Cucumber, signature tasks
├── cypress/
│   ├── e2e/create_va/                               # Gherkin scenarios (BDD)
│   │   ├── 01_positive.feature
│   │   ├── 02_header_signature.feature
│   │   ├── 03_mandatory_field.feature
│   │   ├── 04_field_validation.feature
│   │   └── 05_non_functional.feature
│   ├── support/step_definitions/
│   │   ├── create_va.steps.js                       # Given / When / Then implementation
│   │   └── hooks.js                                 # saves status per scenario
│   └── fixtures/va_request.json                     # valid base request body
├── scripts/
│   ├── env.js                                       # loads .env
│   └── generate_signature.js                        # Authorization & x-req-signature generator
└── package.json
```

## How it works

Example scenario:

```gherkin
Scenario: TC-API-042 - Create VA with amount below minimum (9999)
  Given a valid Create VA request body
  And the field "amount" is set to 9999
  When I send the Create VA request
  Then the request should be rejected with response_code "01" for field "amount"
```

- **Feature files** describe the behaviour in plain language. Every scenario name starts with the
  test case ID (`TC-API-xxx`) from the xlsx, and is tagged with its priority (`@CRITICAL`, `@HIGH`, ...).
  Similar cases use `Scenario Outline` + `Examples` (data-driven).
- **Step definitions** (`create_va.steps.js`):
  - `Given a valid Create VA request body` loads `va_request.json` with a unique `external_id`.
  - `Given ...` steps change the body / headers (set, remove, fill N chars, wrong signature, ...).
  - `When I send the Create VA request` generates `Authorization = Basic Base64(merchant_index:secret_unbound_id)`
    and `x-req-signature = SHA256(hash_key + external_id + order_id)` from the body that is sent
    (via `cy.task`, reusing `scripts/generate_signature.js`), then sends `POST /va`.
  - `Then ...` steps assert:
    - all: HTTP < 500 and response time < 3000 ms
    - success: HTTP 200, `response_code` `00`, `va_number` generated, `transaction_status` `ACTIVE`,
      `external_id` / `amount` / `payment_system` match the request
    - invalid field: `response_code` `01` and `response_message` mentions the field
    - rejected (auth / signature / x-version / channel / max amount): `response_code` is not `00`
- Duplicate cases create their own fresh VA first and only reuse that new data.
- Response and status of every scenario are saved to `reports/actual_results.json`.

Tags: `@positive`, `@negative`, `@header`, `@mandatory`, `@validation`, `@non-functional`,
`@security`, `@performance`, `@blocked`, priority `@CRITICAL` / `@HIGH` / `@MEDIUM` / `@LOW`, and `@TC-API-xxx`.

## Setup credentials (.env)

Credentials are read from `.env` (not committed). Copy the template and fill in the values
from the assessment document:

```bash
cp .env.example .env    # PowerShell: Copy-Item .env.example .env
```

| Key | Description |
|---|---|
| `BASE_URL` | `https://api-stage.mcpayment.id` |
| `MERCHANT_INDEX` | merchant index |
| `SECRET_UNBOUND_ID` | secret unbound id |
| `HASH_KEY` | hash key for `x-req-signature` |
| `X_VERSION` | `v3` (optional, default `v3`) |

If a value is missing, Cypress and the signature script stop with `Missing env: ...`.

## Run

```bash
npm install
npm test               # headless run (all feature files)
npm run test:open      # Cypress UI
npm run test:report    # + HTML report in reports/
npm run signature:test # verify signature generator against the sample cURL
```

Run by tag or by feature file:

```bash
npx cypress run --env tags="@CRITICAL"
npx cypress run --env tags="@negative and not @blocked"
npx cypress run --env tags="@TC-API-042"
npx cypress run --spec cypress/e2e/create_va/01_positive.feature
```


> Running from the VS Code terminal and getting `Cypress.exe: bad option: --smoke-test`?
> VS Code sets `ELECTRON_RUN_AS_NODE=1`. Unset it first:
> PowerShell `Remove-Item Env:ELECTRON_RUN_AS_NODE`, bash `unset ELECTRON_RUN_AS_NODE`.

## Execution result on staging (2026-10-16)

Run against `https://api-stage.mcpayment.id/va`: **60 tests, 51 passed, 9 failed.**

Actual response format (differs from the document):

```json
// success (HTTP 200) - no "Success" message, returns VA data
{ "response_code": "00", "transaction_id": "...", "external_id": "...", "transaction_status": "ACTIVE",
  "payment_details": { "va_number": "8889906200280965016", "amount": 10000, "payment_system": "CLOSED", ... }, ... }
// error (HTTP 400) - descriptive message instead of "Invalid <field_name>"
{ "response_code": "01", "response_message": "email in customer_details is required" }
```

### Defects found (test fails as expected by spec)

| Test | Spec | Actual |
|---|---|---|
| TC-API-018 | `x-version` is mandatory | Request without `x-version` is accepted (`00`) |
| TC-API-019 | `x-version` value must be `v3` | `x-version: v2` is accepted (`00`) |
| TC-API-032 | `phone` is mandatory | Request without `phone` is accepted (`00`) |
| TC-API-054 | `phone` 8-15 digits | 7 digits accepted (`00`) |
| TC-API-055 | `phone` 8-15 digits | 16 digits accepted (`00`) |
| TC-API-056 | `phone` digits only | `08988abcde` accepted (`00`) |
| TC-API-050 | `transaction_description` max 100 chars | 101 chars accepted (`00`) |

### Blocked / need clarification

| Test | Note |
|---|---|
| TC-API-002, TC-API-003 | `OPEN` / `PARTIAL` require undocumented field `is_multi_use: true`; with it, API returns `04 payment channel is not found` (merchant not configured for multi-use VA on staging). |

### Document gaps

- Response key is `response_code` / `response_message`, not documented.
- Other codes exist: `03` (amount above merchant maximal transaction amount), `04` (invalid signature, channel not found).
- `is_multi_use` is required for `OPEN` / `PARTIAL` but not in the field list.
