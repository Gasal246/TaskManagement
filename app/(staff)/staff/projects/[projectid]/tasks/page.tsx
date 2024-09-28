"use client"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Avatar, Popconfirm, Tooltip } from 'antd'
import React from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Progress } from '@/components/ui/progress'
import { Flag, LayoutList, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'

const ProjectTasks = ({ params }: { params: { projectid: string } }) => {
    const router = useRouter();

    const handleDeleteTask = async (taskid: string) => {

    }
    return (
        <div className="p-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/staff/projects">All Projects</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href={`/staff/projects/${params.projectid}`}>Project Name</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>All Tasks</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="bg-slate-950/50 rounded-lg p-3 my-3">
                <h1 className=''>Project Tasks</h1>
            </div>
            <div className="bg-slate-950/50 rounded-lg p-3">
                <Input type='search' placeholder='Search..' className='w-full lg:w-1/2 my-1' />
                <div className="flex flex-wrap">
                    <div className="w-full lg:w-4/12 p-1">
                        <Tooltip title="Click To Open This Task">
                            <motion.div onClick={() => router.push(`/staff/tasks/taskid`)} whileTap={{ scale: 0.98 }} className="p-2 rounded-lg bg-cyan-950 border border-neutral-800 hover:border-neutral-600 select-none cursor-pointer">
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
                        </Tooltip>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProjectTasks