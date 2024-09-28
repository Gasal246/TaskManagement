import { QUERY_KEYS } from "../queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { addNewProject, addProjectComment, addProjectDoc, addProjectFlow, approveProject, changeDocumentAccess, changeProjectDeadline, completeOrForwardProject, deleteProjectComment, deleteProjectDoc, deleteProjectFlow, getAllProjectsAdmin, getAllUserProjects, getProjectById, getProjectComments, getProjectFlows, projectOnView, searchProjects, updateProjectDetails } from "./fn/projectFn";

export const useGetAllProjectsAdmin = (adminid: string, filter: ProjectGetFilters) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_PROJECTS, filter],
        queryFn: async () => await getAllProjectsAdmin(adminid, filter),
        enabled: !!adminid
    })
}

export const useGetUserProjects = (userid: string, filter: ProjectGetFilters) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_PROJECTS, filter],
        queryFn: async () => await getAllUserProjects(userid, filter),
        enabled: !!userid
    })
}

export const useAddNewProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: FormData) => addNewProject(formData),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ALL_PROJECTS]
            })
        }
    })
}

export const useSearchProjects = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ userid, searchTerm }:{ userid: string, searchTerm: string }) => searchProjects(userid, searchTerm),
    })
}

export const useGetProjectById = (projectid: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_PROJECT_BY_ID, projectid],
        queryFn: async () => await getProjectById(projectid),
        enabled: !!projectid
    })
}

export const useAddProjectDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formdata:FormData) => addProjectDoc(formdata),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECT_BY_ID, data?._id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECT_BY_ID]
            })
        }
    })
}

export const useDeleteProjectDoc = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ projectid, docid }:{ projectid:string, docid: string }) => deleteProjectDoc(projectid, docid),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECT_BY_ID, data?._id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECT_BY_ID]
            })
        }
    })
}

export const useGetProjectFlows = (projectid: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_PROJECT_FLOWS, projectid],
        queryFn: async () => getProjectFlows(projectid),
        enabled: !!projectid
    })
}

export const useAddProjectFlow = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: FormData) => addProjectFlow(formData),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECT_BY_ID, data?._id],
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECT_FLOWS, data?._id],
            })
        }
    })
}

export const useDeleteProjectFlow = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ projectid, flowid }:{ projectid: string, flowid: string }) => deleteProjectFlow(projectid, flowid),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECT_BY_ID, data?._id],
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECT_FLOWS, data?._id],
            })
        }
    })
}

export const useGetProjectComments = (projectid: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_PROJECT_COMMENTS, projectid],
        queryFn: async () => await getProjectComments(projectid),
        enabled: !!projectid
    })
}

export const useAddProjectComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: FormData) => addProjectComment(formData),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECT_BY_ID, data?._id],
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECT_COMMENTS, data?._id],
            })
        }
    })
}

export const useDeleteProjectComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ projectid, commentid }:{ projectid: string, commentid: string }) => deleteProjectComment(projectid, commentid),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECT_BY_ID, data?._id],
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECT_COMMENTS, data?._id],
            })
        }
    })
}

export const useChangeProjectDeadline = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ projectid, deadiline }:{ projectid:string, deadiline: string }) => changeProjectDeadline(projectid, deadiline),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECT_BY_ID, data?._id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECT_BY_ID]
            })
        }
    })
}

export const useProjectOnView = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ projectid }:{ projectid: string }) => projectOnView(projectid),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECTS_ANALYTICS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ALL_PROJECTS]
            })
        }
    })
}

export const useApproveProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ projectid }:{ projectid: string }) => approveProject(projectid),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECTS_ANALYTICS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ALL_PROJECTS]
            })
        }
    })
}

export const useUpdateProjectDeatils = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: FormData) => updateProjectDetails(formData),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECT_BY_ID, data?._id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECT_BY_ID]
            })
        }
    })
}

export const useDocumentChangeAccess = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: FormData) => changeDocumentAccess(formData),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECT_BY_ID, data?._id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECT_DOCS, data?._id]
            })
        }
    })
}

export const useCompleteOrForwardProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: FormData) => completeOrForwardProject(formData),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECT_BY_ID, data?._id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ALL_PROJECTS, data?.AdminId]
            })
        }
    })
}
