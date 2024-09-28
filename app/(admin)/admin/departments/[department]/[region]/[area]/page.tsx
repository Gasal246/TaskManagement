"use client"
import React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"
import { useDeleteDepartmentArea, useGetAreaById, useGetDepartmentById, useGetRegionById } from '@/query/client/adminQueries'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Avatar, Tooltip } from 'antd'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { columns } from "./columns"
import { DataTable } from "./data-table"
import LoaderSpin from '@/components/shared/LoaderSpin'
import { useGetAreaStaffs } from '@/query/client/depQueries'
import TableSkeleton from '@/components/skeletons/TableSkeleton'
import AddAreaStaff from '@/components/admin/AddAreaStaff'

const DepartmentArea = ({ params }: { params: { department: string, region: string, area: string } }) => {
    const router = useRouter();
    const { data: department, isLoading: loadingDepartment } = useGetDepartmentById(params?.department);
    const { data: region, isLoading: loadingRegion } = useGetRegionById(params?.region);
    const { data: area, isLoading: loadingArea } = useGetAreaById(params?.area);
    const { mutateAsync: deleteArea, isPending: deletingArea } = useDeleteDepartmentArea();
    const { data: staffList, isLoading: loadingStaffList } = useGetAreaStaffs(params.department, params.region, params.area);
    const handleDeleteArea = async () => {
        const response = await deleteArea({ depid: params.department, regionid: params.region, areaid: params.area });
        if (response?.deleted) {
            router.replace(`/admin/departments/${params.department}/${params.region}`);
            return toast.success("Area Successfully Removed")
        }
        return toast.error("Deletion Failed due to unkown error.")
    }

    return (
        <div className='p-4 overflow-y-scroll h-screen pb-20'>
            {loadingArea || loadingRegion || loadingDepartment ? <div className="w-full h-full justify-center items-center flex"> <LoaderSpin size={60} /></div> :
                <>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/admin/departments">Departments</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href={`/admin/departments/${params?.department}`}>{department?.DepartmentName}</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href={`/admin/departments/${params?.department}/${params?.region}`}>{region?.RegionName}</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{area?.Areaname}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div className="flex justify-between bg-slate-950/50 p-3 rounded-lg mt-2">
                        <div>
                            <h1 className='font-bold text-2xl mb-2'>{area?.Areaname}</h1>
                            {area?.AreaHead ? <Tooltip title="Area Head">
                                <div className="flex items-center gap-1">
                                    <Avatar src={area?.AreaHead?.AvatarUrl ? `${area?.AreaHead?.AvatarUrl}` : '/avatar.png'} />
                                    <div>
                                        <h1 className='leading-3 text-sm'>{area?.AreaHead?.Name}</h1>
                                        <h1 className='text-xs'>{area?.AreaHead?.Email}</h1>
                                    </div>
                                </div>
                            </Tooltip> : <h1 className="text-xs text-orange-600">no area head added</h1>}
                        </div>
                        <div className="flex gap-2 items-center">
                            <Link href={`/admin/regions/${params?.region}/${params?.area}`}>
                                <motion.h1 whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className='p-1 hover:bg-cyan-950 rounded-sm px-3 border-2 border-slate-400 cursor-pointer'>
                                    Manage Area
                                </motion.h1>
                            </Link>
                            <AddAreaStaff trigger={
                                <motion.h1 whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className='p-1 hover:bg-cyan-950 rounded-sm px-3 border-2 border-slate-400 cursor-pointer'>
                                    Add Staff
                                </motion.h1>
                            } regId={params.region} areaId={params.area} depId={params.department} />

                            <AlertDialog>
                                <AlertDialogTrigger>
                                    <motion.h1 whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className='p-1 hover:bg-red-700 rounded-sm px-3 border-2 border-slate-400 cursor-pointer'>
                                        Delete Area
                                    </motion.h1>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will permanently remove this Area and its data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDeleteArea}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                    <div className="bg-slate-950/50 p-3 mt-2 rounded-lg">
                        <h1 className='text-sm font-medium text-neutral-200'>Regional Staffs</h1>
                        {loadingStaffList && <TableSkeleton />}
                        {staffList && <DataTable data={staffList?.Staffs} columns={columns} />}
                    </div></>
            }
        </div>
    )
}

export default DepartmentArea