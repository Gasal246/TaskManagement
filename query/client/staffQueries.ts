import { useQuery } from "@tanstack/react-query"
import { QUERY_KEYS } from "../queryKeys"
import { getDepartmentByUserid, getSkillwiseUsers } from "./fn/staffFn"

export const useGetDepartmentByUserId = (userid: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_DEPARTMENT_BY_USERID],
        queryFn: async () => await getDepartmentByUserid(userid),
        enabled: !!userid
    })
}

export const useGetSkillwiseUsers = (skill: string, companyid: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_SKILLWISE_USERS, skill, companyid],
        queryFn: async () => await getSkillwiseUsers(skill, companyid),
        enabled: !!skill,
    });
};
