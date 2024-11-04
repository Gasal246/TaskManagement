import { QUERY_KEYS } from "../queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getAllProjectAnalytics } from "./fn/projectFn";
import { getAllTaskAnalytics } from "./fn/tasksFn";
import { getAdminProjectAnalytics, getAdminTasksAnalytics, getProjectCompletePendingByUserid, getProjectStatistics, getTasksAnalyticsPi } from "./fn/analyticsFn";

export const useGetAllProjectAnalytics = (userid: string, filter: ProjectGetFilters) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_PROJECTS_ANALYTICS, userid, filter],
        queryFn: async () => await getAllProjectAnalytics(userid, filter),
        enabled: !!userid
    })
}

export const useGetAllTaskAnalytics = (userid: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_PROJECTS_ANALYTICS, userid],
        queryFn: async () => await getAllTaskAnalytics(userid),
        enabled: !!userid
    })
}

export const useGetProjectCompletedPendingAnalytics = (userid: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_PROJECT_COMPLETED_PENDING_CHART],
        queryFn: async () => await getProjectCompletePendingByUserid(userid),
        enabled: !!userid
    })
}

export const useGetTaskAnalyticsPi = (userid: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_TASKS_ANALYTICS_PI_CHART],
        queryFn: async () => await getTasksAnalyticsPi(userid),
        enabled: !!userid
    })
}

export const useGetProjectStatistics = ( userid: string ) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_PROJECT_STATISTICS, userid],
        queryFn: async () => await getProjectStatistics(userid),
        enabled: !!userid
    })
}

export const useGetAdminTasksAnalytics = (adminid: string ) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ADMIN_TASK_ANALYTICS, adminid],
        queryFn: async () => await getAdminTasksAnalytics(adminid),
        enabled: !!adminid
    })
}

export const useGetAdminProjectAnalytics = (adminid: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ADMIN_PROJECT_ANALYTICS, adminid],
        queryFn: async () => await getAdminProjectAnalytics(adminid),
        enabled: !!adminid
    })
}

