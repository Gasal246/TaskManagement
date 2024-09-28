"use client"
import React from 'react'
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import Image from 'next/image'
import { CircleUser } from 'lucide-react'
import { motion } from 'framer-motion'
import { ExitIcon } from '@radix-ui/react-icons'
import { signOut, useSession } from 'next-auth/react'
import { useGetSuperAdminById } from '@/query/client/superuserQueries'

const SuperTopbar = () => {
    const { data: session }: any = useSession();
    const { data: superAdmin, isLoading: superAdminDataLoading } = useGetSuperAdminById(session?.user?.id)
    return (
        <div className='w-full h-14 dark:bg-slate-900 bg-slate-400 px-10 flex items-center'>
            <div className="flex items-center justify-center gap-2">
                <Image src={'/logo.png'} alt='my_logo' width={30} height={30} />
                <h1 className='font-bold text-nowrap'>C~Panel</h1>
            </div>
            <div className="w-full flex justify-end">
                {superAdmin &&
                    <Popover>
                        <PopoverTrigger>
                            <motion.div whileTap={{ scale: 0.98 }} className="px-3 flex gap-1 items-center">
                                <CircleUser size={25} />
                                <div>
                                    <h1 className='text-start font-medium text-sm'>{superAdmin?.Name}</h1>
                                    <h1 className='text-start font-medium text-xs'>{superAdmin?.Email}</h1>
                                </div>
                            </motion.div>
                        </PopoverTrigger>
                        <PopoverContent className='w-40 p-2 space-y-2'>
                            <motion.button whileTap={{ scale: 0.98 }} className='w-full bg-secondary hover:bg-secondary/50 rounded-sm p-1 text-sm flex gap-1 items-center justify-center'><CircleUser size={16} strokeWidth={2} /> Profile </motion.button>
                            <motion.button onClick={() => signOut()} whileTap={{ scale: 0.98 }} className='w-full bg-destructive hover:bg-pink-900 text-destructive-foreground rounded-sm p-1 text-sm flex gap-1 items-center justify-center'><ExitIcon /> Sign Out</motion.button>
                        </PopoverContent>
                    </Popover>
                }
            </div>
        </div>
    )
}

export default SuperTopbar