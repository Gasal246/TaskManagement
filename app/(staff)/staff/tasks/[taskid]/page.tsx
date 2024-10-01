/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { ArrowBigLeftDash, Edit, Flag, Plus, SendToBack, Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
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
import { useFindUserById, useGetTaskById } from '@/query/client/userQueries'
import { useChangeTaskTitle, useCheckTaskActivity, useCompleteTask, useRemoveTaskActivity, useTaskOnView } from '@/query/client/taskQueries'
import { toast } from 'sonner'
import LoaderSpin from '@/components/shared/LoaderSpin'
import { useSession } from 'next-auth/react'
import { useInView } from 'react-intersection-observer'

interface ActivityData {
  highCount: number | null;
  avgCount: number | null;
  lowCount: number | null;
}

const TaskIdPage = ({ params }: { params: { taskid: string } }) => {
  const router = useRouter()
  const searchParams = useSearchParams();
  const { data: session }: any = useSession(); 
  const { data: currentUser } = useFindUserById(session?.user?.id);
  const projectid = searchParams.get('projectid');
  const { data: taskData, isLoading: loadingTaskData } = useGetTaskById(params.taskid);
  const [activityData, setActivityData] = useState<ActivityData>();
  const { mutateAsync: checkTaskActivity, isPending: checkingTaskActivity } = useCheckTaskActivity();
  const { mutateAsync: removeTaskActivity, isPending: removingActivity } = useRemoveTaskActivity();
  const { mutateAsync: changeTitle, isPending: changingTitle } = useChangeTaskTitle();
  const { mutateAsync: completeTask, isPending: completingTask } = useCompleteTask()
  const [completeCommand, setCompleteCommand] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const { ref, inView } = useInView();
    const { mutateAsync: taskOnView, isPending: onviewPending } = useTaskOnView();
    const handleTaskOnView = async () => {
        await taskOnView({ taskid: params?.taskid })
    }
    useEffect(() => {
        if (inView) {
            handleTaskOnView()
        }
    }, [inView])

  useEffect(() => {
    if (taskData) {
      let highCount = taskData?.Activities?.filter((act: any) => act?.Priority == 'high');
      let avgCount = taskData?.Activities?.filter((act: any) => act?.Priority == 'medium');
      let lowCount = taskData?.Activities?.filter((act: any) => act?.Priority == 'low');
      setActivityData({
        highCount: highCount?.length,
        avgCount: avgCount?.length,
        lowCount: lowCount?.length
      })
      console.log("LOOK IT HERE: ", highCount, lowCount, avgCount)
    }
  }, [taskData])

  const handleChecking = async (activityId: string, check: boolean) => {
    const formData = new FormData();
    formData.append('form', JSON.stringify({
      activityid: activityId,
      taskid: params.taskid,
      status: check
    }))
    const response = await checkTaskActivity(formData);
  }

  const handleRemoveActivity = async (activityId: string) => {
    const response = await removeTaskActivity({ taskid: params.taskid, activityid: activityId });
    if (response?._id) {
      return toast.success("Activity successfully removed")
    } else {
      return toast.error("Something went wrong!!", {
        description: "Activity Can't be deleted, pls try again.."
      })
    }
  }

  const handleTaskComplete = async () => {
    const formData = new FormData();
    formData.append('form', JSON.stringify({
      completeComment: completeCommand,
      taskid: params.taskid
    }))
    const response = await completeTask(formData);
    if(response?._id){
      return toast.success("Task Successfully Completed.")
    }else{
      return toast.error("Something went wrong", { description: "Task Not marked as completed" })
    }
  }

  const handleChangeTaskTitle = async () => {
    try {
      const response = await changeTitle({ taskid: params.taskid, title: newTitle });
      if (response?._id) {
        return toast.success("Title Successfully Changed.")
      } else { throw new Error(response) }
    } catch (error) {
      return toast.error("Some thing went wrong", { description: `${error}` })
    } finally {
      setNewTitle('')
    }
  }

  return (
    <div className='p-4 overflow-y-scroll pb-20 relative' ref={ref}>
      { loadingTaskData ? <div className="w-full h-screen flex justify-center items-center"><LoaderSpin size={65} /></div> :
        <>
        <div className="flex justify-between items-center relative">
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
                <BreadcrumbPage>{taskData?.TaskName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
        <TaskAnalyticsSheet taskData={taskData} currentUser={currentUser} />
      </div>

      <div className="flex bg-slate-950/50 rounded-lg p-3 justify-between items-center mb-3 mt-3">
        <div>
          {/* make the edit button show only if it is the creator */}
          <h1 className='font-medium flex gap-1'>{taskData?.TaskName}<Popover content={
            <div className='flex gap-1 items-center'>
              <Input placeholder='Enter New Task Title' value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
              <Button variant='secondary'>{changingTitle ? <LoaderSpin size={22} /> : 'Update'}</Button>
            </div>
          } title="Update Task Title" placement='bottom' trigger='click'><Edit size={14} className='hover:text-neutral-400 cursor-pointer' /></Popover></h1>
          <p className='text-xs text-slate-200'>{taskData?.Description}</p>
        </div>
      </div>
      <div className="bg-slate-950/50 p-3 rounded-lg mb-3 flex gap-2 items-center flex-wrap">
        {activityData?.highCount && activityData?.highCount > 0 && <h2 className='text-xs text-red-500 border border-red-500 p-1 px-2 rounded-lg flex items-center gap-1 font-semibold'><Flag fill='red' size={12} />{activityData?.highCount} HIGH</h2>}
        {activityData?.avgCount && activityData?.avgCount > 0 && <h2 className='text-xs text-orange-400 border border-orange-400 p-1 px-2 rounded-lg flex items-center gap-1 font-semibold'><Flag fill='gold' size={12} />{activityData?.lowCount} Average</h2>}
        {activityData?.lowCount && activityData?.lowCount > 0 && <h2 className='text-xs text-slate-400 border border-slate-400 p-1 px-2 rounded-lg flex items-center gap-1 font-semibold'><Flag fill='grey' size={12} />{activityData?.lowCount} Low</h2>}
        <h2 className='text-xs font-medium text-slate-200 border border-slate-700 p-1 px-2 rounded-lg flex items-center gap-1'>Duration: 2days</h2>
        <Popconfirm title="Delete Task!!" description="Are you sure to delet this task ?"><button className='bg-cyan-950 rounded-lg text-red-400 hover:text-white hover:border-slate-300 border-red-700 text-xs px-3 p-1 border'>Delete task</button></Popconfirm>
        {taskData && <EditTaskPriorityDurationSheet trigger={
          <button className='bg-cyan-950 rounded-lg text-orange-400 hover:text-white hover:border-slate-300 border-red-700 text-xs px-3 p-1 border'>Update task</button>
        } taskData={taskData} />}
      </div>
      <div className="bg-slate-950/50 p-3 rounded-lg mb-3">
        <h1 className='text-center mb-1 text-sm'>ToDo</h1>
        <div className="flex gap-2 w-full lg:w-3/4 items-center mx-auto mb-3">
          <h1 className='w-full p-1 text-center bg-cyan-950 rounded-lg border border-neutral-700 text-sm'>Pending {taskData?.Activities?.filter((act: any) => !act?.Completed)?.length}</h1>
          <h1 className='w-full p-1 text-center bg-cyan-950 rounded-lg border border-neutral-700 text-sm'>Completed {taskData?.Activities?.filter((act: any) => act?.Completed)?.length}</h1>
          <h1 className='w-full p-1 text-center bg-cyan-950 rounded-lg border border-neutral-700 text-sm'>Total {taskData?.Activities?.length}</h1>
        </div>
        <div className="bg-slate-950/50 p-3 rounded-lg flex flex-col gap-2">
          {
            taskData?.Activities?.map((activity: any) => (
              <div key={activity?._id} className="p-2 border rounded-lg border-slate-700 hover:bg-slate-800/70 select-none">
                <div className="flex gap-2 items-center">
                  <Checkbox onCheckedChange={() => handleChecking(activity?._id, !activity?.Completed)} checked={activity?.Completed} />
                  <h3 className='text-sm text-slate-100 flex gap-2 items-center'>{activity?.Title}
                    <Flag fill={activity?.Priority == "high" ? 'red' : (activity?.Priority == 'medium' ? 'gold' : 'grey')} color={activity?.Priority == "high" ? 'red' : (activity?.Priority == 'medium' ? 'gold' : 'grey')} size={14} />
                    <Popconfirm title="Delete activity ?" onConfirm={() => handleRemoveActivity(activity?._id)}><Trash2 size={14} color='red' /></Popconfirm>
                  </h3>
                </div>
                <p className='text-xs text-slate-200 pl-6'>{activity?.Description}</p>
              </div>
            ))
          }

          <AddActivitySheet trigger={
            <div className="p-2 border rounded-lg border-slate-700 hover:bg-slate-200/90 hover:text-black font-semibold select-none flex gap-1 items-center text-sm justify-center cursor-pointer"><Plus size={20} /> Add Activity</div>
          } taskid={taskData?._id} />
        </div>
      </div>
      {/* Show the complete task */}
      <div className="bg-cyan-900/50 p-3 rounded-lg">
        <Textarea rows={5} placeholder='You can add some comments on task completion.' className='border-slate-300' value={completeCommand} onChange={(e) => setCompleteCommand(e.target.value)} />
        <div className="flex justify-end mt-3"><Button onClick={handleTaskComplete}>{ completingTask ? <LoaderSpin size={22} /> : 'Complete'}</Button></div>
      </div></>
      }
    </div>
  )
}

export default TaskIdPage