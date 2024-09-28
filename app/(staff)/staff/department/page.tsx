"use client"
import { CubeIcon } from '@radix-ui/react-icons'
import { Avatar } from 'antd'
import { LocateFixedIcon } from 'lucide-react'
import React from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Progress } from '@/components/ui/progress'
import AddDepartmentRegion from '@/components/staff/AddDepartmentRegion'
import { DataTable } from './data-table'
import { columns } from './columns'

const StaffDepartment = () => {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className='p-4'>
      <div className="bg-slate-950/50 rounded-lg p-3 mb-3">
        <h1 className='flex items-center gap-1'><CubeIcon /> Department Name</h1>
      </div>
      <div className="bg-slate-950/50 rounded-lg p-3 mb-3 flex flex-wrap items-center">
        <div className="w-full lg:w-1/2 p-1">
          <div className="bg-slate-950/50 rounded-lg p-3">
            <h1 className='text-xs text-cyan-500 leading-3'>Allowed Staffs: <span className='text-xs text-slate-400'>10</span></h1>
            <h1 className='text-xs text-cyan-500 leading-3'>Total Staffs: <span className='text-xs text-slate-400'>5</span></h1>
            <div className="flex gap-1 items-center">
              <Progress value={30} />
              <h1 className='text-xs text-slate-400'>30%</h1>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 p-1">
          <div className="bg-slate-950/60 rounded-lg p-2">
            <h1 className='text-xs text-cyan-600 mb-1'>Department Head</h1>
            <div className="flex gap-2 items-center">
              <Avatar src="/avatar.png" />
              <div>
                <h1 className='text-xs text-cyan-500 leading-3'>YOU</h1>
                <h1 className='text-xs text-slate-400'>you@gmail.com</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-slate-950/50 rounded-lg p-3 mb-3">
        <div className="flex justify-between">
          <h1 className='text-xs font-medium text-cyan-300'>Department Regions</h1>
          <AddDepartmentRegion currentUser={{}} allRegions={[]} />
        </div>
        <div className="flex flex-wrap">
          <div className="w-full lg:w-3/12 p-1">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => router.push(`/staff/department/regionid`)} className="bg-slate-950/50 rounded-lg p-2 cursor-pointer">
              <h1 className='text-sm flex gap-1 items-center'><LocateFixedIcon size={18} /> Region Name</h1>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="bg-slate-950/50 rounded-lg p-3">
        <h1 className='text-xs font-medium text-cyan-300'>Department Staffs</h1>
        <DataTable data={[]} columns={columns} />
      </div>
    </div>
  )
}

export default StaffDepartment