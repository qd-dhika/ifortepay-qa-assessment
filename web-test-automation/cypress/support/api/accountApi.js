// automationexercise.com public API, used only for test data setup and cleanup
// https://automationexercise.com/api_list

export function createAccount(user) {
  return cy.request({
    method: 'POST',
    url: '/api/createAccount',
    form: true,
    body: user,
  }).then((res) => {
    const body = typeof res.body === 'string' ? JSON.parse(res.body) : res.body;
    expect(body.responseCode, `precondition: account ${user.email} created`).to.eq(201);
  });
}

export function deleteAccount(email, password) {
  return cy.request({
    method: 'DELETE',
    url: '/api/deleteAccount',
    form: true,
    body: { email, password },
    failOnStatusCode: false,
  });
}
