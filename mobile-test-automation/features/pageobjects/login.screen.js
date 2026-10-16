// Screen object: "Login / Sign up Form" screen of the WebdriverIO native demo app
class LoginScreen {
  get tabBarLogin() { return $('~Login'); }
  get screen() { return $('~Login-screen'); }
  get loginTab() { return $('~button-login-container'); }
  get signUpTab() { return $('~button-sign-up-container'); }
  get email() { return $('~input-email'); }
  get password() { return $('~input-password'); }
  get repeatPassword() { return $('~input-repeat-password'); }
  get loginButton() { return $('~button-LOGIN'); }
  get signUpButton() { return $('~button-SIGN UP'); }

  async open() {
    await this.tabBarLogin.click();
    await this.screen.waitForDisplayed();
  }

  async switchToLogin() {
    await this.loginTab.click();
    await this.loginButton.waitForDisplayed();
  }

  async switchToSignUp() {
    await this.signUpTab.click();
    await this.repeatPassword.waitForDisplayed();
  }

  // empty value = leave the field empty
  async fill(field, value) {
    await field.clearValue();
    if (value) await field.setValue(value);
  }

  async hideKeyboard() {
    if (await driver.isKeyboardShown()) await driver.hideKeyboard();
  }

  async signIn(email, password) {
    await this.fill(this.email, email);
    await this.fill(this.password, password);
    await this.hideKeyboard();
    await this.loginButton.click();
  }

  async signUp(email, password, repeatPassword) {
    await this.fill(this.email, email);
    await this.fill(this.password, password);
    await this.fill(this.repeatPassword, repeatPassword);
    await this.hideKeyboard();
    await this.signUpButton.click();
  }

  errorText(message) {
    return $(`android=new UiSelector().text("${message}")`);
  }
}

module.exports = new LoginScreen();
