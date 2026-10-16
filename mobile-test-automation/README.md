# Mobile Test Automation - Sign Up & Sign In (Android)

**Target app:** [WebdriverIO Native Demo App](https://github.com/webdriverio/native-demo-app) v2.2.0 (Android APK),
a public demo app for mobile automation practice with a native "Login / Sign up Form".
**Tools:** Appium 2 + UiAutomator2 driver, WebdriverIO 9, Cucumber (Gherkin BDD), Screen Object pattern.

Test case IDs (`TC-SU-xxx`, `TC-SI-xxx`) refer to `../frontend-test-cases/TestCases_SignUp_SignIn.xlsx`.

## Structure

```
mobile-test-automation/
├── wdio.conf.js                          # Appium service, Android capabilities, Cucumber, screenshot on failure
├── apps/                                 # APK (downloaded by script, not committed: > 100 MB)
├── features/
│   ├── 01_sign_up.feature                # Sign Up scenarios
│   ├── 02_sign_in.feature                # Sign In scenarios
│   ├── pageobjects/
│   │   ├── login.screen.js               # Login / Sign up screen (accessibility id locators)
│   │   └── alert.js                      # native Android alert
│   └── step-definitions/auth.steps.js    # Given / When / Then
├── scripts/download-app.js
└── package.json
```

## Scenarios

| Feature | Test case |
|---|---|
| Sign Up | TC-SU-001 valid data, TC-SU-002 password 8 chars, TC-SU-012 all empty, TC-SU-016 empty email, TC-SU-017 invalid email, TC-SU-020 empty password, TC-SU-021 password < 8 chars, TC-SU-023 confirm password mismatch, TC-SU-027 password masked, TC-SU-010 switch to Sign In |
| Sign In | TC-SI-001 valid sign in, TC-SI-014 all empty, TC-SI-015 empty password, TC-SI-016 empty email, TC-SI-017 invalid email, TC-SI-025 password masked, TC-SI-010 switch to Sign Up |

> The demo app validates input on the client only (no backend), so cases that need a real account
> (registered email, wrong password, account lock, etc.) are covered by the web automation instead.

## Prerequisites

- Node.js 18+ and Java 17+ (`JAVA_HOME` set)
- Android SDK with `platform-tools`, `emulator`, `build-tools;34.0.0`, `platforms;android-34`,
  `system-images;android-34;google_apis;x86_64`, and `ANDROID_HOME` set
- An emulator (AVD) or a real device with USB debugging

Example setup with Android command-line tools:

```bash
sdkmanager "platform-tools" "emulator" "build-tools;34.0.0" "platforms;android-34" "system-images;android-34;google_apis;x86_64"
avdmanager create avd -n Pixel_7_API_34 -k "system-images;android-34;google_apis;x86_64" -d pixel_7
```

## Setup & run

```bash
cp .env.example .env     # PowerShell: Copy-Item .env.example .env
npm install
npm run setup            # download APK + install Appium UiAutomator2 driver
npm test                 # starts Appium, launches the AVD from .env if no device is running, runs all features
```

Run by tag:

```bash
TAGS="@CRITICAL" npm test                    # bash
$env:TAGS="@sign-up and @negative"; npm test # PowerShell
```

Screenshots of failed steps are saved to `reports/screenshots/`.

## Execution result (2026-10-16)

Android 14 emulator (Pixel 7, API 34): **17 scenarios, 17 passed.**
