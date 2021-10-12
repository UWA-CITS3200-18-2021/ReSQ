// Login
export const login = (username,password) => {
    cy.viewport(1368, 768)
    cy.visit(`${Cypress.env("url")}/login`);

    // Choose the auth credentials that is correct in environment unless parameter is specified
    const usernameToType = username || Cypress.env("username");
    const passwordToType = password || Cypress.env("password");

    // Login as the specified user
    //  `#login` is the username field id
    cy.get('#username').type(usernameToType);
    cy.get('#password').type(passwordToType);

    // // Find one of the buttons to exist in this page to verify successful login
    // cy.get("Add To Queue")
}