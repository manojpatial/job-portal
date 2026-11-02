import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant'
import { useDispatch, useSelector } from 'react-redux'
import { setSingleJob } from '@/redux/jobSlice'
import { toast } from 'sonner'

export const JobDescription = ({}) => {
   
    //get job id from URL
    const params = useParams();
    const jobId = params.id;
    const {singleJob} = useSelector(store =>store.job);
    const {user} = useSelector(store=>store.auth);

    const dispatch = useDispatch();
    //check if loggedin user already applied for this job or not
     const isInitallyApplied =  singleJob?.applications?.some(application => application.applicant == user?._id) || false;
     const [isApplied, setIsApplied] = useState(isInitallyApplied);
//     singleJob?.applications?.forEach(app => {
//   console.log("Applicant:", app.applicant);
//   console.log("User ID:", user?._id);
// });

    //apply to a job function
    const applyJobHandler = async () =>{
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {withCredentials:true});
            console.log(res.data);
            
            if(res.data.success){
                setIsApplied(true); //Update apply button after response 
                const updatedSingleJob = {...singleJob, applications:[...singleJob.applications,{applicant:user?._id}]};
                dispatch(setSingleJob(updatedSingleJob)); //udated realtime applicant number
                toast.success(res.data.message);
            }
        } catch (error) { 
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
    useEffect(() => {
        const feetchSingleJob = async () =>{
            try {
                const res = await axios (`${JOB_API_END_POINT}/get/${jobId}`, {withCredentials:true});
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application => application.applicant == user?._id));
                }
            } catch (error) { 
                console.log(error);
                
            }
        }
        feetchSingleJob();
    },[jobId, dispatch, user?._id])
    return (
        <div>
            <Navbar />
            <div className='max-w-7xl mx-auto my-10'>
                <div className='flex items-center justify-between'>
                    <div>
                        <h1 className='font-bold text-xl'>{singleJob?.title}</h1>
                        <div className='flex items-center mt-4 gap-2'>
                            <Badge className="text-blue-700 font-bold" variant='ghost'>{singleJob?.position} Position</Badge>
                            <Badge className="text-[#F83002] font-bold" variant='ghost'>{singleJob?.jobType}</Badge>
                            <Badge className="text-[#7209b7] font-bold" variant='ghost'>{singleJob?.salary} LPA</Badge>
                        </div>
                    </div>
                    {/* Dynamic CSS example */}
                    <Button
                    onClick = {isApplied ? null : applyJobHandler}
                        disabled={isApplied}
                        className={`rounded-fill ${isApplied ? 'bg-gray-600 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#b43a1b]'} `}>
                        {
                            isApplied ? "Applied" : "Apply Now"
                        }
                    </Button>
                </div>
                <h2 className='border-b-2 border-b-gray-300 my-4 py-1'>{singleJob?.description}</h2>
                <div className='my-4'>
                    <h3 className='font-bold my-1'>Role:<span className='pl-3 font-normal text-gray-600'>{singleJob?.title}</span></h3>
                    <h3 className='font-bold my-1'>Location:<span className='pl-3 font-normal text-gray-600'>{singleJob?.location}</span></h3>
                    <h3 className='font-bold my-1'>Description:<span className='pl-3 font-normal text-gray-600'>{singleJob?.description}</span></h3>
                    <h3 className='font-bold my-1'>Experience:<span className='pl-3 font-normal text-gray-600'>{singleJob?.experienceLevel} Years</span></h3>
                    <h3 className='font-bold my-1'>Salary:<span className='pl-3 font-normal text-gray-600'>{singleJob?.salary} LPA</span></h3>
                    <h3 className='font-bold my-1'>Total Application:<span className='pl-3 font-normal text-gray-600'>{singleJob?.applications.length}</span></h3>
                    <h3 className='font-bold my-1'>Posted Date:<span className='pl-3 font-normal text-gray-600'>{singleJob?.createdAt.split("T")[0]}</span></h3>
                </div>
            </div>
        </div>
    )
}
