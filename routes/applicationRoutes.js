const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController'); // Make sure this path is correct
const authMidddleware = require('../middleware/auth');

// Route example
router.get('/Company/getall', authMidddleware, applicationController.companyGetapplication); // Ensure getAllJobs is defined in jobController
router.get('/candidates/getall', authMidddleware,applicationController.candidatesApplication);
router.delete("/delete/:id",authMidddleware,applicationController.candidateDelete);
router.post("/post",authMidddleware,applicationController.postApplication);

module.exports = router;