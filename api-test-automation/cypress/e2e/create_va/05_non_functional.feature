@api @create-va @non-functional
Feature: Create Virtual Account - Non-Functional
  Performance and basic security checks on POST /va

  Background:
    Given a valid Create VA request body

  @TC-API-058 @MEDIUM @performance
  Scenario: TC-API-058 - Create VA response time under 3 seconds
    When I send the Create VA request
    Then the VA should be created successfully
    And the response time should be less than 3000 ms

  @security
  Scenario Outline: <tc_id> - Create VA with <attack> payload in <field>
    And the field "<field>" is set to <value>
    When I send the Create VA request
    Then there should be no server error
    And the response should not expose a database error

    @HIGH
    Examples:
      | tc_id      | attack        | field        | value          |
      | TC-API-059 | SQL injection | billing_name | "' OR 1=1; --" |

    @MEDIUM
    Examples:
      | tc_id      | attack | field                   | value                       |
      | TC-API-060 | XSS    | transaction_description | "<script>alert(1)</script>" |
