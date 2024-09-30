import axios from "axios";

export async function getProjectCompletePendingByUserid(userid: string) {
    try {
        const res = await axios.get(`/api/data/projects/yearly/completed-pending/${userid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}