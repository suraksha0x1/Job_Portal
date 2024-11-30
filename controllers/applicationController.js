const Application = require("../models/application");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const job = require("../models/job");

const companyGetapplication = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized: User not authenticated" });
    }

    const {role} = req.user;

    if (role === "candidates") {
        return res.status(400).json({ error: "candidates are not allowed to access these resources!" });
    }
    const {id} = req.user;
    const applications =  await Application.findOne({"companyID_user.user":id});
    res.status(200).json({
        success:true,
        applications,
    })

    // Proceed with the function logic...
};


const candidatesApplication = async(req, res)=>{
    const { role } = req.user;
    
    if (role === "Company") {
        return res.status(400).json({ error: "Company are not allowed to access these resources!" });
    }

    const {id} = req.user;
    const applications =  await Application.findOne({"applicantID_user.user":id});
    res.status(200).json({
        success:true,
        applications,
    })
};

const candidateDelete = async(req,res)=>{
    const { role } = req.user;
    
    if (role === "Company") {
        return res.status(400).json({ error: "Company are not allowed to access these resources!" });
    }

    const {id} = req.params;
    const application  = await Application.findByPk(id);
    if(!application){
        return res.status(404).json({ error: "Oops, no application found!" });
    }
    await application.destroy();
    res.status(200).json({
        success:true,
        message: "Application deleted successfully!",

    })
}

const postApplication = async(req,res)=>{
    const { role } = req.user;
    
    if (role === "Company") {
        return res.status(400).json({ error: "Company are not allowed to access these resources!" });
    }
   const {name, email, phone, jobId,status } = req.body;
   const applicantID_user = req.user.id;

   
   if(!jobId){
    return res.status(404).json({ error: "Oops, no job found!" });
   }
   const jobDetails = await job.findByPk(jobId);
   if(!jobDetails){
    return res.status(404).json({ error: "Oops, no job found!" });
   }

   const companyID_user = jobDetails.companyId;
   
   const application = await Application.create({
    name,
    email,
    phone,
    applicantID_user,
    companyID_user,
    status,
   });
   res.status(200).json({
    success:true,
    message:"Application submitted successfully!",
    application,
   });
}

module.exports={
    candidatesApplication,
    companyGetapplication,
    candidateDelete,
    postApplication,
};
