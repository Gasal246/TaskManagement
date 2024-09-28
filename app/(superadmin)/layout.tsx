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
  description: "a site by Muhammed Gasal",
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
      <div className="flex w-full h-full">
        <div className="w-2/12 h-full"><SuperSidebar /></div>
        <div className="w-10/12 h-full">{children}</div>
      </div>
    </div>
  )
}

export default SuperAdminLayout