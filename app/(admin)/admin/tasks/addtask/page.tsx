/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"
import { useAddNewTask, useFindUserById, useGetChoosableStaffs } from "@/query/client/userQueries"
import { useSession } from "next-auth/react"
import { Avatar, Popconfirm, Tooltip } from "antd"
import { ArrowBigLeftDash, FilePlus2, Flag, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import AddActivitySheet from "@/components/task/AddActivitySheet"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, } from "@/components/ui/accordion"


const formSchema = z.object({
    taskName: z.string().min(2).max(30),
    description: z.string().min(2).max(250),
    deadline: z.string().date(),
    forwardMethord: z.string(),
    directStaffs: z.array(z.string()).optional(),
})

interface Activity {
    Title: string;
    Description: string;
    Priority: string;
    Completed: boolean;
}

const AddTaskPage = () => {
    const searchParams = useSearchParams();
    const projectid = searchParams.get('projectid');
    const router = useRouter()
    const [priority, setPriority] = useState('low');
    const { data: session }: any = useSession();
    const { data: currentUser, isLoading: loadingCurrent } = useFindUserById(session?.user?.id);
    const { mutateAsync: addNewTask, isPending: addingNewTask } = useAddNewTask();
    const { data: stafflist, isLoading: loadingStaffList, refetch: refechStaff } = useGetChoosableStaffs(session?.user?.id);
    const [directStaff, setDirectStaff] = useState('');
    const [showStafflist, setShowStafflist] = useState(false);
    const [activities, setActivities] = useState<Activity[]>([])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            taskName: "",
            description: "",
            deadline: '',
            forwardMethord: 'public'
        },
    })

    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === 'forwardMethord') {
                if (value.forwardMethord === 'direct') {
                    setShowStafflist(true);
                    refechStaff();
                } else {
                    setShowStafflist(false);
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [form.watch]);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const formData = new FormData();
        formData.append('taskform', JSON.stringify({
            TaskName: values.taskName,
            Creator: session?.user?.id,
            Description: values.description,
            ForwardType: directStaff ? 'individual' : 'public',
            AssignedUser: directStaff || null,
            Projectid: projectid || null,
            Deadline: values.deadline,
            Priority: priority,
            SelectedStaffs: values.directStaffs || [],
            Activities: activities?.length > 0 ? activities : []
        }));
        const response = await addNewTask({ formData: formData });
        if (response?._id) {
            router.back();
            return toast.success("Task Successfully added.", {
                description: "You can see your tasks in tasks/Created tab."
            })
        } else {
            return toast.error("Task Not Added", {
                description: "Error: " + response
            })
        }
    }

    const handleDeleteActivity = (index: number) => {
        const updatedActivities = activities.filter((activity, idx) => idx !== index);
        setActivities(updatedActivities);
    }

    return (
        <div className="p-4 pb-28">
            {projectid ?
                <div className="mb-2">
                    <div onClick={() => router.back()} className="lg:hidden bottom-16 left-3 bg-black/50 rounded-full w-[35px] h-[35px] fixed flex justify-center items-center">
                        <Tooltip title="back"><ArrowBigLeftDash size={30} /></Tooltip>
                    </div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => router.back()} className="cursor-pointer hidden w-[100px] h-[35px] rounded-full lg:flex gap-1 items-center text-xs bg-black/60 justify-center"><ArrowBigLeftDash size={25} /> Back</motion.div>
                </div> : <Breadcrumb className='mb-2'>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/admin/tasks">All Tasks</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Add NewTask</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                    <FormField
                        control={form.control}
                        name="taskName"
                        render={({ field }) => (
                            <FormItem className="bg-slate-950/40 p-2 rounded-lg">
                                <FormLabel>Task Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="enter task name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="bg-slate-950/40 p-2 rounded-lg">
                                <FormLabel>Task Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Tell about task."
                                        className="resize-y border-border"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                            <FormItem className="bg-slate-950/40 p-2 rounded-lg">
                                <FormLabel>Deadline</FormLabel>
                                <FormControl>
                                    <Input type="date" placeholder="select the date" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="p-3 bg-slate-950/50 rounded-lg">
                        <label className='text-sm font-medium'>Select Task Priority</label><br />
                        <div className="flex items-center gap-2">
                            <h1 className={`cursor-pointer text-sm font-medium hover:bg-cyan-950/50 border ${priority == 'high' && 'bg-cyan-950'} border-slate-500 p-1 px-3 flex gap-1 items-center rounded-lg`} onClick={() => setPriority('high')}>High <Flag size={18} fill='red' /></h1>
                            <h1 className={`cursor-pointer text-sm font-medium hover:bg-cyan-950/50 border ${priority == 'medium' && 'bg-cyan-950'} border-slate-500 p-1 px-3 flex gap-1 items-center rounded-lg`} onClick={() => setPriority('medium')}>Average <Flag size={18} fill='gold' /></h1>
                            <h1 className={`cursor-pointer text-sm font-medium hover:bg-cyan-950/50 border ${priority == 'low' && 'bg-cyan-950'} border-slate-500 p-1 px-3 flex gap-1 items-center rounded-lg`} onClick={() => setPriority('low')}>Low <Flag size={18} fill='silver' /></h1>
                        </div>
                    </div>
                    <div className="flex flex-col bg-slate-950/50 p-3 rounded-lg mb-3">
                        <div className="flex justify-between items-center mb-2">
                            <h1 className="text-sm font-medium">Activities / ToDo</h1>
                            <AddActivitySheet
                                trigger={<Button className="flex gap-1 rounded-full" type="button"><FilePlus2 size={16} />Add New</Button>}
                                activities={activities} setActivities={setActivities}
                            />
                        </div>
                        {activities?.map((activity, index) => (
                            <div key={index} className="p-2 border rounded-lg border-slate-700 hover:bg-slate-800/70 select-none mb-2">
                                <div className="flex gap-2 items-center">
                                    <h3 className='text-sm text-slate-100 flex gap-2 items-center'>
                                        <Flag fill={activity?.Priority == 'high' ? 'red' : (activity?.Priority == 'medium' ? 'gold' : 'gray')} color={activity?.Priority == 'high' ? 'red' : (activity?.Priority == 'medium' ? 'gold' : 'gray')} size={14} />
                                        {activity?.Title}
                                        <Popconfirm title="Delete activity ?" onConfirm={() => handleDeleteActivity(index)}><Trash2 size={14} color='red' className="cursor-pointer" /></Popconfirm>
                                    </h3>
                                </div>
                                <p className='text-xs text-slate-200'>{activity?.Description}</p>
                            </div>
                        ))}
                    </div>
                    <div className="bg-slate-950/50 rounded-lg p-3">
                        <h1 className="text-sm font-medium">Forward Task</h1>
                        <Accordion type="single" collapsible>
                            <AccordionItem value="item-1">
                                <AccordionTrigger>Department</AccordionTrigger>
                                <AccordionContent>
                                    <div>
                                        <h1 className="text-xs text-slate-400">Forward to any department, or deparatment staffs. ( distribution possible ).</h1>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2">
                                <AccordionTrigger>Region</AccordionTrigger>
                                <AccordionContent>
                                    <div>
                                        <h1 className="text-xs text-slate-400">Forward Task to a special region head, ( distribution possible ).</h1>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger>Area</AccordionTrigger>
                                <AccordionContent>
                                    <div>
                                        <h1 className="text-xs text-slate-400">Forward Task to an Area, ( distribution possible ).</h1>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                    <div className="pt-5 flex justify-end">
                        <Button type="submit" className="">Upload Task</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default AddTaskPage
