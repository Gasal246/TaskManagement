import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminTopbar from '@/components/admin/AdminTopbar'
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { getUserAuth } from '@/query/server/userFunctions';

export const metadata: Metadata = {
  title: "Taskmanager | Admin",
  description: "A site by Wideline IT solutions, Designed to simplify task and staff management in a business environment. Built with ease of use in mind, it allows teams to seamlessly assign, track, and complete tasks while keeping all staff data organized in one central hub. Each employee has a unique profile showcasing their roles, task history, and performance metrics. Managers can monitor task progress, set priorities, and identify bottlenecks at a glance.",
};

const AdminLayout = async ({ children }: {
  children: React.ReactNode
}) => {
  const session: any = await getServerSession(authOptions)
  if (!session) {
    return redirect('/signin')
  }
  const response: { Role: userTypes } = await getUserAuth(session?.user?.id);
  if (response?.Role != 'admin') {
    return redirect('/staff');
  }
  return (
    <div className='w-full h-screen overflow-y-hidden'>
      <AdminTopbar />
      <div className="flex w-full h-full">
        <div className="w-2/12 h-full"><AdminSidebar /></div>
        <div className="w-10/12 h-full overflow-y-scroll">{children}</div>
      </div>
    </div>
  )
}

export default AdminLayout