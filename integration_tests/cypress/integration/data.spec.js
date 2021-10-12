// It's hard to check the correctness of charts in integration testing
// This testing is limited to ensuring that chart elements exists
// and that they are not crashing
describe("Data Analytics", () => {

    beforeEach(() => {
        // Makes sure user is logged in as export feature requires login
        cy.login();
    });

    it('As a user, I can view analytics', () =>{
        cy.visit(`${Cypress.env("url")}/data`);

        // Check that the weekly "Students visited per day" exist as a chart
        cy.get("#studentsVisitedBarChart").get("svg.ct-chart-bar")

        // Check that the weekly "Units for this week" exist as a chart
        cy.get("#unitsPieChart").get("svg.ct-chart-pie")

        // Check that the weekly "Staff requested this week" exist as a chart
        cy.get("#unitsStaffChart").get("svg.ct-chart-pie")

    });


})

