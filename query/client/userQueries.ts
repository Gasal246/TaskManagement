import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEYS } from "../queryKeys";
import { addNewTask, deleteTask, findByMail, findUserById, getTaskComments, getTaskById, sendEmailVerificationOtp, setupNewPassword, verifyOTP, addTaskComment, removeTaskComment, getChoosableStaffs, getAllNotifications, notificationInview, resetPassword, getUserRole, getAllTasks, sendMagicLink, findHeadByUserid, getUserUnderUserid, getAllTodos, checkTodoHandler, deleteTodo, addTodo } from "./fn/userFunctions";

export const useFindByMailId = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (email: string) => findByMail(email),
    })
}

export const useSendEmailVerification = () => {
    return useMutation({
        mutationFn: (email: string) => sendEmailVerificationOtp(email),
    })
}

export const useVerifyOtp = () => {
    return useMutation({
        mutationFn: ({ email, otp }: { email: string, otp: string }) => verifyOTP(email, otp),
    })
}

export const useSetupUserPassword = () => {
    return useMutation({
        mutationFn: ({ email, password, pin }: { email: string, password: string, pin: string }) => setupNewPassword(email, password, pin),
    })
}

export const useFindUserById = (userid: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, userid],
        queryFn: async () => await findUserById(userid),
        enabled: !!userid
    })
}

export const useFindHeadInfo = ( userid: string ) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_HEAD_INFO],
        queryFn: async () => await findHeadByUserid(userid),
        enabled: !!userid
    })
}

export const useSendPasswordMagicLink = () => {
    return useMutation({
        mutationFn: ({ email }: { email: string }) => sendMagicLink(email),
    })
}

// ###### TASKS OF STAFF

export const useGetAllTasks = (userid: string, filter: TaskTypes) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_TASKS, userid],
        queryFn: async () => await getAllTasks(userid, filter),
        enabled: !!userid
    })
}

export const useGetTaskById = (taskid: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_TASK_BY_ID, taskid],
        queryFn: async () => await getTaskById(taskid),
        enabled: !!taskid
    })
}

export const useAddNewTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ formData }: { formData: FormData }) => addNewTask(formData),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ALL_TASKS]
            })
        }
    })
}

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ taskid }: { taskid: string }) => deleteTask(taskid),
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

export const useGetComments = (taskid: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_COMMENTS_BY_TASKID, taskid],
        queryFn: async () => await getTaskComments(taskid),
        enabled: !!taskid
    })
}

export const useAddTaskComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ formData }: { formData: FormData }) => addTaskComment(formData),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_TASK_BY_ID, data?._id]
            })
        }
    })
}

export const useRemoveTaskComment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ taskid, commentid }: { taskid: string, commentid: string }) => removeTaskComment(taskid, commentid),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_TASK_BY_ID, data?._id]
            })
        }
    })
}

export const useGetChoosableStaffs = (userid: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CHOOSE_STAFFS, userid],
        queryFn: async () => await getChoosableStaffs(userid),
        enabled: !!userid
    })
}

export const useGetAllNotifications = (userid: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_NOTIFICATIONS, userid],
        queryFn: async () => await getAllNotifications(userid),
        enabled: !!userid
    })
}

export const useNotificationInview = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (notificationid: string) => notificationInview(notificationid),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ALL_NOTIFICATIONS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ALL_NOTIFICATIONS, data?.ReceiverId]
            })
        }
    })
}

export const useResetPassword = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (formData: FormData) => resetPassword(formData),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?._id]
            })
        }
    })
}

export const useGetUserRole = (userid: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_ROLE, userid],
        queryFn: async () => await getUserRole(userid),
        enabled: !!userid
    })
}

export const useGetStaffsUnderUserid  = (userid: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_STAFFS_UNDER_USERID, userid],
        queryFn: async () => await getUserUnderUserid(userid),
        enabled: !!userid
    })
}

export const useGetAllTodo = ( userid: string ) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_TODO],
        queryFn: async () => getAllTodos(userid),
        enabled: !!userid
    })
}

export const useCheckTodo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ todoid, check }: { todoid: string, check: 'completed' | 'pending' }) => checkTodoHandler(todoid, check),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ALL_TODO]
            })
        }
    })
}

export const useDeleteTodo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ( todoid: string ) => deleteTodo(todoid),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ALL_TODO]
            })
        }
    })
}

export const useAddTodo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ( formData: FormData ) => addTodo(formData),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ALL_TODO]
            })
        }
    })
}

