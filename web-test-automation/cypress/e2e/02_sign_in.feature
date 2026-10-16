@web @sign-in
Feature: Sign In
  As a registered user
  I want to sign in with my email and password
  So that I can access my account

  Background:
    Given a registered account exists
    And I am on the Sign Up / Sign In page

  @TC-SI-001 @CRITICAL @positive
  Scenario: TC-SI-001 - Sign in with valid email and password
    When I sign in with the registered email and password
    Then I should be logged in as the registered user

  @TC-SI-002 @MEDIUM @positive
  Scenario: TC-SI-002 - Sign in with email in uppercase
    When I sign in with the registered email in uppercase and the correct password
    Then I should be logged in as the registered user

  @TC-SI-003 @LOW @positive
  Scenario: TC-SI-003 - Sign in by pressing Enter key
    When I fill the registered email and password and press Enter
    Then I should be logged in as the registered user

  @TC-SI-009 @HIGH @positive
  Scenario: TC-SI-009 - Sign out ends the session
    Given I am signed in with the registered account
    When I click Logout
    Then I should be signed out
    When I go back to the previous page
    And I reload the page
    Then I should be signed out

  @TC-SI-012 @CRITICAL @negative
  Scenario: TC-SI-012 - Sign in with wrong password
    When I sign in with the registered email and password "WrongPass1!"
    Then I should see the error "Your email or password is incorrect!"
    And I should not be logged in

  @TC-SI-013 @HIGH @negative
  Scenario: TC-SI-013 - Sign in with unregistered email
    When I sign in with an unregistered email and the correct password
    Then I should see the error "Your email or password is incorrect!"
    And I should not be logged in

  @TC-SI-018 @HIGH @negative
  Scenario: TC-SI-018 - Sign in with correct password in different letter case
    When I sign in with the registered email and the password in lowercase
    Then I should see the error "Your email or password is incorrect!"
    And I should not be logged in

  @negative
  Scenario Outline: <tc_id> - <title>
    When I sign in with email "<email>" and password "<password>"
    Then the "<invalid_field>" field should be marked as invalid by the browser
    And I should not be logged in

    @HIGH
    Examples:
      | tc_id     | title                         | email | password  | invalid_field  |
      | TC-SI-014 | Sign in with all fields empty |       |           | sign in email  |

    @MEDIUM
    Examples:
      | tc_id     | title                             | email                    | password  | invalid_field    |
      | TC-SI-015 | Sign in with empty Password       | qa.user@mailinator.com   |           | sign in password |
      | TC-SI-016 | Sign in with empty Email          |                          | Passw0rd! | sign in email    |
      | TC-SI-017 | Sign in with invalid email format | qa.user@                 | Passw0rd! | sign in email    |

  @TC-SI-023 @HIGH @non-functional @security
  Scenario: TC-SI-023 - Error message does not reveal whether email is registered
    When I sign in with the registered email and password "WrongPass1!"
    Then I should see the error "Your email or password is incorrect!"
    When I sign in with an unregistered email and the correct password
    Then I should see the error "Your email or password is incorrect!"

  @TC-SI-024 @CRITICAL @non-functional @security
  Scenario: TC-SI-024 - SQL injection in Sign In fields
    When I sign in with the registered email and password "' OR '1'='1"
    Then I should see the error "Your email or password is incorrect!"
    And I should not be logged in

  @TC-SI-025 @HIGH @non-functional @security
  Scenario: TC-SI-025 - Password is masked on Sign In
    Then the "sign in password" field should mask the input
