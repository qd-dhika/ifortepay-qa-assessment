const { defineConfig } = require('cypress');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');
const fs = require('fs');
const path = require('path');
const { generateAuthorization, generateSignature } = require('./scripts/generate_signature');
const { loadConfig } = require('./scripts/env');

// credentials come from .env (see .env.example)
const config = loadConfig();

module.exports = defineConfig({
  e2e: {
    baseUrl: config.base_url,
    specPattern: 'cypress/e2e/**/*.feature',
    supportFile: false,
    video: false,
    env: {
      merchant_index: config.merchant_index,
      secret_unbound_id: config.secret_unbound_id,
      hash_key: config.hash_key,
      x_version: config.x_version,
      max_response_time: 3000,
    },
    async setupNodeEvents(on, cypressConfig) {
      // Gherkin .feature support
      await addCucumberPreprocessorPlugin(on, cypressConfig);
      on('file:preprocessor', createBundler({ plugins: [createEsbuildPlugin(cypressConfig)] }));

      // actual response & status per test case, saved to reports/actual_results.json
      const resultFile = path.join(__dirname, 'reports', 'actual_results.json');
      const results = {};
      const save = () => {
        fs.mkdirSync(path.dirname(resultFile), { recursive: true });
        fs.writeFileSync(resultFile, JSON.stringify(results, null, 2));
        return null;
      };

      on('task', {
        recordResponse: ({ id, response }) => {
          results[id] = { ...(results[id] || {}), response };
          return save();
        },
        recordStatus: ({ id, state, error }) => {
          results[id] = { ...(results[id] || {}), state, error };
          return save();
        },
        // signature is generated on Node side (crypto), reusing scripts/generate_signature.js
        generateAuthorization: ({ merchantIndex, secretUnboundId }) =>
          generateAuthorization(merchantIndex, secretUnboundId),
        generateSignature: ({ hashKey, externalId, orderId }) =>
          generateSignature(hashKey, externalId, orderId),
      });

      return cypressConfig;
    },
  },
});
