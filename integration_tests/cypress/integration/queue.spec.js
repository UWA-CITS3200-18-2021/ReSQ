import { addStudentToQueue } from "../support/commands/queue";
import { generateStudentQueueData } from "../utils/queue"
describe('Queue', () => {
    before(() => {
      // Makes sure user is logged in as export feature requires login
      cy.login();
    })

    beforeEach(() => {
        cy.viewport(1368, 768)
    })
    
    // Note this test assumes that the queue is currently empty for
    // simplicity of the test
    describe("As a user (in a workflow), I can do the following tasks", () =>{
        // This is a workflow test, so "it" tests are to happen in order
        const data = generateStudentQueueData()
        it("I can add a new Student in the Queue", () =>{
            addStudentToQueue(data)

            // Find the element in the SSQueue table
            cy.get('#SSQueueTable').find('tr').contains(data.studentName)
            
        })
        it("I can move the Student in the Queue to the In Session", () => {
            // Select the first element in the table then click it
            cy.get('#SSQueueTable >tbody > tr > .td-actions > button.btn-success').eq(0).click();
            
            // Find the element in the inSession table
            cy.get('#inSession').find('tr').contains(data.studentName)

        })

        it("I can finish the session of the student in session", () =>{
            // Select the first element in the table then click it
            cy.get('#inSession >tbody > tr > .td-actions > button.btn-success').eq(0).click();

            // Make sure the student is no longer in the inSession table
            cy.get('#inSession').find('tr').contains(data.studentName).should('not.exist')
            
            // Check entire website
            cy.contains(data.studentName).should('not.exist')
        })
    })
})
