@api @create-va @negative @validation
Feature: Create Virtual Account - Field Validation
  Field value must follow the data type, length, format and fixed value in the API spec

  Background:
    Given a valid Create VA request body

  @TC-API-034 @CRITICAL
  Scenario: TC-API-034 - Create VA with duplicate external_id
    And a VA has already been created
    And the request uses the same external_id as that VA
    When I send the Create VA request
    Then the request should be rejected with response_code "01" for field "external_id"

  @TC-API-035 @MEDIUM
  Scenario: TC-API-035 - Create VA with external_id more than 64 chars
    And the external_id has 65 characters
    When I send the Create VA request
    Then the request should be rejected with response_code "01" for field "external_id"

  Scenario Outline: <tc_id> - <title>
    And the field "<field>" is set to <value>
    When I send the Create VA request
    Then the request should be rejected with response_code "01" for field "<field>"

    @CRITICAL
    Examples:
      | tc_id      | title                                    | field  | value |
      | TC-API-042 | Create VA with amount below minimum (9999) | amount | 9999  |

    @HIGH
    Examples:
      | tc_id      | title                                                 | field          | value              |
      | TC-API-036 | Create VA with order_id containing special characters | order_id       | "QA@ORDER#01"      |
      | TC-API-038 | Create VA with currency other than IDR                | currency       | "USD"              |
      | TC-API-039 | Create VA with payment_method other than bank_transfer | payment_method | "credit_card"      |
      | TC-API-043 | Create VA with amount 0                               | amount         | 0                  |
      | TC-API-044 | Create VA with negative amount                        | amount         | -10000             |
      | TC-API-045 | Create VA with non-numeric amount                     | amount         | "abc"              |
      | TC-API-051 | Create VA with invalid email format                   | email          | "testqa.gmail.com" |
      | TC-API-054 | Create VA with phone less than 8 digits               | phone          | "0898888"          |
      | TC-API-055 | Create VA with phone more than 15 digits              | phone          | "0898888888888888" |
      | TC-API-057 | Create VA with invalid callback_url format            | callback_url   | "not-a-valid-url"  |

    @MEDIUM
    Examples:
      | tc_id      | title                                       | field          | value                 |
      | TC-API-041 | Create VA with invalid payment_system value | payment_system | "MONTHLY"             |
      | TC-API-046 | Create VA with amount more than 13 digits   | amount         | 99999999999999        |
      | TC-API-048 | Create VA with expired_time in wrong format | expired_time   | "2026-10-20 10:00:00" |
      | TC-API-056 | Create VA with phone containing letters     | phone          | "08988abcde"          |

  Scenario Outline: <tc_id> - Create VA with <field> more than <max> chars
    And the field "<field>" is filled with <length> characters
    When I send the Create VA request
    Then the request should be rejected with response_code "01" for field "<field>"

    @MEDIUM
    Examples:
      | tc_id      | field    | max | length |
      | TC-API-037 | order_id | 65  | 66     |

    @LOW
    Examples:
      | tc_id      | field                   | max | length |
      | TC-API-049 | billing_name            | 100 | 101    |
      | TC-API-050 | transaction_description | 100 | 101    |
      | TC-API-053 | full_name               | 100 | 101    |

  @TC-API-052 @LOW
  Scenario: TC-API-052 - Create VA with email more than 255 chars
    And the field "email" is filled with an email of 256 characters
    When I send the Create VA request
    Then the request should be rejected with response_code "01" for field "email"

  @TC-API-040 @HIGH
  Scenario: TC-API-040 - Create VA with payment_channel other than MANDIRI
    And the field "payment_channel" is set to "BCA"
    When I send the Create VA request
    Then the request should be rejected

  @TC-API-047 @MEDIUM
  Scenario: TC-API-047 - Create VA with amount 13 digits above merchant maximal transaction amount
    And the field "amount" is set to 9999999999999
    When I send the Create VA request
    Then the request should be rejected
