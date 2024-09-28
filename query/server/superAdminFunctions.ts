import axiosInstance from "./axiosInstace";

export async function getAdminInfo(userid: string){
    try {
        const res = await axiosInstance.get(`/api/superadmin?id=${userid}`);
        return res.data;
    } catch (error) {
        console.log(error)
    }
}