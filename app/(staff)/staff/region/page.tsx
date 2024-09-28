"use client"
import { LandPlot, LocateFixedIcon } from 'lucide-react'
import React from 'react'
import { DataTable } from './data-table'
import { columns } from './columns'
import AddDepartmentRegion from '@/components/staff/AddDepartmentRegion'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import AddDepartmentArea from '@/components/staff/AddDepartmentArea'

const StaffAreas = () => {
  const router = useRouter();
  return (
    <div className='p-4'>
      <div className="bg-slate-950/50 rounded-lg p-3 mb-3">
        <h4 className='text-xs text-cyan-500'>Areas Under Region</h4>
        <h1 className='text-slate-200 flex gap-1 items-center'><LandPlot size={18} /> India</h1>
      </div>
      <div className="bg-slate-950/50 rounded-lg p-3 mb-3">
        <div className="flex justify-between">
          <h1 className='text-xs font-medium text-cyan-300'>Regional Areas</h1>
          <AddDepartmentArea currentUser={{}} allAreas={[]} />
        </div>
        <div className="flex flex-wrap">
          <div className="w-full lg:w-3/12 p-1">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => router.push(`/staff/region/areaid`)} className="bg-slate-950/50 rounded-lg p-2 cursor-pointer">
              <h1 className='text-sm flex gap-1 items-center'><LocateFixedIcon size={18} /> Area Name</h1>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="bg-slate-950/50 rounded-lg p-3">
        <h1 className='text-xs font-medium text-cyan-300'>Region Staffs</h1>
        <DataTable data={[]} columns={columns} />
      </div>
    </div>
  )
}

export default StaffAreas