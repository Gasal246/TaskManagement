"use client"
import React, { useState } from 'react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, } from "@/components/ui/sheet"
import { Button } from '../ui/button'
import { Flag } from 'lucide-react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from '../ui/textarea'

const formSchema = z.object({
    name: z.string().min(2),
    description: z.string().min(2),
})

const AddActivitySheet = ({ projectid, trigger }: { projectid?: string, trigger: React.ReactNode }) => {
    const [priority, setPriority] = useState('low');
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }
    return (
        <Sheet>
            <SheetTrigger>{trigger}</SheetTrigger>
            <SheetContent className="w-[400px] lg:min-w-[660px]">
                <SheetHeader>
                    <SheetTitle>Add Activity</SheetTitle>
                    <SheetDescription>A task is a group of activities to complete, add more here..</SheetDescription>
                </SheetHeader>
                <div className="h-full overflow-y-scroll pb-10 my-3">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Activity Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="new activity title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div>
                                <label className='text-sm font-medium'>Select Priority</label><br />
                                <div className="flex items-center gap-2">
                                    <h1 className={`cursor-pointer text-sm font-medium hover:bg-cyan-950/50 border ${priority == 'high' && 'bg-cyan-950'} border-slate-500 p-1 px-3 flex gap-1 items-center rounded-lg`} onClick={() => setPriority('high')}>High <Flag size={18} fill='red' /></h1>
                                    <h1 className={`cursor-pointer text-sm font-medium hover:bg-cyan-950/50 border ${priority == 'average' && 'bg-cyan-950'} border-slate-500 p-1 px-3 flex gap-1 items-center rounded-lg`} onClick={() => setPriority('average')}>Average <Flag size={18} fill='gold' /></h1>
                                    <h1 className={`cursor-pointer text-sm font-medium hover:bg-cyan-950/50 border ${priority == 'low' && 'bg-cyan-950'} border-slate-500 p-1 px-3 flex gap-1 items-center rounded-lg`} onClick={() => setPriority('low')}>Low <Flag size={18} fill='silver' /></h1>
                                </div>
                            </div>
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Tell What Exactly a user should do here.." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Submit</Button>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default AddActivitySheet