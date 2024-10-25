/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { useEffect, useState } from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import makeAnimated from 'react-select/animated';
import { useSession } from 'next-auth/react'
import { useAddNewStaff, useGetAllSkills } from '@/query/client/adminQueries'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ConfigProvider, Select as SELECT } from 'antd'

const formSchema = z.object({
    Name: z.string().min(3, "Sorry! as per our business guidelines this is not a real name.").max(25),
    Email: z.string().email("Invalid email address").min(2).max(50),
    Country: z.string(),
    Province: z.string(),
    City: z.string().optional(),
    Pin: z.string().optional(),
    Phone: z.string().optional(),
})

type Document = {
    name: string,
    file: File | null,
    fileUrl: string | null,
    expireAt: Date | null,
    remindMe: Date | null
}

const animatedComponents = makeAnimated();

const AddStaff = () => {
    const router = useRouter();
    const { data: session }: any = useSession();
    const { mutateAsync: addNewStaff, isPending: addingStaff } = useAddNewStaff();
    const [loading, setLoading] = useState(false);

    const { data: allSkills, isLoading: loadingAllSkills } = useGetAllSkills(session?.user?.id);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [filteredOptions, setFilteredOptions] = useState([]);
    useEffect(() => {
        if (allSkills) {
            setFilteredOptions(allSkills?.Skills?.filter((o: any) => !selectedItems.includes(o)));
        }
    }, [allSkills, selectedItems]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            Name: "",
            Email: "",
            Country: "",
            Province: "",
            City: "",
            Pin: "",
            Phone: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        const formData = new FormData();
        formData.append("userform", JSON.stringify({
            Name: values.Name,
            Email: values.Email,
            Country: values.Country,
            Province: values.Province,
            City: values.City,
            Skills: selectedItems,
            Phone: values.Phone
        }))

        try {
            const response = await addNewStaff({ formData });
            if (response?.existing) {
                return toast.error("Email is already in use.", {
                    description: "This email is currently being used by some of your staff."
                });
            }
            router.push('/admin/staffs');
            return toast.success("New Staff Added Successfully.", {
                description: "Added a new staff data _just_now_."
            });
        } catch (error) {
            console.log(error);
            return toast.error("Something went wrong while adding a new staff member.");
        } finally {
            setLoading(false);
        }
    }

    return (

        <div className='p-5 overflow-y-scroll h-[95dvh] pb-20'>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/admin/staffs">Manage Staffs</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>add staffs</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="mt-2 bg-slate-950/50 p-3 rounded-lg">
                <h1 className='font-semibold mb-3 text-xl'>Add New staff</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 lg:w-10/12">
                        <FormField
                            control={form.control}
                            name="Name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="staff name" className='border-border' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="Email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email address" className='border-border' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="Phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <Input placeholder="phone number with country code" className='border-border' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="Country"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <FormControl>
                                        <Input placeholder="native country" className='border-border' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="Province"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Province</FormLabel>
                                    <FormControl>
                                        <Input placeholder="country province or state" className='border-border' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="City"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Native City</FormLabel>
                                    <FormControl>
                                        <Input placeholder="your locality" className='border-border' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="Pin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pin Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="postal code or pin code" className='border-border' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div>
                            <label className='text-sm font-medium'>Skills</label>
                            <ConfigProvider
                                theme={{
                                    token: {
                                        colorPrimary: '#00b96b',
                                        colorBgContainer: '#f6ffed',
                                        colorTextPlaceholder: 'gray'
                                    },
                                }}
                            ><SELECT mode="multiple" placeholder="Filter Out Skills" value={selectedItems} style={{ width: '100%' }}
                                onChange={setSelectedItems}
                                options={filteredOptions.map((item) => ({
                                    value: item,
                                    label: item,
                                }))}
                                /></ConfigProvider>
                        </div>
                        <div className="w-full flex justify-end">
                            <Button type="submit" className='bg-cyan-950 text-foreground hover:bg-cyan-950/50'>{loading ? 'Creating...' : 'Create Now'}</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default AddStaff