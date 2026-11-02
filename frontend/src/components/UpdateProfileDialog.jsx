import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'sonner'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'


export const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    //get user data from store auth slice
    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
        fullname: user?.fullname,
        email: user?.email,
        phoneNumber: user?.phoneNumber,
        bio: user?.profile?.bio,
        skills: user?.profile?.skills?.map(skill => skill),
        file: user?.profile?.resume
    });

    const dispatch = useDispatch(); // initiate to send updated user data into store.jsx

    //set all input
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    //set file
    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
    }

    // submit form data into database
    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);

        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user)); //send updated user data into store.jsx
                toast.success(res.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Update failed");
        }finally{
            setLoading(false);
        }
        setOpen(false); //close popup
        console.log(input);

    }
    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}> {/* onOpenChange={setOpen} will close popup on x click*/}
                <DialogContent className='sm:max-w[450px]'>
                    <DialogHeader>
                        <DialogTitle>
                            Update Profile
                        </DialogTitle>
                    </DialogHeader>
                    <div>
                        <form onSubmit={submitHandler}>
                            <div className='grid gap-4 py-4'>
                                <div className='grid grid-cols-4 items-center gap-2'>
                                    <Label htmlFor="name" className='text-right'>Name</Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="fullname"
                                        value={input.fullname}
                                        onChange={changeEventHandler}
                                        className='col-span-3'
                                    />
                                </div>
                                <div className='grid grid-cols-4 items-center gap-2'>
                                    <Label htmlFor="email" className='text-right'>Email</Label>
                                    <Input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={input.email}
                                        onChange={changeEventHandler}
                                        className='col-span-3'
                                    />
                                </div>
                                <div className='grid grid-cols-4 items-center gap-2'>
                                    <Label htmlFor="number" className='text-right'>Phone</Label>
                                    <Input
                                        type="number"
                                        id="number"
                                        name="phoneNumber"
                                        value={input.phoneNumber}
                                        onChange={changeEventHandler}
                                        className='col-span-3'
                                    />
                                </div>
                                <div className='grid grid-cols-4 items-center gap-2'>
                                    <Label htmlFor="bio" className='text-right'>Bio</Label>

                                    <Input
                                        type="text"
                                        id="bio"
                                        name="bio"
                                        value={input.bio}
                                        onChange={changeEventHandler}
                                        className='col-span-3'
                                    />
                                </div>
                                <div className='grid grid-cols-4 items-center gap-2'>
                                    <Label htmlFor="skills" className='text-right'>Skills</Label>
                                    <Input
                                        id="skills"
                                        name="skills"
                                        value={input.skills}
                                        onChange={changeEventHandler}
                                        className='col-span-3'
                                    />
                                </div>
                                <div className='grid grid-cols-4 items-center gap-2'>
                                    <Label htmlFor="file" className='text-right'>Resume</Label>
                                    <Input
                                        type="file"
                                        id="file"
                                        name="file"
                                        onChange={fileChangeHandler}
                                        accept='application/pdf'
                                        className='col-span-3'
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                {
                                    loading ? <Button className='w-full my-4 '><Loader2 className='mr-2 h-4 w-4 animate-spin' />Please wait...</Button> : <Button type='submit' className='w-full my-4'>Update</Button>
                                }
                            </DialogFooter>
                        </form>
                    </div>
                </DialogContent>

            </Dialog>
        </div>
    )
}
