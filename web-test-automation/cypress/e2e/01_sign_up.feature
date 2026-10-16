@web @sign-up
Feature: Sign Up
  As a new visitor
  I want to create an account
  So that I can sign in and shop on the website

  Background:
    Given I am on the Sign Up / Sign In page

  @TC-SU-001 @CRITICAL @positive
  Scenario: TC-SU-001 - Sign up with all valid data
    When I fill the sign up form with a new name and email
    And I click the Sign Up button
    Then the account information form should be displayed
    When I complete the account information form
    And I click the Create Account button
    Then the account should be created successfully
    When I click the Continue button
    Then I should be logged in as the new user

  @TC-SU-012 @HIGH @negative
  Scenario: TC-SU-012 - Sign up with all fields empty
    When I fill the sign up form with name "" and email ""
    And I click the Sign Up button
    Then the "sign up name" field should be marked as invalid by the browser
    And I should stay on the Sign Up / Sign In page

  @negative
  Scenario Outline: <tc_id> - <title>
    When I fill the sign up form with name "<name>" and email "<email>"
    And I click the Sign Up button
    Then the "<invalid_field>" field should be marked as invalid by the browser
    And I should stay on the Sign Up / Sign In page

    @MEDIUM
    Examples:
      | tc_id      | title                       | name      | email                     | invalid_field |
      | TC-SU-013  | Sign up with empty Full Name |           | qa.signup@mailinator.com | sign up name  |

    @HIGH
    Examples:
      | tc_id      | title                             | name      | email      | invalid_field |
      | TC-SU-016  | Sign up with empty Email          | QA Tester |            | sign up email |
      | TC-SU-017  | Sign up with invalid email format | QA Tester | qa.signup@ | sign up email |

  @TC-SU-018 @CRITICAL @negative
  Scenario: TC-SU-018 - Sign up with already registered email
    Given a registered account exists
    When I fill the sign up form with the registered email
    And I click the Sign Up button
    Then I should see the error "Email Address already exist!"

  @TC-SU-019 @HIGH @negative
  Scenario: TC-SU-019 - Sign up with registered email in different letter case
    Given a registered account exists
    When I fill the sign up form with the registered email in uppercase
    And I click the Sign Up button
    Then I should see the error "Email Address already exist!"

  @TC-SU-020 @HIGH @negative
  Scenario: TC-SU-020 - Sign up with empty Password
    When I fill the sign up form with a new name and email
    And I click the Sign Up button
    And I complete the account information form without password
    And I click the Create Account button
    Then the "account password" field should be marked as invalid by the browser
    And the account should not be created

  @TC-SU-027 @HIGH @non-functional
  Scenario: TC-SU-027 - Password is masked by default on Sign Up
    When I fill the sign up form with a new name and email
    And I click the Sign Up button
    Then the "account password" field should mask the input
