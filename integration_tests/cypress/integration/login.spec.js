describe("Login", () => {
    
    it("As the user of the system, if I enter my credentials, I can login successfully", () => {
        cy.login();

        // Find one of the buttons to exist in this page to verify successful login
        cy.contains(".btn", "Add to Queue")
    })

    it("As the user of the system, if I enter wrong credentials, I see error message", () => {
        cy.login("wrongusername","wrongpassword");

        // Find error message to exist in this page to verify unsuccessful login
        cy.contains(".alert", "Incorrect username or password, please try again.")
    })

    describe("As the user of the system, I should be redirected to login when I go to page that requires authentication", () => {
    
        // Go to page that requires authentication
        const pagesThatRequiresAuth =["","data","export"].map(page => (`${Cypress.env("url")}/${page}`))
        pagesThatRequiresAuth.forEach(page => {
            it(`Redirect page to login when unauthenticated when visiting ${page}`, () =>{
                cy.visit(page);
                cy.url().should("include", "/login");
            })
        })
    })

})