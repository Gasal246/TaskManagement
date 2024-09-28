"use client"
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DashboardIcon } from '@radix-ui/react-icons'
import { SquareLibrary, UsersIcon } from 'lucide-react'

const SuperSidebar = () => {
    const pathname = usePathname();
    return (
        <div className={`w-full h-full dark:bg-slate-900 bg-slate-400 relative overflow-hidden`}>
            <Link href="/superadmin">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`${pathname === '/superadmin' ? 'dark:bg-cyan-950 bg-blue-400 border-b border-slate-700' : 'dark:bg-slate-800 bg-slate-50'} w-full p-2 font-medium text-start flex gap-2 items-center hover:border-b hover:border-slate-700`}>
                    <DashboardIcon /> Inventory Insights
                </motion.button>
            </Link>
            <Link href="/superadmin/admins">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`${pathname.includes('/admins') ? 'dark:bg-cyan-950 bg-blue-400 border-b border-slate-700' : 'dark:bg-slate-800 bg-slate-50'} w-full p-2 font-medium text-start flex gap-2 items-center hover:border-b hover:border-slate-700`}>
                    <DashboardIcon /> Admin Management
                </motion.button>
            </Link>
            <Link href="/superadmin/departments">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`${pathname.includes('/departments') ? 'dark:bg-cyan-950 bg-blue-400 border-b border-slate-700' : 'dark:bg-slate-800 bg-slate-50'} w-full p-2 font-medium text-start flex gap-2 items-center hover:border-b hover:border-slate-700`}>
                    <DashboardIcon /> Department Management
                </motion.button>
            </Link>
        </div>
    )
}

export default SuperSidebar
