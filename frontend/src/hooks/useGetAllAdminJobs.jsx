import { setallAdminJobs, setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

export const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();
    useEffect(() => {
    const fetchAllAdminJobs = async () =>{
        try {
            const res = await axios (`${JOB_API_END_POINT}/getadminjobs`, {withCredentials:true});
            
            
            if(res.data.success){
                dispatch(setallAdminJobs(res.data.jobs)) //get data from job controller
            }
        } catch (error) {
            console.log(error);
            
        }
    }
    fetchAllAdminJobs();
  },[])
}
