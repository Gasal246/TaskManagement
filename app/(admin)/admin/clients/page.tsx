"use client"
import AddClientsDialog from '@/components/client/AddClientsDialog'
import RegionAndAreaFilter from '@/components/shared/RegionAndAreaFilter'
import { Input } from '@/components/ui/input'
import { useFindUserById } from '@/query/client/userQueries'
import { Pyramid } from 'lucide-react'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Badge } from 'antd'
import { useGetAllClients } from '@/query/client/clientQueries'
import { Skeleton } from '@/components/ui/skeleton'
import { multiFormatDateString } from '@/lib/utils'

const ClientsPage = () => {
  const { data: session }: any = useSession();
  const { data: currentUser, isLoading: loadingUserData } = useFindUserById(session?.user?.id);
  const { data: clients, isLoading: loadingClients } = useGetAllClients(session?.user?.id)
  const [region, setRegion] = useState('');
  const [area, setArea] = useState('');
  const router = useRouter();

  useEffect(() => {
    console.log(region, area);
  }, [region, area])

  return (
    <div className='p-4'>
      <div className="bg-slate-950/50 p-3 rounded-lg flex items-center justify-between mb-3">
        <h1 className='font-medium flex gap-1 items-center'><Pyramid size={20} /> Clients Management</h1>
        {currentUser && <AddClientsDialog currentUser={currentUser} />}
      </div>
      <div className="bg-slate-950/50 rounded-lg p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {clients?.length > 0 && <RegionAndAreaFilter setArea={setArea} setRegion={setRegion} currentUser={currentUser} placeholder='All Clients' />}
          <Input type='search' placeholder='search' />
        </div>
        <div className="w-full flex flex-wrap mt-3">
          {loadingClients && <>
            <div className="w-full p-1 lg:w-3/12"><Skeleton className='w-full h-[120px] rounded-lg' /></div>
            <div className="w-full p-1 lg:w-3/12"><Skeleton className='w-full h-[120px] rounded-lg' /></div>
            <div className="w-full p-1 lg:w-3/12"><Skeleton className='w-full h-[120px] rounded-lg' /></div>
          </>}
          {clients?.map((client: any) => (
            <div className="w-full p-1 lg:w-3/12" key={client?._id}>
              <Badge dot className='w-full'>
                <motion.div onClick={() => router.push(`/admin/clients/${client?._id}`)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="bg-slate-950/60 p-3 rounded-lg hover:shadow-sm select-none cursor-pointer">
                  <div className='mb-2'>
                    <h1 className='text-slate-200 text-sm font-medium leading-4'>{client?.Name}</h1>
                    <h1 className='text-slate-200 text-xs font-light'>{client?.Email}</h1>
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs text-slate-400">{multiFormatDateString(client?.createdAt)}</h3>
                    <h3 className="text-xs text-slate-400 font-medium">{client?.Region?.RegionName}, {client?.Area?.Areaname}</h3>
                  </div>
                </motion.div>
              </Badge>
            </div>
          ))}
          {clients?.length <= 0 && <h1 className='text-xs text-slate-400'>No client data found, you can add a new one.</h1>}
        </div>
      </div>
    </div>
  )
}

export default ClientsPage