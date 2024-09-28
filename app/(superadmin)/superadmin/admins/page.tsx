/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Avatar, Tooltip } from 'antd'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input'
import { useGetAdmins, useGetAdminsAddedWithin, useSearchAddedAdmins } from '@/query/client/superuserQueries'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { addDays, format, subDays } from "date-fns"
import { Calendar as CalendarIcon, CircleUser } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import useDebounce from '@/hooks/useDebounce'

const AdminsManaging = () => {
    const { data: allAdmin, isLoading: loadingAllAdmin } = useGetAdmins('all');
    const { data: adminsToday, isLoading: loadingAdminTodays } = useGetAdmins('today');
    const { data: adminsMonthly, isLoading: loadingAdminMonthly } = useGetAdmins('month');
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: subDays(new Date(), 10),
        to: new Date(),
    });
    const { data: datedData, isLoading: datedDataLoading } = useGetAdminsAddedWithin(date);

    // SEARCHING
    const [searchTerm, setSearchTerm] = useState('');
    const debounceSearchTerm = useDebounce(searchTerm, 500);
    const [searchResults, setSearchResults] = useState([]);
    const { mutateAsync: searchAdmins, isPending: searchingAdmin, isSuccess: searchDone, isError: searchFailed, } = useSearchAddedAdmins();
    useEffect(() => {
        const fn = async () => {
            const response = await searchAdmins(debounceSearchTerm);
            setSearchResults(response)
        }
        if (debounceSearchTerm) {
            fn();
        }
    }, [debounceSearchTerm])

    return (
        <div className='p-4'>
            <div className="flex justify-between">
                <h1 className='font-semibold text-xl'>Admin Management</h1>
                <Link href="/superadmin/admins/add-admin">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className='p-2 bg-slate-800 hover:bg-cyan-950 rounded-md px-3 border border-slate-600 cursor-pointer'>
                        Add Admins
                    </motion.button>
                </Link>
            </div>
            <Tooltip title="search by admin name or email" placement='bottomLeft'>
                <Input type='search' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder='&#128269; search admins' className='border-border border mx-1 my-2 w-[99%]' />
            </Tooltip>
            {searchTerm && searchDone && searchResults?.length == 0 && <h1>{`No Result found on "${searchTerm}"`}</h1>}
            {searchingAdmin && <h1>{`searching for "${searchTerm}"`}</h1>}
            {searchTerm && <div className="w-full overflow-y-scroll h-[82vh]">
                <div className="flex flex-wrap">
                    {searchResults?.map((data: any) => (
                        <div key={data?._id} className="w-full lg:w-3/12 p-1">
                            <Link href={`/superadmin/admins/${data?._id}`}>
                                <Tooltip title="click to view">
                                    <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }} className="w-full bg-slate-800 rounded-md p-3 hover:shadow-md border-slate-600 border">
                                        <div className="flex gap-1 items-center">
                                            {data?.adminDetails?.AvatarUrl ? <Avatar src={data?.adminDetails?.AvatarUrl} size={28} /> : <CircleUser />}
                                            <h1>{data?.adminDetails?.Name}</h1>
                                        </div>
                                        <h2 className='text-start text-sm mt-1'>{data?.adminDetails?.Email}</h2>
                                        <h3 className='text-start text-xs mt-1 text-slate-300'>{formatDate(data?.createdAt)}</h3>
                                    </motion.div>
                                </Tooltip>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>}
            {
                loadingAdminMonthly || loadingAdminTodays || loadingAllAdmin || datedDataLoading ?
                    <h1 className='flex gap-2'><Image src='/icons/loadingspin.svg' alt='loaderpng' width={30} height={30} /> please wait... Loading Admin Data.</h1> :
                    (
                        !searchTerm &&
                        <Tabs defaultValue="all" className="w-full text-center">
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="today">Today</TabsTrigger>
                                <TabsTrigger value="month">This Month</TabsTrigger>
                                <TabsTrigger value="days">
                                    <div className={"grid gap-2"}>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    id="date"
                                                    variant={"secondary"}
                                                    className={cn(
                                                        "w-[300px] justify-start text-left font-normal",
                                                        !date && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {date?.from ? (
                                                        date.to ? (
                                                            <>
                                                                {format(date.from, "LLL dd, y")} -{" "}
                                                                {format(date.to, "LLL dd, y")}
                                                            </>
                                                        ) : (
                                                            format(date.from, "LLL dd, y")
                                                        )
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    initialFocus
                                                    mode="range"
                                                    defaultMonth={date?.from}
                                                    selected={date}
                                                    onSelect={setDate}
                                                    numberOfMonths={2}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="all">
                                {allAdmin?.length == 0 && <h1>No Data Found</h1>}
                                <div className="w-full overflow-y-scroll h-[82vh]">
                                    <div className="flex flex-wrap">
                                        {allAdmin?.map((data: any) => (
                                            <div key={data?._id} className="w-full lg:w-3/12 p-1">
                                                <Link href={`/superadmin/admins/${data?._id}`}>
                                                    <Tooltip title="click to view">
                                                        <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }} className="w-full bg-slate-800 rounded-md p-3 hover:shadow-md border-slate-600 border">
                                                            <div className="flex gap-1 items-center">
                                                                {data?.AdminId?.AvatarUrl ? <Avatar src={data?.AdminId?.AvatarUrl} size={28} /> : <CircleUser />}
                                                                <h1>{data?.AdminId?.Name}</h1>
                                                            </div>
                                                            <h2 className='text-start text-sm mt-1'>{data?.AdminId?.Email}</h2>
                                                            <h3 className='text-start text-xs mt-1 text-slate-300'>{formatDate(data?.createdAt)}</h3>
                                                        </motion.div>
                                                    </Tooltip>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="today">
                                {adminsToday?.length == 0 && <h1>No Data For Today</h1>}
                                <div className="w-full overflow-y-scroll h-[82vh]">
                                    <div className="flex flex-wrap">
                                        {adminsToday?.map((data: any) => (
                                            <div key={data?._id} className="w-full lg:w-3/12 p-1">
                                                <Link href={`/superadmin/admins/${data?._id}`}>
                                                    <Tooltip title="click to view">
                                                        <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }} className="w-full bg-slate-800 rounded-md p-3 hover:shadow-md border-slate-600 border">
                                                            <div className="flex gap-1 items-center">
                                                                {data?.AdminId?.AvatarUrl ? <Avatar src={data?.AdminId?.AvatarUrl} size={28} /> : <CircleUser />}
                                                                <h1>{data?.AdminId?.Name}</h1>
                                                            </div>
                                                            <h2 className='text-start text-sm mt-1'>{data?.AdminId?.Email}</h2>
                                                            <h3 className='text-start text-xs mt-1 text-slate-300'>{formatDate(data?.createdAt)}</h3>
                                                        </motion.div>
                                                    </Tooltip>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="month">
                                {adminsMonthly?.length == 0 && <h1>No Data For The Month</h1>}
                                <div className="w-full overflow-y-scroll h-[82vh]">
                                    <div className="flex flex-wrap">
                                        {adminsMonthly?.map((data: any) => (
                                            <div key={data?._id} className="w-full lg:w-3/12 p-1">
                                                <Link href={`/superadmin/admins/${data?._id}`}>
                                                    <Tooltip title="click to view">
                                                        <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }} className="w-full bg-slate-800 rounded-md p-3 hover:shadow-md border-slate-600 border">
                                                            <div className="flex gap-1 items-center">
                                                                {data?.AdminId?.AvatarUrl ? <Avatar src={data?.AdminId?.AvatarUrl} size={28} /> : <CircleUser />}
                                                                <h1>{data?.AdminId?.Name}</h1>
                                                            </div>
                                                            <h2 className='text-start text-sm mt-1'>{data?.AdminId?.Email}</h2>
                                                            <h3 className='text-start text-xs mt-1 text-slate-300'>{formatDate(data?.createdAt)}</h3>
                                                        </motion.div>
                                                    </Tooltip>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="days">
                                {datedData?.length == 0 && <h1>No data found for <span
                                    className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground")}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date?.from ? (
                                        date.to ? (
                                            <>
                                                {format(date.from, "LLL dd, y")} -{" "}
                                                {format(date.to, "LLL dd, y")}
                                            </>
                                        ) : (
                                            format(date.from, "LLL dd, y")
                                        )
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </span></h1>}
                                <div className="w-full overflow-y-scroll h-[82vh]">
                                    <div className="flex flex-wrap">
                                        {datedData?.map((data: any) => (
                                            <div key={data?._id} className="w-full lg:w-3/12 p-1">
                                                <Link href={`/superadmin/admins/${data?._id}`}>
                                                    <Tooltip title="click to view">
                                                        <motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }} className="w-full bg-slate-800 rounded-md p-3 hover:shadow-md border-slate-600 border">
                                                            <div className="flex gap-1 items-center">
                                                                {data?.AdminId?.AvatarUrl ? <Avatar src={data?.AdminId?.AvatarUrl} size={28} /> : <CircleUser />}
                                                                <h1>{data?.AdminId?.Name}</h1>
                                                            </div>
                                                            <h2 className='text-start text-sm mt-1'>{data?.AdminId?.Email}</h2>
                                                            <h3 className='text-start text-xs mt-1 text-slate-300'>{formatDate(data?.createdAt)}</h3>
                                                        </motion.div>
                                                    </Tooltip>
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    )
            }

        </div>
    )
}

export default AdminsManaging