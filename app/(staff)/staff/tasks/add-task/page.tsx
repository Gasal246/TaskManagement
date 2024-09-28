/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"
import { useAddNewTask, useGetChoosableStaffs } from "@/query/client/userQueries"
import { useSession } from "next-auth/react"
import { Avatar, Popconfirm } from "antd"
import { FilePlus2, Flag, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
    taskName: z.string().min(2).max(30),
    description: z.string().min(2).max(250),
    deadline: z.string().date().optional(),
    forwardMethord: z.string(),
    directStaffs: z.array(z.string()).optional(),
})

const AddTaskPage = () => {
    const { data: session }: any = useSession();
    const { mutateAsync: addNewTask, isPending: addingNewTask } = useAddNewTask();
    const { data: stafflist, isLoading: loadingStaffList } = useGetChoosableStaffs(session?.user?.id);
    const [directStaff, setDirectStaff] = useState('')
    const [showStafflist, setShowStafflist] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            taskName: "",
            description: "",
            deadline: '',
            forwardMethord: ""
        },
    })

    useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === 'forwardMethord') {
                if (value.forwardMethord === 'direct') {
                    setShowStafflist(true);
                } else {
                    setShowStafflist(false);
                }
            }
        });

        return () => subscription.unsubscribe();
    }, [form.watch]);

    async function onSubmit(values: z.infer<typeof formSchema>) {

    }

    return (
        <div className="p-4">
            <Breadcrumb className='mb-2'>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/staff/tasks">Tasks</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Add NewTask</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
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
                    <div className="flex flex-col bg-slate-950/50 p-3 rounded-lg mb-3">
                        <div className="flex justify-between items-center mb-2">
                            <h1 className="text-sm font-medium">Activities / ToDo</h1>
                            <Button className="flex gap-1 rounded-full" type="button"><FilePlus2 size={16} />Add New</Button>
                        </div>
                        <div className="p-2 border rounded-lg border-slate-700 hover:bg-slate-800/70 select-none mb-2">
                            <div className="flex gap-2 items-center">
                                <h3 className='text-sm text-slate-100 flex gap-2 items-center'><Flag fill='red' color='red' size={14} /> Activity Name <Popconfirm title="Delete activity ?"><Trash2 size={14} color='red' /></Popconfirm></h3>
                            </div>
                            <p className='text-xs text-slate-200'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum consequuntur impedit iusto, quia provident dolorem. Accusantium beatae tempora itaque voluptatibus.</p>
                        </div>
                        <div className="p-2 border rounded-lg border-slate-700 hover:bg-slate-800/70 select-none mb-2">
                            <div className="flex gap-2 items-center">
                                <h3 className='text-sm text-slate-100 flex gap-2 items-center'><Flag fill='red' color='red' size={14} /> Activity Name <Popconfirm title="Delete activity ?"><Trash2 size={14} color='red' /></Popconfirm></h3>
                            </div>
                            <p className='text-xs text-slate-200'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum consequuntur impedit iusto, quia provident dolorem. Accusantium beatae tempora itaque voluptatibus.</p>
                        </div>
                    </div>
                    <div className="flex flex-col bg-slate-950/50 p-3 rounded-lg">
                        <FormField
                            control={form.control}
                            name="forwardMethord"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Forward Method</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a method to forward task." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="direct">Direct Assigning</SelectItem>
                                            <SelectItem value="heads">Assign to Heads & Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {showStafflist && <div className="flex flex-col gap-1 bg-slate-950/50 p-3 rounded-lg">
                        <FormField
                            control={form.control}
                            name="directStaffs"
                            render={() => (
                                <FormItem>
                                    <div className="mb-4">
                                        <FormLabel className="text-base">selects staffs to forward</FormLabel>
                                    </div>
                                    {stafflist?.Staffs?.map((item: any) => (
                                        <FormField
                                            key={item.id}
                                            control={form.control}
                                            name="directStaffs"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem key={item._id} className="flex flex-row items-center space-x-3 space-y-0" >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(item._id)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([field?.value, item?._id])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== item._id
                                                                            )
                                                                        )
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            <div className="flex gap-1 items-center">
                                                                <Avatar src={item?.AvatarUrl || '/avatar.png'} size={35} />
                                                                <div>
                                                                    <h1 className="text-xs font-medium leading-3">{item?.Name}</h1>
                                                                    <h1 className="text-xs">{item?.Email}</h1>
                                                                </div>
                                                            </div>
                                                        </FormLabel>
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    ))}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>}
                    <div className="pt-5 flex justify-end">
                        <Button type="submit" className="">Create task</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default AddTaskPage
