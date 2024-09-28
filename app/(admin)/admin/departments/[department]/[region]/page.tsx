"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"
import AddDepartmentArea from '@/components/admin/AddDepartmentArea'
import Link from 'next/link'
import { LandPlot } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useDeleteDepartmentRegion, useGetDepartmentById, useGetDepartmentRegion, useGetRegionById } from '@/query/client/adminQueries'
import { Avatar, Tooltip } from 'antd'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { toast } from 'sonner'
import LoaderSpin from '@/components/shared/LoaderSpin'
import { useGetRegionalStaffs } from '@/query/client/depQueries'
import TableSkeleton from '@/components/skeletons/TableSkeleton'
import { DataTable } from '../data-table'
import { columns } from './columns'
import AddRegionalStaff from '@/components/admin/AddRegionalStaff'

const DepartmentRegion = ({ params }: { params: { department: string, region: string } }) => {
  const router = useRouter()
  const { data: departmentRegion, isLoading: loadingDepartmentRegion } = useGetDepartmentRegion(params.department, params.region);
  const { data: department, isLoading: loadingDepartment } = useGetDepartmentById(params.department);
  const { mutateAsync: deleteRegion, isPending: deletingRegion } = useDeleteDepartmentRegion();
  const { data: regionalStaffs, isLoading: loadingRegStaffs } = useGetRegionalStaffs(params.department, params.region);
  const handleDeleteRegion = async () => {
    const response = await deleteRegion({ depid: params?.department, regionid: params?.region });
    if (response?._id) {
      router.replace(`/admin/departments/${params.department}`)
      return toast.success("Region Successfully Deleted.")
    }
    return toast.error("Region Deletion Failed.")
  }
  return (
    <div className='p-4 overflow-y-scroll h-screen pb-20'>
      {loadingDepartment || loadingDepartmentRegion ? <div className="w-full h-full justify-center items-center flex"> <LoaderSpin size={60} /></div> :
        <>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/departments">departments</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/admin/departments/${params?.department}`}>{department?.DepartmentName}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{departmentRegion?.RegionId?.RegionName}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex justify-between items-center bg-slate-950/40 p-3 rounded-lg mt-2">
            <div>
              <h1 className='font-bold text-2xl mb-2 text-neutral-200'>Region {departmentRegion?.RegionId?.RegionName}</h1>
              {departmentRegion?.RegionId?.RegionHead ? <Tooltip title="Area Head">
                <div className="flex items-center gap-1">
                  <Avatar src={departmentRegion?.RegionId?.RegionHead?.AvatarUrl ? `${departmentRegion?.RegionId?.RegionHead?.AvatarUrl}` : '/avatar.png'} />
                  <div>
                    <h1 className='leading-3 text-sm'>{departmentRegion?.RegionId?.RegionHead?.Name}</h1>
                    <h1 className='text-xs'>{departmentRegion?.RegionId?.RegionHead?.Email}</h1>
                  </div>
                </div>
              </Tooltip> : <h1 className="text-xs text-orange-600">no region head added</h1>}
            </div>
            <div className="flex gap-2">
              <AddDepartmentArea trigger={
                <motion.h1 whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className='p-1 hover:bg-cyan-950 rounded-lg px-6 border-2 border-slate-400 cursor-pointer'>
                  Add Areas
                </motion.h1>
              } departmentId={params.department} regionId={params.region} />
              <AddRegionalStaff trigger={
                <motion.h1 whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className='p-1 hover:bg-cyan-950 rounded-lg px-6 border-2 border-slate-400 cursor-pointer'>
                  Add Staffs
                </motion.h1>
              } depId={params.department} regId={params.region} />
              <Link href={`/admin/regions/${params.region}`}>
                <motion.h1 whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className='p-1 hover:bg-cyan-950 rounded-lg px-6 border-2 border-slate-400 cursor-pointer'>
                  Manage Region
                </motion.h1>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger>
                  <motion.h1 whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className='p-1 hover:bg-red-700 rounded-lg px-6 border-2 border-slate-400 cursor-pointer'>
                    Delete Region
                  </motion.h1>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove this Region and its data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteRegion}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <div className="bg-slate-950/40 p-3 rounded-lg mt-2">
            <h1 className='mb-2 text-neutral-200'>Department Areas ({departmentRegion?.Areas?.length})</h1>
            <div className='flex flex-wrap'>
              {
                departmentRegion?.Areas?.map((area: any) => (
                  <div className="w-full md:w-3/12 p-1" key={area?._id}>
                    <Link href={`/admin/departments/${params?.department}/${params?.region}/${area?._id}`}>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full h-full bg-sky-700 p-2 flex items-center justify-center gap-1 rounded-sm hover:shadow-md cursor-pointer">
                        <LandPlot size={18} />
                        <h1>{area?.Areaname}</h1>
                      </motion.div>
                    </Link>
                  </div>
                ))
              }
            </div>
          </div>
          <div className="bg-slate-950/50 p-3 mt-2 rounded-lg">
            <h1 className='text-sm font-medium text-neutral-200'>Regional Staffs</h1>
            {loadingRegStaffs && <TableSkeleton />}
            {regionalStaffs && <DataTable columns={columns} data={regionalStaffs?.Staffs} />}
          </div>
        </>
      }
    </div>
  )
}

export default DepartmentRegion