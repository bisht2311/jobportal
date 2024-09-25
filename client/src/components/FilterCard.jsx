import React, { useEffect, useState } from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'

const filterData = [
    {
        filterType:'Location',
        array:['Delhi NCR' ,'Banglore','Hyderabad','Pune','Mumbai']
    },
    {
        filterType:'Industry',
        array:['Frontend Developer','Backend Developer','Fullstack Developer']
    }
]

const FilterCard = () => {

    const dispatch = useDispatch()

    const [selectedValue,setSelectedValue] = useState('')

    const changeHandler = (value) => {
        setSelectedValue(value)
    }

    useEffect(()=>{
        //console.log(selectedValue)
        dispatch(setSearchedQuery(selectedValue))
    },[selectedValue])

  return (
    <div className='w-full bg-white p-3 rounded-md'>
        <h1 className='font-bold text-lg'>Filter Jobs</h1>
        <hr className='mt-3' />
        <RadioGroup value={selectedValue} onValueChange={changeHandler}>
            {
                filterData.map((data,index)=>(
                    <div>
                        <h1 className='font-bold text-lg'>{data.filterType}</h1>
                        {
                            data.array.map((item,idx,index)=>{
                                const itemId = `id${index}-${idx}`
                                return(
                                    <div className='flex items-center space-x-2 my-2'>
                                        <RadioGroupItem id={itemId} value={item}  />
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

export default FilterCard