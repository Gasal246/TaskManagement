"use client"
import { useFindUserById } from '@/query/client/userQueries'
import { Avatar } from 'antd';
import { EllipsisVertical } from 'lucide-react';
import React, { useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import EditProfileDialog from '@/components/admin/EditProfileDialog';
import { Button } from '@/components/ui/button';
import ChangeDpDialog from '@/components/admin/ChangeDpDialog';
import { useSession } from 'next-auth/react';


const ProfilePage = ({ params }: { params: { id: string } }) => {
    const { data: session }: any = useSession();
    const { data: userData, isLoading: loadingUserData } = useFindUserById(params?.id);
    return (
        <div className='w-full h-screen pb-20 p-4 lg:p-10'>
            <div className="flex justify-center gap-1">
                <Avatar size={150} src={userData?.AvatarUrl || '/avatar.png'} />
                {userData && session?.user?.id == userData?._id && <div>
                    <Popover>
                        <PopoverTrigger><EllipsisVertical className='hover:bg-black p-1 rounded-full cursor-pointer border border-border' /></PopoverTrigger>
                        <PopoverContent className='w-[150px] p-1 space-y-1'>
                            {userData && <EditProfileDialog trigger={<Button className='w-full'>Edit Info</Button>} userData={userData} />}
                            <ChangeDpDialog trigger={<Button className='w-full'>Change Dp</Button>} userid={userData?._id} prevAvatar={userData?.AvatarUrl || '/avatar.png'} />
                            <Button className='w-full'>Reset Password</Button>
                        </PopoverContent>
                    </Popover>
                </div>}
            </div>
            <div className="flex justify-center flex-col items-center py-2 pr-2">
                <h1 className='text-xl font-semibold leading-4'>{userData?.Name}</h1>
                <h1 className='text-sm'>{userData?.Email}</h1>
            </div>
            <div className="flex h-[40dvh] w-full justify-center items-center flex-col text-slate-400">
                We are in the development Stage Now..
                <h4 className='text-xs'>You could view and update this information anytime now, under the company security policy profile is not completly setuped.</h4>
            </div>
        </div>
    )
}

export default ProfilePage