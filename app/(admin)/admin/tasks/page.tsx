"use client"
import { Button } from '@/components/ui/button'
import { CalendarCheck, CalendarPlus, Circle, Flag, LayoutList, Trash2 } from 'lucide-react'
import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs"
import { Avatar, Popconfirm, Tooltip } from 'antd';
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Progress } from '@/components/ui/progress'
import TaskTab from '@/components/staff/TaskTab'
import { useFindUserById } from '@/query/client/userQueries'
import { useSession } from 'next-auth/react'

const TasksPage = () => {
    const router = useRouter();
    const { data: session }: any = useSession();
    const { data: currentUser, isLoading: loadingUser } = useFindUserById(session?.user?.id);

    return (
        <div className='p-4'>
            <div className="flex bg-slate-950/50 p-3 rounded-lg justify-between items-center mb-3">
                <div>
                    <h1 className='text-xl font-semibold flex gap-2 items-center'>Manage Tasks<CalendarCheck /></h1>
                    <h3 className='text-xs font-medium text-neutral-300' >Manage All The Tasks Under Your Management Here.</h3>
                </div>
                <Button className='flex items-center gap-1' onClick={() => router.push('/admin/tasks/addtask')} >Add Tasks <CalendarPlus size={16} /></Button>
            </div>

            <div className="bg-slate-950/50 p-3 rounded-lg">
                <Tabs defaultValue="new" className="w-full">
                    <TabsList className="grid w-full grid-cols-5 border border-slate-700">
                        <TabsTrigger value="new">New Tasks</TabsTrigger>
                        <TabsTrigger value="ongoing">Ongoing Tasks</TabsTrigger>
                        <TabsTrigger value="owned">Owned Tasks</TabsTrigger>
                        <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
                    </TabsList>
                    <TabsContent value="new">
                        <div className='w-full'>
                            <h1 className="text-sm pl-1 my-1">New tasks</h1>
                            <TaskTab currentUser={currentUser} tasktype='new' />
                        </div>
                    </TabsContent>
                    <TabsContent value="ongoing">
                        <div className='w-full'>
                            <h1 className="text-sm pl-1 my-1">Ongoing tasks</h1>
                            <TaskTab currentUser={currentUser} tasktype='ongoing' />
                        </div>
                    </TabsContent>
                    <TabsContent value="owned">
                        <div className='w-full'>
                            <h1 className="text-sm pl-1 my-1">Owned or Created tasks</h1>
                            <TaskTab currentUser={currentUser} tasktype='created' />
                        </div>
                    </TabsContent>
                    <TabsContent value="completed">
                        <div className='w-full'>
                            <h1 className="text-sm pl-1 my-1">Completed tasks</h1>
                            <TaskTab currentUser={currentUser} tasktype='completed' />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default TasksPage