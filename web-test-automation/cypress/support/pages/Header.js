// Page object: top navigation bar
class Header {
  get loginLink() { return cy.contains('a', 'Signup / Login'); }
  get logoutLink() { return cy.contains('a', 'Logout'); }
  get loggedInAs() { return cy.contains('a', 'Logged in as'); }
}

export default new Header();
