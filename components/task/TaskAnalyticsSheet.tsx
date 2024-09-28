"use client"
import React from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, } from "@/components/ui/sheet"
import { Button } from '../ui/button'
import { SendToBack } from 'lucide-react'
import { Avatar } from 'antd'
import { useRouter } from 'next/navigation'

const TaskAnalyticsSheet = ({ taskData, currentUser }:{ taskData: any, currentUser?: any }) => {
    const router = useRouter()
    return (
        <Sheet>
            <SheetTrigger asChild><Button className='flex items-center gap-1'><SendToBack size={18} /> Analytics</Button></SheetTrigger>
            <SheetContent className="w-[400px] lg:min-w-[660px]">
                <SheetHeader>
                    <SheetTitle>Task Analytics</SheetTitle>
                    <SheetDescription>Analytics of a task let you know more about the following task</SheetDescription>
                </SheetHeader>
                <div className="h-full overflow-y-scroll flex flex-col pb-10 my-3">
                    <div className='mb-3'>
                        <h3 className='text-xs text-cyan-500 font-medium'>Project Name: <span className='text-slate-300 font-light'>Task Project Name</span></h3>
                        <h3 className='text-xs text-cyan-500 font-medium'>Task Name: <span className='text-slate-300 font-light'>Task Project Name</span></h3>
                        <h3 className='text-xs text-cyan-500 font-medium'>Total Activities: <span className='text-slate-300 font-light'>10</span></h3>
                        <h3 className='text-xs text-cyan-500 font-medium'>Completed Activities: <span className='text-slate-300 font-light'>5</span></h3>
                    </div>
                    <h1 className='text-xs font-medium text-slate-200'>Users Enganged</h1>
                    <div className="flex flex-col gap-1 py-2">
                        <div className="flex gap-1 items-center bg-cyan-950/50 p-2 rounded-lg hover:bg-cyan-950/70 cursor-pointer" onClick={() => router.push('/staff/profile/userid')}>
                            <Avatar src="/avatar.png" />
                            <div>
                                <h1 className="text-xs leading-4 font-medium text-slate-200">User Name</h1>
                                <h1 className="text-xs text-slate-300">user@gmail.com</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default TaskAnalyticsSheet
