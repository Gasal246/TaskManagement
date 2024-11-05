"use client"
import React, { useEffect, useState } from 'react'
import { ArrowUpWideNarrow, Circle, Dot, FilePlus, Frown, Menu, SortAsc, SortDesc, Trash2 } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { motion } from 'framer-motion';
import { Avatar, Badge, ConfigProvider, GetProps, Input, Popconfirm, Tooltip } from 'antd';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress"
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import AddProjectDialog from '@/components/shared/AddProjectDialog';
import ProjectCards from '@/components/admin/ProjectCards';
import ProjectCardsSkeleton from '@/components/skeletons/ProjectCardsSkeleton';
import useDebounce from '@/hooks/useDebounce';
import { useSearchProjects } from '@/query/client/projectQueries';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { formatDateTiny, multiFormatDateString } from '@/lib/utils';
import { useGetAllProjectAnalytics } from '@/query/client/analyticsQueries';
import { useFindUserById } from '@/query/client/userQueries';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import RegionAndAreaFilter from '@/components/shared/RegionAndAreaFilter';
import { useGetAllClients } from '@/query/client/clientQueries';
import AddClientsDialog from '@/components/client/AddClientsDialog';
import InfoTootlip from '@/components/shared/InfoTootlip';


type SearchProps = GetProps<typeof Input.Search>;

const ProjectsPage = () => {
  const { data: session }: any = useSession();
  const { data: newAnalytics, isLoading: loadingNewAnalytics }: any = useGetAllProjectAnalytics(session?.user?.id, 'new');
  const { data: endedAnalytics, isLoading: loadingEndedAnalytics }: any = useGetAllProjectAnalytics(session?.user?.id, 'ended');
  const { data: deletedAnalytics, isLoading: loadingDeletedAnalytics }: any = useGetAllProjectAnalytics(session?.user?.id, 'deleted');
  const { data: ongoingAnalytics, isLoading: loadingOngoingAnalytics }: any = useGetAllProjectAnalytics(session?.user?.id, 'ongoing');
  const { data: ownedAnalytics, isLoading: loadingOwnedAnalytics }: any = useGetAllProjectAnalytics(session?.user?.id, 'owned');

  const { data: currentUser, isLoading: loadingUserData } = useFindUserById(session?.user?.id);

  const router = useRouter();
  const { Search } = Input;
  const [searchValue, setSearchValue] = useState('');
  const { mutateAsync: searchProjects, isPending: searchingProjects } = useSearchProjects();
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const { data: clients, isLoading: loadingClients } = useGetAllClients(session?.user?.id);
  const [selectedClients, setSelectedClients] = useState<any[]>([]);
  const [region, setRegion] = useState('');
  const [area, setArea] = useState('');

  const handleSearch: SearchProps['onSearch'] = async (value, _e, info) => {
    console.log(value)
    setSearchValue(value);
    const response = await searchProjects({ userid: session?.user?.id, searchTerm: value });
    setAllProjects(response);
  }

  const handleFilterClient = (clientid: string) => {
    if (selectedClients?.includes(clientid)) {
      setSelectedClients(selectedClients.filter((id) => id != clientid));
    } else {
      setSelectedClients((prev) => [...prev, clientid]);
    }
  }

  return (
    <div className='p-4'>
      <div className="flex justify-between bg-slate-950/50 p-3 rounded-lg items-center">
        <h1 className='font-bold'>Project Management</h1>

        <Popover>
          <PopoverTrigger className='p-2 bg-slate-600 rounded-lg hover:bg-slate-700 cursor-pointer'><ArrowUpWideNarrow /></PopoverTrigger>
          <PopoverContent className='w-[140px] p-1 mr-3'>
            <div className="flex flex-col gap-1">
              <h4 className='flex items-center justify-between text-sm text-black bg-neutral-100 p-1 px-2 rounded-sm font-medium hover:bg-neutral-300 cursor-pointer'>High Priority <SortAsc color='black' /></h4>
              <h4 className='flex items-center justify-between text-sm text-black bg-neutral-100 p-1 px-2 rounded-sm font-medium hover:bg-neutral-300 cursor-pointer'>Low Priority <SortDesc color='black' /></h4>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="bg-slate-950/50 p-3 rounded-lg mt-3">
        <div className='mb-5 flex justify-between flex-wrap'>
          <ConfigProvider
            theme={{
              token: { colorTextPlaceholder: 'gray' },
            }}
          ><Search placeholder="search projects" onSearch={handleSearch} className='w-full lg:w-1/2' /></ConfigProvider>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">filter clients</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter Clients</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {clients?.length <= 0 && <AddClientsDialog currentUser={currentUser} />}
              {
                clients?.length > 0 &&
                clients?.map((client: any) => (
                  <DropdownMenuCheckboxItem key={client?._id} checked={selectedClients?.includes(client?._id)} onCheckedChange={() => handleFilterClient(client?._id)} >
                    <div className="w-full p-1">
                      <h3 className="text-xs font-medium text-slate-300">{client?.Name}</h3>
                      <h3 className="text-xs text-slate-400">{client?.Email}</h3>
                    </div>
                  </DropdownMenuCheckboxItem>
                ))
              }
            </DropdownMenuContent>
          </DropdownMenu>
          <RegionAndAreaFilter currentUser={currentUser} setArea={setArea} setRegion={setRegion} placeholder='filter region ' />
          <AddProjectDialog trigger={<Button className='font-medium lg:text-sm flex items-center gap-1 bg-cyan-600 mt-1'>Add Project <FilePlus size={18} /></Button>} />
        </div>

        {!searchValue ? <Tabs defaultValue="ongoing" className="w-full">
          <TabsList className={`grid w-full ${currentUser?.Role != 'staff' ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} grid-cols-2 h-full gap-1 border border-slate-700`}>
            {currentUser?.Role != 'staff' && <div className='px-2'><Badge count={newAnalytics?.unopenedProjects?.length} size='small' className='w-full text-slate-300'><TabsTrigger value="new" className='flex items-center gap-3 w-full border border-slate-950'>
              <span className='flex gap-1 items-center'>New Projects <InfoTootlip text="This area will show you latest projects which you haven't viewed yet." /></span>
            </TabsTrigger></Badge></div>}
            <div className='px-2'><Badge size='small' count={ongoingAnalytics?.unopenedProjects?.length} className='w-full text-slate-300'><TabsTrigger value="ongoing" className='flex items-center gap-3 w-full border border-slate-950'>
              <span className='flex gap-1 items-center'>Ongoing Projects <InfoTootlip text="This shows the projects that are approved and readily working." /></span>
            </TabsTrigger></Badge></div>
            <div className='px-2'><Badge size='small' count={ownedAnalytics?.unopenedProjects?.length} className='w-full text-slate-300'><TabsTrigger value="owned" className='flex items-center gap-3 w-full border border-slate-950'>
              <span className='flex gap-1 items-center'>Owned Projects <InfoTootlip text="This area shows the projects created by you. [ means you own them ]" /></span>
            </TabsTrigger></Badge></div>
            <div className='px-2'><Badge size='small' count={deletedAnalytics?.unopenedProjects?.length} className='w-full text-slate-300'><TabsTrigger value="deleted" className='flex items-center gap-3 w-full border border-slate-950'>
              <span className='flex gap-1 items-center'>Deleted Projects <InfoTootlip text="Projects deleted by admin or creator is showcased here for couple of days before completely deleted." /></span>
            </TabsTrigger></Badge></div>
            <div className='px-2'><Badge size='small' count={endedAnalytics?.unopenedProjects?.length} className='w-full text-slate-300'><TabsTrigger value="ended" className='flex items-center gap-3 w-full border border-slate-950'>
              <span className='flex gap-1 items-center'>Ended Projects <InfoTootlip text="This area shows All the completed projects under your sector." /></span>
            </TabsTrigger></Badge></div>
          </TabsList>
          {currentUser?.Role == 'admin' && <TabsContent value="new">
            <ProjectCards filter='new' selectedClients={selectedClients} />
          </TabsContent>}
          <TabsContent value="ongoing">
            <ProjectCards filter='ongoing' selectedClients={selectedClients} />
          </TabsContent>
          <TabsContent value="owned">
            <ProjectCards filter='owned' selectedClients={selectedClients} />
          </TabsContent>
          <TabsContent value="deleted">
            <ProjectCards filter='deleted' selectedClients={selectedClients} />
          </TabsContent>
          <TabsContent value="ended">
            <ProjectCards filter='ended' selectedClients={selectedClients} />
          </TabsContent>
        </Tabs> :
          <Card className='border-slate-700'>
            <CardHeader className='p-3 px-4 capitalize'><CardTitle>Showing Results For {`"${searchValue}"`}</CardTitle></CardHeader>
            <CardContent className="p-3 w-full flex flex-wrap">
              {searchingProjects && <ProjectCardsSkeleton />}
              {allProjects?.map((project: any) => (
                <div className="w-full lg:w-4/12 p-1" key={project?._id}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => router.push(`/staff/projects/${project?._id}`)} className="bg-neutral-700/70 p-3 rounded-lg cursor-pointer select-none">
                    <div className="flex justify-between px-1">
                      <h1 className='text-sm font-medium'>{project?.Title}</h1>
                    </div>
                    <Link href={`/staff/profile/${'staffid'}`}><div className="flex gap-1 bg-slate-950/50 p-2 rounded-lg items-center mt-2 mb-1">
                      <Avatar src={project?.Creator?.AvatarUrl || '/avatar.png'} size={26} />
                      <div>
                        <h1 className='text-xs font-medium leading-3'>{project?.Creator?.Name}</h1>
                        <h1 className='text-xs'>{project?.Creator?.Email}</h1>
                      </div>
                    </div></Link>
                    <div className='flex justify-between gap-1 mb-2'>
                      <Tooltip title={formatDateTiny(project?.createdAt)}><div className='bg-slate-950/60 p-1 px-2 rounded-lg w-1/2'>
                        <h2 className='text-neutral-300 text-[11px] leading-3'>Created On</h2>
                        <h2 className='text-slate-300 text-[10px]'>{multiFormatDateString(project?.createdAt)}</h2>
                      </div></Tooltip>
                      <Tooltip title={formatDateTiny(project?.Deadline)}><div className='bg-slate-950/60 p-1 px-2 rounded-lg w-1/2'>
                        <h2 className='text-neutral-300 text-[11px] leading-3'>Deadline:</h2>
                        <h2 className='text-slate-300 text-[10px]'>{multiFormatDateString(project?.Deadline)}</h2>
                      </div></Tooltip>
                    </div>
                    <div className='px-2 mb-2'>
                      <h2 className={`text-xs ${project?.Priority == 'high' ? 'text-red-400' : (project?.Priority == 'average' ? 'text-orange-400' : 'text-slate-400')} flex items-center gap-1 font-medium capitalize`}><Circle size={10} fill="" strokeWidth={5} /><span className='uppercase'>{project?.Priority}</span> priority</h2>
                      <h2 className={`text-xs ${project?.IsApproved ? 'text-green-400' : 'text-orange-400'} flex items-center gap-1 font-medium`}><Circle size={10} fill="" strokeWidth={5} />{project?.IsApproved ? 'Approved Project' : 'Waiting Approval'}</h2>
                    </div>
                    <div className='flex gap-1 items-center'>
                      <Progress value={project?.Progress} /> <span className='text-xs'>{project?.Progress}%</span>
                    </div>
                  </motion.div>
                </div>
              ))}
              {!allProjects ? <h1 className='text-sm font-medium flex gap-1 items-center text-red-300'><Frown /> Cannot find any results for {searchValue}</h1> :
                (allProjects?.length <= 0 && <Tooltip title={`No Data for ${searchValue}.`} ><motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} animate={{ scale: 1.2 }} className='w-full flex justify-center items-center py-10'>
                  <Image src={`/icons/noresults.png`} alt='noresults' width={200} height={200} className='opacity-70' />
                </motion.div></Tooltip>)}
            </CardContent>
          </Card>
        }
      </div>
    </div>
  )
}

export default ProjectsPage