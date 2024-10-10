/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "sonner"
import { useCreateNewAdmin, useGetDemoDepartments } from "@/query/client/superuserQueries"
import { useRouter } from "next/navigation"
import { Ban, CircleCheckBig } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email().max(60),
    phone: z.string().min(5).optional(),
    items: z.array(z.string()).refine((value) => value.some((item) => item)),
    country: z.string(),
    province: z.string(),
    city: z.string().optional(),
    pin: z.string().optional()
})

const AddAdmin = () => {
    const router = useRouter()
    const [adminCreated, setAdminCreated] = useState(false);
    const [adminData, setAdminData] = useState<any>();
    const [loading, setLoading] = useState(false);
    const { data: demodepartments, isLoading: demoDeparmentsLoading } = useGetDemoDepartments();
    const { mutateAsync: addNewAdmin, isPending: addingNewAdmin } = useCreateNewAdmin()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            country: "",
            province: "",
            city: "",
            phone: "",
            pin: "",
            items: []
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        let formData = new FormData();
        formData.append("adminform", JSON.stringify({
            name: values.name,
            email: values.email,
            departments: values.items.join(','),
            phone: values.phone,
            province: values.province,
            city: values.city,
            country: values.country,
            pin: values.pin
        }))
        const response = await addNewAdmin(formData);
        if(response?._id){
            router.replace('/superadmin/admins')
            return toast.success("Admin Registered successfully");
        }else{
            return toast.error("Something went wrong on Registerting New Admin.")
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
                <h1 className='text-xl font-bold mb-3 bg-slate-950/50 rounded-lg p-3'>{adminCreated ? '' : 'Add New Admin'}</h1>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="bg-slate-950/50 p-3 rounded-lg">
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
                                        <FormItem className="bg-slate-950/50 p-3 rounded-lg">
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
                                    name="country"
                                    render={({ field }) => (
                                        <FormItem className="bg-slate-950/50 p-3 rounded-lg">
                                            <FormLabel>Country</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Country" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="province"
                                    render={({ field }) => (
                                        <FormItem className="bg-slate-950/50 p-3 rounded-lg">
                                            <FormLabel>Province</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Country Province" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                        <FormItem className="bg-slate-950/50 p-3 rounded-lg">
                                            <FormLabel>City</FormLabel>
                                            <FormControl>
                                                <Input placeholder="located city" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="pin"
                                    render={({ field }) => (
                                        <FormItem className="bg-slate-950/50 p-3 rounded-lg">
                                            <FormLabel>Pin Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Pin or Postal code" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem className="bg-slate-950/50 p-3 rounded-lg">
                                            <FormLabel>Phone</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Company contact number." {...field} />
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
                                                                    className={`flex flex-row items-center space-x-1 space-y-0 ${form.getValues('items')?.includes(item?._id) ? 'bg-cyan-950/50 border-cyan-700' : 'bg-slate-950/50'} border border-slate-700 rounded-lg p-3 select-none`}
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
                                                                        <div className={`p-2 w-full cursor-pointer`}>
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
                                    <Button className="bg-cyan-500" type="submit">{addingNewAdmin ? "Creating..." : "Create Admin"}</Button>
                                </div>
                            </form>
                        </Form>
            </div>
        </div>
    )
}

export default AddAdmin
