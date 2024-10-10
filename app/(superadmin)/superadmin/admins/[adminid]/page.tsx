/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { Button } from '@/components/ui/button'
import { useChangeAdminStatus, useDeleteAdmin, useDeleteAdminDep, useDeleteAdminDoc, useFindAdminByAdminId, useGetAdminUsers } from '@/query/client/superuserQueries'
import { Avatar, Popconfirm, Tooltip } from 'antd'
import React, { useEffect } from 'react'
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { DotsHorizontalIcon, TrashIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { CircleCheckBig, FilePlus2, MapPinned, OctagonX, PencilRuler, Trash2, Trash2Icon, Users } from 'lucide-react'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import EditDepartmentDialog from '@/components/super/EditDepartmentDialog'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"
import EditAdminDialog from '@/components/super/EditAdminDialog'
import { formatDateTiny, formatNumber } from '@/lib/utils'
import AddAdminDocumentsDialog from '@/components/super/AddAdminDocumentsDialog'
import { AdminCountBoxSkelton, DepartmentsLoadingSkelton, ProfileInfoSkelton } from './skeletons'
import ShowAdminUsers from '@/components/super/ShowAdminUsers'
import AddMoreDepDialog from '@/components/super/AddMoreDepDialog'
import { deleteObject, ref } from 'firebase/storage'
import { storage } from '@/firebase/config'

const AdminPage = ({ params }: { params: { adminid: string } }) => {
  const router = useRouter();
  const { data: adminData, isLoading: adminDataLoading } = useFindAdminByAdminId(params.adminid);
  const { mutateAsync: changeAdminStatus, isPending: changingAdminStatus } = useChangeAdminStatus();
  const { mutateAsync: deleteAdmin, isPending: deletingAdmin } = useDeleteAdmin();
  const { mutateAsync: deleteAdminDoc, isPending: deletingAdminDoc } = useDeleteAdminDoc();
  const { mutateAsync: deleteAdminDep, isPending: deletingAdminDep } = useDeleteAdminDep();

  const handleStatusChange = async (value: any) => {
    const response = await changeAdminStatus({ adminid: params.adminid, status: value });
  }

  const handleDeleteAdmin = async () => {
    const response = await deleteAdmin(params.adminid);
    if (response?._id) {
      router.replace('/superadmin/admins');
      return toast.success("Complete Admin Data Erased...")
    } else {
      return toast.error("Delete failed some steps.")
    }
  }

  const handleDeleteDocument = async ( docId: string, docUrl: string) => {
    try {
      const formData = new FormData();
      formData.append('adminId', adminData?._id);
      formData.append('docId', docId);
      formData.append('docUrl', docUrl);
      const fileRef = ref(storage, docUrl);
      await deleteObject(fileRef);
      const response = await deleteAdminDoc(formData);
      if (response?._id) {
        return toast.success('Admin Document Deleted.')
      }
    } catch (error) {
      console.log(error);
      return toast.error("Something went wrong on deleting document.")
    }
  }

  const handleDeleteDeparment = async (depid: string) => {
    const formData = new FormData();
    formData.append('depId', depid);
    formData.append('adminId', adminData?._id);
    const response = await deleteAdminDep(formData);
    if (response?._id) {
      return toast.success("Department Successfully Deleted.")
    }
  }

  return (
    <div className="w-full h-screen overflow-y-scroll p-5 pb-20">
      <Breadcrumb className='mb-2'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/superadmin/admins">Admin Management</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{adminData?.AdminId?.Name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        {adminDataLoading ? <ProfileInfoSkelton /> : <div className='flex items-center gap-1'>
          <Avatar src={adminData?.AdminId?.AvatarUrl} size={45} />
          <div>
            <h1 className='font-bold text-xl'>{adminData?.AdminId?.Name} <Badge variant={adminData?.AdminId?.Status == 'active' ? "outline" : "destructive"}>{changingAdminStatus ? 'changing...' : (adminData?.AdminId?.InitialEntry ? 'initial' : adminData?.AdminId?.Status)}</Badge></h1>
            <h2 className="text-sm">{adminData?.AdminId?.Email}</h2>
          </div>
        </div>}
        <div className="flex">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline"><DotsHorizontalIcon /></Button>
            </PopoverTrigger>
            <PopoverContent className="w-32 p-1 space-y-1">
              <EditAdminDialog
                trigger={<span> Edit Admin</span>}
                adminData={adminData?.AdminId}
              />
              <DropdownMenu>
                <DropdownMenuTrigger className='text-sm font-medium bg-slate-800 hover:bg-slate-700 p-1 w-full rounded-sm'>Change Status</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={adminData?.AdminId?.Status} onValueChange={handleStatusChange}>
                    <DropdownMenuRadioItem value="active">active</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="blocked">blocked</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialog>
                <AlertDialogTrigger className='text-sm font-light bg-red-900 hover:bg-red-800 p-1 w-full rounded-sm flex gap-1 items-center justify-center'>Delete <Trash2Icon size={16} /></AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure to Delete Admin?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your admin account
                      and remove all data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAdmin}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {adminDataLoading ? <AdminCountBoxSkelton /> :
        <div className="flex flex-wrap mt-5">
          <div className="w-full md:w-2/12 p-1">
            <ShowAdminUsers trigger={
              <Tooltip title="view all users"><motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-slate-900 border-slate-600 border p-3 rounded-md aspect-auto cursor-pointer select-none">
                <h2 className='text-sm font-medium'>Total Users</h2>
                <div className="justify-center items-center">
                  <h1 className='text-center text-[4em] font-black '>{formatNumber(adminData?.adminUsers?.length || 0)}</h1>
                </div>
              </motion.div></Tooltip>
            } adminData={adminData} />
          </div>
          <div className="w-full md:w-2/12 p-1">
            <div className="bg-slate-900 border-slate-600 border p-3 rounded-md aspect-auto">
              <h2 className='text-sm font-medium'>Total Projects</h2>
              <div className="justify-center items-center">
                <h1 className='text-center text-[4em] font-black '>{formatNumber(adminData?.projectCount || 0)}</h1>
              </div>
            </div>
          </div>
          <div className="w-full md:w-2/12 p-1">
            <div className="bg-slate-900 border-slate-600 border p-3 rounded-md aspect-auto">
              <h2 className='text-sm font-medium'>Total Tasks</h2>
              <div className="justify-center items-center">
                <h1 className='text-center text-[4em] font-black '>{formatNumber(adminData?.taskCount || 0)}</h1>
              </div>
            </div>
          </div>
        </div>}

      <h1 className='mt-5 font-semibold'>Departments</h1>
      {adminDataLoading ? <DepartmentsLoadingSkelton /> : <div className="flex flex-wrap mb-2">
        {
          adminData?.Departments?.map((department: any) => (
            <div className="w-3/12 p-1" key={department?._id}>
              <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }} className="w-full bg-slate-800 rounded-md p-2 hover:shadow-md border-slate-600 border cursor-pointer relative">
                <div className="absolute top-2 right-2 z-20"><EditDepartmentDialog
                  trigger={<Tooltip title="Edit" placement='left'><PencilRuler size={18} /></Tooltip>}
                  departmentId={department?._id}
                /></div>
                <h1 className='text-sm font-semibold'>{department?.DepartmentName}</h1>
                <h3 className='text-xs text-slate-300 mb-1'>{department?.DepartmentHead ? department?.DepartmentHead?.Email : 'no head added'}</h3>
                <li className='text-xs flex gap-1 text-slate-400'>{department?.AllowProjects ? <CircleCheckBig size={14} strokeWidth={2} /> : <OctagonX size={14} strokeWidth={2} />} - Allow Projects </li>
                <li className='text-xs flex gap-1 text-slate-400'>{department?.AllowTasks ? <CircleCheckBig size={14} strokeWidth={2} /> : <OctagonX size={14} strokeWidth={2} />} - Allow Tasks </li>
                <li className='text-xs flex gap-1 text-slate-400'><Users size={12} /> - total staffs: {department?.MaximumStaffs} </li>
                <div className="flex justify-end space-x-2 mr-1">
                  <Tooltip title={`${department?.Staffs?.length} staffs`}><li className='text-xs flex gap-1 text-slate-400'><Users size={14} /> {department?.Staffs?.length},</li></Tooltip>
                  <Tooltip title={`${department?.Regions?.length} regions`}><li className='text-xs flex gap-1 text-slate-400'><MapPinned size={14} /> {department?.Regions?.length}</li></Tooltip>
                  <Popconfirm title="Delete Department ?" description="Are you sure want to delete this department?" onConfirm={() => handleDeleteDeparment(department?._id)}>
                    <h3 className='text-xs text-red-600 underline'>Delete?</h3>
                  </Popconfirm>
                </div>
              </motion.div>
            </div>
          ))
        }
        <div className="w-3/12 p-1">
          <AddMoreDepDialog trigger={
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="cursor-pointer bg-primary border-2 border-slate-900 p-3 justify-center items-center h-full flex rounded-xl">
              <h1 className='flex gap-2 font-bold text-black'>Add More <FilePlus2 /></h1>
            </motion.div>
          } adminId={params.adminid} />
        </div>
      </div>}
      <h4 className='font-medium'>Documents</h4>
      {adminDataLoading ? <DepartmentsLoadingSkelton /> : <div className="flex flex-wrap items-center">
        {adminData?.Documents?.map((doc: any) => (
          <div className="w-full lg:w-3/12 p-1" key={doc?._id}>
            <div className="bg-slate-900 border border-slate-600 p-2 w-full rounded-md">
              <div className="flex justify-between items-center">
              <Link href={doc?.DocUrl} target='_blank' className='w-full '><h1 className="text-sm font-medium">{doc?.DocName}</h1></Link>
                <Popconfirm title="Delete Document" description="Are you sure want to delete this company document ?" onConfirm={() => handleDeleteDocument(doc?._id, doc?.DocUrl)}><motion.div whileHover={{ rotate: -30, scale: 1.05 }} whileTap={{ scale: 0.98 }} className="text-red-700"><Trash2 size={20} /></motion.div></Popconfirm>
              </div>
              <div className="flex justify-between mt-1 items-center">
                <div>
                  <h4 className="text-xs text-slate-400 leading-3">expire at</h4>
                  <h2 className="text-xs font-medium text-slate-300">{formatDateTiny(doc?.ExpireAt)}</h2>
                </div>
                <div>
                  <h4 className="text-xs text-slate-400 leading-3">remind at</h4>
                  <h2 className="text-xs font-medium text-slate-300">{formatDateTiny(doc?.RemindAt)}</h2>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="w-full md:w-3/12 p-2">
          <AddAdminDocumentsDialog trigger={
            <motion.h1 whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="cursor-pointer bg-cyan-700 border border-slate-600 p-2 flex gap-2 items-center text-sm font-semibold text-black justify-center rounded-full">Add Document <FilePlus2 /></motion.h1>
          } adminId={adminData?.AdminId?._id} />
        </div>
      </div>}
    </div>
  )
}

export default AdminPage