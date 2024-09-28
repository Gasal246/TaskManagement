"use client"
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"
import AddDepartmentRegion from '@/components/admin/AddDepartmentRegion'
import { Earth, PencilRuler, Percent, SquareCheckBig, SquareX } from 'lucide-react'
import { useGetDepartmentById } from '@/query/client/adminQueries'
import LoaderSpin from '@/components/shared/LoaderSpin'
import { Avatar, Tooltip } from 'antd'
import AddDepartmentHead from '@/components/admin/AddDepartmentHead'
import AddDepStaff from '@/components/admin/AddDepStaff'
import { DataTable } from './data-table'
import { columns } from './columns'
import EditDepartmentName from '@/components/admin/EditDepartmentName'
import { calculatePercentage } from '@/lib/utils'


const Department = ({ params }: { params: { department: string } }) => {
    const { data: department, isLoading: loadingDepartment } = useGetDepartmentById(params?.department);
    return (
        <div className='p-4 pb-20'>
            {
                loadingDepartment ? <div className="w-full h-full justify-center items-center flex"> <LoaderSpin size={60} /></div> :
                    <>
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/admin/departments">Departments</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{loadingDepartment ? <LoaderSpin size={20} /> : department?.DepartmentName}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <div className="flex justify-between bg-slate-950/40 p-3 rounded-lg mt-2">
                            <div>
                                <div className="">
                                    <h1 className='font-bold text-2xl flex items-center gap-1 '>{department?.DepartmentName} <EditDepartmentName trigger={<Tooltip title="edit name"><PencilRuler size={14} className='text-orange-300 hover:text-slate-950' /></Tooltip>} department={department} /></h1>
                                    <div className="flex gap-3 items-center mb-3">
                                        {<h4 className={`${department?.AllowProjects ? 'text-green-300' : 'text-red-300'} text-xs font-medium flex items-center gap-1`}>Allowed Projects {department?.AllowProjects ? <SquareCheckBig size={16} /> : <SquareX size={16} />}</h4>}
                                        {<h4 className={`${department?.AllowTasks ? 'text-green-300' : 'text-red-300'} text-xs font-medium flex items-center gap-1`}>Allowed Tasks {department?.AllowTasks ? <SquareCheckBig size={16} /> : <SquareX size={16} />}</h4>}
                                    </div>
                                </div>
                                <Tooltip title="Department Head" placement='right'>
                                    <div className="flex gap-1 items-center">
                                        {department?.DepartmentHead && <Avatar src={`${department?.DepartmentHead?.AvatarUrl ? department?.DepartmentHead?.AvatarUrl : '/avatar.png'}`} size={40} />}
                                        {
                                            department?.DepartmentHead ?
                                                <div>
                                                    <h1 className='font-medium text-sm leading-3'>{department?.DepartmentHead?.Name}</h1>
                                                    <h1 className='font-medium text-xs'>{department?.DepartmentHead?.Email}</h1>
                                                </div>
                                                : <h1 className="text-xs text-orange-500">no head added to this department</h1>
                                        }
                                    </div>
                                </Tooltip>
                                <div className="flex gap-2 items-center mt-3">
                                    <h1 className='text-xs font-medium bg-black p-2 rounded-sm'>Max Staffs Allowed: <b className='text-blue-400'>{department?.MaximumStaffs}</b></h1>
                                    <h1 className='text-xs font-medium bg-black p-2 rounded-sm'>Total Staffs Added: <b className='text-orange-300'>{department?.staffCount}</b></h1>
                                    <h1 className='text-xs font-medium p-2 rounded-sm'><strong className={`${calculatePercentage(department?.MaximumStaffs, department?.staffCount) >= 70 ? 'text-orange-300' : (calculatePercentage(department?.MaximumStaffs, department?.staffCount) >= 50 ? 'text-blue-400' : 'text-green-600') } flex gap-1 items-center`}>{calculatePercentage(department?.MaximumStaffs, department?.staffCount)} <Percent size={12} /> used</strong></h1>
                                </div>
                            </div>
                            <div className="flex gap-2 items-center">
                                <AddDepartmentRegion trigger={
                                    <motion.h1 whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className='p-1 hover:bg-cyan-950 rounded-sm px-3 border-2 border-slate-400 cursor-pointer'>
                                        Add Dep Region
                                    </motion.h1>
                                } depid={department?._id} />
                                <AddDepartmentHead trigger={
                                    <motion.h1 whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className='p-1 hover:bg-cyan-950 rounded-sm px-3 border-2 border-slate-400 cursor-pointer'>
                                        Add Dep Head
                                    </motion.h1>
                                } departmentId={department?._id} />
                                <AddDepStaff trigger={
                                    <motion.h1 whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className='p-1 hover:bg-cyan-950 rounded-sm px-3 border-2 border-slate-400 cursor-pointer'>
                                        Add Dep Staff
                                    </motion.h1>
                                } depId={department?._id} />
                            </div>
                        </div>
                        <div className='bg-slate-950/40 py-3 px-3 mt-2 rounded-lg'>
                            <h1 className='mb-2'>Department Regions ({department?.Regions?.length})</h1>
                            <div className='flex flex-wrap'>
                                {department?.Regions?.map((region: any) => (
                                    <div className="w-full md:w-3/12 p-1" key={region?._id}>
                                        <Link href={`/admin/departments/${department?._id}/${region?.RegionId?._id}`}>
                                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full h-full bg-sky-700 p-2 flex items-center justify-center gap-1 rounded-sm hover:shadow-md cursor-pointer">
                                                <Earth size={18} />
                                                <h1>{region?.RegionId?.RegionName}</h1>
                                            </motion.div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='bg-slate-950/40 p-4 rounded-lg mt-3 mb-20'>
                            <h1 className='text-sm font-medium'>Department Staffs</h1>
                            {department?.Staffs && <DataTable columns={columns} data={department?.Staffs} />}
                        </div>
                    </>
            }
        </div>
    )
}

export default Department