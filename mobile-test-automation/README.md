# Mobile Test Automation - Sign Up & Sign In (Android)

Target: [WebdriverIO Native Demo App](https://github.com/webdriverio/native-demo-app) v2.2.0
Tools: Appium + WebdriverIO + Cucumber (Gherkin BDD)

## Requirements

- Node.js, Java 17+
- Android SDK (`ANDROID_HOME`) with an emulator, e.g. `Pixel_7_API_34`

## Run

```bash
npm install
cp .env.example .env      # set AVD_NAME
npm run setup             # download APK + install Appium driver
npm test                  # run all
```

Run by tag (PowerShell): `$env:TAGS="@sign-up"; npm test`

## Structure

- `features/*.feature` - test scenarios
- `features/pageobjects/` - screen objects
- `features/step-definitions/` - step implementation
