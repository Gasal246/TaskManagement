"use client"
import UpdateClientDialog from '@/components/client/UpdateClientDialog'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import RegionAndAreaFilter from '@/components/shared/RegionAndAreaFilter'
import { ProjectCard } from '@/components/admin/ProjectCards'
import { useSession } from 'next-auth/react'
import { useFindUserById } from '@/query/client/userQueries'
import { useDeleteClient, useGetClientById } from '@/query/client/clientQueries'
import ProjectCardsSkeleton from '@/components/skeletons/ProjectCardsSkeleton'
import LoaderSpin from '@/components/shared/LoaderSpin'
import { Popconfirm } from 'antd'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const ClientIdPage = ({ params }: { params: { clientid: string } }) => {
    const router = useRouter();
    const [area, setArea] = useState('');
    const [region, setRegion] = useState('');
    const { data: session }: any = useSession();
    const { data: currentUser, isLoading: loadingCurrentUser } = useFindUserById(session?.user?.id);
    const { data: clientData, isLoading: loadingClientData } = useGetClientById(params.clientid);
    const { mutateAsync: deleteClient, isPending: deletingClient } = useDeleteClient();

    const handleDeleteClient = async (clientid: string) => {
        try{
            const response = await deleteClient(clientid);
            if(response?._id){
                router.replace(`/${currentUser?.Role == 'admin' ? 'admin' : 'staff'}/clients`)
                return toast.success("Client Deleted Successfully.");
            }else{
                throw new Error(response)
            }
        }catch (error) {
            return toast.error("Something went wrong: Delete Client.", { description: `${error}`});
        }
    }

    return (
        <div className={`p-4 overflow-y-scroll ${deletingClient && 'blur-lg'}`}>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/admin/clients">All Clients</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{clientData?.Name || <LoaderSpin size={22} />}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="bg-slate-950/50 rounded-lg p-3 mt-2 flex items-center justify-between mb-1 m-1">
                <h1 className='font-medium'>{clientData?.Name || <LoaderSpin size={22} />}</h1>
                <div className="flex gap-2 items-center">
                    {clientData ? <UpdateClientDialog clientData={clientData} currentUser={currentUser} /> : <LoaderSpin size={24}/>}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Popconfirm title="Delete Client ?" description="Projects and tasks assosiated with this client will also be deleted ?" overlayClassName='w-[280px]' onConfirm={() => handleDeleteClient(clientData?._id)}><Button className='bg-red-700 hover:bg-red-600 text-white'>{deletingClient ? 'Deleting..' : 'Delete'}</Button></Popconfirm>
                    </motion.div>
                </div>
            </div>
            <div className="flex flex-wrap mb-1">
                <div className="w-full lg:w-1/2 p-1">
                    <div className="bg-slate-950/50 rounded-lg p-3">
                        <h3 className='text-xs font-light text-slate-300'>Email</h3>
                        <h3 className="text-sm font-medium text-slate-200">{clientData?.Email || <LoaderSpin size={22} />}</h3>
                    </div>
                </div>
                <div className="w-full lg:w-1/2 p-1">
                    <div className="bg-slate-950/50 rounded-lg p-3">
                        <h3 className='text-xs font-light text-slate-300'>Region, Area</h3>
                        <h3 className="text-sm font-medium text-slate-200">{clientData?.Region?.RegionName || <LoaderSpin size={22} />}, {clientData?.Area?.Areaname}</h3>
                    </div>
                </div>
            </div>
            <div className="bg-slate-950/50 rounded-lg p-3 m-1 mb-2">
                <h3 className='text-xs font-light text-slate-300 mb-1'>Address & Details</h3>
                <pre className={`text-sm text-wrap text-slate-200`}>{clientData?.Details || <LoaderSpin size={22} />}</pre>
            </div>
            <div className="bg-slate-950/50 rounded-lg p-3 m-1">
                <div className="flex items-center justify-between mb-2">
                    <h3 className='text-xs font-light text-slate-300 mb-1'>Client Projects</h3>
                    <RegionAndAreaFilter currentUser={{}} setArea={setArea} setRegion={setRegion} placeholder='All Regions' />
                </div>
                <div className="flex flex-wrap items-center">
                    {loadingClientData && <ProjectCardsSkeleton />}
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

export default ClientIdPage