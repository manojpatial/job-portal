import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const [filterCompany, setfilterCompany] = useState(companies);
    const navigate= useNavigate();

    //filter company by search name logic
    useEffect(() =>{
        const filteredCompany = companies.length >= 0 && companies.filter((company) =>{
            if(!searchCompanyByText){
                return true;
            }
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase()); 
        });
        setfilterCompany(filteredCompany);

    },[companies, searchCompanyByText]);

    return (
        <div>
            <div>
                <Table>
                    <TableCaption className="caption-top">Companies List</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Logo</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className='text-right'>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            filterCompany.length <= 0 ? <span>No Company Available</span> : (
                                <>
                                    {
                                        filterCompany?.map((company) => {
                                            return (
                                                <TableRow  key={company._id}>
                                                    <TableCell>
                                                        <Avatar>
                                                            <AvatarImage
                                                                src={company.logo || "https://png.pngtree.com/png-vector/20190225/ourmid/pngtree-circuit-logo-template-vector-png-image_704226.jpg"}
                                                            />
                                                        </Avatar>
                                                    </TableCell>
                                                    <TableCell>{company.name}</TableCell>
                                                    <TableCell>{company.createdAt.split("T")[0]}</TableCell>
                                                    <TableCell className='text-right cursor-pointer'>
                                                        <Popover>
                                                            <PopoverTrigger><MoreHorizontal className='cursor-pointer' /></PopoverTrigger>
                                                            <PopoverContent className='w-32'>
                                                                <div onClick = {() => navigate(`/admin/companies/${company._id}`)} className='flex items-center gap-4 w-fit cursor-pointer'>
                                                                    <Edit2 className='w-4' />
                                                                    <span>Edit</span>
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
