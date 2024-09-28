import axiosInstance from './axiosInstace';

export async function getUserAuth(userid: string) {
    try {
        const res = await axiosInstance.get(`/api/users?id=${userid}`);
        return res?.data;
    } catch (error) {
        console.log(error)
    }
}