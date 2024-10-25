"use client"
import React from 'react'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"
import { Avatar, Popconfirm, Tooltip } from 'antd'
import { Button } from '@/components/ui/button'
import { FilePlus2, FileText, Globe2, LandPlot, Plus, SquareX, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatDate, formatDateShortly } from '@/lib/utils'
import ViewStaffDocument from '@/components/admin/ViewStaffDocument'
import { useDeleteStaff, useDeleteStaffDocument, useGetStaff, useRemoveSkill, useUpdateUserStatus } from '@/query/client/adminQueries'
import LoaderSpin from '@/components/shared/LoaderSpin'
import Image from 'next/image'
import AddStaffSkillDialog from '@/components/admin/AddStaffSkillDialog'
import { toast } from 'sonner'
import AddNewDocumentDialog from '@/components/admin/AddNewDocumentDialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { useRouter } from 'next/navigation'
import EditStaffDialog from '@/components/admin/EditStaffDialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu"
import { Badge } from '@/components/ui/badge'
import { deleteObject, ref } from 'firebase/storage'
import { storage } from '@/firebase/config'


const StaffPage = ({ params }: { params: { staffid: string } }) => {
  const router = useRouter();
  const { data: staffData, isLoading: staffLoading } = useGetStaff(params?.staffid);
  const { mutateAsync: removeSkill, isPending: removingSkill } = useRemoveSkill();
  const { mutateAsync: removeDocument, isPending: removingDocument } = useDeleteStaffDocument();
  const { mutateAsync: deleteStaff, isPending: deletingUser } = useDeleteStaff();
  const { mutateAsync: updateStatus, isPending: updatingStatus } = useUpdateUserStatus();

  const handleRemoveSkill = async (skill: string) => {
    const response = await removeSkill({ staffId: params?.staffid, skill: skill });
    if (response?.existing) {
      return toast.error("No Skill Exist like that.");
    }
    return toast.success("Skill Successfully Removed.");
  }

  const handleDeleteDocument = async (docid: string, docUrl: string) => {
    try {
      const fileRef = ref(storage, docUrl);
      await deleteObject(fileRef);
      const response = await removeDocument({ staffid: params.staffid, docid: docid });
      if (response?._id) {
        return toast.success("Document Removed.");
      } else {
        return toast.error("Failed to remove document.")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDeleteStaff = async () => {
    const deleteDocPromises = staffData?.Documents?.map(async (doc: any) => {
      const docRef = ref(storage, doc?.DocUrl);
      await deleteObject(docRef);
    })
    try {
      const response = await deleteStaff(params?.staffid);
      await Promise.all(deleteDocPromises);
      if (staffData?.AvatarUrl) {
        const pfpRef = ref(storage, staffData?.AvatarUrl);
        await deleteObject(pfpRef);
      }
      if (response?._id) {
        router.replace('/admin/staffs')
        return toast.success("Staff Removed Successfully.");
      } else {
        return toast.error("Failed to remove staff.")
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong on deleting staff data.")
    }
  }

  const handleStatusChange = async (value: any) => {
    const response = await updateStatus({ staffid: staffData?._id, status: value });
  }

  return (
    <div className='p-5 overflow-y-scroll pb-20'>
      <Breadcrumb className='mb-3'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/staffs">Manage Staffs</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{staffLoading ? <LoaderSpin size={18} /> : staffData?.Name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {staffLoading || deletingUser ? <div className='flex gap-2 items-center w-full justify-center h-[100dvh]'>
        <h1>{deletingUser ? 'Deleting...' : 'loading...'}</h1>
        <Image src={'/assets/walk.gif'} alt='walkanimation' width={60} height={60} />
        <h1>please wait...</h1>
      </div> : <div className="bg-slate-950/50 p-3 rounded-lg mb-3"> <div className="flex justify-between items-center flex-wrap">
        <div className="flex gap-1 items-center mb-3 bg-slate95">
          <Avatar src={staffData?.AvatarUrl ? `${staffData?.AvatarUrl}` : `/avatar.png`} size={55} />
          <div className="flex flex-col">
            <span className='font-black text-2xl leading-6'>{staffData?.Name}</span>
            <span className='text-sm flex gap-1'>{staffData?.Email} <Badge variant={staffData?.Status == 'blocked' ? "destructive" : "outline"} className={`${staffData?.Status == 'active' && 'border-green-600'} text-[12px] p-0 px-1`}>{updatingStatus ? '...' : staffData?.Status}</Badge></span>
          </div>
        </div>
        <div className="flex gap-1 mb-3">
          <DropdownMenu>
            <DropdownMenuTrigger className='text-sm font-medium bg-slate-800 hover:bg-slate-700 p-1 px-3 border-border border w-full rounded-sm'>Change Status</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={staffData?.Status} onValueChange={handleStatusChange}>
                <DropdownMenuRadioItem value="active">Active</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="blocked">Blocked</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="unverified">Un-Verified</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <EditStaffDialog trigger={
            <motion.h1 whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className='p-1 hover:bg-cyan-900 bg-slate-800 rounded-lg px-6 border border-slate-400 cursor-pointer'>
              Edit
            </motion.h1>
          } staffData={staffData} />
          <AlertDialog>
            <AlertDialogTrigger>
              <motion.h1 whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className='p-1 hover:bg-red-900 bg-slate-800 rounded-lg px-6 border border-slate-400 cursor-pointer'>
                Delete
              </motion.h1>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure to remove this Staff?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone and all the tasks and project related to this staff still remain same.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteStaff}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
        <div className="flex gap-1 mb-3">
          <Tooltip title={`${staffLoading ? 'loading..' : 'Region'}`}><h1 className='flex gap-1 bg-slate-700 p-1 px-3 text-sm rounded-md'><Globe2 size={20} /> {staffData?.Region ? staffData?.Region.RegionName : 'no region'}</h1></Tooltip>
          <Tooltip title={`${staffLoading ? 'loading..' : 'Area'}`}><h1 className='flex gap-1 bg-slate-700 p-1 px-3 text-sm rounded-md'><LandPlot size={20} /> {staffData?.Area ? staffData?.Area.Areaname : 'no area'}</h1></Tooltip>
        </div>
        <h1 className='text-xs text-slate-400'>{staffData?.Department ? staffData?.Department?.DepartmentName : "not added to any departments"}</h1>
      </div>
      }

      <div className="bg-slate-950/50 p-2 rounded-lg mb-3 grid lg:grid-cols-2 grid-cols-1">
        <div className="p-1">
          <div className="bg-slate-950/50 rounded-lg p-2">
            <h2 className='text-xs font-medium text-slate-400'>Phone</h2>
            <h3 className='text-sm text-slate-300'>{staffData?.Phone || 'not added'}</h3>
          </div>
        </div>
        <div className="p-1">
          <div className="bg-slate-950/50 rounded-lg p-2">
            <h2 className='text-xs font-medium text-slate-400'>Country</h2>
            <h3 className='text-sm text-slate-300'>{staffData?.Address?.Country || 'not added'}</h3>
          </div>
        </div>
        <div className="p-1">
          <div className="bg-slate-950/50 rounded-lg p-2">
            <h2 className='text-xs font-medium text-slate-400'>Province</h2>
            <h3 className='text-sm text-slate-300'>{staffData?.Address?.Province || 'not added'}</h3>
          </div>
        </div>
        <div className="p-1">
          <div className="bg-slate-950/50 rounded-lg p-2">
            <h2 className='text-xs font-medium text-slate-400'>City</h2>
            <h3 className='text-sm text-slate-300'>{staffData?.Address?.City || 'not added'}</h3>
          </div>
        </div>
        <div className="p-1">
          <div className="bg-slate-950/50 rounded-lg p-2">
            <h2 className='text-xs font-medium text-slate-400'>Pin</h2>
            <h3 className='text-sm text-slate-300'>{staffData?.Address?.Pin || 'not added'}</h3>
          </div>
        </div>
      </div>

      <div className="mb-4 bg-slate-950/50 p-3 py-5 rounded-lg">
        <h1 className='text-sm mb-1'>Skills:</h1>
        <div className="flex gap-1 flex-wrap">
          {staffData?.Skills?.map((skill: any) => (
            <h1 key={skill} className='bg-white text-black text-sm px-3 p-1 rounded-sm flex gap-2'>{skill} <SquareX onClick={() => handleRemoveSkill(skill)} className='text-slate-800 hover:text-red-700 cursor-pointer' size={20} /></h1>
          ))}
          <AddStaffSkillDialog trigger={
            <Tooltip title="add new skill"><motion.h1 whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className='cursor-pointer bg-white text-black text-sm px-3 p-1 rounded-full flex font-bold'>Add More <Plus size={20} /></motion.h1></Tooltip>
          } staffid={params?.staffid} />
        </div>
      </div>

      <div className="bg-slate-950/50 p-3 py-5 rounded-lg">
        <h1 className='text-sm font-medium pl-1 mb-1'>Documents:</h1>
        <div className="flex flex-wrap items-center">
          {staffData?.Documents?.map((doc: any) => (
            <div className="w-3/12 p-1" key={doc?._id}>
              <Tooltip title="click title to view file" placement='leftTop'>
                <div className='w-full bg-slate-800 p-2 rounded-md border border-border cursor-pointer relative'>
                  <ViewStaffDocument trigger={
                    <h1 className='text-sm font-medium text-slate-300 flex gap-1'><FileText size={18} />{doc?.DocName}</h1>
                  } url={doc?.DocUrl} docName={doc?.DocName} />
                  <h3 className='text-xs font-medium text-slate-400'>Exp: <span className='text-cyan-600'>{formatDateShortly(doc?.ExpireAt)}</span></h3>
                  <h3 className='text-xs font-medium text-slate-400'>Remind: <span className='text-cyan-600'>{formatDateShortly(doc?.RemindAt)}</span></h3>
                  <motion.div whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.05 }} className='absolute top-2 right-2'>
                    <Popconfirm title='Delete Document' description='Are you sure about to delete this document ?' cancelText='No' okText='Yes' onConfirm={() => handleDeleteDocument(doc?._id, doc?.DocUrl)}><Trash2 size={18} className='hover:text-red-600' /></Popconfirm>
                  </motion.div>
                </div>
              </Tooltip>
            </div>
          ))}
          <div className="w-2/12 p-1">
            <div className="bg-slate-300 p-2 rounded-md">
              <AddNewDocumentDialog trigger={
                <motion.h1 whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className='cursor-pointer bg-white text-black text-sm px-3 p-1 rounded-full flex font-bold gap-1'>Add Document <FilePlus2 size={18} /></motion.h1>
              } staffid={params?.staffid} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffPage