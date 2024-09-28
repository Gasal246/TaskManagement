"use client"
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'
import AddRegionDialog from '@/components/admin/AddRegionDialog'
import { Earth } from 'lucide-react'
import { useGetAllRegions } from '@/query/client/adminQueries'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Tooltip } from 'antd'

const Regions = () => {
  const { data: session }: any = useSession();
  const { data: allRegions, isLoading: loadingRegions } = useGetAllRegions(session?.user?.id);
  return (
    <div className="p-4 overflow-y-scroll h-full pb-20">
      <div className="flex justify-between bg-slate-950/50 p-3 rounded-lg items-center">
        <h1 className='font-semibold text-xl'>Region Management</h1>
        <AddRegionDialog trigger={
          <motion.h1 whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className='p-2 hover:bg-cyan-950 rounded-full px-6 border-2 border-slate-400 cursor-pointer'>
            Add Region
          </motion.h1>
        } />
      </div>
      <div className="bg-slate-950/50 p-3 rounded-lg items-center mt-3">
        <h1 className='flex gap-1 items-center'>Added regions: {loadingRegions && <Image src={'/icons/loadingspin.svg'} width={35} height={35} alt='loader' />}</h1>
        <div className='flex flex-wrap'>
          {
            allRegions?.map((region: any) => (
              <div className="w-full md:w-3/12 p-1" key={region?._id}>
                <Link href={`/admin/regions/${region?._id}`}>
                  <Tooltip title="click to edit & add areas inside">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full h-full bg-sky-700 p-2 flex items-center justify-center gap-1 rounded-sm hover:shadow-md cursor-pointer">
                      <Earth size={18} />
                      <h1>{region?.RegionName}</h1>
                    </motion.div>
                  </Tooltip>
                </Link>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Regions