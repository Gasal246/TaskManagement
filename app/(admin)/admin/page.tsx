"use client"
import UserDailyActivity from '@/components/charts/UserDailyActivity'
import UserMonthlyActivity from '@/components/charts/UserMonthlyActivity'
import LoaderSpin from '@/components/shared/LoaderSpin'
import TimeNow from '@/components/shared/TimeNow'
import TodoBox from '@/components/staff/TodoBox'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, formatDateShortly, formatDateTiny, formatNumber } from '@/lib/utils'
import { useGetAllAdminAreas, useGetAllDepartments, useGetAllRegions, useGetAllStaffs } from '@/query/client/adminQueries'
import { useGetAdminProjectAnalytics, useGetAdminTasksAnalytics } from '@/query/client/analyticsQueries'
import { useFindUserById } from '@/query/client/userQueries'
import { Tooltip } from 'antd'
import { ArrowRight, BellElectric, Contact, Globe2, LandPlot, ShieldAlert } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { DataTable } from './task-table'
import { columns } from './task-column'
 
export const payments: any[] = [
  {
    id: "728ed52f",
    staff: {
      Name: 'Staff Name',
      Email: 'staff@gmail.com',
      AvatarUrl: '/avatar.png',
      Region: 'India',
      Area: 'Kerala'
    },
    task: {
      _id: "8dfasdf9a7sdf",
      TaskName: "TaskName",
      Deadline: new Date().toISOString(),
      createdAt: new Date().toISOString()
    },
  },
]

const AdminDashboard = () => {
  const router = useRouter();
  const { data: session }: any = useSession();
  const { data: userData, isLoading: userLoading } = useFindUserById(session?.user?.id);
  const { data: departments, isLoading: loadingDepartments } = useGetAllDepartments(session?.user?.id);
  const { data: staffs, isLoading: loadingStaffs } = useGetAllStaffs(session?.user?.id);
  const { data: regions, isLoading: loadingRegions } = useGetAllRegions(session?.user?.id);
  const { data: areas, isLoading: loadingAreas } = useGetAllAdminAreas(session?.user?.id);
  const { data: taskAnalytics, isLoading: loadingTaskAnalytics } = useGetAdminTasksAnalytics(session?.user?.id);
  const { data: projectAnalytics, isLoading: loadingProjectAnalytics } = useGetAdminProjectAnalytics(session?.user?.id);

  return (
    <>
      {/* <div className="absolute top-[45%] left-[45%] justify-center items-center flex-col z-30">
        <div className="w-full items-center justify-center flex mb-2">
          <ShieldAlert size={80} />
        </div>
        <h1 className='font-medium shadow-sm'>Sorry To Inform Admin Panel Maintanence In Progress</h1>
      </div> */}
      <div className='p-4 relative overflow-scroll pb-40 h-screen'>
        <div className={`flex justify-between p-3 bg-slate-950/50 rounded-lg mb-3 items-center flex-wrap ${userLoading && 'blur'}`}>
          <h1 className='text-cyan-400'>Hi, <span className='text-white time-font'>{userData?.Name}</span></h1>
          <div className="flex gap-2 flex-wrap">
            {staffs && <Tooltip placement='left' title={<ArrowRight size={14} />}><div className='border border-slate-700 rounded-lg p-1 px-2 hover:bg-slate-950/20 cursor-pointer' onClick={() => router.push(`/admin/staffs`)}>
              <h1 className='text-sm font-medium flex items-center gap-1 text-cyan-400'><LandPlot size={14} /> Staffs</h1>
              <h2 className='text-xs text-slate-300 text-center font-medium'>{formatNumber(staffs?.length || 0)}</h2>
            </div></Tooltip>}
            {loadingStaffs && <Skeleton className='w-[110px] h-[47px] rounded-lg' />}
            {departments && <Tooltip placement='left' title={<ArrowRight size={14} />}> <div className='border border-slate-700 rounded-lg p-1 px-2 hover:bg-slate-950/20 cursor-pointer' onClick={() => router.push(`/admin/departments`)}>
              <h1 className='text-xs font-medium flex items-center gap-1 text-cyan-400'><BellElectric size={14} />Departments</h1>
              <h2 className='text-sm text-slate-300 text-center font-medium'>{formatNumber(departments?.length || 0)}</h2>
            </div></Tooltip>}
            {loadingDepartments && <Skeleton className='w-[110px] h-[47px] rounded-lg' />}
            {regions && <Tooltip placement='left' title={<ArrowRight size={14} />}> <div className='border border-slate-700 rounded-lg p-1 px-2 hover:bg-slate-950/20 cursor-pointer' onClick={() => router.push(`/admin/regions`)}>
              <h1 className='text-xs font-medium flex items-center gap-1 text-cyan-400'><Contact size={14} /> Regions</h1>
              <h2 className='text-sm text-slate-300 capitalize text-center font-medium'>{formatNumber(regions?.length || 0)}</h2>
            </div></Tooltip>}
            {loadingRegions && <Skeleton className='w-[110px] h-[47px] rounded-lg' />}
            {areas && <Tooltip placement='left' title={<ArrowRight size={14} />}><div className='border border-slate-700 rounded-lg p-1 px-2 hover:bg-slate-950/20 cursor-pointer' onClick={() => router.push(`/admin/areas`)}>
              <h1 className='text-xs font-medium flex items-center gap-1 text-cyan-400'><Globe2 size={14} /> Areas</h1>
              <h2 className='text-sm text-slate-300 text-center font-medium'>{formatNumber(areas?.length || 0)}</h2>
            </div></Tooltip>}
            {loadingAreas && <Skeleton className='w-[110px] h-[47px] rounded-lg' />}
          </div>
        </div>
        <div className="bg-slate-950/50 p-3 rounded-lg flex gap-1 justify-between mb-3 lg:flex-nowrap flex-wrap">
          <div onClick={() => router.push(`/staff/tasks`)} className="bg-slate-950/50 p-2 px-3 rounded-lg w-full lg:w-1/2 border hover:border-slate-700 border-slate-900 select-none cursor-pointer">
            <h1 className='text-sm font-medium mb-1 flex items-center gap-1 text-cyan-500'>Tasks {loadingTaskAnalytics && <LoaderSpin size={20} />}</h1>
            {taskAnalytics && <div className="flex gap-2">
              <h1 className='lg:w-32 text-xs font-semibold p-1 px-3 border border-slate-500 rounded-lg'>New: {formatNumber(taskAnalytics?.new?.length) || 0}</h1>
              <h1 className='lg:w-32 text-xs font-semibold p-1 px-3 border border-slate-500 rounded-lg'>Ongoing: {formatNumber(taskAnalytics?.ongoing?.length) || 0}</h1>
              <h1 className='lg:w-32 text-xs font-semibold p-1 px-3 border border-slate-500 rounded-lg'>Completed: {formatNumber(taskAnalytics?.completed?.length) || 0}</h1>
            </div>}
          </div>
          <div onClick={() => router.push(`/staff/projects`)} className="bg-slate-950/50 p-2 px-3 rounded-lg w-full lg:w-1/2 border hover:border-slate-700 border-slate-900 select-none cursor-pointer">
            <h1 className='text-sm font-medium mb-1 flex items-center gap-1 text-cyan-500'>Projects {loadingProjectAnalytics && <LoaderSpin size={20} />}</h1>
            {projectAnalytics && <div className="flex gap-2">
              <h1 className='lg:w-32 text-xs font-semibold p-1 px-3 border border-slate-500 rounded-lg'>Ongoing: {formatNumber(projectAnalytics?.ongoing?.length) || 0}</h1>
              <h1 className=' text-xs font-semibold p-1 px-3 border border-slate-500 rounded-lg'>Waiting Approval: {formatNumber(projectAnalytics?.waitingApproval?.length) || 0}</h1>
            </div>}
          </div>
        </div>
        <div className='mt-3 bg-slate-950/50 p-3 rounded-lg'>
          <div className="flex justify-between">
            <h1 className='text-sm text-cyan-500 font-medium flex gap-2 items-center'>Running <TimeNow /></h1>
            <h1 className='text-sm text-cyan-500 font-medium flex gap-2 items-center time-font'>{formatDateShortly(new Date().toISOString())}</h1>
          </div>
          <div className="w-full h-[500px] flex mt-2">
            <div className="w-2/3 h-full p-1 border border-dashed border-slate-700 bg-slate-950/50 rounded-lg">
              <DataTable columns={columns} data={payments} />
            </div>
            <div className="w-1/3 h-full p-1 border border-dashed border-slate-700 bg-slate-950/50 rounded-lg">
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminDashboard
