import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "../queryKeys";
import { addNewActivity, changeTaskTitle, checkingActivity, completeTask, editTask, getProjectTasks, inviewTask, removeTaskActivity } from "./fn/tasksFn";

export const useAddNewTaskActivity = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: FormData) => addNewActivity(formData),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_TASK_BY_ID, data?._id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ALL_TASKS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECT_TASKS]
            })
        }
    })
}

export const useCheckTaskActivity = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: FormData) => checkingActivity(formData),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_TASK_BY_ID, data?._id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ALL_TASKS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECT_TASKS]
            })
        }
    })
}

export const useRemoveTaskActivity = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ taskid, activityid }:{ taskid: string, activityid: string }) => removeTaskActivity(taskid, activityid),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_TASK_BY_ID, data?._id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ALL_TASKS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECT_TASKS]
            })
        }
    })
}

export const useCompleteTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: FormData) => completeTask(formData),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_TASK_BY_ID, data?._id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ALL_TASKS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECT_TASKS]
            })
        }
    })
}

export const useChangeTaskTitle = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ taskid, title }:{ taskid: string, title: string }) => changeTaskTitle(taskid, title),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_TASK_BY_ID, data?._id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ALL_TASKS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECT_TASKS]
            })
        }
    })
}

export const useEditTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ formData }: { formData: FormData }) => editTask(formData),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_TASK_BY_ID, data?._id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ALL_TASKS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PROJECT_TASKS]
            })
        }
    })
}

export const useTaskOnView = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ taskid }: { taskid: string }) => inviewTask(taskid),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_TASK_BY_ID, data?._id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ALL_TASKS]
            })
        }
    })
}

export const useGetProjectTasks = (projectid: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_PROJECT_TASKS, projectid],
        queryFn: async () => await getProjectTasks(projectid),
        enabled: !!projectid
    })
}
