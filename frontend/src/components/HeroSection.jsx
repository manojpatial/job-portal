import { setSearchedQuery } from '@/redux/jobSlice'
import { Button } from '@base-ui/react'
import { Search, SearchIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export const HeroSection = () => {
    //Search feature
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }
    return (
        <div className='text-center mt-6'>
            <div className='flex flex-col gap-5 my-10'>
                <span className='mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium'>No. Job Hunt Platform</span>
                <h1 className='text-5xl font-bold'>Search, Apply & <br /> Get Your <span className='text-[#6A38C2]'>Dream Job</span></h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus debitis alias ut labore ipsa?</p>
                <div className='flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto'>
                    <input
                        type="text"
                        placeholder='Find your dream jobs'
                        onChange={(e) => setQuery(e.target.value)}
                        className='outline-none border-none w-full p-4'
                    />
                    <Button onClick={searchJobHandler} className='rounded-r-full bg-[#6A38C2] p-4 text-white'>
                        <Search className='h-5 w-5' />
                    </Button>


                </div>
            </div>

        </div>
    )
}
