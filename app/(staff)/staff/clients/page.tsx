"use client"
import AddClientsDialog from '@/components/client/AddClientsDialog'
import { Input } from '@/components/ui/input'
import { useFindUserById } from '@/query/client/userQueries'
import { Badge } from 'antd'
import { Pyramid } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { multiFormatDateString } from '@/lib/utils'
import { useGetAllClients } from '@/query/client/clientQueries'
import ProjectCardsSkeleton from '@/components/skeletons/ProjectCardsSkeleton'

const StaffClients = () => {
  const router = useRouter();
  const { data: session }: any = useSession();
  const { data: currentUser, isLoading: loadingUser } = useFindUserById(session?.user?.id);
  const { data: allClients, isLoading: loadingClients } = useGetAllClients(session?.user?.id);
  const [ region, setRegion ] = useState('');
  const [ area, setArea ] = useState('');
  return (
    <div className='p-4'>
      <div className="bg-slate-950/50 rounded-lg p-3 flex justify-between items-center mb-3">
        <h2 className='flex gap-1 items-center'><Pyramid size={18} /> Your Clients</h2>
        <AddClientsDialog currentUser={currentUser} />
      </div>
      <div className="bg-slate-950/50 rounded-lg p-3">
        <Input placeholder='search..' className='w-full lg:w-1/2' />
        <div className="flex flex-wrap -p-1 mt-2">
          { loadingClients ? <ProjectCardsSkeleton /> : ( allClients?.length <= 0 ? <h1 className='w-full text-center text-xs text-red-800 bg-black rounded-lg p-3 flex gap-1 it'>{"You may not have added any clients."} <AddClientsDialog currentUser={currentUser} trigger={<span className='text-xs font-medium text-blue-800 italic underline cursor-pointer'>Add Clients</span>} /></h1> : null)}
          {allClients?.map((client: any) => (
            <div className="w-full lg:w-3/12 p-1" key={client?._id}>
              <Badge dot={!client?.OpenedBy?.includes(session?.user?.id)} className='w-full'>
                <motion.div onClick={() => router.push(`/staff/clients/${client?._id}`)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-slate-950/60 p-3 rounded-lg hover:shadow-sm select-none cursor-pointer">
                  <div className='mb-2'>
                    <h1 className='text-slate-200 text-sm font-medium leading-4'>{client?.ShortName}</h1>
                    <h1 className='text-slate-200 text-xs font-light'>{client?.FullName}</h1>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs text-slate-400">{multiFormatDateString(client?.createdAt)}</h3>
                    <h3 className="text-xs text-slate-400 font-medium">{client?.Region?.RegionName}, {client?.Area?.Areaname}</h3>
                  </div>
                </motion.div>
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StaffClients
