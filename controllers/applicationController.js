
const Application = require('../models/application');
const Job = require('../models/job');
const User = require('../models/user');

// Create a new application (by a candidate)
const createApplication = async (req, res) => {
    try {
        const jobId = req.params.id; // Extract jobId from URL parameters
        
        // Validate jobId
        if (!jobId) {
            return res.status(400).json({ error: 'Job ID is required' });
        }

        // Ensure the user is authenticated
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized access' });
        }

        const candidateId = req.user.id;

        // Ensure the user is a candidate
        if (req.user.role !== 'candidates') {
            return res.status(403).json({ error: 'Only candidates can apply for jobs' });
        }

        // Check if the job exists
        const job = await Job.findByPk(jobId);
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        // Check if the candidate has already applied for this job
        const existingApplication = await Application.findOne({
            where: { jobId, applicantId: candidateId },
        });

        if (existingApplication) {
            return res.status(400).json({ error: 'You have already applied for this job' });
        }

        // Extract companyId from the job details
        const companyId = job.companyId; // Assuming Job model includes a `companyId` field

        // Create the application
        const newApplication = await Application.create({
            jobId,
            applicantId: candidateId,
            companyId,
            status: 'Pending', // Set initial status
        });

        res.redirect("/dashboard");
    } catch (error) {
        console.error('Error creating application:', error);
        return res.status(500).json({ error: 'Server error while creating application' });
    }
};





const getApplicantsForJob = async (req, res) => {
    try {
        const companyId = req.user.id; // Company ID from authenticated user

        // Check if the user is a company
        if (req.user.role !== 'Company') {
            return res.status(403).json({ error: 'Only companies can view applications' });
        }

        // Fetch jobs posted by this company along with their applicants (candidates)
        const jobs = await Job.findAll({
            where: { companyId },
            include: [
                {
                    model: Application,
                    include: [
                        {
                            model: User,
                            as: 'candidate', // Ensure alias matches the association
                            attributes: ['name', 'email', 'validDocument', 'contactInfo'],
                        },
                    ],
                },
            ],
        });

        // Log the fetched jobs to inspect the structure (for debugging)
        console.log('Fetched Jobs:', jobs);

        // No jobs found
        if (!jobs || jobs.length === 0) {
            return res.render('application/jobApplicants', {
                jobTitle: 'No jobs found',
                applicants: [],
            });
        }

        // Extract applicants for rendering
        const applicants = jobs.flatMap(job => 
            (job.Applications || []).map(application => ({
                applicationId: application.id, // Include application ID
                jobId: job.id,
                jobTitle: job.title,
                candidateName: application.candidate?.name || 'N/A',  // Safe access
                candidateEmail: application.candidate?.email || 'N/A',
                validDocument: application.candidate?.validDocument || 'N/A',
                contactInfo: application.candidate?.contactInfo || 'N/A',
                status: application.status,
            }))
        );

        // Render the applicants for the job
        return res.render('application/jobApplicants', { 
            jobTitle: 'Your Job Applications', 
            applicants 
        });
    } catch (error) {
        console.error('Error fetching applicants:', error.message);
        return res.status(500).json({ error: 'Server error while fetching applicants' });
    }
}

const getApplicants = async (req, res) => {
    try {
        // Check if the user is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied. Only admins can view applications.' });
        }

        // Fetch all jobs with their applicants
        const jobs = await Job.findAll({
            include: [
                {
                    model: Application,
                    include: [
                        {
                            model: User,
                            as: 'candidate', // Ensure alias matches the association
                            attributes: ['name', 'email', 'validDocument', 'contactInfo'],
                        },
                    ],
                },
            ],
        });

        // Log the fetched jobs for debugging
        console.log('Fetched Jobs:', jobs);

        // Handle case when no jobs are found
        if (!jobs || jobs.length === 0) {
            return res.render('application/jobApplicants', {
                jobTitle: 'No jobs found',
                applicants: [],
            });
        }

        // Extract applicants for rendering
        const applicants = jobs.flatMap(job =>
            (job.Applications || []).map(application => ({
                applicationId: application.id, // Include application ID
                jobId: job.id,
                jobTitle: job.title,
                candidateName: application.candidate?.name || 'N/A',  // Safe access
                candidateEmail: application.candidate?.email || 'N/A',
                validDocument: application.candidate?.validDocument || 'N/A',
                contactInfo: application.candidate?.contactInfo || 'N/A',
                status: application.status,
            }))
        );

        // Render the applicants for the job
        return res.render('application/Applicants', { 
            jobTitle: 'All Job Applications', 
            applicants 
        });
    } catch (error) {
        console.error('Error fetching applicants:', error.message);
        return res.status(500).json({ error: 'Server error while fetching applicants' });
    }
};



        
// Update the status of an application (by a company)
// const updateApplicationStatus = async (req, res) => {
//     try {
//         const { applicationId } = req.params; // Extract the application ID from the URL
//         const { status } = req.body; // Get the status from the request body

//         // Validate the status
//         const validStatuses = ["approved", "rejected"];
//         if (!validStatuses.includes(status)) {
//             return res.status(400).json({ error: "Invalid status" });
//         }

//         // Ensure the user is a company
//         if (req.user.role !== 'Company') {
//             return res.status(403).json({ error: 'Only companies can update application statuses' });
//         }

//         // Find the application by its ID
//         const application = await Application.findByPk(applicationId);
//         if (!application) {
//             return res.status(404).json({ error: "Application not found" });
//         }

//         // Ensure that the company updating the application is the one that posted the job
//         const job = await Job.findByPk(application.jobId);
//         if (job.companyId !== req.user.id) {
//             return res.status(403).json({ error: 'You are not authorized to update this application' });
//         }

//         // Update the application status
//         application.status = status;
//         await application.save();

//         // Redirect back to the job applicants page or render a success message
//         //return res.redirect(`/applications/${application.jobId}/status`);
//         return res.redirect(`/applications/${application.jobId}`); // Redirect to job applicants list

//     } catch (error) {
//         console.error("Error updating application status:", error.message);
//         return res.status(500).json({ error: "Server error while updating application status" });
//     }
// };
// // Get all applications by a specific candidate


// const updateApplicationStatus = async (req, res) => {
//     try {
//         const { applicationId } = req.params; // Extract the application ID from the URL
//         const { status } = req.body; // Get the status from the request body

//         // Validate the status
//         const validStatuses = ["approved", "rejected"];
//         if (!validStatuses.includes(status)) {
//             return res.status(400).json({ error: "Invalid status" });
//         }

//         // Ensure the user is a company
//         if (req.user.role !== "Company") {
//             return res.status(403).json({ error: "Only companies can update application statuses" });
//         }

//         // Find the application by its ID
//         const application = await Application.findByPk(applicationId);
//         if (!application) {
//             return res.status(404).json({ error: "Application not found" });
//         }

//         // Ensure that the company updating the application is the one that posted the job
//         const job = await Job.findByPk(application.jobId);
//         if (!job || job.companyId !== req.user.id) {
//             return res.status(403).json({ error: "You are not authorized to update this application" });
//         }

//         // Update the application status
//         application.status = status;
//         await application.save();
        

//         // Render the applicants for the job
        
    

//         // Redirect back to the job applicants page or render a success message
//         return res.render("application/jobApplicants", {
//             jobTitle: job.title, // Pass job title here
//             applicants: applicantsData,
//         });
//     } catch (error) {
//         console.error("Error updating application status:", error.message);
//         return res.status(500).json({ error: "Server error while updating application status" });
//     }
// const updateApplicationStatus = async (req, res) => {
//     try {
//         const { applicationId } = req.params; // Extract the application ID from the URL
//         const { status } = req.body; // Get the status from the request body

//         // Validate the status
//         const validStatuses = ["approved", "rejected"];
//         if (!validStatuses.includes(status)) {
//             return res.status(400).json({ error: "Invalid status" });
//         }

//         // Ensure the user is a company
//         if (req.user.role !== "Company") {
//             return res.status(403).json({ error: "Only companies can update application statuses" });
//         }

//         // Find the application by its ID
//         const application = await Application.findByPk(applicationId);
//         if (!application) {
//             return res.status(404).json({ error: "Application not found" });
//         }

//         // Ensure that the company updating the application is the one that posted the job
//         const job = await Job.findByPk(application.jobId);
//         if (!job || job.companyId !== req.user.id) {
//             return res.status(403).json({ error: "You are not authorized to update this application" });
//         }

//         // Update the application status
//         application.status = status;
//         await application.save();

//         // Fetch all applicants for the job
//         const applicantsData = await Application.findAll({
//             where: { jobId: job.id },
//             include: [
//                 {
//                     model: User,
//                     as: "candidate", // Alias for the User model
//                     attributes: ["name", "email", "validDocument", "contactInfo"], // Required fields
//                 },
//                 {
//                     model: Job,
//                     as: "company", // Alias for the Job model
//                     attributes: ["title"], // Include job title
//                 },
//             ],
//         });

//         // Map applicantsData to include all necessary fields for rendering
//         const applicants = applicantsData.map(applicant => ({
//             applicationId: applicant.id,
//             jobId: applicant.jobId,
//             jobTitle: applicant.company?.title || "N/A", // Use the correct alias for job title
//             candidateName: applicant.candidate?.name || "N/A", // Include candidate name
//             candidateEmail: applicant.candidate?.email || "N/A", // Include candidate email
//             validDocument: applicant.candidate?.validDocument || "N/A", // Include valid document
//             contactInfo: applicant.candidate?.contactInfo || "N/A", // Include contact info
//             status: applicant.status, // Application status
//         }));

//         // Render the job applicants page with the transformed applicants data
//         return res.render("application/jobApplicants", {
//             jobTitle: job.title,
//             applicants,
//         });
//     } catch (error) {
//         console.error("Error updating application status:", error.message);
//         return res.status(500).json({ error: "Server error while updating application status" });
//     }
// };




const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params; // Get the application ID
        const { status } = req.body; // Get the new status

        // Validate the status
        const validStatuses = ["approved", "rejected"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        // Ensure the user is a company
        if (req.user.role !== "Company") {
            return res.status(403).json({ error: "Only companies can update application statuses" });
        }

        // Find the application by its ID
        const application = await Application.findByPk(applicationId);
        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }

        // Ensure the company owns the job
        const job = await Job.findByPk(application.jobId);
        if (!job || job.companyId !== req.user.id) {
            return res.status(403).json({ error: "You are not authorized to update this application" });
        }

        // Update the application status
        application.status = status;
        await application.save();

        // Return the updated status as a JSON response
        return res.status(200).json({
            message: "Status updated successfully",
            status: application.status,
        });
    } catch (error) {
        console.error("Error updating application status:", error.message);
        return res.status(500).json({ error: "Server error while updating application status" });
    }
};

const updateApplication = async (req, res) => {
    try {
        const { applicationId } = req.params; // Get the application ID from route parameters
        const { status } = req.body; // Get the new status from the request body

        // Validate the status
        const validStatuses = ["approved", "rejected"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        // Ensure the user is an admin
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "Only admins can update application statuses" });
        }

        // Find the application by its ID
        const application = await Application.findByPk(applicationId);
        if (!application) {
            return res.status(404).json({ error: "Application not found" });
        }

        // Update the application status
        application.status = status;
        await application.save();

        // Return the updated status as a JSON response
        // return res.status(200).json({
        //     message: "Status updated successfully",
        //     status: application.status,
        // });
        return res.status(200).json({
            success: true, // Add this line
            message: "Status updated successfully",
            applicationId: applicationId, // Include the applicationId
            status: application.status,  // Include the updated status
        });
        
        
    } catch (error) {
        console.error("Error updating application status:", error.message);
        return res.status(500).json({ error: "Server error while updating application status" });
    }
};








module.exports = {
    createApplication,

    updateApplicationStatus,
    getApplicants ,
    updateApplication,

    getApplicantsForJob,
    // getApplicantApplicationsForAdmin,
};
