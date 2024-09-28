"use client"
import React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"
import { motion } from 'framer-motion'
import AddAreaDialog from '@/components/admin/AddAreaDialog'
import { LandPlot } from 'lucide-react'
import { useDeleteRegion, useGetAllAreas, useGetRegionById } from '@/query/client/adminQueries'
import LoaderSpin from '@/components/shared/LoaderSpin'
import AddRegionalHeadDialog from '@/components/admin/AddRegionalHeadDialog'
import { Avatar, Tooltip } from 'antd'
import EditRegionDialog from '@/components/admin/EditRegionDialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const RegionPage = ({ params }: { params: { region: string } }) => {
    const router = useRouter();
    const { data: regionData, isLoading: regionLoading } = useGetRegionById(params.region);
    const { data: allAreas, isLoading: areasLoading } = useGetAllAreas(params?.region);
    const { mutateAsync: deleteRegion, isPending: deletingRegion } = useDeleteRegion();

    const handleDeleteRegion = async () => {
        const response = await deleteRegion(params?.region);
        if (response?._id) {
            router.push('/admin/regions')
            return toast.success("Region Deleted Successfully.")
        }
        return toast.error("Region Not Deleted..", {
            description: "Unknown error! please try again.."
        })
    }

    return (
        <div className='p-4 overflow-y-scroll h-full pb-20'>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/admin/regions">Manage Regions</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{regionLoading ? <LoaderSpin size={20} /> : regionData?.RegionName}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex justify-between my-3 items-center flex-wrap mb-4 bg-slate-950/50 p-3 rounded-lg">
                <div className=''>
                    <h1 className='font-bold text-2xl flex gap-1 mb-1'>Region {regionLoading ? <LoaderSpin size={20} /> : regionData?.RegionName}</h1>
                    <div className="flex gap-1 items-center">
                        <Avatar src={regionData?.RegionHead?.AvatarUrl || '/avatar.png'} />
                        <div>
                            <h2 className='font-medium flex gap-1 leading-4'>{regionData?.RegionHead?.Name}</h2>
                            <h2 className='font-medium text-xs flex gap-1'>{regionData?.RegionHead?.Email}</h2>
                        </div>
                    </div>
                    <h2 className='font-medium text-xs flex gap-1 text-orange-300'>{!regionData?.RegionHead && 'no Head for this region.'}</h2>
                </div>
                {regionData && <div className="flex gap-1 flex-wrap">
                    <AddRegionalHeadDialog
                        trigger={<motion.h1 whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className='p-1 hover:bg-cyan-950 bg-slate-800 rounded-lg px-6 border border-slate-400 cursor-pointer'>
                            Update Region Head
                        </motion.h1>} regionId={regionData?._id}
                    />
                    <AddAreaDialog trigger={
                        <motion.h1 whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className='p-1 hover:bg-cyan-950 bg-slate-800 rounded-lg px-6 border border-slate-400 cursor-pointer'>
                            Add Area
                        </motion.h1>
                    } regionId={regionData?._id} />
                    <EditRegionDialog trigger={
                        <motion.h1 whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className='p-1 hover:bg-slate-900 bg-slate-800 rounded-lg px-6 border border-slate-400 cursor-pointer'>
                            Edit
                        </motion.h1>
                    } regionData={regionData} />
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <motion.h1 whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className='p-1 hover:bg-red-900 bg-slate-800 rounded-lg px-6 border border-slate-400 cursor-pointer'>
                                Delete
                            </motion.h1>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your region
                                    and remove all related data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteRegion}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>}
            </div>
            <div className="bg-slate-950/50 p-3 rounded-lg">
                <h1 className='flex items-center gap-1'>{allAreas?.length > 0 ? 'Added areas:' : 'No Areas Added'} {areasLoading && <LoaderSpin size={30} />}</h1>
                <div className='flex flex-wrap'>
                    {
                        allAreas?.map((area: any) => (
                            <div key={area?._id} className="w-full md:w-3/12 p-1">
                                <Tooltip title="click to edit & add area head">
                                    <motion.div onClick={() => router.push(`/admin/regions/${params?.region}/${area?._id}`)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full h-full bg-sky-700 p-2 flex items-center justify-center gap-1 rounded-sm hover:shadow-md cursor-pointer">
                                        <LandPlot size={18} />
                                        <h1>{area?.Areaname}</h1>
                                    </motion.div>
                                </Tooltip>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default RegionPage