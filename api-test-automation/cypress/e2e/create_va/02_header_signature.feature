@api @create-va @negative @header
Feature: Create Virtual Account - Header & Signature
  Every request must be authenticated with Authorization (Basic) and x-req-signature (SHA256),
  and must send x-version v3

  Background:
    Given a valid Create VA request body

  @TC-API-013 @CRITICAL
  Scenario: TC-API-013 - Create VA without Authorization header
    And the header "Authorization" is removed
    When I send the Create VA request
    Then the request should be rejected

  @TC-API-014 @CRITICAL
  Scenario: TC-API-014 - Create VA with invalid Authorization (wrong secret_unbound_id)
    And the Authorization is generated with a wrong secret_unbound_id
    When I send the Create VA request
    Then the request should be rejected

  @TC-API-015 @CRITICAL
  Scenario: TC-API-015 - Create VA without x-req-signature header
    And the header "x-req-signature" is removed
    When I send the Create VA request
    Then the request should be rejected

  @TC-API-016 @CRITICAL
  Scenario: TC-API-016 - Create VA with signature generated from wrong hash_key
    And the x-req-signature is generated with a wrong hash_key
    When I send the Create VA request
    Then the request should be rejected

  @TC-API-017 @CRITICAL
  Scenario: TC-API-017 - Create VA with signature not matching body (order_id changed after signing)
    And the x-req-signature is generated with a different order_id
    When I send the Create VA request
    Then the request should be rejected

  @TC-API-018 @HIGH
  Scenario: TC-API-018 - Create VA without x-version header
    And the header "x-version" is removed
    When I send the Create VA request
    Then the request should be rejected

  @TC-API-019 @HIGH
  Scenario: TC-API-019 - Create VA with invalid x-version
    And the header "x-version" is set to "v2"
    When I send the Create VA request
    Then the request should be rejected
