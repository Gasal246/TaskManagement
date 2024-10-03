"use client"
import { useFindUserById } from '@/query/client/userQueries';
import { AreaChart, BellElectric, Contact, Globe2, LandPlot } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation';
import ProjectsCompletedAndPending from '@/components/charts/ProjectsCompletedAndPending';
import { Skeleton } from '@/components/ui/skeleton';
import TaskAnalysis from '@/components/charts/TaskAnalysis';
import ProjectAnalysisPi from '@/components/charts/ProjectAnalysisPi';
import { useGetAllProjectAnalytics, useGetAllTaskAnalytics } from '@/query/client/analyticsQueries';

const StaffHome = () => {
  const router = useRouter();
  const { data: session }: any = useSession();
  const { data: userData, isLoading: userLoading } = useFindUserById(session?.user?.id);
  const { data: taskAnalytics, isLoading: loadingTaskAnalytics } = useGetAllTaskAnalytics(session?.user?.id);
  const { data: projectAnalytics, isLoading: loadingProjectAnalytics } = useGetAllProjectAnalytics(session?.user?.id, 'all');

  useEffect(() => {
    if(taskAnalytics || projectAnalytics){
      console.log(taskAnalytics);
      console.log(projectAnalytics);
    }
  }, [taskAnalytics, projectAnalytics])

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
            <h1 className={`lg:w-32 text-xs font-semibold p-1 px-3 border ${taskAnalytics?.unreadedTasks > 0 ? 'border-slate-500 text-slate-300' : 'border-slate-700 text-slate-400'} rounded-lg`}>New: {taskAnalytics?.unreadedTasks}</h1>
            <h1 className={`lg:w-32 text-xs font-semibold p-1 px-3 border ${taskAnalytics?.acceptedTasks > 0 ? 'border-slate-500 text-slate-300' : 'border-slate-700 text-slate-400'} rounded-lg`}>Ongoing: {taskAnalytics?.acceptedTasks}</h1>
            <h1 className={`lg:w-32 text-xs font-semibold p-1 px-3 border ${taskAnalytics?.completedTasks > 0 ? 'border-slate-500 text-slate-300' : 'border-slate-700 text-slate-400'} rounded-lg`}>Completed: {taskAnalytics?.completedTasks}</h1>
          </div>
        </div>
        <div onClick={() => router.push(`/staff/projects`)} className="bg-slate-950/50 p-2 px-3 rounded-lg w-full lg:w-1/2 border hover:border-slate-700 border-slate-900 select-none cursor-pointer">
          <h1 className='text-sm font-medium mb-1'>Projects</h1>
          <div className="flex gap-2">
            <h1 className={`lg:w-32 text-xs font-semibold p-1 px-3 border ${projectAnalytics?.unopendedProjects?.length > 0 ? 'border-slate-500 text-slate-300' : 'border-slate-700 text-slate-400'} rounded-lg`}>New: {projectAnalytics?.unopendedProjects?.length || 0}</h1>
            <h1 className={`lg:w-32 text-xs font-semibold p-1 px-3 border ${projectAnalytics?.approvedProjectIds?.length > 0 ? 'border-slate-500 text-slate-300' : 'border-slate-700 text-slate-400'} rounded-lg`}>Ongoing: {projectAnalytics?.approvedProjectIds?.length || 0}</h1>
            <h1 className={`lg:w-32 text-xs font-semibold p-1 px-3 border ${projectAnalytics?.completedProjectIds?.length > 0 ? 'border-slate-500 text-slate-300' : 'border-slate-700 text-slate-400'} rounded-lg`}>Completed: {projectAnalytics?.completedProjectIds?.length || 0}</h1>
          </div>
        </div>
      </div>
      <div className='w-full mt-3 bg-slate-950/50 p-3 pb-5 rounded-lg'>
        <h1 className='text-sm font-medium gap-1 items-center flex text-cyan-500 mb-2'><AreaChart size={18} /> Analytics</h1>
          {userData && <ProjectsCompletedAndPending currentUser={userData} />}
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-2 w-full mt-2">
          {userData && <TaskAnalysis currentUser={userData} /> }
          {userData && <ProjectAnalysisPi currentUser={userData} /> }
          {userLoading && <Skeleton className='w-full h-[300px]' />}
        </div>
      </div>
    </div>
  )
}

export default StaffHome