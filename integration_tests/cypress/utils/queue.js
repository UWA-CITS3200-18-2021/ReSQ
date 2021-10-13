// Generates a valid student queue data
// pass an object `overwriteParams` to overwrite the default params
export const generateStudentQueueData = (overwriteParams) =>({
    studentName: "Frinze Lapuz",
    studentNumber: "22711649",
    unitCode: "CITS3403",
    enquiry: "Essay",
    ...overwriteParams
})