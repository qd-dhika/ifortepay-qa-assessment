@mobile @android @sign-in
Feature: Sign In (Android)
  As a user of the mobile app
  I want to sign in with my email and password
  So that I can access the app

  Background:
    Given I open the Login screen

  @TC-SI-001 @CRITICAL @positive
  Scenario: TC-SI-001 - Sign in with valid email and password
    When I sign in with email "qa.user@mailinator.com" and password "Passw0rd!"
    Then I should see the alert "Success" with message "You are logged in!"

  @TC-SI-014 @HIGH @negative
  Scenario: TC-SI-014 - Sign in with all fields empty
    When I sign in with email "" and password ""
    Then I should see the error "Please enter a valid email address"
    And I should see the error "Please enter at least 8 characters"
    And no alert should be displayed

  @negative
  Scenario Outline: <tc_id> - <title>
    When I sign in with email "<email>" and password "<password>"
    Then I should see the error "<error>"
    And no alert should be displayed

    @MEDIUM
    Examples:
      | tc_id     | title                             | email                  | password  | error                              |
      | TC-SI-015 | Sign in with empty Password       | qa.user@mailinator.com |           | Please enter at least 8 characters |
      | TC-SI-016 | Sign in with empty Email          |                        | Passw0rd! | Please enter a valid email address |
      | TC-SI-017 | Sign in with invalid email format | qa.user@               | Passw0rd! | Please enter a valid email address |

  @TC-SI-025 @HIGH @non-functional
  Scenario: TC-SI-025 - Password is masked on Sign In
    When I type "Passw0rd!" in the password field
    Then the password field should be masked

  @TC-SI-010 @LOW @positive
  Scenario: TC-SI-010 - Navigate from Sign In to Sign Up
    When I switch to the Sign up tab
    Then the Sign up form should be displayed
