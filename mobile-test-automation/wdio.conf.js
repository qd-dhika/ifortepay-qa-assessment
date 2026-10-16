const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const APP_PATH = path.resolve(__dirname, process.env.APP_PATH || 'apps/android.wdio.native.app.v2.2.0.apk');
const APP_PACKAGE = 'com.wdiodemoapp';
const STEP_FILES = require('fs')
  .readdirSync(path.join(__dirname, 'features', 'step-definitions'))
  .filter((file) => file.endsWith('.js'))
  .map((file) => `./features/step-definitions/${file}`);

exports.config = {
  runner: 'local',
  specs: ['./features/**/*.feature'],
  maxInstances: 1,

  // Appium server is started automatically by @wdio/appium-service
  port: 4723,
  services: [['appium', { command: 'appium', args: { relaxedSecurity: true } }]],

  capabilities: [{
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': process.env.DEVICE_NAME || 'Android Emulator',
    // emulator is launched automatically when AVD_NAME is set and no device is connected
    ...(process.env.AVD_NAME ? { 'appium:avd': process.env.AVD_NAME, 'appium:avdLaunchTimeout': 240000 } : {}),
    'appium:app': APP_PATH,
    'appium:appPackage': APP_PACKAGE,
    'appium:appActivity': '.MainActivity',
    'appium:autoGrantPermissions': true,
    'appium:newCommandTimeout': 240,
    'appium:uiautomator2ServerInstallTimeout': 120000,
    'appium:adbExecTimeout': 120000,
  }],

  logLevel: 'warn',
  waitforTimeout: 15000,
  connectionRetryTimeout: 240000,
  connectionRetryCount: 1,

  framework: 'cucumber',
  reporters: ['spec'],
  cucumberOpts: {
    // explicit file list: glob patterns are not resolved on Windows paths with spaces
    require: STEP_FILES,
    tags: process.env.TAGS || '',
    timeout: 120000,
    retry: 0,
  },

  // fresh app state for every scenario
  beforeScenario: async () => {
    await driver.terminateApp(APP_PACKAGE);
    await driver.activateApp(APP_PACKAGE);
  },

  // screenshot on failure
  afterStep: async (step, scenario, result) => {
    if (!result.passed) {
      const name = scenario.name.split(' - ')[0];
      await driver.saveScreenshot(path.join(__dirname, 'reports', 'screenshots', `${name}.png`));
    }
  },

  onPrepare: () => {
    require('fs').mkdirSync(path.join(__dirname, 'reports', 'screenshots'), { recursive: true });
  },
};
