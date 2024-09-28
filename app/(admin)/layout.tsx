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
  description: "a site by Muhammed Gasal",
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