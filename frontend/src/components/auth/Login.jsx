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
import { setLoading, setUser } from "../../redux/authSlice";
import { useSelector } from 'react-redux'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'



export const Login = () => {
    const [input, setInput] = React.useState({
        email: '',
        password: '',
        role: 'student',
    });
    const { loading, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(USER_API_END_POINT + "/login", input, { //get data from login function of User controller
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user)); // send user data to store.jsx and use with auth slice
                navigate('/');
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.log(err);
        }
        finally {
            dispatch(setLoading(false));
        }
    }

    //check if looged in
    useEffect(() => {
        if(user){
            navigate("/");
        }
    },[])

    return (
        <div>
            <Navbar />
            <div className="flex justify-center items-center max-w-7xl mx-auto m-6">
                <form onSubmit={submitHandler} className="w-1/2 border p-5 rounded-md shadow-md">
                    <h1 className="text-xl font-bold mb-5">Login</h1>
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
                    {/* {
                        loading ? (
                            <button type="submit" className="bg-[#000000] text-white w-full py-2 rounded-md hover:bg-[#F83002]/90" disabled>
                                Loading...
                            </button>
                        ) : (
                            <button type="submit" className="bg-[#000000] text-white w-full py-2 rounded-md hover:bg-[#F83002]/90">
                                Login
                            </button>
                        )
                    } */}
                    {
                        loading ? <Button className='w-full my-4 '><Loader2 className='mr-2 h-4 w-4 animate-spin'/>Please wait...</Button> : <Button type='submit' className='w-full my-4'>Login</Button>
                    }
                    <span className="text-sm text-gray-500 mt-2 block">Don't have an account? <a href="/signup" className="text-[#0281f8]">Sign Up</a></span>
                </form>
            </div>
        </div>
    )
}
