const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController'); // Make sure this path is correct
const authMidddleware = require('../middleware/auth');

// Route example
// router.get('/Company-application', authMidddleware, applicationController.getApplicationsForCompany); // Ensure getAllJobs is defined in jobController
// router.get('/candidate-application', authMidddleware,applicationController.getApplicationsByCandidate);
// router.put("/update",authMidddleware,applicationController.updateApplicationStatus);
// router.post("/apply/:id",authMidddleware,applicationController.createApplication);
// Route to show the application form
router.get('/apply/:id',authMidddleware, applicationController.createApplication);
router.get('/jobApplicants', authMidddleware,applicationController.getApplicantsForJob );
router.get('/Applicants', authMidddleware,applicationController.getApplicants );
// router.get('/applicantApplication', authMidddleware,applicationController.getApplicantsForJob );


//router.post("/:applicationId/status",authMidddleware, applicationController.updateApplicationStatus);
//router.post("/applications/:applicationId/status",authMidddleware, applicationController.updateApplicationStatus);
// router.get('/applications/:applicationId', authMidddleware,applicationController.updateApplicationStatus);
// router.post('/applications/:applicationId/status',authMidddleware, applicationController.updateApplicationStatus);
router.post(
    "/applications/:applicationId/status",
    authMidddleware,
    applicationController.updateApplicationStatus
);
router.post(
    "/applications/:applicationId/state",
    authMidddleware,
    applicationController.updateApplication
);






module.exports = router; 