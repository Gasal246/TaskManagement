"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useSendPasswordMagicLink } from "@/query/client/userQueries"
import { useEffect } from "react"
import { toast } from "sonner"

const formSchema = z.object({
    email: z.string().email(),
})

const ForgetPassword = () => {
    const  { mutateAsync: sendMagicLink, isPending: sendingEmail } = useSendPasswordMagicLink();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const response = await sendMagicLink({ email: values.email });
        if(sendingEmail){
            toast.success("Sending Magical Link.", { description: "Please check your email."})
        }
        if(response){
            return toast.success(response)
        }else{
            return toast.error("Email Not Send!!")
        }
    }

    return (
        <div className='w-full h-screen flex flex-col justify-center items-center'>
            <div className="">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="enter email address." {...field} />
                                    </FormControl>
                                    <FormDescription>You will be getting a email magic link for resetting your password</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="rounded-full">{sendingEmail ? 'Getting You..' : 'Send Email'}</Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default ForgetPassword
