/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { ProjectCard } from '@/components/admin/ProjectCards'
import UpdateClientDialog from '@/components/client/UpdateClientDialog'
import RegionAndAreaFilter from '@/components/shared/RegionAndAreaFilter'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Input, Popconfirm, Popover, Skeleton, Tooltip } from 'antd'
import { Button } from '@/components/ui/button'
import { useClientOnView, useDeleteClient, useDeleteContactCard, useGetClientById, useUpdateContactCard } from '@/query/client/clientQueries'
import { formatDateTiny } from '@/lib/utils'
import ProjectCardsSkeleton from '@/components/skeletons/ProjectCardsSkeleton'
import { useFindUserById } from '@/query/client/userQueries'
import { useInView } from 'react-intersection-observer'
import { EditIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import AddContactCard from '@/components/client/AddContactCard'

const StaffClientId = ({ params }: { params: { clientid: string } }) => {
    const { data: session }: any = useSession();
    const [area, setArea] = useState('');
    const [region, setRegion] = useState('');
    const router = useRouter();
    const { data: currentUser, isLoading: loadingUser } = useFindUserById(session?.user?.id);
    const { data: clientData, isLoading: loadingClient } = useGetClientById(params.clientid);
    const { mutateAsync: updateContactCard, isPending: updatingContactCard } = useUpdateContactCard();
    const { mutateAsync: deleteContactCard, isPending: deletingContactCard } = useDeleteContactCard();
    const { mutateAsync: deleteClient, isPending: deletingClient } = useDeleteClient();
    const [contactDetails, setContactDetails] = useState<{ id: string; name: string; email: string; designation: string; phone: string; } | null>(null);

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

    const handleUpdateSelect = (contact: any) => {
        setContactDetails({
            id: contact?._id,
            name: contact?.Name,
            email: contact?.Email,
            designation: contact?.Designation,
            phone: contact?.Phone
        })
    }

    const handleUpdateContactInfo = async (contactId: string | undefined) => {
        const formData = new FormData();
        formData.append('contactForm', JSON.stringify({
            clientId: params?.clientid,
            cardId: contactId,
            Name: contactDetails?.name,
            Email: contactDetails?.email,
            Phone: contactDetails?.phone,
            Designation: contactDetails?.designation,
        }))
        const response = await updateContactCard(formData);
        if (response?._id) {
            setContactDetails(null)
            return toast.success("Contact Card Successfull Updated.")
        } else {
            return toast.error("Contact Not Updated Something Went Wrong.")
        }
    }

    const handleDeleteContactCard = async (cardid: string) => {
        const response = await deleteContactCard({ clientId: params.clientid, cardId: cardid });
        if (response?._id) {
            return toast.success("Card Successfully Deleted.")
        } else {
            return toast.error("Something went wrong on card deletion.")
        }
    }

    const handleDeleteClient = async () => {
        const response = await deleteClient(params.clientid);
        if (response?._id) {
            router.push(`/${currentUser?.Role == 'admin' ? 'admin' : 'staff'}/clients`)
            return toast.success("Client Deleted Successfully!")
        } else {
            return toast.error("Something went wrong on deleting client!!", { description: "please inform to development team." })
        }
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
                        <BreadcrumbPage>{clientData?.ShortName}</BreadcrumbPage>
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
                        <Popconfirm title="Delete Client ?" description="Projects and tasks assosiated with this client will also be deleted ?" overlayClassName='w-[280px]' onConfirm={handleDeleteClient}><Button className='bg-red-700 hover:bg-red-600 text-white'>{'Delete'}</Button></Popconfirm>
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
                            <Tooltip title={<div className='flex gap-2'>
                                <Popconfirm title="Are You Sure To Delete This Contact  ?" onConfirm={() => handleDeleteContactCard(contact?._id)}><Trash2Icon size={20} className='cursor-pointer text-red-600 hover:text-slate-400' /></Popconfirm>
                                <Popover
                                    content={
                                        <div className='flex flex-col gap-1'>
                                            <Input className='w-[300px]' placeholder='Contact Name' value={contactDetails?.name} onChange={(e) => setContactDetails((prev: any) => { return { ...prev, name: e.target.value } })} />
                                            <Input className='w-[300px]' placeholder='Contact Designation' value={contactDetails?.designation} onChange={(e) => setContactDetails((prev: any) => { return { ...prev, designation: e.target.value } })} />
                                            <Input className='w-[300px]' placeholder='Contact Email' value={contactDetails?.email} onChange={(e) => setContactDetails((prev: any) => { return { ...prev, email: e.target.value } })} />
                                            <Input className='w-[300px]' placeholder='Contact Phone' value={contactDetails?.phone} onChange={(e) => setContactDetails((prev: any) => { return { ...prev, phone: e.target.value } })} />
                                            <Button variant='secondary' onClick={() => handleUpdateContactInfo(contactDetails?.id)}>{updatingContactCard ? "Updating.." : 'Update.'}</Button>
                                        </div>
                                    }
                                    title="Add Skill"
                                    placement='bottom'
                                    trigger='click'
                                ><EditIcon onClick={() => handleUpdateSelect(contact)} size={20} className='cursor-pointer text-cyan-500 hover:text-slate-400' /></Popover>
                            </div>}>
                                <div className='bg-slate-950/50 rounded-lg p-2 border border-dashed border-slate-700'>
                                    <h1 className='text-cyan-500 text-xs font-medium flex gap-1'>Name: <span className='text-slate-300 font-normal'>{contact?.Name}</span></h1>
                                    <h1 className='text-cyan-500 text-xs font-medium flex gap-1'>Designation: <span className='text-slate-300 font-normal'>{contact?.Designation}</span></h1>
                                    <h1 className='text-cyan-500 text-xs font-medium flex gap-1'>Email: <span className='text-slate-300 font-normal'>{contact?.Email}</span></h1>
                                    <h1 className='text-cyan-500 text-xs font-medium flex gap-1'>Phone: <span className='text-slate-300 font-normal'>{contact?.Phone}</span></h1>
                                </div>
                            </Tooltip>
                        </div>
                    ))}
                    <div className="w-full lg:w-3/12 p-1">
                        <AddContactCard clientid={params.clientid} trigger={
                            <div className='bg-slate-950/50 cursor-pointer flex gap-1 items-center justify-center hover:bg-white hover:text-black w-full h-full rounded-lg p-2 border border-dashed border-slate-700'>
                                <PlusIcon />
                                <span>Add Card</span>
                            </div>
                        } />
                    </div>
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