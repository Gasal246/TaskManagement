"use client"
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'
import { useGetAllDepartments } from '@/query/client/adminQueries'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Globe2, Users } from 'lucide-react'
import { Tooltip } from 'antd'

const Departments = () => {
  const { data: session }: any = useSession();
  const { data: departments, isLoading: loadingDepartments } = useGetAllDepartments(session?.user?.id);
  return (
    <div className='p-4'>
      <div className="flex justify-between">
        <h1 className='font-bold text-2xl'>Department Management</h1>
      </div>
      <div className='bg-slate-950/50 p-3 rounded-lg mt-3'>
        <h1 className='font-medium mb-2'>{loadingDepartments ? 'please wait..' : (departments?.length <= 0 ? 'No Departments' : 'Your Departments:')}</h1>
        {loadingDepartments ?
          <div className='flex gap-2 items-center w-full justify-center h-[75dvh]'>
            <h1>loading...</h1>
            <Image src={'/assets/walk.gif'} alt='walkanimation' width={60} height={60} />
            <h1>please wait...</h1>
          </div> :
          <div className='flex flex-wrap'>
            {departments?.map((department: any) => (
              <div className="w-full md:w-3/12 p-1" key={department?._id}>
                <Link href={`/admin/departments/${department?._id}`}>
                  <Tooltip title="click to view department">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full h-full bg-sky-700 p-2 text-center gap-1 rounded-sm hover:shadow-md cursor-pointer">
                      <h1 className='font-bold '>{department?.DepartmentName}</h1>
                      <div className="flex gap-3 justify-center items-center">
                        <Tooltip title="total staffs"><h1 className='text-xs flex gap-1 items-center'><Users size={14} /> {department?.Staffs?.length}</h1></Tooltip>
                        <Tooltip title="total regions"><h1 className='text-xs flex gap-1 items-center'><Globe2 size={14} /> {department?.Regions?.length}</h1></Tooltip>
                      </div>
                    </motion.div>
                  </Tooltip>
                </Link>
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  )
}

export default Departments
