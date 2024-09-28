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

const Staffs = () => {
  const { data: session }: any = useSession();
  const { data: allStaffs, isPending: loadingStaffData } = useGetAllStaffs(session?.user?.id);
  return (
    <div className='p-4'>
      <div className="flex justify-between items-center bg-slate-950/50 p-3 rounded-lg">
        <h1 className='font-semibold text-xl'>Staff Management</h1>
        {allStaffs && <Link href="/admin/staffs/add-staff">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className='p-2 hover:bg-cyan-950 rounded-full px-6 border-2 border-slate-400 cursor-pointer'>
            Add staff
          </motion.button>
        </Link>}
      </div>
      <div className="bg-slate-950/50 p-3 rounded-lg mt-3">
        {loadingStaffData && <TableSkeleton />}
        {allStaffs && <DataTable columns={columns} data={allStaffs} />}
      </div>
    </div>
  )
}

export default Staffs