// const express = require('express');
// const router = express.Router();
// const jobControllers = require('../controllers/jobController');
// const authMidddleware = require('../middleware/auth');


// router.post('/post', authMidddleware,jobControllers.postJob);
// router.get('/getall',jobControllers.getMyJobs);
// module.exports = router;



const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController'); // Make sure this path is correct
const authMidddleware = require('../middleware/auth');
const auth = require('../middleware/auth')
// Route example
router.get('/jobs/create-jobs',authMidddleware ,(req, res) => {
    res.render('jobs/create-jobs',{userId:req.user.id});
});


router.get('/job-list',authMidddleware,jobController.getJobswithCompany );

// router.get('/getall/job', jobController.getAllJobs); // Ensure getAllJobs is defined in jobController
router.post('/api/post/job', authMidddleware,jobController.postJob);
router.get('/update/:id', authMidddleware, jobController.updateJob);
router.post('/update/:id', authMidddleware, jobController.updateJob);
router.get('/getmyjobs', authMidddleware,jobController.getmyJobs);
// router.get('/delete/:id', authMidddleware, jobController.deleteJob);
router.delete('/delete/:id', authMidddleware, jobController.deleteJob);

router.post('/jobs/:id/update', authMidddleware,jobController.update);
router.get('/jobs/:id/update', authMidddleware, jobController.update);


// Route for candidates to browse jobs
// router.get('/jobs/browse', authMidddleware, jobController.getAllJobs);
router.get('/list', authMidddleware,jobController.getAllJobs);
router.get('/admin-list', authMidddleware,jobController.getJobs);
// Route for admin to delete a job
router.get('/jobs/:id/delete',authMidddleware, jobController.adminDeletejob);





module.exports = router;
