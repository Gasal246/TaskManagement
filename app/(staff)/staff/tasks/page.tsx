"use client"
import React, { useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from 'next/navigation'
import { useFindUserById } from '@/query/client/userQueries'
import { useSession } from 'next-auth/react'
import { CalendarCheck, CalendarPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import TaskTab from '@/components/staff/TaskTab'
import { useGetAllTaskAnalytics } from '@/query/client/analyticsQueries'
import { Badge } from 'antd'

const TasksPage = () => {
  const { data: session }: any = useSession();
  const router = useRouter();
  const { data: currentUser, isLoading: loadingUser } = useFindUserById(session?.user?.id);
  const { data: newTaskAnalytics, isLoading: loadingNewAnalytics } = useGetAllTaskAnalytics(session?.user?.id);

  useEffect(() => {
    if (newTaskAnalytics) {
      console.log(newTaskAnalytics)
    }
  }, [newTaskAnalytics])

  return (
    <div className='p-4'>
      <div className="flex items-center justify-between bg-slate-950/50 rounded-lg p-3 mb-3">
        <h1 className='font-medium flex gap-1 items-center'><CalendarCheck size={18} /> Manage Tasks</h1>
        <Button onClick={() => router.push(`/staff/tasks/add-task`)} className='flex gap-1'><CalendarPlus size={16} />New Task</Button>
      </div>
      <Tabs defaultValue="accepted" className="w-full bg-slate-950/70 p-3 rounded-lg">
        <div className="flex flex-wrap">
          <Input type='search' className='w-full lg:w-1/2' placeholder='search..' />
          {/* -------------------------------  ADD PROJECT FILTRATION HERE ------------------------------- */}
        </div>
        <TabsList className='flex-wrap md:flex-none my-2 h-full w-full grid lg:grid-cols-4 grid-cols-2'>
          <div className='px-2'><Badge size='small' count={newTaskAnalytics?.unreadedTasks} className='w-full text-slate-300'><TabsTrigger value="new" className='flex items-center gap-3 w-full'>New Tasks</TabsTrigger></Badge></div>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="created">Created</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="new">
          <div className='w-full'>
            <h1 className="text-sm pl-1 my-1">New tasks</h1>
            <TaskTab currentUser={currentUser} tasktype='new' />
          </div>
        </TabsContent>
        <TabsContent value="accepted">
          <div className='w-full'>
            <h1 className="text-sm pl-1 my-1">Accepted tasks</h1>
            <TaskTab currentUser={currentUser} tasktype='accepted' />
          </div>
        </TabsContent>
        <TabsContent value="created">
          <h1 className="text-sm pl-1 my-1">Created tasks</h1>
          <TaskTab currentUser={currentUser} tasktype='created' />
        </TabsContent>
        <TabsContent value="completed">
          <h1 className="text-sm pl-1 my-1">Completed tasks</h1>
          <TaskTab currentUser={currentUser} tasktype='completed' />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default TasksPage