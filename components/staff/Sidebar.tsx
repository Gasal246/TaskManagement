"use client"
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { AlarmClockCheck, Captions, Codepen, Home, LandPlot, MapPinnedIcon, Pyramid, Users } from 'lucide-react'
import { Tooltip } from 'antd'
import { useSession } from 'next-auth/react'
import { Badge } from '../ui/badge'
import { useGetAllProjectAnalytics } from '@/query/client/analyticsQueries'

const StaffSidebar = () => {
    const pathname = usePathname();
    const { data: session }: any = useSession();
    const { data: projectsAnalytics, isLoading: loadingProjectAnalytics }: any = useGetAllProjectAnalytics(session?.user?.id, 'all');
    return (
        <div className='w-full h-full bg-slate-900 relative'>
            <h1 className='text-center justify-center py-4 flex gap-2 items-center text-lg font-semibold'><Image src="/logo.png" alt='logo' width={30} height={30} /> TaskManager</h1>
            <Link href="/staff">
                <Tooltip title="Home" placement='right'><motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className={`text-sm ${pathname === '/staff' ? 'bg-primary text-primary-foreground font-semibold border-b border-slate-700' : 'dark:bg-slate-800 bg-slate-50'} w-full p-2 font-medium text-start flex gap-2 items-center hover:border-b hover:border-slate-700`}>
                    <Home size={18} /> Home
                </motion.button></Tooltip>
            </Link>
            <Link href="/staff/tasks">
                <Tooltip title="Tasks" placement='right'><motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className={`text-sm ${pathname.includes('/staff/tasks') ? 'bg-primary text-primary-foreground font-semibold border-b border-slate-700' : 'dark:bg-slate-800 bg-slate-50'} w-full p-2 font-medium text-start flex gap-2 items-center hover:border-b hover:border-slate-700 justify-between`}>
                    <div className="flex gap-1"><AlarmClockCheck size={18} /> Tasks</div> <Badge>01</Badge>
                </motion.button></Tooltip>
            </Link>
            <Link href="/staff/projects">
                <Tooltip title="Projects" placement='right'><motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className={`text-sm ${pathname.includes('/staff/projects') ? 'bg-primary text-primary-foreground font-semibold border-b border-slate-700' : 'dark:bg-slate-800 bg-slate-50'} w-full p-2 font-medium text-start flex gap-2 items-center hover:border-b hover:border-slate-700 justify-between`}>
                    <div className="flex gap-1"><Captions size={18} /> Projects</div> {projectsAnalytics?.unopenedProjects?.length > 0 && <Badge>{projectsAnalytics?.unopenedProjects?.length}</Badge>}
                </motion.button></Tooltip>
            </Link>
            <Link href="/staff/clients">
                <Tooltip title="Clients" placement='right'><motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className={`text-sm ${pathname.includes('/staff/clients') ? 'bg-primary text-primary-foreground font-semibold border-b border-slate-700' : 'dark:bg-slate-800 bg-slate-50'} w-full p-2 font-medium text-start flex gap-2 items-center hover:border-b hover:border-slate-700 justify-between`}>
                    <div className="flex gap-1"><Pyramid size={18} /> Clients</div>
                </motion.button></Tooltip>
            </Link>
            <Link href="/staff/staffs">
                <Tooltip title="Staffs" placement='right'><motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className={`text-sm ${pathname.includes('/staff/staffs') ? 'bg-primary text-primary-foreground font-semibold border-b border-slate-700' : 'dark:bg-slate-800 bg-slate-50'} w-full p-2 font-medium text-start flex gap-2 items-center hover:border-b hover:border-slate-700 justify-between`}>
                    <div className="flex gap-1"><Users size={18} /> Staffs</div>
                </motion.button></Tooltip>
            </Link>
            <Link href="/staff/department">
                <Tooltip title="Department" placement='right'><motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className={`text-sm ${pathname.includes('/staff/department') ? 'bg-primary text-primary-foreground font-semibold border-b border-slate-700' : 'dark:bg-slate-800 bg-slate-50'} w-full p-2 font-medium text-start flex gap-2 items-center hover:border-b hover:border-slate-700 justify-between`}>
                    <div className="flex gap-1"><Codepen size={18} /> Deparment</div>
                </motion.button></Tooltip>
            </Link>
            <Link href="/staff/region">
                <Tooltip title="Region" placement='right'><motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className={`text-sm ${pathname.includes('/staff/region') ? 'bg-primary text-primary-foreground font-semibold border-b border-slate-700' : 'dark:bg-slate-800 bg-slate-50'} w-full p-2 font-medium text-start flex gap-2 items-center hover:border-b hover:border-slate-700 justify-between`}>
                    <div className="flex gap-1"><LandPlot size={18} /> Region</div>
                </motion.button></Tooltip>
            </Link>
            <Link href="/staff/area">
                <Tooltip title="Area" placement='right'><motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className={`text-sm ${pathname.includes('/staff/area') ? 'bg-primary text-primary-foreground font-semibold border-b border-slate-700' : 'dark:bg-slate-800 bg-slate-50'} w-full p-2 font-medium text-start flex gap-2 items-center hover:border-b hover:border-slate-700 justify-between`}>
                    <div className="flex gap-1"><LandPlot size={18} /> Area</div>
                </motion.button></Tooltip>
            </Link>
        </div>
    )
}

export default StaffSidebar