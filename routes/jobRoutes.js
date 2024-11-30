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
// router.get('/dashboard',authMidddleware, jobController.getAllJobs);
// router.post('/dashboard', authMidddleware, jobController.postJob );
// router.get('/dashboard', authMidddleware, jobController.updateJob);
// router.delete('/dasboard', authMidddleware, jobController.deleteJob);

router.get('/job-list',authMidddleware,jobController.getJobswithCompany );

router.get('/api/getall/job', jobController.getAllJobs); // Ensure getAllJobs is defined in jobController
router.post('/api/post/job', authMidddleware,jobController.postJob);
router.put('/update/:id', authMidddleware, jobController.updateJob);
router.get('/getmyjobs', authMidddleware,jobController.getmyJobs);
router.delete('/delete/:id', authMidddleware, jobController.deleteJob);
module.exports = router;
