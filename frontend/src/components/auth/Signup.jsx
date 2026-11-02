import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import axios from 'axios'
import { USER_API_END_POINT } from '../../utils/constant'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setLoading } from "../../redux/authSlice";
import { useSelector } from 'react-redux'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'

export const Signup = () => {
    const [input, setInput] = React.useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        role: 'student',
        file: ''
    });
    const { loading, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('fullname', input.fullName);
        formData.append('email', input.email);
        formData.append('phoneNumber', input.phone);
        formData.append('password', input.password);
        formData.append('role', input.role);
        if (input.file) {
            formData.append('file', input.file);
        }
        try {
            dispatch(setLoading(true));
            const res = await axios.post(USER_API_END_POINT + "/register", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });

            if (res.data.success) {
                navigate('/login');
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.log(err);
            toast.error(err.response.data.message || "Something went wrong");
        }
        finally {
            dispatch(setLoading(false));
        }
    }
    //check if looged in
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [])
    return (
        <div>
            <Navbar />
            <div className="flex justify-center items-center max-w-7xl mx-auto m-6">
                <form onSubmit={submitHandler} className="w-1/2 border p-5 rounded-md shadow-md">
                    <h1 className="text-xl font-bold mb-5">Sign Up</h1>
                    <div className="my-4">
                        <Label>Full Name</Label>
                        <Input
                            type="text"
                            placeholder="Enter your full name"
                            name="fullName"
                            value={input.fullName}
                            onChange={changeEventHandler}
                        />
                    </div>
                    <div className="my-4">
                        <Label>Email</Label>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            name="email"
                            value={input.email}
                            onChange={changeEventHandler}
                        />
                    </div>
                    <div className="my-4">
                        <Label>Phone Number</Label>
                        <Input
                            type="number"
                            placeholder="Enter your phone number"
                            name="phone"
                            value={input.phone}
                            onChange={changeEventHandler}
                        />
                    </div>
                    <div className="my-4">
                        <Label>Password</Label>
                        <Input
                            type="password"
                            placeholder="Enter your password"
                            name="password"
                            value={input.password}
                            onChange={changeEventHandler}
                        />
                    </div>
                    <div className="flex justify-center items-center">
                        <RadioGroup defaultValue="option-one" className="flex items-center gap-3 my-5">
                            <div className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    value="student"
                                    id="option-one"
                                    name="role"
                                    className="cursor-pointer"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                />
                                <Label htmlFor="option-one">Student</Label>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="radio"
                                    value="recruiter"
                                    id="option-two"
                                    name="role"
                                    className="cursor-pointer"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                />
                                <Label htmlFor="option-two">Recruiter</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className="my-4">
                        <label className="block mb-2">Profile Picture</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="cursor-pointer"
                            onChange={changeFileHandler}
                        />
                    </div>
                    {
                        loading ? <Button className='w-full my-4 '><Loader2 className='mr-2 h-4 w-4 animate-spin' />Please wait...</Button> : <Button type='submit' className='w-full my-4'>Sign Up</Button>
                    }
                    <span className="text-sm text-gray-500 mt-2 block">Already have an account? <a href="/login" className="text-[#0281f8]">Login</a></span>
                </form>
            </div>
        </div>
    )
}
