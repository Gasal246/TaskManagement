/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useCreateNewAdmin, useDeleteAdminDoc, useGetDemoDepartments } from "@/query/client/superuserQueries"
import { Popconfirm, Tooltip } from "antd";
import { useRouter } from "next/navigation"
import { Ban, CircleCheckBig, FilePlus2, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import AddAdminDocumentsDialog from "@/components/super/AddAdminDocumentsDialog"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { getAdminInfo } from "@/query/server/superAdminFunctions"
import { findAdminByAdminid } from "@/query/client/fn/superAdminFn"
import { formatDateTiny } from "@/lib/utils"

const formSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email().max(60),
    items: z.array(z.string()).refine((value) => value.some((item) => item))
})

const AddAdmin = () => {
    const router = useRouter()
    const [adminCreated, setAdminCreated] = useState(false);
    const [adminData, setAdminData] = useState<any>();
    const [loading, setLoading] = useState(false);
    const { data: demodepartments, isLoading: demoDeparmentsLoading } = useGetDemoDepartments();
    const { mutateAsync: addNewAdmin, isPending: addingNewAdmin, isSuccess: addedNewAdmin, status: addingStatus } = useCreateNewAdmin()
    const { mutateAsync: deleteAdminDoc, isPending:deletingAdminDoc } = useDeleteAdminDoc();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            items: []
        },
    })

    useEffect(() => {
        if (addedNewAdmin) {
            toast.success("New Admin Info Saved to Database.", { description: "You have added a new admin, just now!", onDismiss: () => router.replace('/superadmin/admins') })
        }
    }, [addedNewAdmin, addingStatus])

    const fetchAdmin = async (adminid: string) => {
        setLoading(true)
        try {
            setAdminData(null);
            const res = await findAdminByAdminid(adminid);
            setAdminData(res);
        } catch (error) {
            console.log("Error Fetching Admin: ", error)
        } finally {
            setLoading(false)
        }
    }

    const [docUpdate, setDocUpdate] = useState(false)
    useEffect(() => {
        if(docUpdate){
            fetchAdmin(adminData?._id)
            setDocUpdate(false);
        }
    }, [docUpdate])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        let formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("departments", values.items.join(','))
        const response = await addNewAdmin(formData);
        if (response?._id) {
            await fetchAdmin(response?._id);
            setAdminCreated(true);
        }
    }

    const handleDeleteDocument = async (docId: string, docUrl: string) => {
        const formData = new FormData();
        formData.append('adminId', adminData?._id);
        formData.append('docId', docId);
        formData.append('docUrl', docUrl);
        const response = await deleteAdminDoc(formData);
        console.log(response);
        if(response?._id){
            setDocUpdate(true)
            return toast.success('Admin Document Deleted.')
        }
    }

    return (
        <div className={`p-5 overflow-y-scroll h-[90dvh] pb-20 ${loading && 'blur-lg'}`}>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/superadmin/admins">Admins</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>add admin</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="mt-3">
                <h1 className='text-xl font-bold mb-3'>{adminCreated ? '' : 'Add New Admin'}</h1>
                {
                    !adminCreated ?
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Admin Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="This name will be displayed as the company name." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Admin Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="This will be taken as company's official email id" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="items"
                                    render={() => (
                                        <FormItem>
                                            <div className="mb-2">
                                                <FormLabel className="text-base">{demodepartments?.length > 0 ? 'Select the Department Plans' : <Link href={`/superadmin/departments`} className="text-sm text-blue-500 italic">click to create some department plans</Link>}</FormLabel>
                                            </div>
                                            <div className="flex gap-2 flex-wrap">
                                                {demodepartments?.map((item: any) => (
                                                    <FormField
                                                        key={item._id}
                                                        control={form.control}
                                                        name="items"
                                                        render={({ field }) => {
                                                            return (
                                                                <FormItem
                                                                    key={item._id}
                                                                    className="flex flex-row items-center space-x-1 space-y-0"
                                                                >
                                                                    <FormControl>
                                                                        <Checkbox
                                                                            checked={field.value?.includes(item._id)}
                                                                            onCheckedChange={(checked) => {
                                                                                return checked
                                                                                    ? field.onChange([...field.value, item._id])
                                                                                    : field.onChange(
                                                                                        field.value?.filter(
                                                                                            (value) => value !== item._id
                                                                                        )
                                                                                    )
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                    <FormLabel className="font-normal">
                                                                        <div className={`${form.getValues('items')?.includes(item?._id) && 'border-2 border-cyan-500'} cursor-pointer border p-2 border-slate-500 bg-slate-900 rounded-md min-w-[200px]`}>
                                                                            <h1 className="text-sm font-medium mb-1">{item?.DepartmentName}</h1>
                                                                            <h1 className="text-xs flex items-center gap-1">{item?.AllowProjects ? <><CircleCheckBig size={14} /> Allowed Projects</> : <><Ban size={14} /> No Projects Allowed</>}</h1>
                                                                            <h1 className="text-xs flex items-center gap-1">{item?.AllowTasks ? <><CircleCheckBig size={14} /> Allowed Tasks</> : <><Ban size={14} /> No Tasks Allowed</>}</h1>
                                                                            <h1 className="text-xs">Staffs Allows: {item?.MaximumStaffs}</h1>
                                                                        </div>
                                                                    </FormLabel>
                                                                </FormItem>
                                                            )
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-end px-4">
                                    <button type="submit" disabled={form.getValues('items').length <= 0} className="bg-blue-800 p-2 px-3 rounded-sm hover:bg-pink-800/70 text-foreground"><Tooltip title={addingNewAdmin ? 'wait! untill the creation complete' : (form.getValues('items').length > 0 ? 'click to create new admin' : 'select some plans before continue.')}>{addingNewAdmin ? 'wait! creating..' : 'Continue'}</Tooltip></button>
                                </div>
                            </form>
                        </Form> :
                        <>
                            <h1 className="font-semibold">Name: <span className="text-slate-300">{adminData?.AdminId?.Name}</span></h1>
                            <h1 className="font-semibold">Email: <span className="text-slate-300">{adminData?.AdminId?.Email}</span></h1>
                            <h1 className="text-sm font-medium mt-2">Company Documents</h1>
                            <div className="flex flex-wrap items-center">
                                {adminData?.Documents?.map((doc: any) => (
                                    <div className="w-full md:w-3/12 p-1" key={doc?._id}>
                                        <div className="bg-slate-900 border border-slate-600 p-2 w-full rounded-md">
                                            <div className="flex justify-between items-center">
                                                <h1 className="text-sm font-medium">{doc?.DocName}</h1>
                                                <Popconfirm title="Delete Document" description="Are you sure want to delete this company document ?" onConfirm={() => handleDeleteDocument(doc?._id, doc?.DocUrl)}><motion.div whileHover={{ rotate: -30, scale: 1.05 }} whileTap={{ scale: 0.98 }} className="text-red-700"><Trash2 size={20} /></motion.div></Popconfirm>
                                            </div>
                                            <div className="flex justify-between mt-1 items-center">
                                                <div>
                                                    <h4 className="text-xs text-slate-400 leading-3">expire at</h4>
                                                    <h2 className="text-xs font-medium text-slate-300">{formatDateTiny(doc?.ExpireAt)}</h2>
                                                </div>
                                                <div>
                                                    <h4 className="text-xs text-slate-400 leading-3">remind at</h4>
                                                    <h2 className="text-xs font-medium text-slate-300">{formatDateTiny(doc?.RemindAt)}</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="w-full md:w-3/12 p-2">
                                    <AddAdminDocumentsDialog trigger={
                                        <motion.h1 whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="cursor-pointer bg-cyan-700 border border-slate-600 p-2 flex gap-2 items-center text-sm font-semibold text-black justify-center rounded-full">Add Document <FilePlus2 /></motion.h1>
                                    } adminId={adminData?.AdminId?._id} updateTrigger={setDocUpdate} />
                                </div>
                            </div>
                        </>
                }
            </div>
        </div>
    )
}

export default AddAdmin
