
// Import the model with a different variable name to avoid conflicts
const job = require("../models/job");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require('../models/user'); // Adjust the path to your models directory


// const getAllJobs = async (req, res) => {
//     const jobs = await job.findOne({ ref: "users" });
//    res.render('jobdashboard');
// };

// const getAllJobs = async (req, res) => {
//     try {
//         const jobs = await job.findAll(); // Replace with actual query logic
//         console.log("Jobs data:", jobs); // Debug log to verify jobs data
//         // res.render('jobdashboard', { jobs });
//         res.render('jobs/job-list', {jobs});
//     } catch (error) {
//         console.error("Error fetching jobs:", error.message);
//         res.status(500).send("Server Error");
//     }
    
// };

// const { job, User } = require('../models'); // Import the models

const getAllJobs = async (req, res) => {
    try {
        // Fetch all jobs with company details
        const jobs = await job.findAll({
            include: [
                {
                    model: User,
                    attributes: ['companyName', 'address'],
                    where: { role: 'Company' },
                },
            ],
        });

        console.log("Fetched jobs:", jobs);  // Log to check if jobs are fetched correctly

        if (req.user.role === 'candidates' ) {
            res.render('jobs/list', { jobs });  // Pass jobs to the view
        // } else if (req.user.role==='admin'){
            // res.render('jobs/list', { jobs });  
            // res.status(403).json({ error: "Unauthorized access." });
        }else{
            res.status(403).json({ error: "Unauthorized access." });
        }
    } catch (error) {
        console.error("Error fetching jobs:", error.message);
        res.status(500).json({ error: "An internal server error occurred." });
    }
};

const getJobs = async (req, res) => {
    try {
        // Fetch all jobs with company details
        const jobs = await job.findAll({
            include: [
                {
                    model: User,
                    attributes: ['companyName', 'address'],
                    where: { role: 'Company' },
                },
            ],
        });

        console.log("Fetched jobs:", jobs);  // Log to check if jobs are fetched correctly

        if (req.user.role === 'admin' ) {
            res.render('jobs/admin-list', { jobs });  // Pass jobs to the view
        // } else if (req.user.role==='admin'){
            // res.render('jobs/list', { jobs });  
            // res.status(403).json({ error: "Unauthorized access." });
        }else{
            res.status(403).json({ error: "Unauthorized access." });
        }
    } catch (error) {
        console.error("Error fetching jobs:", error.message);
        res.status(500).json({ error: "An internal server error occurred." });
    }
};


// module.exports = { getAllJobs };





// const postJob = async (req, res) => {
//     const { role, id } = req.user;
    
//     if (role === "candidates") {
//         return res.status(400).json({ error: "Candidates are not allowed to access these resources!" });
//     }
//     const { title, description, salary } = req.body;

//     if (!title || !description || !salary) {
//         return res.status(400).json({ error: "Please provide full details" });
//     }

//     try {
//         // const companyId = req.user.id;
//         const Job = await job.create({
//             title,
//             description,
//             salary,
//             companyId: req.user.id, // Assign companyId from req.user._id
//         });
//         res.redirect("/jobs/jobs-listed");
//         res.status(200).json({
//             success: true,
//             message: "Job posted successfully!",
//             job,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Server error" });
//     }
// }
const postJob = async (req, res) => {
    try {
        // Destructure user details and validate role
        const { role, id: companyId } = req.user;

        if (role !== "Company") {
            return res.status(403).json({ 
                error: "Access denied. Only companies can post jobs." 
            });
        }

        // Destructure job details from the request body
        const { title, description, salary } = req.body;

        // Validate required fields
        if (!title || !description || !salary) {
            return res.status(400).json({ 
                error: "All fields are required: title, description, and salary." 
            });
        }

        // Create a new job entry in the database
        const Job = await job.create({
            title,
            description,
            salary,
            companyId, // Assign companyId from req.user.id
        });
        // return res.render("/jobs/job-list");
        
       

        // Respond with success message and job details
        return res.redirect("/job-list");

    } catch (error) {
        console.error("Error posting job:", error.message);
        return res.status(500).json({ 
            error: "An internal server error occurred. Please try again later." 
        });
    }
};

const getJobswithCompany = async (req, res) => {
    try {
      const jobs = await job.findAll({
        where: {
          companyId: req.user.id,
          
        },

      });
      res.render('jobs/job-list',{jobs:jobs});
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


const getmyJobs = async(req,res)=>{
    const { role, id } = req.user;
    
    if (role === "candidates") {
        return res.status(400).json({ error: "Candidates are not allowed to access these resources!" });
    }
    


const myjobs = await job.findAll({companyId:id});
res.render("job-list",{jobs:myjobs})
};

// Updating job

// const updateJob = async (req, res) => {
//     const { role } = req.user;
    
//     if (role === "candidates") {
//         return res.status(400).json({ error: "Candidates are not allowed to access these resources!" });
//     }

//     const { id } = req.params;

//     try {
//         // Fetch the job record by primary key
//         const jobRecord = await job.findByPk(id);
//         res.render('jobs/updateJob', { jobs:jobs });
//         if (!jobRecord) {
//             return res.status(404).json({ error: "Oops, no job found!" });
//         }

//         // Update the job record with new data
//         await jobRecord.update(req.body); // No need for a 'where' clause here

//         // res.render("jobs/job-list",{jobs:jobs});
//     } catch (error) {
//         console.error("Error during job update:", error);
//         res.status(500).json({ error: "Server error" });
//     }
// };

// Controller to handle job update
const updateJob = async (req, res) => {
    const { role } = req.user;

    // Check if the user has access to update jobs
    if (role === "candidates") {
        return res.status(400).json({ error: "Candidates are not allowed to access these resources!" });
    }

    const { id } = req.params;

    try {
        // Fetch the job record by primary key
        const jobRecord = await job.findByPk(id);

        if (!jobRecord) {
            return res.status(404).json({ error: "Oops, no job found!" });
        }

        if (req.method === "GET") {
            // Render the update form with the job details
            return res.render("jobs/updateJob", { job: jobRecord });
        } else if (req.method === "POST") {
            // Update the job with new data from the form submission
            const { title, description, salary } = req.body;

            if (!title || !description || !salary) {
                return res.status(400).json({ error: "All fields are required!" });
            }

            // Update the job record
            await jobRecord.update({ title, description, salary });

            // Fetch all jobs for the user (company) after the update
            const jobs = await job.findAll({
                where: { companyId: req.user.id } // Assuming the user is a company and has jobs linked to them
            });

            // After update, render the updated job list page
            return res.render("jobs/job-list", { jobs: jobs });
        } else {
            return res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error) {
        console.error("Error during job update:", error);
        res.status(500).json({ error: "Server error" });
    }
};




const update = async (req, res) => {
    const { role } = req.user;

    // Allow only admins to access this resource
    if (role !== "admin") {
        return res.status(403).json({ error: "Access denied! Only admins can update jobs." });
    }

    const { id } = req.params;

    try {
        // Fetch the job record by primary key
        const jobRecord = await job.findByPk(id);

        if (!jobRecord) {
            return res.status(404).json({ error: "Job not found!" });
        }

        if (req.method === "GET") {
            // Render the update form with the job details
            return res.render("jobs/update", { job: jobRecord });
        } else if (req.method === "POST") {
            // Update the job with new data from the form submission
            const { title, description, salary } = req.body;

            if (!title || !description || !salary) {
                return res.status(400).json({ error: "All fields are required!" });
            }

            // Update the job record
            await jobRecord.update({ title, description, salary });
            const jobs = await job.findAll({
                include: [
                    {
                        model: User,
                        attributes: ['companyName', 'address'] // Only the required fields
                    }
                ]
            });

            // Fetch all jobs after the update
            // const jobs = await job.findAll(); // Admin can see all jobs

            // After update, render the updated job list page
            return res.render("jobs/admin-list", { jobs: jobs });
        } else {
            return res.status(405).json({ error: "Method not allowed" });
        }
    } catch (error) {
        console.error("Error during job update:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// const adminDeletejob = async (req, res) => {
//     const { role } = req.user;

//     // Allow only admins to access this resource
//     if (role !== "admin") {
//         return res.status(403).json({ error: "Access denied! Only admins can delete jobs." });
//     }

//     const { id } = req.params;

//     try {
//         // Fetch the job record by primary key
//         const jobRecord = await job.findByPk(id);

//         if (!jobRecord) {
//             return res.status(404).json({ error: "Job not found!" });
//         }

//         // Delete the job record
//         await jobRecord.destroy();

//         // Fetch all jobs after deletion to render the updated list
//         const jobs = await job.findAll({
//             include: [
//                 {
//                     model: User,
//                     attributes: ['companyName', 'address'], // Only the required fields
//                 },
//             ],
//         });

//         // After deletion, render the updated job list page
//         return res.render("jobs/admin-list", { jobs:jobs });
//     } catch (error) {
//         console.error("Error during job deletion:", error);
//         return res.status(500).json({ error: "Server error" });
//     }
// };

const adminDeletejob = async (req, res) => {
    const { role } = req.user;

    // Allow only admins to access this resource
    if (role !== "admin") {
        return res.status(403).json({ error: "Access denied! Only admins can delete jobs." });
    }

    const { id } = req.params;

    try {
        // Fetch the job record by primary key
        const jobRecord = await job.findByPk(id);

        if (!jobRecord) {
            return res.status(404).json({ error: "Oops, no job found!" });
        }

        // Delete the job record
        await jobRecord.destroy();

        // Send a success response
        return res.status(200).json({ success: true, message: "Job deleted successfully!" });
    } catch (error) {
        console.error("Error during job deletion:", error);
        return res.status(500).json({ error: "Server error" });
    }
};





const deleteJob = async (req, res) => {
    const { role } = req.user;

    if (role === "candidates") {
        return res.status(400).json({ error: "Candidates are not allowed to access these resources!" });
    }

    const { id } = req.params;

    try {
        // Find the job record by ID
        const jobRecord = await job.findByPk(id);
        if (!jobRecord) {
            return res.status(404).json({ error: "Oops, no job found!" });
        }

        // Ensure the job belongs to the logged-in company
        if (jobRecord.companyId !== req.user.id) {
            return res.status(403).json({ error: "You are not authorized to delete this job." });
        }

        // Delete the job record
        await jobRecord.destroy();

        // Send success response
        return res.status(200).json({
            success: true,
            message: "Job deleted successfully!",
        });
    } catch (error) {
        console.error("Error deleting job:", error);
        return res.status(500).json({ error: "Server error" });
    }
};




module.exports = {
    getAllJobs,
    postJob,
    updateJob,
    getmyJobs,
    getJobs,
    update,
    adminDeletejob,
    // myjobs,
    deleteJob,
    getJobswithCompany,
};

