import { QUERY_KEYS } from "../queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getAllProjectAnalytics } from "./fn/projectFn";
import { getAllTaskAnalytics } from "./fn/tasksFn";

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
