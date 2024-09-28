"use client"
import ProfilPageSkeleton from '@/components/skeletons/ProfilPageSkeleton'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useFindUserById } from '@/query/client/userQueries'
import { Avatar } from 'antd'
import { EllipsisVertical } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React from 'react'
import { motion } from 'framer-motion'
import EditUserInfoDialog from '@/components/staff/EditUserInfoDialog'
import ChangeDpDialog from '@/components/admin/ChangeDpDialog'
import ResetPasswordDialog from '@/components/shared/ResetPasswordDialog'

const ProfilPage = ({ params }: { params: { id: string } }) => {
    const { data: session }: any = useSession();
    const { data: userData, isLoading: loadingUserData } = useFindUserById(session?.user?.id);
    return (
        <div className='w-full h-full'>
            {loadingUserData ?
                <div className="flex w-full h-[70dvh] justify-center items-center">
                    <ProfilPageSkeleton />
                </div> : (userData ?
                    <>
                        <div className="flex flex-col pt-10 w-full items-center justify-center bg-slate-950/70 pb-10 mb-3">
                            <div className="flex gap-1 justify-start">
                                <Avatar size={150} src={userData?.AvatarUrl || '/avatar.png'} />
                                {userData && userData?._id == session?.user?.id && <div>
                                    <Popover>
                                        <PopoverTrigger className='bg-black p-1 rounded-full'><EllipsisVertical size={16} /></PopoverTrigger>
                                        <PopoverContent className='w-[130px] p-1 space-y-1'>
                                            <ChangeDpDialog trigger={
                                                <motion.h1 className='bg-slate-800 text-sm text-center p-1 rounded-sm hover:bg-slate-900 cursor-pointer border border-slate-700'>Edit Pic</motion.h1>
                                            } userid={session?.user?.id} prevAvatar={userData?.AvatarUrl || '/avatar.png'} />
                                            <EditUserInfoDialog trigger={
                                                <motion.h1 className='bg-slate-800 text-sm text-center p-1 rounded-sm hover:bg-slate-900 cursor-pointer border border-slate-700'>Edit Info</motion.h1>
                                            } userData={userData} />
                                            <ResetPasswordDialog trigger={
                                                <motion.h1 className='bg-slate-800 text-sm text-center p-1 rounded-sm hover:bg-slate-900 cursor-pointer border border-slate-700'>Reset Password</motion.h1>
                                            } />
                                        </PopoverContent>
                                    </Popover>
                                </div>}
                            </div>
                            <div className='flex justify-center flex-col items-center mt-1'>
                                <h1 className='font-medium'>{userData?.Name}</h1>
                                <h1 className='text-sm font-medium leading-3'>{userData?.Email}</h1>
                            </div>
                        </div>
                        <div className="bg-slate-950/50 p-3 rounded-lg flex flex-wrap mb-3 mx-2">
                            <div className="w-full lg:w-3/12 p-1">
                                <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                                    <h1 className='text-xs font-semibold text-slate-400'>User Role:</h1>
                                    <h1 className='text-sm font-medium text-slate-300 capitalize'>{userData?.Role}</h1>
                                </div>
                            </div>
                            <div className="w-full lg:w-3/12 p-1">
                                <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                                    <h1 className='text-xs font-semibold text-slate-400'>User Department:</h1>
                                    <h1 className='text-sm font-medium text-slate-300 capitalize'>{userData?.Department?.DepartmentName}</h1>
                                </div>
                            </div>
                            <div className="w-full lg:w-3/12 p-1">
                                <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                                    <h1 className='text-xs font-semibold text-slate-400'>User Region:</h1>
                                    <h1 className='text-sm font-medium text-slate-300 capitalize'>{userData?.Region?.RegionName}</h1>
                                </div>
                            </div>
                            <div className="w-full lg:w-3/12 p-1">
                                <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800">
                                    <h1 className='text-xs font-semibold text-slate-400'>User Area:</h1>
                                    <h1 className='text-sm font-medium text-slate-300 capitalize'>{userData?.Area?.Areaname}</h1>
                                </div>
                            </div>
                        </div>
                    </> : <h1 className='text-center'>No User Found</h1>
                )}
        </div>
    )
}

export default ProfilPage