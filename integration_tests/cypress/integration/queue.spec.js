import { addStudentToQueue } from "../support/commands/queue";
import { generateStudentQueueData } from "../utils/queue"
describe('Queue', () => {
    beforeEach(() => {
      // Makes sure user is logged in as export feature requires login
      cy.login();
    })
    
    describe("As a user (in a workflow), I can do the following tasks", () =>{

        it("I can add a new Student in the Queue", () =>{
            const data = generateStudentQueueData()
            addStudentToQueue(data)
        })
    })
})
