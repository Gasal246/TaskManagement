"use client"
import { Edit, Flag, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Checkbox } from "@/components/ui/checkbox"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"
import { Textarea } from "@/components/ui/textarea"
import { Input, Popconfirm, Popover, Tooltip } from 'antd'

const TaskIdPage = ({ params }: { params: { taskid: string } }) => {
  const [isCompleted, setIsCompleted] = useState();

  const handleChecking = async (activityId: string, isCompleted: boolean) => {

  }

  return (
    <div className='p-4 overflow-y-scroll pb-20'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/tasks">Tasks</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Task Name</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
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
        <div className="flex gap-1">
          <Popconfirm title="Delete Task!!" description="Are you sure to delet this task ?"><Button>Delete</Button></Popconfirm>
        </div>
      </div>
      <div className="bg-slate-950/50 p-3 rounded-lg mb-3 flex gap-2 items-center flex-wrap">
        <h2 className='text-xs text-red-500 border border-red-500 p-1 px-2 rounded-lg flex items-center gap-1 font-semibold'><Flag fill='red' size={12} />2 HIGH</h2>
        <h2 className='text-xs text-orange-400 border border-orange-400 p-1 px-2 rounded-lg flex items-center gap-1 font-semibold'><Flag fill='gold' size={12} />2 Average</h2>
        <h2 className='text-xs font-medium text-slate-200 border border-slate-700 p-1 px-2 rounded-lg flex items-center gap-1'>Duration: 2days</h2>
        <h2 className='text-xs font-medium text-slate-200 border border-slate-700 p-1 px-2 rounded-lg flex items-center gap-1'>Due: 2024-12-06</h2>
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
          <div className="p-2 border rounded-lg border-slate-700 hover:bg-slate-800/70 select-none">
            <div className="flex gap-2 items-center">
              <Checkbox onCheckedChange={() => handleChecking('', true)} checked />
              <h3 className='text-sm text-slate-100 flex gap-2 items-center'>Activity Name <Flag fill='gold' color='gold' size={14} /></h3>
            </div>
            <p className='text-xs text-slate-200 pl-6'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum consequuntur impedit iusto, quia provident dolorem. Accusantium beatae tempora itaque voluptatibus.</p>
          </div>
          <div className="p-2 border rounded-lg border-slate-700 hover:bg-slate-800/70 select-none">
            <div className="flex gap-2 items-center">
              <Checkbox onCheckedChange={() => handleChecking('', true)} />
              <h3 className='text-sm text-slate-100 flex gap-2 items-center'>Activity Name <Flag fill='red' color='red' size={14} /></h3>
            </div>
            <p className='text-xs text-slate-200 pl-6'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum consequuntur impedit iusto, quia provident dolorem. Accusantium beatae tempora itaque voluptatibus.</p>
          </div>
          <div className="p-2 border rounded-lg border-slate-700 hover:bg-slate-800/70 select-none">
            <div className="flex gap-2 items-center">
              <Checkbox onCheckedChange={() => handleChecking('', true)} />
              <h3 className='text-sm text-slate-100 flex gap-2 items-center'>Activity Name <Flag fill='gold' color='gold' size={14} /></h3>
            </div>
            <p className='text-xs text-slate-200 pl-6'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum consequuntur impedit iusto, quia provident dolorem. Accusantium beatae tempora itaque voluptatibus.</p>
          </div>
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