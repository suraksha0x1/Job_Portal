// const job = require("../models/job");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();
// // const authMidddleware = require("../middleware/auth");


// const getAllJobs = async(req,res)=>{
//     const newjobs  = await job.findOne({ref:"users"});
//     res.status(200).json({
//         success:true,
//         jobs,

//     });
// }

// const postJob = async(req,res)=>{
//     const {role} =req.user;
//     if(role === "candidates"){
//         return res.status(400).json({ error: "candidates are not allowed to access these resources!" });
//     }
//     const {title, description,salary} = req.body;
    
//     if(!title || !description|| !salary){
//         return res.status(400).json({ error: "Please provide full details" });
//     }
//     const companyId = req.user._id;
//     const Job = await job.create({
//         title, description,salary,companyId
//     });
//     res.status(200).json({
//      success:true,
//      message: "Job posted successfully!",
//      Job,
//     })
// }




// module.exports = {
//     getAllJobs,
//     postJob,
//     // getmyJobs,
//     // other functions
// };

// Import the model with a different variable name to avoid conflicts
const job = require("../models/job");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// const getAllJobs = async (req, res) => {
//     const jobs = await job.findOne({ ref: "users" });
//    res.render('jobdashboard');
// };

const getAllJobs = async (req, res) => {
    try {
        const jobs = await job.findAll(); // Replace with actual query logic
        console.log("Jobs data:", jobs); // Debug log to verify jobs data
        res.render('jobdashboard', { jobs });
        res.render('jobs/jobs-listed', { jobs});
    } catch (error) {
        console.error("Error fetching jobs:", error.message);
        res.status(500).send("Server Error");
    }
    
};


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
        // res.redirect("/jobs/jobs-listed");

        // Respond with success message and job details
        return res.status(201).json({
            success: true,
            message: "Job posted successfully!",
            job,
        });
    } catch (error) {
        console.error("Error posting job:", error.message);
        return res.status(500).json({ 
            error: "An internal server error occurred. Please try again later." 
        });
    }
};

const getJobswithCompany = async (req, res) => {
    try {
      const jobs = await Job.findAll({
        where: {
          companyId: req.user.id,
          
        },

      });
      res.render('job-list');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


const getmyJobs = async(req,res)=>{
    const { role, id } = req.user;
    
    if (role === "candidates") {
        return res.status(400).json({ error: "Candidates are not allowed to access these resources!" });
    }
    


const myjobs = await job.findOne({companyId:req.user.id});
res.status(200).json({
    success:true,
    myjobs,
});
};

// Updating job

const updateJob = async (req, res) => {
    const { role } = req.user;
    
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

        // Update the job record with new data
        await jobRecord.update(req.body); // No need for a 'where' clause here

        res.status(200).json({
            success: true,
            message: "Job updated successfully!",
        });
    } catch (error) {
        console.error("Error during job update:", error);
        res.status(500).json({ error: "Server error" });
    }
};



//deleting job
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

        // Delete the job record
        await jobRecord.destroy();

        // Send success response
        res.status(200).json({
            success: true,
            message: "Job deleted successfully!",
        });
    } catch (error) {
        console.error("Error deleting job:", error);
        res.status(500).json({ error: "Server error" });
    }
};



module.exports = {
    getAllJobs,
    postJob,
    updateJob,
    getmyJobs,
    // myjobs,
    deleteJob,
    getJobswithCompany,
};

