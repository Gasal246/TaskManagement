"use client"
import { ArrowBigLeftDash, Edit, Flag, Plus, SendToBack, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Checkbox } from "@/components/ui/checkbox"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"
import { Textarea } from "@/components/ui/textarea"
import { Input, Popconfirm, Popover, Tooltip } from 'antd'
import { useRouter, useSearchParams } from 'next/navigation'
import TaskAnalyticsSheet from '@/components/task/TaskAnalyticsSheet'
import AddActivitySheet from '@/components/task/AddActivitySheet'
import EditTaskPriorityDurationSheet from '@/components/task/EditTaskPriorityDurationSheet'

const TaskIdPage = ({ params }: { params: { taskid: string } }) => {
  const router = useRouter()
  const searchParams = useSearchParams();
  const [isCompleted, setIsCompleted] = useState();
  const projectid = searchParams.get('projectid');

  const handleChecking = async (activityId: string, isCompleted: boolean) => {

  }

  return (
    <div className='p-4 overflow-y-scroll pb-20 relative'>
      <div className="flex justify-between items-center">
        {projectid ? <>
          <div onClick={() => router.back()} className="lg:hidden bottom-16 left-3 bg-black/50 rounded-full w-[35px] h-[35px] fixed flex justify-center items-center">
            <Tooltip title="back"><ArrowBigLeftDash size={30} /></Tooltip>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => router.back()} className="cursor-pointer hidden w-[100px] h-[35px] rounded-full lg:flex gap-1 items-center text-xs bg-black/60 justify-center"><ArrowBigLeftDash size={25} /> Back</motion.div>
        </> :
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/staff/tasks">Tasks</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Task Name</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
        <TaskAnalyticsSheet taskData={{}} />
      </div>

      <div className="flex bg-slate-950/50 rounded-lg p-3 justify-between items-center mb-3 mt-3">
        <div>
          {/* make the edit button show only if it is the creator */}
          <h1 className='font-medium flex gap-1'>Task Name<Popover content={
            <div className='flex gap-1 items-center'>
              <Input placeholder='Enter New Task Title' />
              <Button variant='secondary'>Update</Button>
            </div>
          } title="Update Task Title" placement='bottom' trigger='click'><Edit size={14} className='hover:text-neutral-400 cursor-pointer' /></Popover></h1>
          <p className='text-xs text-slate-200'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, aliquam.</p>
        </div>
      </div>
      <div className="bg-slate-950/50 p-3 rounded-lg mb-3 flex gap-2 items-center flex-wrap">
        <h2 className='text-xs text-red-500 border border-red-500 p-1 px-2 rounded-lg flex items-center gap-1 font-semibold'><Flag fill='red' size={12} />2 HIGH</h2>
        <h2 className='text-xs text-orange-400 border border-orange-400 p-1 px-2 rounded-lg flex items-center gap-1 font-semibold'><Flag fill='gold' size={12} />2 Average</h2>
        <h2 className='text-xs font-medium text-slate-200 border border-slate-700 p-1 px-2 rounded-lg flex items-center gap-1'>Duration: 2days</h2>
        <Popconfirm title="Delete Task!!" description="Are you sure to delet this task ?"><button className='bg-cyan-950 rounded-lg text-red-400 hover:text-white hover:border-slate-300 border-red-700 text-xs px-3 p-1 border'>Delete task</button></Popconfirm>
        <EditTaskPriorityDurationSheet trigger={
          <button className='bg-cyan-950 rounded-lg text-orange-400 hover:text-white hover:border-slate-300 border-red-700 text-xs px-3 p-1 border'>Update task</button>
        } taskData={{}} />
      </div>
      <div className="bg-slate-950/50 p-3 rounded-lg mb-3">
        <h1 className='text-center mb-1 text-sm'>ToDo</h1>
        <div className="flex gap-2 w-full lg:w-3/4 items-center mx-auto mb-3">
          <h1 className='w-full p-1 text-center bg-cyan-950 rounded-lg border border-neutral-700 text-sm'>Pending 2</h1>
          <h1 className='w-full p-1 text-center bg-cyan-950 rounded-lg border border-neutral-700 text-sm'>Completed 2</h1>
          <h1 className='w-full p-1 text-center bg-cyan-950 rounded-lg border border-neutral-700 text-sm'>Total 4</h1>
        </div>
        <div className="bg-slate-950/50 p-3 rounded-lg flex flex-col gap-2">
          <div className="p-2 border rounded-lg border-slate-700 hover:bg-slate-800/70 select-none">
            <div className="flex gap-2 items-center">
              <Checkbox onCheckedChange={() => handleChecking('', true)} checked />
              <h3 className='text-sm text-slate-100 flex gap-2 items-center'>Activity Name <Flag fill='red' color='red' size={14} /><Popconfirm title="Delete activity ?"><Trash2 size={14} color='red' /></Popconfirm></h3>
            </div>
            <p className='text-xs text-slate-200 pl-6'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum consequuntur impedit iusto, quia provident dolorem. Accusantium beatae tempora itaque voluptatibus.</p>
          </div>
          <AddActivitySheet trigger={
            <div className="p-2 border rounded-lg border-slate-700 hover:bg-slate-200/90 hover:text-black font-semibold select-none flex gap-1 items-center text-sm justify-center cursor-pointer"><Plus size={20} /> Add Activity</div>
          } />
        </div>
      </div>
      {/* Show the complete task */}
      <div className="bg-cyan-900/50 p-3 rounded-lg">
        <Textarea rows={5} placeholder='You can add some comments on task completion.' className='border-slate-300' />
        <div className="flex justify-end mt-3"><Button>Complete</Button></div>
      </div>
    </div>
  )
}

export default TaskIdPage