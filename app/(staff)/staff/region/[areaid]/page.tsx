"use client"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { LandPlot } from 'lucide-react'
import React from 'react'
import { DataTable } from './data-table'
import { columns } from './columns'

const StaffAreaAreaId = ({ params }: { params: { areaid: string } }) => {
  return (
    <div className='p-4'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/staff/region">Region Name</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Area Name</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="bg-slate-950/50 rounded-lg p-3 my-3">
        <h1 className='flex items-center gap-1'><LandPlot size={18} /> Area Name</h1>
      </div>
      <div className="bg-slate-950/50 rounded-lg p-3">
        <h1 className='text-xs font-medium text-cyan-300'>Area Staffs</h1>
        <DataTable data={[]} columns={columns} />
      </div>
    </div>
  )
}

export default StaffAreaAreaId
