import React from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Avatar, AvatarImage } from './ui/avatar'
import { useNavigate } from 'react-router-dom'

export const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();
    return (
        <div onClick={() => navigate(`/description/${job?._id}`)} className='p-5 rounded-md shadow-xl bg-white border border-gray-100 cursor-pointer'>
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
                <h2 className='font-medium text-lg' my-2>{job?.title}</h2>
                <p className='text-sm '>{job?.description}</p>
            </div>
            <div className='flex items-center mt-4 gap-2'>
                <Badge className="text-blue-700 font-bold" variant='ghost'>{job?.position} Position</Badge>
                <Badge className="text-[#F83002] font-bold" variant='ghost'>{job?.jobType}</Badge>
                <Badge className="text-[#7209b7] font-bold" variant='ghost'>{job?.salary} LPA</Badge>
            </div>
        </div>
    )
}
