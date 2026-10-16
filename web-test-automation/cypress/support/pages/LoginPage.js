// Page object: /login (contains "Login to your account" and "New User Signup!" forms)
const FIELDS = {
  'sign in email': '[data-qa="login-email"]',
  'sign in password': '[data-qa="login-password"]',
  'sign up name': '[data-qa="signup-name"]',
  'sign up email': '[data-qa="signup-email"]',
};

class LoginPage {
  visit() {
    cy.visit('/login');
    cy.contains('h2', 'Login to your account').should('be.visible');
  }

  field(name) {
    return cy.get(FIELDS[name]);
  }

  // empty value = leave the field empty
  fill(name, value, { sensitive = false } = {}) {
    this.field(name).clear();
    if (value) this.field(name).type(value, { log: !sensitive });
  }

  fillLogin(email, password) {
    this.fill('sign in email', email);
    this.fill('sign in password', password, { sensitive: true });
  }

  fillSignup(name, email) {
    this.fill('sign up name', name);
    this.fill('sign up email', email);
  }

  clickLogin() { cy.get('[data-qa="login-button"]').click(); }
  clickSignup() { cy.get('[data-qa="signup-button"]').click(); }

  errorMessage(text) { return cy.contains('p', text); }
}

export default new LoginPage();
