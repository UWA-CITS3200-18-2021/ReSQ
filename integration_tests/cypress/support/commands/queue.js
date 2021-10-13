export const addStudentToQueue = ({studentName,studentNumber,unitCode,enquiry}) =>{
    // Needs data generation for this to work
    // recommended to use /utils/queue:generateStudentData
    cy.get(':nth-child(1) > .btn').click();
    cy.get('#studentName').clear();
    cy.get('#studentName').type(studentName);
    cy.get('#studentNumber').clear();
    cy.get('#studentNumber').type(studentNumber);
    cy.get('#unitCode').clear();
    cy.get('#unitCode').type(unitCode);
    cy.get(':nth-child(3) > #queue').check();
    cy.get('#enquiry').clear();
    cy.get('#enquiry').type(enquiry);
    cy.get('#addToQueueForm > .btn').click();
}