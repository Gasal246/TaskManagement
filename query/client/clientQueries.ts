import { QUERY_KEYS } from "../queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addClient, deleteClient, getClientById, getClients, updateClient } from "./fn/clientFn";

export const useGetAllClients = (userid: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_CLIENTS],
        queryFn: async () => await getClients(userid),
        enabled: !!userid
    })
}

export const useAddClients = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: FormData) => addClient(formData),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ALL_CLIENTS]
            })
        }
    })
}

export const useGetClientById = (userid: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CLIENT_BY_ID, userid],
        queryFn: async () => await getClientById(userid),
        enabled: !!userid
    })
}

export const useUpdateClient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: FormData) => updateClient(formData),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CLIENT_BY_ID, data?._id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ALL_CLIENTS]
            })
        }
    })
}

export const useDeleteClient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (clientId: string) => deleteClient(clientId),
        onSuccess: (data: any) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ALL_CLIENTS]
            })
        }
    })
}