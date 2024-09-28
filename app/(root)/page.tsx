/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import LoaderSpin from "@/components/shared/LoaderSpin";
import { ThemeChanger } from "@/components/theme/ThemeChanger";
import { Badge } from "@/components/ui/badge";
import { useFindUserById } from "@/query/client/userQueries";
import { Tooltip } from "antd";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { data: session }: any = useSession();
  const { data: userData, isLoading: userDataLoading } = useFindUserById(session?.user?.id);
  useEffect(() => {
    if(userData){
      if(userData?.Role !== 'admin'){
        return router.replace('/staff');
      }else{
        return router.replace('/admin')
      }
    }
  }, [userData])
  return (
    <main className="flex h-screen flex-col items-center justify-center p-24">
      <div className="flex flex-wrap items-start gap-1">
        <h1 className="text-[3em] font-black">TaskManager</h1>
        <Tooltip title="we are currently on our Development stage, so please report any Issues ASAP you face them. 😁"><Badge>Dev</Badge></Tooltip>
      </div>
      <h1 className="flex gap-1 items-center">Loading User Interfaces.. ( kindly Reload if you not automatically routed ) <LoaderSpin size={40} /></h1>
    </main>
  );
}
