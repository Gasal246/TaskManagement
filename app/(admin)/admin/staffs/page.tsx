"use client"
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { useGetAllStaffs } from '@/query/client/adminQueries'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import TableSkeleton from '@/components/skeletons/TableSkeleton'
import { useFindUserById } from '@/query/client/userQueries'

const Staffs = () => {
  const { data: session }: any = useSession();
  const { data: allStaffs, isPending: loadingStaffData } = useGetAllStaffs(session?.user?.id);
  const { data: currentUser, isLoading: loadingUser } = useFindUserById(session?.user?.id);
  return (
    <div className='p-4 pb-20 overflow-y-scroll'>
      <div className="flex justify-between items-center bg-slate-950/50 p-3 rounded-lg">
        <h1 className='font-semibold text-xl'>Staff Management</h1>
        {allStaffs && <Link href="/admin/staffs/add-staff">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className='p-2 hover:bg-cyan-950 rounded-full px-6 border-2 border-slate-400 cursor-pointer'>
            Add staff
          </motion.button>
        </Link>}
      </div>
      <div className="bg-slate-950/50 p-3 rounded-lg mt-3">
        {allStaffs && <div className="flex justify-between">
          <h1 className='text-xs text-slate-400 leading-3'>Total Staffs: <span className='font-medium text-slate-300'>{allStaffs?.length}</span></h1>
          {allStaffs.length > 10 && <h1 className='text-xs px-2 p-1 rounded-full bg-slate-900 leading-3'>10 Per Page</h1>}
        </div>}
        {loadingStaffData && <TableSkeleton />}
        {allStaffs && <DataTable columns={columns} data={allStaffs} currentUser={currentUser} />}
      </div>
    </div>
  )
}

export default Staffs