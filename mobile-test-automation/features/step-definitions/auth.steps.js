const { Given, When, Then } = require('@wdio/cucumber-framework');
const loginScreen = require('../pageobjects/login.screen');
const nativeAlert = require('../pageobjects/alert');

// ---------- Given ----------

Given('I open the Login screen', async () => {
  await loginScreen.open();
});

Given('I switch to the Sign up tab', async () => {
  await loginScreen.switchToSignUp();
});

When('I switch to the Login tab', async () => {
  await loginScreen.switchToLogin();
});

// ---------- When ----------

When('I sign up with email {string}, password {string} and confirm password {string}', async (email, password, confirm) => {
  await loginScreen.signUp(email, password, confirm);
});

When('I sign in with email {string} and password {string}', async (email, password) => {
  await loginScreen.signIn(email, password);
});

When('I type {string} in the password field', async (value) => {
  await loginScreen.fill(loginScreen.password, value);
});

When('I type {string} in the password and confirm password fields', async (value) => {
  await loginScreen.fill(loginScreen.password, value);
  await loginScreen.fill(loginScreen.repeatPassword, value);
});

// ---------- Then ----------

Then('I should see the alert {string} with message {string}', async (title, message) => {
  await nativeAlert.waitForShown();
  await expect(nativeAlert.title).toHaveText(title);
  await expect(nativeAlert.message).toHaveText(message);
  await nativeAlert.close();
});

Then('I should see the error {string}', async (message) => {
  await expect(loginScreen.errorText(message)).toBeDisplayed();
});

Then('no alert should be displayed', async () => {
  expect(await nativeAlert.isShown()).toBe(false);
});

Then('the password field should be masked', async () => {
  await expect(loginScreen.password).toHaveAttribute('password', 'true');
});

Then('the confirm password field should be masked', async () => {
  await expect(loginScreen.repeatPassword).toHaveAttribute('password', 'true');
});

Then('the Login form should be displayed', async () => {
  await expect(loginScreen.loginButton).toBeDisplayed();
  await expect(loginScreen.repeatPassword).not.toBeDisplayed();
});

Then('the Sign up form should be displayed', async () => {
  await expect(loginScreen.signUpButton).toBeDisplayed();
  await expect(loginScreen.repeatPassword).toBeDisplayed();
});
