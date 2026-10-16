/// <reference types="cypress" />
/**
 * Step definitions for cypress/e2e/create_va/*.feature (POST /va)
 *
 * Authorization   = Basic Base64(merchant_index:secret_unbound_id)
 * x-req-signature = SHA256(hash_key + external_id + order_id)
 * Both are generated on Node side (cy.task) from the body that is actually sent.
 */
import { Given, When, Then, Before } from '@badeball/cypress-cucumber-preprocessor';

const FIELD_PATH = {
  billing_name: 'payment_details.billing_name',
  payment_system: 'payment_details.payment_system',
  amount: 'payment_details.amount',
  expired_time: 'payment_details.expired_time',
  transaction_description: 'payment_details.transaction_description',
  is_multi_use: 'payment_details.is_multi_use',
  email: 'customer_details.email',
  full_name: 'customer_details.full_name',
  phone: 'customer_details.phone',
};
const pathOf = (field) => FIELD_PATH[field] || field;

const uniqueId = () => `${Date.now()}${Cypress._.random(100000, 999999)}`;

// scenario state, reset before every scenario
let ctx;

Before(() => {
  ctx = {
    body: null,
    headerOverrides: {},     // header name -> value, or null to remove
    signatureVariant: null,  // 'wrong_hash_key' | 'different_order_id'
    authVariant: null,       // 'wrong_secret'
    createdVa: null,
    response: null,
  };
});

// ---------- helpers ----------

function buildHeaders(body) {
  const env = Cypress.env();
  const externalId = body.external_id === undefined ? '' : String(body.external_id);
  const orderId = body.order_id === undefined ? '' : String(body.order_id);
  const headers = { 'Content-Type': 'application/json', 'x-version': env.x_version };

  const secret = ctx.authVariant === 'wrong_secret' ? 'wrongsecret' : env.secret_unbound_id;
  const hashKey = ctx.signatureVariant === 'wrong_hash_key' ? 'wrong_hash_key' : env.hash_key;
  const signedOrderId = ctx.signatureVariant === 'different_order_id' ? `${orderId}-X` : orderId;

  return cy.task('generateAuthorization', { merchantIndex: env.merchant_index, secretUnboundId: secret }, { log: false })
    .then((auth) => { headers.Authorization = auth; })
    .then(() => cy.task('generateSignature', { hashKey, externalId, orderId: signedOrderId }, { log: false }))
    .then((signature) => {
      headers['x-req-signature'] = signature;
      Object.entries(ctx.headerOverrides).forEach(([key, value]) => {
        if (value === null) delete headers[key];
        else headers[key] = value;
      });
      return headers;
    });
}

function postVa(body) {
  return buildHeaders(body).then((headers) =>
    cy.request({ method: 'POST', url: '/va', headers, body, failOnStatusCode: false }));
}

function responseDetail() {
  return `response: ${JSON.stringify(ctx.response.body).slice(0, 300)}`;
}

function expectNoServerError() {
  expect(ctx.response.status, `no server error (HTTP < 500) | ${responseDetail()}`).to.be.lessThan(500);
  expect(ctx.response.duration, 'response time (ms)').to.be.lessThan(Cypress.env('max_response_time'));
}

// ---------- Given ----------

Given('a valid Create VA request body', () => {
  cy.fixture('va_request.json').then((base) => {
    ctx.body = { ...Cypress._.cloneDeep(base), external_id: uniqueId() };
  });
});

Given('the field {string} is set to {}', (field, value) => {
  // value is written as JSON in the feature: "text", 9999, true
  Cypress._.set(ctx.body, pathOf(field), JSON.parse(value));
});

Given('the field {string} is removed', (field) => {
  Cypress._.unset(ctx.body, pathOf(field));
});

Given('the field {string} is filled with {int} characters', (field, length) => {
  Cypress._.set(ctx.body, pathOf(field), field.charAt(0).toUpperCase().repeat(length));
});

Given('the field {string} is filled with an email of {int} characters', (field, length) => {
  const domain = '@gmail.com';
  Cypress._.set(ctx.body, pathOf(field), 'a'.repeat(length - domain.length) + domain);
});

Given('the field {string} is filled with a datetime {int} day(s) from now in ISO-8601 +07:00 format', (field, days) => {
  // format YYYY-MM-DDTHH:mm:ss.SSS+07:00
  const wib = new Date(Date.now() + (days * 24 + 7) * 3600 * 1000);
  Cypress._.set(ctx.body, pathOf(field), wib.toISOString().replace('Z', '+07:00'));
});

Given('the external_id has {int} characters', (length) => {
  ctx.body.external_id = uniqueId().padEnd(length, '0');
});

Given('the header {string} is removed', (header) => {
  ctx.headerOverrides[header] = null;
});

Given('the header {string} is set to {string}', (header, value) => {
  ctx.headerOverrides[header] = value;
});

Given('the Authorization is generated with a wrong secret_unbound_id', () => {
  ctx.authVariant = 'wrong_secret';
});

Given('the x-req-signature is generated with a wrong hash_key', () => {
  ctx.signatureVariant = 'wrong_hash_key';
});

Given('the x-req-signature is generated with a different order_id', () => {
  ctx.signatureVariant = 'different_order_id';
});

Given('a VA has already been created', () => {
  // fresh data created by this scenario only
  const body = { ...Cypress._.cloneDeep(ctx.body), external_id: uniqueId() };
  postVa(body).then((res) => {
    expect(res.body.response_code, 'precondition: VA created').to.eq('00');
    ctx.createdVa = body;
  });
});

Given('the request uses the same external_id as that VA', () => {
  ctx.body.external_id = ctx.createdVa.external_id;
});

Given('the request uses a new external_id with the same order_id', () => {
  ctx.body.external_id = uniqueId();
  ctx.body.order_id = ctx.createdVa.order_id;
});

// ---------- When ----------

When('I send the Create VA request', () => {
  postVa(ctx.body).then((res) => {
    ctx.response = res;
    // saved for the Actual Result column in the test case xlsx
    cy.task('recordResponse', {
      id: Cypress.currentTest.title.split(' - ')[0],
      response: { http: res.status, duration: res.duration, body: res.body },
    }, { log: false });
  });
});

// ---------- Then ----------

Then('the VA should be created successfully', () => {
  const res = ctx.response.body;
  const sent = ctx.body;
  expectNoServerError();
  expect(ctx.response.status, `HTTP status | ${responseDetail()}`).to.eq(200);
  expect(res.response_code, `response_code | ${responseDetail()}`).to.eq('00');
  expect(res.external_id, 'external_id echoed').to.eq(sent.external_id);
  expect(res.payment_channel, 'payment_channel').to.eq('MANDIRI');
  expect(res.transaction_status, 'transaction_status').to.eq('ACTIVE');
  expect(res.payment_details.va_number, 'va_number generated').to.be.a('string').and.not.be.empty;
  expect(res.payment_details.amount, 'amount').to.eq(sent.payment_details.amount);
  expect(res.payment_details.payment_system, 'payment_system')
    .to.eq(sent.payment_details.payment_system || 'CLOSED');
});

Then('the response field {string} should be {string}', (path, expected) => {
  expect(Cypress._.get(ctx.response.body, path), path).to.eq(expected);
});

Then('the request should be rejected with response_code {string} for field {string}', (code, field) => {
  expectNoServerError();
  expect(ctx.response.body.response_code, `response_code | ${responseDetail()}`).to.eq(code);
  expect(String(ctx.response.body.response_message || '').toLowerCase(), 'response_message mentions the field')
    .to.include(field.toLowerCase());
});

Then('the request should be rejected', () => {
  expectNoServerError();
  expect(ctx.response.body.response_code, `request must be rejected | ${responseDetail()}`).to.not.eq('00');
});

Then('there should be no server error', () => {
  expectNoServerError();
});

Then('the response should not expose a database error', () => {
  const text = JSON.stringify(ctx.response.body).toLowerCase();
  ['sql', 'syntax error', 'database', 'exception', 'stack'].forEach((word) => {
    expect(text, `response must not contain "${word}"`).to.not.include(word);
  });
});

Then('the response time should be less than {int} ms', (ms) => {
  expect(ctx.response.duration, 'response time (ms)').to.be.lessThan(ms);
});
