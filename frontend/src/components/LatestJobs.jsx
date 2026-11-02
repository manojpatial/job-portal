import React from 'react'
import { LatestJobCards } from './LatestJobCards';
import { useSelector } from 'react-redux';



const randonJobs = [1, 2, 3, 4, 5, 6, 7, 8];
export const LatestJobs = () => {
    const {allJobs}= useSelector(store=>store.job);

    return (
        <div className='max-w-7xl mx-auto my-20'>
            <h1 className='text-4xl font-bold'><span className='text-[#6A38C2]'>Latest & Top</span> Job Opening</h1>
            <div className='grid grid-cols-3 gap-4 my-4'>
                {
                   allJobs.lenftg <= 0 ? <span>No job avaiable</span> : allJobs.slice(0,6).map((job) => <LatestJobCards key={job._id} job={job} />)
                }
            </div>

        </div>
    )
}
