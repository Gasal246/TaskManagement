/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { ProjectCard } from '@/components/admin/ProjectCards'
import UpdateClientDialog from '@/components/client/UpdateClientDialog'
import RegionAndAreaFilter from '@/components/shared/RegionAndAreaFilter'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Popconfirm, Skeleton } from 'antd'
import { Button } from '@/components/ui/button'
import { useClientOnView, useGetClientById } from '@/query/client/clientQueries'
import { formatDateTiny } from '@/lib/utils'
import ProjectCardsSkeleton from '@/components/skeletons/ProjectCardsSkeleton'
import { useFindUserById } from '@/query/client/userQueries'
import { useInView } from 'react-intersection-observer'

const StaffClientId = ({ params }: { params: { clientid: string } }) => {
    const { data: session }: any = useSession();
    const [area, setArea] = useState('');
    const [region, setRegion] = useState('');
    const { data: currentUser, isLoading: loadingUser } = useFindUserById(session?.user?.id);
    const { data: clientData, isLoading: loadingClient } = useGetClientById(params.clientid);

    const { ref, inView } = useInView();
    const { mutate: executeClientOnView, isPending: pendingClientOnView } = useClientOnView()
    const handleClientOnView = async () => {
        executeClientOnView(params?.clientid)
    }
    useEffect(() => {
        if (inView) {
            handleClientOnView()
        }
    }, [inView])

    const handleDeleteClient = async (clientid: string) => {

    }

    return (
        <div className='p-4' ref={ref}>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/staff/clients">All Clients</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{clientData?.Name}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="mt-3 bg-slate-950/50 rounded-lg p-3 flex justify-between flex-wrap items-center mb-1">
                <div>
                    <h1 className='leading-5 text-slate-200'>{clientData?.ShortName}</h1>
                    <h4 className='text-sm text-slate-300 mt-1'>{clientData?.FullName}</h4>
                </div>
                <div className="p-1 flex gap-1 items-center">
                    {clientData ? <UpdateClientDialog clientData={clientData} currentUser={currentUser} /> : <Skeleton className='w-[130px] rounded-lg h-[30px]' />}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Popconfirm title="Delete Client ?" description="Projects and tasks assosiated with this client will also be deleted ?" overlayClassName='w-[280px]' onConfirm={() => handleDeleteClient('clientid')}><Button className='bg-red-700 hover:bg-red-600 text-white'>{'Delete'}</Button></Popconfirm>
                    </motion.div>
                </div>
            </div>
            <div className="flex flex-wrap">
                <div className="w-full lg:w-1/2 p-1">
                    <div className="bg-slate-950/50 rounded-lg p-2 text-xs text-cyan-500 font-medium">
                        Region/Area: <pre className='text-slate-300 font-light text-sm'>{clientData?.Region?.RegionName}/{clientData?.Area?.Areaname}</pre>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 p-1">
                    <div className="bg-slate-950/50 rounded-lg p-2 text-xs text-cyan-500 font-medium">
                        Created: <span className="text-slate-300 font-light text-xs text-wrap"> {formatDateTiny(clientData?.createdAt)}</span> <br />
                        Updated: <span className="text-slate-300 font-light text-xs text-wrap"> {formatDateTiny(clientData?.updatedAt)}</span>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 p-1">
                    <div className="bg-slate-950/50 rounded-lg p-2 text-xs text-cyan-500 font-medium">
                        Other Info:
                        <pre className="text-slate-300 font-light text-sm text-wrap">{clientData?.Details}</pre>
                    </div>
                </div>
            </div>
            <div className="bg-slate-950/50 p-3 rounded-lg m-1 mb-2">
                <h1 className='text-sm font-medium text-cyan-500'>Contact Cards</h1>
                <div className="w-full flex flex-wrap">
                    {clientData?.ContactInfo?.map((contact: any) => (
                        <div key={contact?._id} className="w-full lg:w-3/12 p-1">
                            <div className='bg-slate-950/50 rounded-lg p-2 border border-dashed border-slate-700'>
                                <h1 className='text-cyan-500 text-xs font-medium flex gap-1'>Name: <span className='text-slate-300 font-normal'>{contact?.Name}</span></h1>
                                <h1 className='text-cyan-500 text-xs font-medium flex gap-1'>Designation: <span className='text-slate-300 font-normal'>{contact?.Designation}</span></h1>
                                <h1 className='text-cyan-500 text-xs font-medium flex gap-1'>Email: <span className='text-slate-300 font-normal'>{contact?.Email}</span></h1>
                                <h1 className='text-cyan-500 text-xs font-medium flex gap-1'>Phone: <span className='text-slate-300 font-normal'>{contact?.Phone}</span></h1>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="bg-slate-950/50 rounded-lg p-3 m-1">
                <div className="flex items-center justify-between mb-2">
                    <h3 className='text-xs font-light text-slate-300 mb-1'>Client Projects</h3>
                    <RegionAndAreaFilter currentUser={{}} setArea={setArea} setRegion={setRegion} placeholder='All Regions' />
                </div>
                <div className="flex flex-wrap items-center">
                    {loadingClient && <ProjectCardsSkeleton />}
                    {clientData?.Projects?.map((project: any) => (
                        <div className="w-full lg:w-3/12 p-1" key={project?._id}>
                            <ProjectCard project={project} userRole={currentUser?.Role} />
                        </div>
                    ))}
                    {clientData?.Projects?.length <= 0 && <h1 className='text-xs text-slate-400'>No Projects Under this Client.</h1>}
                </div>
            </div>
        </div>
    )
}

export default StaffClientId