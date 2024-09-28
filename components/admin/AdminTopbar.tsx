"use client"
import React, { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import Image from 'next/image'
import { Bell, CircleUser } from 'lucide-react'
import { motion } from 'framer-motion'
import { ExitIcon } from '@radix-ui/react-icons'
import { signOut, useSession } from 'next-auth/react'
import { useFindUserById, useGetAllNotifications } from '@/query/client/userQueries'
import { Avatar, Badge, Tooltip } from 'antd'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation'
import NotificationPane from '../shared/NotificationPane'

const AdminTopbar = () => {
    const router = useRouter();
    const { data: session }: any = useSession();
    const { data: currentUser, isLoading: currentUserDataLoading } = useFindUserById(session?.user?.id);
    const { data: notifications, isLoading: notificationsLoading } = useGetAllNotifications(session?.user?.id);
    const [newNotifications, setNewNotifications] = useState(0);
    useEffect(() => {
        if (notifications) {
            const newest = notifications?.filter((notification: any) => notification?.IsOpened == false);
            setNewNotifications(newest?.length);
        } else {
            setNewNotifications(0);
        }
    }, [notifications])
    return (
        <div className='w-full h-14 dark:bg-slate-900 bg-slate-400 px-10 flex items-center'>
            <div className="flex items-center justify-center gap-2">
                <Image src={'/logo.png'} alt='my_logo' width={30} height={30} />
                <h1 className='font-bold text-nowrap'>Task Manager</h1>
            </div>
            <div className="w-full flex justify-end">
                <NotificationPane trigger={
                    <div className='pt-2 cursor-pointer'>
                        <Tooltip title={newNotifications <= 0 ? 'no new notifications.' : `${newNotifications} new notifications`}>
                            <Badge count={newNotifications} size='small'>
                                <Bell className='text-primary' size={20} />
                            </Badge>
                        </Tooltip>
                    </div>
                } />
                {
                    currentUser &&
                    <Popover>
                        <PopoverTrigger>
                            <motion.div whileTap={{ scale: 0.98 }} className="px-3 flex gap-1 items-center hover:bg-black py-1 rounded-full">
                                <Avatar src={currentUser?.AvatarUrl || '/avatar.png'} />
                                <div className='text-start'>
                                    <h1 className='font-medium text-sm leading-4 text-slate-300'>{currentUser?.Name}</h1>
                                    <h1 className='font-medium text-xs text-slate-400'>{currentUser?.Email}</h1>
                                </div>
                            </motion.div>
                        </PopoverTrigger>
                        <PopoverContent className='w-40 p-2 space-y-2'>
                            <motion.button onClick={() => router.push(`/admin/profile/${currentUser?._id}`)} whileTap={{ scale: 0.98 }} className='w-full bg-secondary hover:bg-slate-700 rounded-sm p-1 text-sm flex gap-1 items-center justify-center'><CircleUser size={16} strokeWidth={2} /> Profile </motion.button>
                            <AlertDialog>
                                <AlertDialogTrigger className='w-full'><motion.h1 whileTap={{ scale: 0.98 }} className='w-full bg-destructive text-destructive-foreground hover:bg-red-700 rounded-sm p-1 text-sm flex gap-1 items-center justify-center'><ExitIcon /> Sign Out</motion.h1></AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Signing Out?</AlertDialogTitle>
                                        <AlertDialogDescription>Are you trying to signOut of application ?</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel onClick={() => signOut()} >Yes</AlertDialogCancel>
                                        <AlertDialogAction>No</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </PopoverContent>
                    </Popover>
                }
            </div>
        </div>
    )
}

export default AdminTopbar