"use client"
import RegionAndAreaFilter from '@/components/shared/RegionAndAreaFilter'
import { useFindUserById } from '@/query/client/userQueries';
import { Info, Users } from 'lucide-react';
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { DataTable } from './data-table';
import { columns } from './columns';

const StaffStaffs = () => {
  const { data: session }: any = useSession();
  const { data: currentUser, isLoading: loadingUser } = useFindUserById(session?.user?.id);
  const [region, setRegion] = useState('');
  const [area, setArea] = useState('');

  return (
    <div className='p-4'>
      <div className="bg-slate-950/50 rounded-lg p-3 flex justify-between items-center flex-wrap">
        <div>
          <h1 className='flex gap-1 items-center'><Users size={18} /> Staffs</h1>
          <p className="text-xs text-slate-300 w-full lg:w-3/4 flex gap-1 items-center">{"Staffs are assigned by the company and you can't modify or delete their data unless agreed by your company administrator, you could view staff documents and refer their skills for your upcoming projects."}</p>
        </div>
      </div>
      <div className="bg-slate-950/50 rounded-lg p-3 mt-3">
        <DataTable columns={columns} data={[]} />
      </div>
    </div>
  )
}

export default StaffStaffs