"use client"
import AddDepartmentsDialog from '@/components/super/AddDepartmentsDialog'
import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useDeleteDemoDep, useGetDemoDepartments } from '@/query/client/superuserQueries'
import { Ban, CircleCheckBig, Trash2 } from 'lucide-react'
import { Popconfirm, Tooltip } from 'antd'
import LoaderSpin from '@/components/shared/LoaderSpin'
import Image from 'next/image'
import { toast } from 'sonner'

const DepartmentPage = () => {
  const { data: demodepartments, isLoading: demoDeparmentsLoading } = useGetDemoDepartments();
  const { mutateAsync: deleteDemoDep, isPending: deletingDep } = useDeleteDemoDep();
  const handleDeleteDepartment = async (depid: string) => {
    const res = await deleteDemoDep(depid);
    if(res?._id){
      return toast.success("Department Modal Successfully Deleted.")
    }else{
      return toast.error("Failed to Delete this Department Model.")
    }
  };
  return (
    <div className='p-4 h-screen overflow-y-scroll pb-20'>
      <div className="flex justify-between">
        <h1 className='font-semibold text-xl'>Department Management</h1>
        <AddDepartmentsDialog trigger={
          <motion.h1 whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className='px-3 p-1 rounded-sm bg-slate-200 text-slate-900'>Build Department</motion.h1>
        } />
      </div>
      {demoDeparmentsLoading && <div className="w-full flex justify-center items-center h-[80dvh]"><LoaderSpin size={90} /></div>}
      {demodepartments?.length <= 0 && <div className="w-full flex justify-center items-center h-[80dvh]"><Tooltip title="No Demo Departments added"><Image src={`/icons/noresults.png`} alt='noresults' width={200} height={200} className='opacity-70' /></Tooltip></div>}
      <div className="flex flex-wrap">
        {
          demodepartments?.map((dep: any) => (
            <div key={dep?._id} className="w-full lg:w-3/12 p-1">
              <div className="bg-slate-900 p-3 rounded-sm">
                <div className="flex justify-between">
                  <h1 className='font-semibold mb-1'>{dep?.DepartmentName}</h1>
                  <Popconfirm title="Delete Department Plan ?" description="Are you sure wanna delete this deparment plan ?" onConfirm={() => handleDeleteDepartment(dep?._id)}><motion.div whileHover={{ scale: 1.05, rotate: -30 }} whileTap={{ scale: 0.98 }} className='text-red-800 hover:text-red-600'><Trash2 size={20} /></motion.div></Popconfirm>
                </div>
                <h1 className="text-xs flex items-center gap-1 mb-1">{dep?.AllowProjects ? <><CircleCheckBig size={14} /> Allowed Projects</> : <><Ban size={14} /> No Projects Allowed</>}</h1>
                <h1 className="text-xs flex items-center gap-1 mb-1">{dep?.AllowTasks ? <><CircleCheckBig size={14} /> Allowed Tasks</> : <><Ban size={14} /> No Tasks Allowed</>}</h1>
                <li className="text-xs">Staffs Allowed: {dep?.MaximumStaffs}</li>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default DepartmentPage