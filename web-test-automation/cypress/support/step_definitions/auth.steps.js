/// <reference types="cypress" />
import { Given, When, Then, Before, After } from '@badeball/cypress-cucumber-preprocessor';
import loginPage from '../pages/LoginPage';
import signupPage from '../pages/SignupPage';
import header from '../pages/Header';
import { createAccount, deleteAccount } from '../api/accountApi';

const uniqueEmail = (prefix) => `${prefix}+${Date.now()}${Cypress._.random(1000, 9999)}@mailinator.com`;

const ACCOUNT_FIELDS = { 'account password': '[data-qa="password"]' };
const fieldEl = (name) => (ACCOUNT_FIELDS[name] ? cy.get(ACCOUNT_FIELDS[name]) : loginPage.field(name));

// scenario state
let ctx;

Before(() => {
  ctx = { account: null, newUser: null, cleanup: [] };
});

// delete ONLY the accounts created by this scenario
After(() => {
  ctx.cleanup.forEach(({ email, password }) => deleteAccount(email, password));
});

// ---------- common ----------

Given('I am on the Sign Up \\/ Sign In page', () => {
  loginPage.visit();
});

Given('a registered account exists', () => {
  cy.fixture('user.json').then((user) => {
    const account = { ...user, email: uniqueEmail('qa.signin') };
    createAccount(account).then(() => {
      ctx.account = account;
      ctx.cleanup.push({ email: account.email, password: account.password });
    });
  });
});

Then('I should see the error {string}', (message) => {
  loginPage.errorMessage(message).should('be.visible');
});

Then('the {string} field should be marked as invalid by the browser', (name) => {
  // HTML5 validation blocks the submit and shows a browser message
  fieldEl(name).then(($el) => {
    expect($el[0].checkValidity(), `${name} is invalid`).to.eq(false);
    expect($el[0].validationMessage, `${name} validation message`).to.not.be.empty;
  });
});

Then('the {string} field should mask the input', (name) => {
  fieldEl(name).should('have.attr', 'type', 'password');
});

Then('I should stay on the Sign Up \\/ Sign In page', () => {
  cy.location('pathname').should('eq', '/login');
});

Then('I should not be logged in', () => {
  header.loginLink.should('be.visible');
  cy.contains('a', 'Logged in as').should('not.exist');
});

// ---------- sign up ----------

When('I fill the sign up form with a new name and email', () => {
  cy.fixture('user.json').then((user) => {
    ctx.newUser = { ...user, email: uniqueEmail('qa.signup') };
    loginPage.fillSignup(ctx.newUser.name, ctx.newUser.email);
  });
});

When('I fill the sign up form with name {string} and email {string}', (name, email) => {
  loginPage.fillSignup(name, email);
});

When('I fill the sign up form with the registered email', () => {
  loginPage.fillSignup(ctx.account.name, ctx.account.email);
});

When('I fill the sign up form with the registered email in uppercase', () => {
  loginPage.fillSignup(ctx.account.name, ctx.account.email.toUpperCase());
});

When('I click the Sign Up button', () => {
  loginPage.clickSignup();
});

Then('the account information form should be displayed', () => {
  signupPage.heading.should('be.visible');
  cy.get('[data-qa="name"]').should('have.value', ctx.newUser.name);
  cy.get('[data-qa="email"]').should('have.value', ctx.newUser.email);
});

When('I complete the account information form', () => {
  signupPage.fillAccountInformation(ctx.newUser);
});

When('I complete the account information form without password', () => {
  signupPage.fillAccountInformation({ ...ctx.newUser, password: '' });
});

When('I click the Create Account button', () => {
  signupPage.createAccountButton.click();
});

Then('the account should be created successfully', () => {
  ctx.cleanup.push({ email: ctx.newUser.email, password: ctx.newUser.password });
  cy.location('pathname').should('eq', '/account_created');
  signupPage.accountCreatedTitle.should('be.visible').and('contain.text', 'Account Created!');
});

Then('the account should not be created', () => {
  cy.location('pathname').should('eq', '/signup');
  signupPage.heading.should('be.visible');
});

When('I click the Continue button', () => {
  signupPage.continueButton.click();
});

Then('I should be logged in as the new user', () => {
  header.loggedInAs.should('be.visible').and('contain.text', ctx.newUser.name);
});

// ---------- sign in ----------

When('I sign in with the registered email and password', () => {
  loginPage.fillLogin(ctx.account.email, ctx.account.password);
  loginPage.clickLogin();
});

When('I sign in with the registered email in uppercase and the correct password', () => {
  loginPage.fillLogin(ctx.account.email.toUpperCase(), ctx.account.password);
  loginPage.clickLogin();
});

When('I sign in with the registered email and password {string}', (password) => {
  loginPage.fillLogin(ctx.account.email, password);
  loginPage.clickLogin();
});

When('I sign in with the registered email and the password in lowercase', () => {
  loginPage.fillLogin(ctx.account.email, ctx.account.password.toLowerCase());
  loginPage.clickLogin();
});

When('I sign in with an unregistered email and the correct password', () => {
  loginPage.fillLogin(uniqueEmail('qa.notregistered'), ctx.account.password);
  loginPage.clickLogin();
});

When('I sign in with email {string} and password {string}', (email, password) => {
  loginPage.fillLogin(email, password);
  loginPage.clickLogin();
});

When('I fill the registered email and password and press Enter', () => {
  loginPage.fill('sign in email', ctx.account.email);
  loginPage.field('sign in password').type(`${ctx.account.password}{enter}`, { log: false });
});

Given('I am signed in with the registered account', () => {
  loginPage.fillLogin(ctx.account.email, ctx.account.password);
  loginPage.clickLogin();
  header.loggedInAs.should('be.visible');
});

Then('I should be logged in as the registered user', () => {
  header.loggedInAs.should('be.visible').and('contain.text', ctx.account.name);
  header.logoutLink.should('be.visible');
});

When('I click Logout', () => {
  header.logoutLink.click();
});

Then('I should be signed out', () => {
  cy.location('pathname').should('eq', '/login');
  header.loginLink.should('be.visible');
  cy.contains('a', 'Logged in as').should('not.exist');
});

When('I go back to the previous page', () => {
  cy.go('back');
});

When('I reload the page', () => {
  cy.reload();
  // after reload the protected state must still be signed out
  cy.visit('/login');
});
