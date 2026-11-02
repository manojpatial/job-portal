import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

// apply for a job
export const applyJob = async (req, res) => {
    try {
        const { id:jobId } = req.params;
        const userId = req.id; // from authentication middleware
        if (!jobId) {
            return res.status(400).json({ 
                message: 'Job ID is required',
                success: false
            });
        }
        //check if user has already applied for the job
        const existingApplication = await Application.findOne({ job:jobId, applicant:userId });
        if (existingApplication) {
            return res.status(400).json({ 
                message: 'You have already applied for this job',
                success: false
            });
        }
        //check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ 
                message: 'Job not found',
                success: false
            });
        }
        //create new application
       const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        });
       
        job.applications.push(newApplication._id);
        await job.save();
         res.status(201).json({ 
            message: 'Application submitted successfully', 
            success: true,
            newApplication
        });
    }catch (error) {
        res.status(500).json({ message: 'Error applying for job', error });
    
    }
};

//Get all applications submitted by a Student
export const getApplicationsForJob = async (req, res) => {
    try {
        const userId = req.id; // from authentication middleware
        const applications = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: 'job',
            options: { sort: { createdAt: -1 } },
            populate: { // its a nested populate to get the company details of the job
                path: 'company',
                options: { sort: { createdAt: -1 } },
            }
            });
        if (!applications) {
            return res.status(404).json({ 
                message: 'No applications found',
                success: false
            });
        }
        res.status(200).json({ 
            message: 'Applications fetched successfully',
            success: true,
            applications,
        });

    }catch (error) {
        res.status(500).json({ message: 'Error fetching applications', error });
    }
};

//Get all applications for a job posted by a recruiter
export const getApplicationsForJobByRecruiter = async (req, res) => {
    try {
        const { id:jobId } = req.params;
        const userId = req.id; // from authentication middleware
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: { // its a nested populate to get the applicant details of the application
                path: 'applicant',
                options: { sort: { createdAt: -1 } }
            }
        });
        if (!job) {
            return res.status(404).json({
                message: 'Job not found',
                success: false
            });
        }
        res.status(200).json({
            message: 'Applications fetched successfully',
            success: true,
            job,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching applications', error });
    }
};
//update job application status by recruiter
export const updateApplicationStatus = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const { status } = req.body;
        const userId = req.id; // from authentication middleware
        if(!status) {
            return res.status(400).json({
                message: 'Status is required',
                success: false
            });
        }
        //find application by applicationId
        const application = await Application.findOne({ _id: applicationId });
        
        console.log(application);
        

        if (!application) {
            return res.status(404).json({
                message: 'Application not found',
                success: false
            });
        }
        //update the status of the application
        application.status = status.toLowerCase();
        await application.save();
        res.status(200).json({
            message: 'Application status updated successfully',
            success: true,
            application,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating application status', error });
    }
};