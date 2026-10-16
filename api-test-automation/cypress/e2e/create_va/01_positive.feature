@api @create-va @positive
Feature: Create Virtual Account - Positive
  As a merchant
  I want to create a MANDIRI Virtual Account through POST /va
  So that my customer can pay the transaction by bank transfer

  Background:
    Given a valid Create VA request body

  @TC-API-001 @CRITICAL
  Scenario: TC-API-001 - Create VA with all valid mandatory fields (payment_system CLOSED)
    When I send the Create VA request
    Then the VA should be created successfully

  @TC-API-002 @HIGH @blocked
  Scenario: TC-API-002 - Create VA with payment_system OPEN
    And the field "payment_system" is set to "OPEN"
    And the field "is_multi_use" is set to true
    When I send the Create VA request
    Then the VA should be created successfully

  @TC-API-003 @HIGH @blocked
  Scenario: TC-API-003 - Create VA with payment_system PARTIAL
    And the field "payment_system" is set to "PARTIAL"
    And the field "is_multi_use" is set to true
    When I send the Create VA request
    Then the VA should be created successfully

  @TC-API-004 @MEDIUM
  Scenario: TC-API-004 - Create VA without payment_system uses default CLOSED
    And the field "payment_system" is removed
    When I send the Create VA request
    Then the VA should be created successfully
    And the response field "payment_details.payment_system" should be "CLOSED"

  @TC-API-005 @HIGH
  Scenario: TC-API-005 - Create VA with valid expired_time (ISO-8601 +07:00)
    And the field "expired_time" is filled with a datetime 1 day from now in ISO-8601 +07:00 format
    When I send the Create VA request
    Then the VA should be created successfully

  @TC-API-006 @MEDIUM
  Scenario: TC-API-006 - Create VA without expired_time (optional field)
    And the field "expired_time" is removed
    When I send the Create VA request
    Then the VA should be created successfully

  @TC-API-007 @CRITICAL
  Scenario: TC-API-007 - Create VA with minimum amount 10000 (boundary)
    And the field "amount" is set to 10000
    When I send the Create VA request
    Then the VA should be created successfully

  @TC-API-008 @MEDIUM
  Scenario: TC-API-008 - Create VA with phone 8 digits (min boundary)
    And the field "phone" is set to "08988888"
    When I send the Create VA request
    Then the VA should be created successfully

  @TC-API-009 @MEDIUM
  Scenario: TC-API-009 - Create VA with phone 15 digits (max boundary)
    And the field "phone" is set to "089888888888888"
    When I send the Create VA request
    Then the VA should be created successfully

  @TC-API-010 @HIGH
  Scenario: TC-API-010 - Create VA with same order_id as previous transaction (order_id not unique)
    And a VA has already been created
    And the request uses a new external_id with the same order_id
    When I send the Create VA request
    Then the VA should be created successfully

  @TC-API-011 @MEDIUM
  Scenario: TC-API-011 - Create VA with external_id at max length 64 chars
    And the external_id has 64 characters
    When I send the Create VA request
    Then the VA should be created successfully

  @TC-API-012 @LOW
  Scenario: TC-API-012 - Create VA with billing_name, transaction_description, full_name at max length 100 chars
    And the field "billing_name" is filled with 100 characters
    And the field "transaction_description" is filled with 100 characters
    And the field "full_name" is filled with 100 characters
    When I send the Create VA request
    Then the VA should be created successfully
