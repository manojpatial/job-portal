import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import { AppliedJobTable } from './AppliedJobTable'
import { UpdateProfileDialog } from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import store from '@/redux/store'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'


//const skills = ['Node', 'Python', 'PHP'];
const isResume = true;

export const Profile = () => {
    useGetAppliedJobs(); //hooks
    // Popup open
    const [open, setOpen] = useState(false);
    
    //get userdata from store.jsx auth slice
    const {user} = useSelector(store=>store.auth);
    return (
        <>
            <div>
                <Navbar />
                <div className='max-w-7xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                    {/* Profile data */}
                    <div className='flex justify-between'>
                        <div className='flex items-center gap-4'>
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={user?.profile?.profilePhoto}>
                                </AvatarImage>
                            </Avatar>
                            <div className=''>
                                <h2 className='font-medium text-xl'>{user?.fullname}</h2>
                                <p>{user?.profile?.bio}</p>
                            </div>
                        </div>
                        <Button onClick={() => setOpen(true)} className="text-right" variant='outline'><Pen></Pen></Button>
                    </div>
                    {/* contact details */}
                    <div className='my-5'>
                        <div className='flex items-center gap-3 my-2'>
                            <Mail />
                            <span>{user?.email}</span>
                        </div>
                        <div className='flex items-center gap-3 my-2'>
                            <Contact />
                            <span>{user?.phoneNumber}</span>
                        </div>
                    </div>
                    {/* Skills listing */}
                    <div className='my-5'>
                        <h2>Skilles</h2>
                        <div className='flex items-center gap-1'>
                            {
                                user?.profile?.skills.length != 0 ? user?.profile?.skills.map((skill, index) => <Badge key={index}>{skill}</Badge>) : "No Skill Added"
                            }
                        </div>
                    </div>
                    {/* Resume */}
                    <div className='grid w-full max-w-sm items-center gap-1'>
                        <Label className='text-md font-bold'>Resume</Label>
                        {
                            isResume ? <a target="_blank" href={user?.profile.resume} className='text-blue-500 w-full hover:underline cursor-pointer'>{user?.profile?.resumeOriginalName}</a> : <span>NA</span>
                        }
                    </div>

                </div>
                <div className='max-w-7xl mx-auto bg-white rounded-2xl'>
                    <h2 className='font-bold text-lg my-5'>Applied Jobs</h2>
                    {/* Application Job Table */}
                    <AppliedJobTable />
                </div>

                <UpdateProfileDialog open={open} setOpen={setOpen}/>
            </div>
        </>

    )
}
