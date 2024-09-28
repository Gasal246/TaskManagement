/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import React, { useEffect, useRef, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ThemeChanger } from '@/components/theme/ThemeChanger'
import { useFindByMailId } from '@/query/client/userQueries'
import { CircleCheckBig, Info, ShieldAlert } from 'lucide-react'

const formSchema = z.object({
    email: z.string().min(2).max(50),
    password: z.string().min(6, "minimum charecters length not satisfied.")
})

const LoginPage = () => {
    const [loading, setLoading] = useState(false)
    const { mutateAsync: findUserByEmail, isPending: findingEmail, isSuccess: respondedEmail } = useFindByMailId()
    const [showpassword, setShowPassword] = useState(false)
    const [userFound, setUserFound] = useState(false)
    const session = useSession()
    const router = useRouter()

    useEffect(() => {
        if (session?.status == 'authenticated') {
            router.replace('/')
        }
    }, [session, router])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true)
        try {
            const response = await signIn('credentials', {
                redirect: false,
                email: values.email,
                password: values.password,
                isSuper: "false"
            })
            if (response?.error) {
                toast("Login Failed!", {
                    description: "There is a mismatch in provided credentials."
                })
            }
            if (response?.ok) {
                toast("Login Success..", {
                    description: "Good to see you " + values.email
                })
            }
        } catch (error) {
            console.log(error)
        } finally {
            form.reset()
            setLoading(false)
        }
    }

    const handleEmailEntry = async (email: string) => {
        form.setValue('email', email);
        const res = await findUserByEmail(email)
        if (res) {
            setUserFound(true)
        } else {
            return setUserFound(false)
        }
        if (res?.InitialEntry) {
            setShowPassword(false)
        } else {
            setShowPassword(true)
        }
    }

    return (
        <div className='w-full h-screen flex flex-col items-center justify-center p-4 gap-10'>
            <div className="absolute top-10 flex justify-between items-center w-full px-10">
                <h1 className='font-bold'>Task Manager</h1>
                <Info />
            </div>
            <h1 className='font-black text-3xl'>Login.</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:w-1/3 w-full mb-32 md:mb-0">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input onChange={(e) => handleEmailEntry(e.target.value)} placeholder="enter your Email" className='bg-transparent outline-none border border-slate-700' />
                                </FormControl>
                                <FormDescription >
                                    {findingEmail ?
                                        <i className='flex items-center gap-1'>
                                            <Image src={`/icons/loadingspin.svg`} width={20} height={20} alt='loader' />
                                            <span className={`text-white text-xs`}>checking...</span>
                                        </i> : (
                                            userFound ?
                                                <i className="flex items-center gap-1">
                                                    <CircleCheckBig size={14} color='green' />
                                                    <span className={`text-green-500 text-xs`}>yes! there you are...</span>
                                                </i> :
                                                <i className="flex items-center gap-1">
                                                    <ShieldAlert size={14} />
                                                    <span className={`text-gray-400 text-xs`}>enter your right email address</span>
                                                </i>
                                        )
                                    }
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {showpassword &&
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="enter your Password" type='password' {...field} className='bg-transparent outline-none border border-slate-700' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    }
                    <div className="flex justify-between items-center">
                        <Link href={`/forgetpassword`} className='text-blue-600 text-sm'>
                            forgot credentials ?
                        </Link>
                        {form.getValues('email').length > 0 && form.getValues('password').length > 0 &&
                            <Button type="submit">{loading ? <Image src={`/icons/loadingspin.svg`} width={30} height={30} alt='loader' /> : 'Login now'}</Button>
                        }
                        {
                            !showpassword && userFound &&
                            <Button type='button' onClick={() => router.push(`/verification/${form.getValues('email')}`)}>Verify & Add Password</Button>
                        }
                    </div>
                </form>
            </Form>
            <div className='md:w-2/3 w-full absolute bottom-5 md:bottom-10 p-2'>
                <p className='text-sm text-gray-500 text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore eius reprehenderit laborum ipsam quis rem est quod eligendi accusamus facilis, non aspernatur voluptatem excepturi obcaecati, reiciendis, tenetur eveniet. Nisi ut doloremque atque aspernatur quos quaerat laboriosam, velit repellendus quis molestiae quam perspiciatis officiis iusto harum, praesentium molestias eum cum nobis!</p>
            </div>
        </div>
    )
}

export default LoginPage
