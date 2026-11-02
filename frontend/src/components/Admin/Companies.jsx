import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { CompaniesTable } from './CompaniesTable'
import { useNavigate } from 'react-router-dom'
import { useGetAllCompanies } from '@/hooks/useGetAllCompanies'
import { useDispatch } from 'react-redux'
import { setsearchCompanyByText } from '@/redux/companySlice'

export const Companies = () => {
    useGetAllCompanies();
    const navigate = useNavigate();
    const [input, setInput] = useState("");
    const dispatch = useDispatch();
    useEffect(() =>{
        dispatch(setsearchCompanyByText(input));

    },[input]);
    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-1 mt-10'>
                <div className='flex intems-center justify-between'>
                    <Input
                        className='w-fit'
                        placeholder='Filter by name'
                        type='text'
                        onChange = {(e) => setInput(e.target.value)}
                    />
                    {/* alternative link option, it shows URL on hover like a anhor tag 
                    <Button className="cursor-pointer">
                        <Link to="/admin/companies/create">New Company</Link>
                    </Button> */}

                    <Button className="cursor-pointer" onClick={() => navigate("/admin/companies/create")}>
                        New Company
                    </Button>
                </div>
                <div>
                    <CompaniesTable/>
                </div>
            </div>
        </div>
    )
}
