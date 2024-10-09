import { useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "../queryKeys"
import { getDepartmentByUserid } from "./fn/staffFn"

export const useGetDepartmentByUserId = (userid: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS],
        queryFn: async () => await getDepartmentByUserid(userid),
        enabled: !!userid
    })
}

