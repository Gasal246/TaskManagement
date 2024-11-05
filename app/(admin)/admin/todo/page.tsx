"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CalendarX2, PlusIcon, Trash2Icon } from 'lucide-react'
import { motion } from 'framer-motion'
import { Checkbox } from '@/components/ui/checkbox'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion"
import { Popconfirm, Tooltip } from 'antd'
import { useAddTodo, useCheckTodo, useDeleteTodo, useGetAllTodo } from '@/query/client/userQueries'
import { useSession } from 'next-auth/react'
import { formatDate, formatDateShortly, multiFormatDateString } from '@/lib/utils'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

const TodoPage = () => {
    const [input, setInput] = useState('');
    const [pending, setPending] = useState<any[]>([]);
    const [completed, setCompleted] = useState<any[]>([]);
    const { data: session }: any = useSession();
    const { data: allTodos, isLoading: loadingTodos } = useGetAllTodo(session?.user?.id);
    const { mutateAsync: checktodo, isPending: checkingTodo } = useCheckTodo();
    const { mutateAsync: deletetodo, isPending: deletingTodo } = useDeleteTodo();
    const { mutateAsync: addtodo, isPending: addingTodo } = useAddTodo();

    const handleCheckTodo = async (todoid: string, currentStatus: string) => {
        let status: 'completed' | 'pending' = 'pending'
        if (currentStatus == 'pending') {
            status = 'completed'
        } else {
            status = 'pending'
        }
        const response = await checktodo({ todoid: todoid, check: status });
        console.log(response);
    }

    const handleDeleteTodo = async (todoid: string) => {
        await deletetodo(todoid);
    }

    const handleAddTodo = async () => {
        const formData = new FormData();
        formData.append('content', input);
        if (!input) {
            return toast.info("Add Activity Before Continuing.")
        }
        const response = await addtodo(formData);
        if (response?._id) {
            setInput('')
            return toast.success("Success! New Todo Activity.")
        } else {
            return toast.error("Something went wrong on Adding ToDo!!.")
        }
    }

    useEffect(() => {
        if (allTodos) {
            const filterpending = allTodos?.filter((todo: any) => todo?.Status == 'pending');
            const filtercompleted = allTodos?.filter((todo: any) => todo?.Status == 'completed');
            setPending(filterpending);
            setCompleted(filtercompleted);
        }
    }, [allTodos])

    return (
        <div className='p-4 h-screen pb-20 overflow-y-scroll lg:overflow-y-hidden'>
            <div className="w-full flex">
                <div className="md:w-2/3 w-full p-1 h-[85dvh]">
                    <div className="bg-slate-950/50 border border-slate-900 h-full w-full rounded-xl md:p-3">
                        <div className="flex gap-1">
                            <Input placeholder='Enter Activity' className='border-slate-700' value={input} onChange={(e) => setInput(e.target.value)} />
                            <motion.div whileTap={{ scale: 0.97 }}><Button onClick={handleAddTodo}><PlusIcon size={20} /></Button></motion.div>
                        </div>
                        <div className="h-[90%] mt-3 rounded-xl border-2 border-slate-700 border-dashed w-full p-3 flex flex-col gap-2 overflow-y-scroll scroll-smooth">
                            {loadingTodos &&
                                <div className='flex flex-col gap-2'>
                                    <Skeleton className='w-full h-[50px] rounded-xl' />
                                    <Skeleton className='w-full h-[50px] rounded-xl' />
                                    <Skeleton className='w-full h-[50px] rounded-xl' />
                                    <Skeleton className='w-full h-[50px] rounded-xl' />
                                </div>
                            }
                            {
                                allTodos?.map((todo: any) => (
                                    <Tooltip key={todo?._id} placement='left' title={<Popconfirm title="confirm delete activity ?" onConfirm={() => handleDeleteTodo(todo?._id)}><Trash2Icon color='red' size={20} /></Popconfirm>}>
                                        <motion.div whileTap={{ scale: 0.98 }} className="bg-slate-950/50 border border-dashed border-slate-800 p-2 rounded-lg hover:bg-slate-700/50 select-none cursor-pointer" onClick={() => handleCheckTodo(todo?._id, todo?.Status)}>
                                            <div className="flex gap-2 items-center">
                                                <Checkbox checked={todo?.Status == 'completed'} />
                                                <h1 className={`text-sm ${todo?.Status == 'completed' && 'text-slate-300 line-through'}`}>{todo?.Content}</h1>
                                            </div>
                                            <div className="flex items-center justify-end">
                                                <h1 className='text-[12px] text-cyan-600'>{` ${formatDate(todo?.createdAt)}`}</h1>
                                            </div>
                                        </motion.div>
                                    </Tooltip>
                                ))
                            }
                            {
                                allTodos?.length <= 0 &&
                                <div className=' flex w-full h-full justify-center items-center'>
                                    <div>
                                        <CalendarX2 size={100} />
                                        <h1 className='text-sm text-slate-400 mt-2'>No ToDo Found</h1>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="md:w-1/3 w-full p-1 h-[85dvh]">
                    <div className="bg-slate-950/50 border border-slate-800 h-full w-full rounded-xl p-2 overflow-y-scroll scroll-smooth">
                        {
                            loadingTodos ?
                                <div className='flex flex-col gap-2'>
                                    <Skeleton className='w-full h-[50px] rounded-xl' />
                                    <Skeleton className='w-full h-[50px] rounded-xl' />
                                    <Skeleton className='w-full h-[50px] rounded-xl' />
                                    <Skeleton className='w-full h-[50px] rounded-xl' />
                                </div> :
                                <Accordion type="single" collapsible>
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger><h1 className='text-sm text-cyan-500'>Pending {`[${pending?.length}]`}</h1></AccordionTrigger>
                                        <AccordionContent>
                                            <div className="flex flex-col gap-2">
                                                {
                                                    pending?.map((todo: any) => (
                                                        <Tooltip key={todo?._id} placement='left' title={<Popconfirm title="confirm delete activity ?" onConfirm={() => handleDeleteTodo(todo?._id)}><Trash2Icon color='red' size={20} /></Popconfirm>}>
                                                            <div className="bg-slate-950/50 border border-dashed border-slate-800 p-2 rounded-lg hover:bg-slate-700/50 select-none cursor-pointer" onClick={() => handleCheckTodo(todo?._id, todo?.Status)}>
                                                                <div className="flex gap-2 items-center">
                                                                    <Checkbox checked={todo?.Status == 'completed'} />
                                                                    <h1 className='text-xs'>{todo?.Content}</h1>
                                                                </div>
                                                                <div className="flex items-center justify-end">
                                                                    <h1 className='text-[12px] text-cyan-600'>{` ${formatDateShortly(todo?.createdAt)}`}</h1>
                                                                </div>
                                                            </div>
                                                        </Tooltip>
                                                    ))
                                                }
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger><h1 className='text-sm text-cyan-500'>Completed {`[${completed?.length}]`}</h1></AccordionTrigger>
                                        <AccordionContent>
                                            <div className="flex flex-col gap-2">
                                                {
                                                    completed?.map((todo: any) => (
                                                        <Tooltip key={todo?._id} placement='left' title={<Popconfirm title="confirm delete activity ?" onConfirm={() => handleDeleteTodo(todo?._id)}><Trash2Icon color='red' size={20} /></Popconfirm>}>
                                                            <div className="bg-slate-950/50 border border-dashed border-slate-800 p-2 rounded-lg hover:bg-slate-700/50 select-none cursor-pointer" onClick={() => handleCheckTodo(todo?._id, todo?.Status)}>
                                                                <div className="flex gap-2 items-center">
                                                                    <Checkbox checked={todo?.Status == 'completed'} />
                                                                    <h1 className='text-xs'>{todo?.Content}</h1>
                                                                </div>
                                                                <div className="flex items-center justify-end">
                                                                    <h1 className='text-[12px] text-cyan-600'>{` ${formatDateShortly(todo?.createdAt)}`}</h1>
                                                                </div>
                                                            </div>
                                                        </Tooltip>
                                                    ))
                                                }
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TodoPage
