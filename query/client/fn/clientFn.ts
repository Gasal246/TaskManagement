import axios from "axios"

export async function addClient(formData: FormData) {
    try {
        const res = await axios.post(`/api/client/add`, formData);
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export async function getClients(userid: string) {
    try {
        const res = await axios.get(`/api/client/get-all/${userid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getClientById(userid: string) {
    try {
        const res = await axios.get(`/api/client/get-id/${userid}?clientprojects=1`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function updateClient(formData: FormData) {
    try {
        const res = await axios.post(`/api/client/update`, formData);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteClient(clientId: string) {
    try {
        const res = await axios.post(`/api/client/delete`, { clientid: clientId });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}