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

const TasksPage = () => {
    const router = useRouter();
    const handleDeleteTask = async (taskid: string) => { }
    return (
        <div className='p-4'>
            <div className="flex bg-slate-950/50 p-3 rounded-lg justify-between items-center mb-3">
                <div>
                    <h1 className='text-xl font-semibold flex gap-2 items-center'>Manage Tasks<CalendarCheck /></h1>
                    <h3 className='text-xs font-medium text-neutral-300' >Manage All The Tasks Under Your Management Here.</h3>
                </div>
                <Button className='flex items-center gap-1'>Add Tasks <CalendarPlus size={16} /></Button>
            </div>

            <div className="bg-slate-950/50 p-3 rounded-lg">
                <Tabs defaultValue="new" className="w-full">
                    <TabsList className="grid w-full grid-cols-5 border border-slate-700">
                        <TabsTrigger value="new">New Tasks</TabsTrigger>
                        <TabsTrigger value="ongoing">Ongoing Tasks</TabsTrigger>
                        <TabsTrigger value="owned">Owned Tasks</TabsTrigger>
                        <TabsTrigger value="deleted">Deleted Tasks</TabsTrigger>
                        <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
                    </TabsList>
                    <TabsContent value="new">
                        <Card className='border-slate-700 bg-slate-950/50'>
                            <CardHeader className='p-3 px-8 pt-5'><CardTitle>New Tasks</CardTitle></CardHeader>
                            <CardContent className="flex flex-wrap">
                                <div className="w-full lg:w-4/12 p-1">
                                    <motion.div onClick={() => router.push(`/admin/tasks/taskid`)} whileTap={{ scale: 0.98 }} className="p-2 rounded-lg bg-neutral-800/90 border border-neutral-800 hover:border-neutral-600 select-none cursor-pointer">
                                        <div className="flex justify-between items-center px-1 mb-1">
                                            <h1 className='font-semibold'>Task Name</h1>
                                            <Popconfirm title="Delete this Task?" description="Are you sure wanna delete this task." onConfirm={() => handleDeleteTask('123')}><motion.div whileHover={{ rotate: -35 }}><Trash2 color='red' size={18} /></motion.div></Popconfirm>
                                        </div>
                                        <div className="flex gap-1 items-center p-1 mb-1">
                                            <Avatar src="/avatar.png" size={20} />
                                            <h1 className='text-xs font-medium text-neutral-200'>creator@gmail.com <span className='italic font-normal text-neutral-300'>&#x2022; just now</span></h1>
                                        </div>
                                        <div className='px-2 mb-2 flex gap-3'>
                                            <Tooltip title="priority"><h2 className='text-sm text-red-400 border border-red-400 p-1 px-2 rounded-lg flex items-center gap-1 font-semibold'><Flag fill='tomato' size={12} />2 HIGH</h2></Tooltip>
                                            <Tooltip title="activities"><h2 className='text-sm text-blue-300 border border-blue-300 p-1 px-2 rounded-lg flex items-center gap-1'><LayoutList size={12} fill='blue' />5</h2></Tooltip>
                                        </div>
                                        <div className="flex justify-between gap-1">
                                            <div className='bg-slate-950/50 p-2 rounded-lg w-full'>
                                                <h3 className='text-xs font-medium leading-3 text-slate-400'>created at</h3>
                                                <h4 className='text-xs text-slate-200'>2024-12-06</h4>
                                            </div>
                                            <div className='bg-slate-950/50 p-2 rounded-lg w-full'>
                                                <h3 className='text-xs font-medium leading-3 text-slate-400'>deadline on</h3>
                                                <h4 className='text-xs text-slate-200'>2024-12-10</h4>
                                            </div>
                                            <div className='bg-slate-950/50 p-2 rounded-lg w-full flex justify-center items-center'>
                                                <h3 className='text-xs font-medium leading-3 text-slate-400'>2 days</h3>
                                            </div>
                                        </div>
                                        <div className='flex gap-1 items-center mt-2'>
                                            <Progress value={67} /> <span className='text-xs'>67%</span>
                                        </div>
                                    </motion.div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="password">
                        <Card>
                            <CardHeader>
                                <CardTitle>Password</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="space-y-1">
                                    <Label htmlFor="current">Current password</Label>
                                    <Input id="current" type="password" />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="new">New password</Label>
                                    <Input id="new" type="password" />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button>Save password</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default TasksPage