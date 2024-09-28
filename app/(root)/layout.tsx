import { getServerSession } from 'next-auth'
import React, { Suspense } from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route'
import { getUserAuth } from '@/query/server/userFunctions'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import { getAdminInfo } from '@/query/server/superAdminFunctions'

export const metadata: Metadata = {
    title: "Taskmanager | Home",
    description: "a site by Muhammed Gasal",
};

const HomeLayout = async ({ children }: {
    children: React.ReactNode
}) => {
    const session: any = await getServerSession(authOptions);
    if (!session) {
        redirect('/signin');
    }
    const info = await getAdminInfo(session?.user?.id)
    if (info?._id) {
        return redirect('/superadmin')
    }
    const response: { Role: userTypes } = await getUserAuth(session?.user?.id);
    if (response?.Role === 'admin') {
        return redirect('/admin');
    }
    return (
        <div className='w-full h-screen'>
            {children}
        </div>
    )
}

export default HomeLayout