import { Job } from "../models/job.model.js";


//post a job
export const postJob = async (req, res) => {
    try {
        
        const { title, description, requirements, salary, experience, location, jobType, position, companyId } = req.body;
        const userId = req.id; // this is logged in user id from authentication middleware
        if(!title || !description || !requirements || !salary || !experience || !location || !jobType || !position || !companyId) {
            return res.status(400).json({ 
                message: 'All fields are required', 
                success: false 
            });
        }
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(','),
            salary:Number(salary),
            experienceLevel:Number(experience),
            location,
            jobType,
            position,
            company: companyId,
            created_by: userId,
        });
        res.status(201).json({
            message: 'Job posted successfully',
            job, 
            success: true 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error posting job', error });
    }
};

//get all jobs for students
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query={
            $or: [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
            ]
        };
        const jobs = await Job.find(query).populate({
            path: 'company',
        }).sort({ createdAt: -1 });
        if (!jobs) {
            return res.status(404).json({ 
                message: 'No jobs found',
                success: false
            });
        }
        res.status(200).json({ 
            jobs, 
            success: true 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching jobs', error });
    }
};


//get job by id for students
export const getJobById = async (req, res) => {
    try {
        const jobId  = req.params.id;
       // const job = await Job.findById(jobId);
       const job = await Job.findById(jobId).populate({
                    path: "applications" // get application data from Applications collection
                    });
        if (!job) {
            return res.status(404).json({ 
                message: 'Job not found',
                success: false
            });
        }
        res.status(200).json({ 
            job, 
            success: true 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching job', error });
    }
};


// For Admin/Recruiter to get all jobs posted by them
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id; // this is logged in user id from authentication middleware
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        })
        if (!jobs) {
            return res.status(404).json({ 
                message: 'No jobs found',
                success: false
            });
        }
        res.status(200).json({ 
            jobs, 
            success: true 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching jobs', error });
    }
};