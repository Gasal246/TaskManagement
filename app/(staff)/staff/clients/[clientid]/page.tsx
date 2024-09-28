"use client"
import { ProjectCard } from '@/components/admin/ProjectCards'
import UpdateClientDialog from '@/components/client/UpdateClientDialog'
import RegionAndAreaFilter from '@/components/shared/RegionAndAreaFilter'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Popconfirm } from 'antd'
import { Button } from '@/components/ui/button'

const StaffClientId = ({ params }: { params: { clientid: string } }) => {
    const { data: session }: any = useSession();
    const [area, setArea] = useState('');
    const [region, setRegion] = useState('');

    const handleDeleteClient = async (clientid: string) => {

    }
    return (
        <div className='p-4'>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/staff/clients">All Clients</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>client name</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="mt-3 bg-slate-950/50 rounded-lg p-3 flex justify-between flex-wrap items-center mb-1">
                <div>
                    <h1 className='leading-5 text-slate-200'>Client Name</h1>
                    <h4 className='text-xs text-slate-300'>client@gmail.com</h4>
                </div>
                <div className="p-1 flex gap-1 items-center">
                    <UpdateClientDialog clientData={{}} currentUser={{}} />
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Popconfirm title="Delete Client ?" description="Projects and tasks assosiated with this client will also be deleted ?" overlayClassName='w-[280px]' onConfirm={() => handleDeleteClient('clientid')}><Button className='bg-red-700 hover:bg-red-600 text-white'>{'Delete'}</Button></Popconfirm>
                    </motion.div>
                </div>
            </div>
            <div className="flex flex-wrap">
                <div className="w-full lg:w-1/2 p-1">
                    <div className="bg-slate-950/50 rounded-lg p-2 text-xs text-cyan-500 font-medium">
                        Phone: <pre className='text-slate-300 font-light text-sm'>+919961680844</pre>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 p-1">
                    <div className="bg-slate-950/50 rounded-lg p-2 text-xs text-cyan-500 font-medium">
                        Region/Area: <pre className='text-slate-300 font-light text-sm'>India/Kerala</pre>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 p-1">
                    <div className="bg-slate-950/50 rounded-lg p-2 text-xs text-cyan-500 font-medium">
                        Other Info:
                        <pre className="text-slate-300 font-light text-sm text-wrap"> Lorem, ipsum dolor.
                            Lorem, ipsum.
                            Lorem.</pre>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 p-1">
                    <div className="bg-slate-950/50 rounded-lg p-2 text-xs text-cyan-500 font-medium">
                        Created: <span className="text-slate-300 font-light text-xs text-wrap"> 2024 sept 1</span> <br />
                        Updated: <span className="text-slate-300 font-light text-xs text-wrap"> 2024 sept 20</span>
                    </div>
                </div>
            </div>
            <div className="bg-slate-950/50 rounded-lg p-3 m-1">
                <div className="flex items-center justify-between mb-2">
                    <h3 className='text-xs font-light text-slate-300 mb-1'>Client Projects</h3>
                    <RegionAndAreaFilter currentUser={{}} setArea={setArea} setRegion={setRegion} placeholder='All Regions' />
                </div>
                <div className="flex flex-wrap items-center">
                    <div className="w-full lg:w-4/12 p-1">
                        <ProjectCard project={{}} userRole={''} />
                    </div>
                    {/* <h1 className='text-xs text-slate-400'>No Projects Under this Client.</h1> */}
                </div>
            </div>
        </div>
    )
}

export default StaffClientId