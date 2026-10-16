@mobile @android @sign-up
Feature: Sign Up (Android)
  As a new user of the mobile app
  I want to create an account
  So that I can sign in to the app

  Background:
    Given I open the Login screen
    And I switch to the Sign up tab

  @TC-SU-001 @CRITICAL @positive
  Scenario: TC-SU-001 - Sign up with all valid data
    When I sign up with email "qa.signup@mailinator.com", password "Passw0rd!" and confirm password "Passw0rd!"
    Then I should see the alert "Signed Up!" with message "You successfully signed up!"

  @TC-SU-002 @HIGH @positive
  Scenario: TC-SU-002 - Sign up with password at minimum length (8 chars)
    When I sign up with email "qa.signup@mailinator.com", password "Passw0r!" and confirm password "Passw0r!"
    Then I should see the alert "Signed Up!" with message "You successfully signed up!"

  @TC-SU-012 @HIGH @negative
  Scenario: TC-SU-012 - Sign up with all fields empty
    When I sign up with email "", password "" and confirm password ""
    Then I should see the error "Please enter a valid email address"
    And I should see the error "Please enter at least 8 characters"
    And I should see the error "Please enter the same password"
    And no alert should be displayed

  @negative
  Scenario Outline: <tc_id> - <title>
    When I sign up with email "<email>", password "<password>" and confirm password "<confirm>"
    Then I should see the error "<error>"
    And no alert should be displayed

    @HIGH
    Examples:
      | tc_id     | title                                    | email                    | password  | confirm   | error                              |
      | TC-SU-016 | Sign up with empty Email                 |                          | Passw0rd! | Passw0rd! | Please enter a valid email address |
      | TC-SU-017 | Sign up with invalid email format        | qa.signup@               | Passw0rd! | Passw0rd! | Please enter a valid email address |
      | TC-SU-020 | Sign up with empty Password              | qa.signup@mailinator.com |           |           | Please enter at least 8 characters |
      | TC-SU-021 | Sign up with password below minimum length | qa.signup@mailinator.com | Pass0r! | Pass0r!   | Please enter at least 8 characters |
      | TC-SU-023 | Sign up with Confirm Password not matching | qa.signup@mailinator.com | Passw0rd! | Passw0rd? | Please enter the same password   |

  @TC-SU-027 @HIGH @non-functional
  Scenario: TC-SU-027 - Password and Confirm Password are masked by default
    When I type "Passw0rd!" in the password and confirm password fields
    Then the password field should be masked
    And the confirm password field should be masked

  @TC-SU-010 @LOW @positive
  Scenario: TC-SU-010 - Navigate from Sign Up to Sign In
    When I switch to the Login tab
    Then the Login form should be displayed
