import { Radio, RadioGroup } from '@base-ui/react'
import React, { useEffect, useState } from 'react'
import { RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'

const filterData = [
    {
        filterType: "Location",
        array: ["Delhi NCR", "Banglore", "Hydrabad", "Pune", "Mumbai"]
    },
    {
        filterType: "Industry",
        array: ["Frontend Developer", "Backend Developer", "Data Science", "Graphic Designer", "FullStack Developer"]
    },
    {
        filterType: "Salary",
        array: ["0-40k", "41-1lakh", "1Lakh-5lakh"]
    },


]
export const FilterCard = () => {
    const dispatch = useDispatch();
    const [selectedValue, setSelectedValue] = useState("");
    const changeHandler = (value) =>{
        setSelectedValue(value);
    }
    useEffect(() =>{
       // console.log(selectedValue);
        dispatch(setSearchedQuery(selectedValue))
    },[selectedValue]);
    return (
        <div className='w-full bg-white p-4 rounded-md'>
            <h2 className='font-bold text-lg'>Filter Jobs</h2>
            <hr className='mt-3' />
            <RadioGroup value={selectedValue} onValueChange={changeHandler}>
                {
                    filterData.map((data, index) => (
                        <div key={data.filterType} className="mt-3">
                            <h3 className='mt-6 font-bold'>{data.filterType}</h3>
                            {
                                data.array.map((item, idx) => {
                                    const itemId = `id-${index}-${idx}`;
                                    return (
                                    <div className='flex items-center space-x-2 my-2'>
                                        <RadioGroupItem id={itemId} value={item}/>
                                        <Label htmlFor={itemId}>{item}</Label>
                                    </div>
                                    )
                                })
                            }
                        </div>
                    ))
                }
            </RadioGroup>
        </div>
    )
}
