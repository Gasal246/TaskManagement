"use client"
import { useFindUserById } from '@/query/client/userQueries';
import { AreaChart, BellElectric, Contact, Globe2, LandPlot } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React from 'react'
import { useRouter } from 'next/navigation';
import UserDailyActivity from '@/components/charts/UserDailyActivity';
import UserMonthlyActivity from '@/components/charts/UserMonthlyActivity';
import TodoBox from '@/components/staff/TodoBox';
import ProjectsCompletedAndPending from '@/components/charts/ProjectsCompletedAndPending';

const StaffHome = () => {
  const router = useRouter();
  const { data: session }: any = useSession();
  const { data: userData, isLoading: userLoading } = useFindUserById(session?.user?.id);
  return (
    <div className='p-4'>
      <div className="flex justify-between p-3 bg-slate-950/50 rounded-lg mb-3 items-center flex-wrap">
        <h1>Hello, {userData?.Name}!</h1>
        <div className="flex gap-2 flex-wrap">
          <div className='border border-slate-700 rounded-lg p-1 px-2'>
            <h1 className='text-xs font-medium flex items-center gap-1'><BellElectric size={14} /> Department</h1>
            <h2 className='text-xs text-slate-300 text-center'>{userData?.Department ? userData?.Department?.DepartmentName : 'Not added to any department'}</h2>
          </div>
          <div className='border border-slate-700 rounded-lg p-1 px-2'>
            <h1 className='text-xs font-medium flex items-center gap-1'><Contact size={14} /> Role</h1>
            <h2 className='text-xs text-slate-300 capitalize text-center'>{userData?.Role ? userData?.Role : 'Staff'}</h2>
          </div>
          <div className='border border-slate-700 rounded-lg p-1 px-2'>
            <h1 className='text-xs font-medium flex items-center gap-1'><Globe2 size={14} /> Region</h1>
            <h2 className='text-xs text-slate-300 text-center'>{userData?.Region ? userData?.Region?.RegionName : 'No Region Added'}</h2>
          </div>
          <div className='border border-slate-700 rounded-lg p-1 px-2'>
            <h1 className='text-xs font-medium flex items-center gap-1'><LandPlot size={14} /> Area</h1>
            <h2 className='text-xs text-slate-300 text-center'>{userData?.Area ? userData?.Area?.Areaname : 'No Area Added'}</h2>
          </div>
        </div>
      </div>
      <div className="bg-slate-950/50 p-3 rounded-lg flex gap-1 justify-between mb-3 lg:flex-nowrap flex-wrap">
        <div onClick={() => router.push(`/staff/tasks`)} className="bg-slate-950/50 p-2 px-3 rounded-lg w-full lg:w-1/2 border hover:border-slate-700 border-slate-900 select-none cursor-pointer">
          <h1 className='text-sm font-medium mb-1'>Tasks</h1>
          <div className="flex gap-2">
            <h1 className='lg:w-32 text-xs font-semibold p-1 px-3 border border-slate-500 rounded-lg'>New: 5</h1>
            <h1 className='lg:w-32 text-xs font-semibold p-1 px-3 border border-slate-500 rounded-lg'>Ongoing: 5</h1>
            <h1 className='lg:w-32 text-xs font-semibold p-1 px-3 border border-slate-500 rounded-lg'>Completed: 5</h1>
          </div>
        </div>
        <div onClick={() => router.push(`/staff/projects`)} className="bg-slate-950/50 p-2 px-3 rounded-lg w-full lg:w-1/2 border hover:border-slate-700 border-slate-900 select-none cursor-pointer">
          <h1 className='text-sm font-medium mb-1'>Projects</h1>
          <div className="flex gap-2">
            <h1 className='lg:w-32 text-xs font-semibold p-1 px-3 border border-slate-500 rounded-lg'>New: 5</h1>
            <h1 className='lg:w-32 text-xs font-semibold p-1 px-3 border border-slate-500 rounded-lg'>Ongoing: 5</h1>
            <h1 className='lg:w-32 text-xs font-semibold p-1 px-3 border border-slate-500 rounded-lg'>Completed: 5</h1>
          </div>
        </div>
      </div>
      <div className='w-full mt-3 bg-slate-950/50 p-3 rounded-lg'>
        <h1 className='text-sm font-medium gap-1 items-center flex text-cyan-500 mb-2'><AreaChart size={18} /> Analytics</h1>
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-2 w-full">
          <ProjectsCompletedAndPending currentUser={userData} />
        </div>
      </div>
    </div>
  )
}

export default StaffHome