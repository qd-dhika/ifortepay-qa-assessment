const path = require('path');
const { defineConfig } = require('cypress');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');

require('dotenv').config({ path: path.join(__dirname, '.env') });
if (!process.env.BASE_URL) {
  throw new Error('Missing env: BASE_URL. Copy .env.example to .env.');
}

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL,
    specPattern: 'cypress/e2e/**/*.feature',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1366,
    viewportHeight: 768,
    defaultCommandTimeout: 10000,
    video: false,
    retries: { runMode: 1, openMode: 0 },
    // third-party ads on the demo site slow down / cover the page
    blockHosts: [
      '*googlesyndication.com', '*doubleclick.net', '*googleadservices.com', '*google-analytics.com',
      '*googletagmanager.com', '*adservice.google.com', '*fundingchoicesmessages.google.com',
    ],
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on('file:preprocessor', createBundler({ plugins: [createEsbuildPlugin(config)] }));
      return config;
    },
  },
});
