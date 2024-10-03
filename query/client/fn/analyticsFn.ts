import axios from "axios";

export async function getProjectCompletePendingByUserid(userid: string) {
    try {
        const res = await axios.get(`/api/data/projects/yearly/completed-pending/${userid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getTasksAnalyticsPi ( userid: string ) {
    try {
        const res = await axios.get(`/api/task/analytics/pitasks/${userid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getProjectStatistics ( userid: string ) {
    try {
        const res = await axios.get(`/api/project/analatics/pistat/${userid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

