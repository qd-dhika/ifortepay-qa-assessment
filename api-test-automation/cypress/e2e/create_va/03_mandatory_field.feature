@api @create-va @negative @mandatory
Feature: Create Virtual Account - Mandatory Field
  Request without a mandatory field must be rejected with response_code 01

  Background:
    Given a valid Create VA request body

  Scenario Outline: <tc_id> - Create VA without mandatory field <field>
    And the field "<field>" is removed
    When I send the Create VA request
    Then the request should be rejected with response_code "01" for field "<field>"

    @CRITICAL
    Examples:
      | tc_id      | field           |
      | TC-API-020 | external_id     |
      | TC-API-021 | order_id        |
      | TC-API-025 | payment_details |
      | TC-API-027 | amount          |

    @HIGH
    Examples:
      | tc_id      | field            |
      | TC-API-022 | currency         |
      | TC-API-023 | payment_method   |
      | TC-API-024 | payment_channel  |
      | TC-API-026 | billing_name     |
      | TC-API-029 | customer_details |
      | TC-API-030 | email            |
      | TC-API-032 | phone            |
      | TC-API-033 | callback_url     |

    @MEDIUM
    Examples:
      | tc_id      | field                   |
      | TC-API-028 | transaction_description |
      | TC-API-031 | full_name               |
