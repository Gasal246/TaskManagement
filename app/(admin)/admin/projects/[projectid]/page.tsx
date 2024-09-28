"use client"
/* eslint-disable react-hooks/exhaustive-deps */
import { Badge } from '@/components/ui/badge'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Avatar, Popconfirm, Tooltip } from 'antd'
import { BarChart2, Edit, Globe2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs";
import LoaderSpin from '@/components/shared/LoaderSpin'
import { Button } from '@/components/ui/button'
import CompleteProjectDialog from '@/components/admin/CompleteProjectDialog'
import RollbackProjectDialog from '@/components/admin/RollbackProjectDialog'
import { useApproveProject, useGetProjectById, useProjectOnView } from '@/query/client/projectQueries'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { formatDateTiny, multiFormatDateString } from '@/lib/utils'
import ProjectDocuments from '@/components/project/ProjectDocuments'
import ProjectFlow from '@/components/project/ProjectFlow'
import ProjectComments from '@/components/project/ProjectComments'
import ChangeDeadlineDialog from '@/components/project/ChangeDeadlineDialog'
import { useInView } from 'react-intersection-observer'
import EditProjectDeatails from '@/components/project/EditProjectDeatails'
import { motion } from 'framer-motion'
import ProjectPeople from '@/components/project/ProjectPeople'

const ProjectIdPage = ({ params }: { params: { projectid: string } }) => {
    const { data: session }: any = useSession();
    const router = useRouter();
    const { data: projectData, isLoading: loadingProjectData } = useGetProjectById(params?.projectid);
    const { mutateAsync: approveProject, isPending: approvingProject } = useApproveProject();

    const { ref, inView } = useInView();
    const { mutateAsync: projectOnView, isPending: onviewPending } = useProjectOnView();
    const handleProjectOnView = async () => {
        await projectOnView({ projectid: params?.projectid })
    }
    useEffect(() => {
        if (inView) {
            handleProjectOnView()
        }
    }, [inView])

    useEffect(() => {
        if (projectData) {
            if (!projectData?.AccessTo?.some((x: any) => x?._id == session?.user?.id)) {
                router.replace("/admin/projects");
                toast.error("You have no access to this project.!")
            }
        }
    }, [projectData])

    const handleApproveProject = async () => {
        const response = await approveProject({ projectid: params.projectid });
        if (response?._id) {
            return toast.success("Project Approved")
        } else {
            return toast.error("Failed to approve project!!")
        }
    }

    return (
        <>
            {loadingProjectData ? <div className='h-screen w-full flex justify-center items-center'><LoaderSpin size={60} /></div> :
                <div className={`p-4 pb-20 ${new Date(projectData?.Deadline) < new Date() && 'bg-red-600/20'}`} ref={ref}>
                    <div className="flex flex-wrap justify-between">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/admin/projects">All Projects</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>{projectData?.Title}</BreadcrumbPage>
                                    {new Date(projectData?.Deadline) < new Date() && <BreadcrumbPage className='text-red-500 p-1 rounded-lg bg-black'>{' __Project Running Over Deadline__ '}</BreadcrumbPage>}
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <ProjectPeople trigger={
                            <motion.h1 whileTap={{ scale: 0.95 }} className='flex text-sm font-semibold items-center bg-slate-950/70 p-1 px-3 rounded-lg hover:text-cyan-500 hover:border-cyan-600 border border-slate-950 select-none cursor-pointer'>People <BarChart2 size={19} /></motion.h1>
                        } OpenedByArray={projectData?.OpenedBy} AccessToArray={projectData?.AccessTo} currentDep={projectData?.WorkingDepartment} />
                    </div>
                    <div className='mt-2 bg-slate-950/50 p-3 rounded-lg flex justify-between items-center mb-3 flex-wrap'>
                        <div>
                            <h1 className='text-2xl font-bold flex gap-2 mb-1'>{projectData?.Title} {(projectData?.AdminId == session?.user?.id || projectData?.Creator?._id == session?.user?.id) && (
                                <EditProjectDeatails trigger={<Edit size={16} />} change='title' previous={projectData?.Title} projectid={params.projectid} />
                            )}</h1>
                            <div className="flex gap-1">
                                <Tooltip title={projectData?.IsApproved ? 'project is approved by admin' : 'project is waiting for admin approval'}><Badge className={`${projectData?.IsApproved ? 'bg-green-400 hover:bg-green-400' : 'bg-orange-400 hover:bg-orange-400'} text-xs select-none`}>{projectData?.IsApproved ? 'Approved' : 'Not-Approved'}</Badge></Tooltip>
                                <Tooltip title="current working department"><Badge className='bg-slate-300 text-xs select-none'>{projectData?.WorkingDepartment?.DepartmentName}</Badge></Tooltip>
                            </div>
                        </div>
                        <div className="flex gap-2 items-center mt-2 lg:mt-0">
                            {session?.user?.id == projectData?.AdminId && !projectData?.IsApproved && <Popconfirm title="Approve Project!!" description={<h1 className='text-sm'>Are you sure want to approve this project?</h1>}
                                placement='bottom' okText="Yes" onConfirm={handleApproveProject}><Button className='text-xs lg:text-sm p-1 lg:p-3 bg-green-300 hover:bg-green-400'>Approve Project</Button></Popconfirm>}
                            {projectData?.IsApproved && <><CompleteProjectDialog workingDep={projectData?.WorkingDepartment} projectId={projectData?._id} trigger={<Button className='text-xs lg:text-sm p-1 lg:p-3'>Complete / Post</Button>} />
                                <RollbackProjectDialog trigger={<Button className='text-xs lg:text-sm p-1 lg:p-3'>Rollback / Issue</Button>} prevDepId='' /></>}
                            {/* Delete Button Only for Admin  */}
                            {(session?.user?.id == projectData?.AdminId || session?.user?.id == projectData?.Creator?._id) && (<Popconfirm title="Delete Project" description="Are you sure want to schedule it for deletion ?"><Button className='bg-red-700 hover:bg-transparent hover:border-2 border-red-700 text-white text-xs lg:text-sm p-1 lg:p-3'>Delete / Archive</Button></Popconfirm>)}
                        </div>
                    </div>
                    <div className="bg-slate-950/50 p-3 rounded-lg flex flex-wrap items-center gap-2 mb-3">
                        <div className='bg-neutral-700/60 p-2 rounded-lg min-w-[280px] hover:bg-slate-800 cursor-pointer' onClick={() => router.push(`/admin/staffs/${projectData?.Creator?._id}`)}>
                            <h1 className='text-xs text-slate-300 mb-1'>Creator:</h1>
                            <Tooltip title="click to view user"><div className="flex items-center gap-1 select-none">
                                <Avatar src={projectData?.Creator?.AvatarUrl || '/avatar.png'} />
                                <div>
                                    <h1 className='text-sm leading-3'>{projectData?.Creator?.Name}</h1>
                                    <h1 className='text-xs'>{projectData?.Creator?.Email}</h1>
                                </div>
                            </div></Tooltip>
                        </div>
                        <div className="flex gap-1 items-center flex-wrap">
                            <Tooltip title={formatDateTiny(projectData?.createdAt)}><div className="bg-slate-950/50 p-2 rounded-lg min-w-[150px]">
                                <h1 className='text-xs text-slate-300 leading-3'>Created at:</h1>
                                <h2 className='text-xs'>{multiFormatDateString(projectData?.createdAt)}</h2>
                            </div></Tooltip>
                            <Tooltip title={formatDateTiny(projectData?.Deadline)}><div className="bg-slate-950/50 p-2 rounded-lg min-w-[150px]">
                                <h1 className='text-xs text-slate-300 leading-3 flex gap-1'>DeadLine at: {(session?.user?.id == projectData?.AdminId || session?.user?.id == projectData?.Creator?._id) && (<ChangeDeadlineDialog trigger={
                                    <Tooltip title="edit deadline?"><Edit className='text-cyan-400' size={14} /></Tooltip>
                                } projectid={projectData?._id} deadline={projectData?.Deadline} />)}</h1>
                                <h2 className='text-xs'>{multiFormatDateString(projectData?.Deadline)}</h2>
                            </div></Tooltip>
                            <div className="bg-slate-950/50 p-2 rounded-lg min-w-[150px]">
                                <h1 className='text-xs text-slate-300 leading-3 flex gap-1'>Location: <Globe2 size={12} /></h1>
                                <h2 className='text-xs'>{projectData?.Region?.RegionName}, {projectData?.Area?.Areaname}</h2>
                            </div>
                        </div>
                    </div>
                    <Tabs defaultValue="details" className="w-full">
                        <TabsList className="grid w-full lg:grid-cols-4 grid-cols-2 h-[80px] lg:h-[50px]">
                            <TabsTrigger value="details">Project Details</TabsTrigger>
                            <TabsTrigger value="documents">Project Documents</TabsTrigger>
                            <TabsTrigger value="flow">Project Flow</TabsTrigger>
                            <TabsTrigger value="comments">Project Comments</TabsTrigger>
                        </TabsList>
                        <TabsContent value="details">
                            <div className="bg-slate-950/50 p-3 rounded-lg w-full">
                                <h1 className='text-xs mb-1 text-cyan-500 flex gap-1 items-center'>Project Details: {(session?.user?.id == projectData?.AdminId || session?.user?.id == projectData?.Creator?._id) && (
                                    <EditProjectDeatails projectid={params?.projectid} change='description' previous={projectData?.Description}
                                        trigger={<span className='text-xs flex gap-1 items-center text-pink-600 cursor-pointer hover:text-blue-300'>EDIT <Edit size={12} /></span>} />
                                )}</h1>
                                <pre className={`text-sm text-wrap `}>{projectData?.Description}</pre>
                            </div>
                        </TabsContent>
                        <TabsContent value="documents">
                            <div className="bg-slate-950/50 p-3 rounded-lg">
                                <ProjectDocuments projectId={projectData?._id} documents={projectData?.Documents} allUsers={projectData?.AccessTo} creatorid={projectData?.Creator?._id} adminid={projectData?.AdminId} />
                            </div>
                        </TabsContent>
                        <TabsContent value="flow">
                            <ProjectFlow projectid={projectData?._id} />
                        </TabsContent>
                        <TabsContent value="comments">
                            <ProjectComments projectid={projectData?._id} />
                        </TabsContent>
                    </Tabs>

                </div>}
        </>
    )
}

export default ProjectIdPage