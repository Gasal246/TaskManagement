import { QUERY_KEYS } from "../queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getAllProjectAnalytics } from "./fn/projectFn";
import { getAllTaskAnalytics } from "./fn/tasksFn";
import { getProjectCompletePendingByUserid } from "./fn/analyticsFn";

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

