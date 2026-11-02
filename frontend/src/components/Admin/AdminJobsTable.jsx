import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSearchJobByText } from '@/redux/jobSlice'

export const AdminJobsTable = () => {
    const {allAdminJobs, searchJobByText} = useSelector(store => store.job);
    const [filterJobs, setfilterJobs] = useState(allAdminJobs);
    const navigate= useNavigate();

    //filter company by search name logic
    useEffect(() =>{
        const filterJobs= allAdminJobs.length >= 0 && allAdminJobs.filter((job) =>{
            if(!searchJobByText){
                return true;
            }
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) ||  job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase()); 
        });
        setfilterJobs(filterJobs);

    },[allAdminJobs, searchJobByText]);

    return (
        <div>
            <div>
                <Table>
                    <TableCaption className="caption-top">Posted Job List</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Company Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className='text-right'>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            filterJobs.length <= 0 ? <span>No Company Available</span> : (
                                <>
                                    {
                                        filterJobs?.map((job) => {
                                            return (
                                                <TableRow  key={job._id}>
                                                    <TableCell>
                                                      {job?.company?.name}
                                                    </TableCell>
                                                    <TableCell>{job?.title}</TableCell>
                                                    <TableCell>{job?.createdAt.split("T")[0]}</TableCell>
                                                    <TableCell className='text-right cursor-pointer'>
                                                        <Popover>
                                                            <PopoverTrigger><MoreHorizontal className='cursor-pointer' /></PopoverTrigger>
                                                            <PopoverContent className='w-32'>
                                                                <div onClick = {() => navigate(`/admin/jobs/${job._id}`)} className='flex items-center gap-4 w-fit cursor-pointer'>
                                                                    <Edit2 className='w-4' />
                                                                    <span>Edit</span>
                                                                </div>
                                                                <div onClick = {() => navigate(`/admin/jobs/${job._id}/applicants`)}  className='flex items-center w-fit gap-2 cursor-pointer mt-2'>
                                                                    <Eye className='w-4'/>
                                                                    <span>Applicants</span>
                                                                </div>
                                                            </PopoverContent>
                                                        </Popover>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    }

                                </>
                            )
                        }

                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
