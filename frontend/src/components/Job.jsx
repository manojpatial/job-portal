import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar } from './ui/avatar'
import { AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

export const Job = ({ job }) => {
    const navigate = useNavigate();
    // const jobId = "dsda8dasd887654da";
    const dayAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
    }
    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-500'>{dayAgoFunction(job?.createdAt) == 0 ? "Today" : `${dayAgoFunction(job?.createdAt)} days ago`} </p>
                <Button variant='outline'><Bookmark className='rounded-full' size="icon" /></Button>
            </div>
            <div className='flex items-center gap-2 my-2'>
                <Button variant="outline" className="p-6" size="icon">
                    <Avatar>
                        <AvatarImage src={job?.company?.logo || "https://png.pngtree.com/png-vector/20190225/ourmid/pngtree-circuit-logo-template-vector-png-image_704226.jpg"} />
                    </Avatar>
                </Button>
                <div>
                    <h2 className='font-medium text-lg'>{job?.company?.name}</h2>
                    <p className='text-sm text-gray-500'>{job?.location}</p>
                </div>
            </div>
            <div>
                <h3 className='font-bold text-lg my-2'>{job?.title}</h3>
                <p className='text-sm text-gray-600'>{job?.description}</p>
            </div>
            <div className='flex items-center mt-4 gap-2'>
                <Badge className="text-blue-700 font-bold" variant='ghost'>{job?.position} Position</Badge>
                <Badge className="text-[#F83002] font-bold" variant='ghost'>{job?.jobType}</Badge>
                <Badge className="text-[#7209b7] font-bold" variant='ghost'>{job?.salary} LPA</Badge>
            </div>
            <div className='flex items-center mt-4 gap-2'>
                <Button onClick={() => navigate(`/description/${job?._id}`)} variant="outline">View Details</Button>
                <Button className="bg-[#7209b7]">Save for later</Button>
            </div>
        </div>
    )
}
