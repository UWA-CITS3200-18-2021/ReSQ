describe("Login", () => {

    beforeEach(() => {
        // Makes sure user is logged in as export feature requires login
        cy.login();
    });

    it('As a user, I can download the CSV file', () =>{
        cy.visit(`${Cypress.env("url")}/export`);

        // Click on the export button
        cy.get('#dateSubmit').click();

        // By default the selection is "Last Day" (which means the entirety of yesterday)
        // Need to know the date to determine file name
        const dateEnd = Cypress.moment().subtract(0, 'days')
        const dateStart = Cypress.moment().subtract(1, 'days')

        // Get string in the format YYYY-MM-DD
        const dateEndString = Cypress.moment(dateEnd).format('YYYY-MM-DD');
        const dateStartString = Cypress.moment(dateStart).format('YYYY-MM-DD');
        
        const fileName = `log_${dateStartString}_to_${dateEndString}.csv`

        // Check that the file is downloaded in `cypress/downloads` folder
        // and the columns are in the correct order and present
        cy.readFile(`cypress/downloads/${fileName}`).should('to.have.string',"id,studentName,studentNumber,unitCode,enquiry,queue,status,enterQueueTime,changeSessionTime,exitSessionTime");

    });


})
