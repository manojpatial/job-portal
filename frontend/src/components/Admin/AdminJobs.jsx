import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { AdminJobsTable } from './AdminJobsTable'
import { useGetAllAdminJobs } from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'

export const AdminJobs = () => {
      useGetAllAdminJobs();
      const navigate = useNavigate();
      const [input, setInput] = useState("");
      const dispatch = useDispatch();
      useEffect(() =>{
          dispatch(setSearchJobByText(input));
  
      },[input]);
      return (
          <div>
              <Navbar />
              <div className='max-w-6xl mx-auto my-1 mt-10'>
                  <div className='flex intems-center justify-between'>
                      <Input
                          className='w-fit'
                          placeholder='Filter by name, role'
                          type='text'
                          onChange = {(e) => setInput(e.target.value)}
                      />
                      {/* alternative link option, it shows URL on hover like a anhor tag 
                      <Button className="cursor-pointer">
                          <Link to="/admin/companies/create">New Company</Link>
                      </Button> */}
  
                      <Button className="cursor-pointer" onClick={() => navigate("/admin/jobs/create")}>
                          Post New Job
                      </Button>
                  </div>
                  <div>
                      <AdminJobsTable/>
                  </div>
              </div>
          </div>
      )
  }
  