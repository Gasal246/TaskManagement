"use client"
import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { motion } from 'framer-motion'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import RegionAndAreaFilter from '../shared/RegionAndAreaFilter'
import { Textarea } from '../ui/textarea'
import { useAddClients } from '@/query/client/clientQueries'
import { toast } from 'sonner'

const formSchema = z.object({
    username: z.string().min(2),
    email: z.string().email(),
    address: z.string(),
})

const AddClientsDialog = ({ currentUser, trigger }: { currentUser: any, trigger?: React.ReactNode }) => {
    const [phone, setPhone] = useState<any>();
    const [region, setRegion] = useState('');
    const [area, setArea] = useState('');
    const { mutateAsync: addClient, isPending: addingClient } = useAddClients()

    useEffect(() => {
        console.log(region);
        console.log(area)
    }, [region, area])
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            address: ""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log('Hello pressed to add this data.')
        const formData = new FormData();
        formData.append('name', values.username);
        formData.append('email', values.email);
        formData.append('details', values.address);
        formData.append('region', region);
        formData.append('area', area);
        formData.append('phone', phone);
        const response = await addClient(formData);
        if(response?._id){
            return toast.success("Client Added Successfully");
        }else{
            return toast.error("New Client Not Added", { description: "Check you filled all the details, & make sure it's unique from other client details."})
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}><Button>Add Client</Button></motion.div>}
            </DialogTrigger>
            <DialogContent className='max-h-[90dvh] overflow-y-scroll'>
                <DialogHeader>
                    <DialogTitle>Add Client</DialogTitle>
                    <DialogDescription>Add new client where projects and tasks can be wrapped under a single roof.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Client Name" {...field} />
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
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Client Email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div>
                            <label className='text-sm'>Phone</label>
                            <div className='border-2 p-2 rounded-lg'>
                                <PhoneInput placeholder="phone number with country code." value={phone} onChange={setPhone} className='bg-transparent' />
                            </div>
                        </div>
                        <RegionAndAreaFilter setRegion={setRegion} setArea={setArea} currentUser={currentUser} placeholder='select region' />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Address & Details.." className='overscroll-y-contain' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="pt-5"><Button type="submit">{addingClient ? 'Adding..' : 'Add Client'}</Button></div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default AddClientsDialog