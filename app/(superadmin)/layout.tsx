import { getServerSession } from 'next-auth'
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { getAdminInfo } from '@/query/server/superAdminFunctions'
import { Metadata } from 'next'
import SuperTopbar from '@/components/super/SuperTopbar'
import SuperSidebar from '@/components/super/SuperSidebar'

export const metadata: Metadata = {
  title: "Taskmanager | Super Admin",
  description: "A site by Wideline IT solutions, Designed to simplify task and staff management in a business environment. Built with ease of use in mind, it allows teams to seamlessly assign, track, and complete tasks while keeping all staff data organized in one central hub. Each employee has a unique profile showcasing their roles, task history, and performance metrics. Managers can monitor task progress, set priorities, and identify bottlenecks at a glance.",
};

const SuperAdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session: any = await getServerSession(authOptions)
  if (!session) {
    redirect('/superlogin')
  }
  const info = await getAdminInfo(session?.user?.id);
  if (!info) {
    redirect('/warning')
  }
  return (
    <div className='w-full h-screen overflow-hidden'>
      <SuperTopbar />
      <div className="flex">
        <div className="w-2/12"><SuperSidebar /></div>
        <div className="w-10/12">{children}</div>
      </div>
    </div>
  )
}

export default SuperAdminLayout