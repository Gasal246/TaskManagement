import { QUERY_KEYS } from "../queryKeys";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addAreaStaff, addDepStaff, addRegionalStaff, editDepName, getAreaStaffs, getAvailableStaffs, getDepartmentsByHeadId, getRegionalStaffs, removeDepStaff} from "./fn/depFunctions";

// ADMIN SIDE
export const useGetAvailableStaffs = (adminId: string, roles?: userTypes[]) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_AVAILABLE_STAFFS, adminId],
        queryFn: async () => await getAvailableStaffs(adminId, roles),
        enabled: !!adminId
    })
}

export const useEditDepName = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ depid, newName }:{ depid: string, newName: string }) => editDepName(depid, newName),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_DEPARTMENT_BY_ID, data?._id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_DEPARTMENT_BY_ID]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ALL_DEPARTMENTS, data?.AdminId],
            })
        }
    })
}

export const useAddDepStaff = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ depid, staffid }:{ depid: string, staffid: string }) => addDepStaff(depid, staffid),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_DEPARTMENT_BY_ID, data?._id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_DEPARTMENT_BY_ID]
            })
        }
    })
}

export const useRemoveDepStaff = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ depid, staffid }:{ depid: string, staffid: string }) => removeDepStaff(depid, staffid),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_DEPARTMENT_BY_ID, data?._id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_DEPARTMENT_BY_ID]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_REGIONAL_STAFFS, data?._id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_AREA_STAFFS, data?._id]
            })
        }
    })
}

export const useGetRegionalStaffs = (depid: string, regid: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_REGIONAL_STAFFS, depid],
        queryFn: async () => await getRegionalStaffs(depid, regid),
        enabled: !!depid
    })
}

export const useGetAreaStaffs = (depid: string, regid: string, areaid: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_AREA_STAFFS, depid],
        queryFn: async () => await getAreaStaffs(depid, regid, areaid),
        enabled: !!depid
    })
}

export const useAddRegionalStaff = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ depid, staffid, regid }:{ depid: string, staffid: string, regid: string }) => addRegionalStaff(depid, staffid, regid),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_DEPARTMENT_BY_ID, data?._id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_REGIONAL_STAFFS, data?._id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_REGION_ID]
            })
        }
    })
}

export const useAddAreaStaff = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ depid, staffid, regid, areaid }:{ depid: string, staffid: string, regid: string, areaid: string }) => addAreaStaff(depid, regid, areaid, staffid),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_DEPARTMENT_BY_ID, data?._id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_AREA_STAFFS, data?._id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_REGION_ID]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_AREA_ID]
            })
        }
    })
}

export const useShowDepartmentForHeads = (userid: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_DEPARTMENTS_BY_HEADID, userid],
        queryFn: async () => await getDepartmentsByHeadId(userid),
        enabled: !!userid
    })
}