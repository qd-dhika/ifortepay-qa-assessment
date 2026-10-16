// Page object: /signup "Enter Account Information" form and /account_created page
class SignupPage {
  get heading() { return cy.contains('b', 'Enter Account Information'); }
  get password() { return cy.get('[data-qa="password"]'); }
  get createAccountButton() { return cy.get('[data-qa="create-account"]'); }
  get accountCreatedTitle() { return cy.get('[data-qa="account-created"]'); }
  get continueButton() { return cy.get('[data-qa="continue-button"]'); }

  fillAccountInformation(user) {
    cy.get(user.title === 'Mrs' ? '#id_gender2' : '#id_gender1').check();
    if (user.password) this.password.type(user.password, { log: false });
    cy.get('[data-qa="days"]').select(user.birth_date);
    cy.get('[data-qa="months"]').select(user.birth_month);
    cy.get('[data-qa="years"]').select(user.birth_year);
    cy.get('#newsletter').check();
    cy.get('[data-qa="first_name"]').type(user.firstname);
    cy.get('[data-qa="last_name"]').type(user.lastname);
    cy.get('[data-qa="company"]').type(user.company);
    cy.get('[data-qa="address"]').type(user.address1);
    cy.get('[data-qa="address2"]').type(user.address2);
    cy.get('[data-qa="country"]').select(user.country);
    cy.get('[data-qa="state"]').type(user.state);
    cy.get('[data-qa="city"]').type(user.city);
    cy.get('[data-qa="zipcode"]').type(user.zipcode);
    cy.get('[data-qa="mobile_number"]').type(user.mobile_number);
  }
}

export default new SignupPage();
