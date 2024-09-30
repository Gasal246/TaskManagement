import axios from "axios";

export async function getAllTaskAnalytics (userid: string) {
    try {
        const res = await axios.get(`/api/task/analytics/${userid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}