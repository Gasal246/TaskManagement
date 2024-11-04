import Admindatas from "@/models/adminDataCollection";
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

export async function getAdminTasksAnalytics ( adminid: string ) {
    try {
        const res = await axios.get(`/api/task/analytics/admin/${adminid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getAdminProjectAnalytics ( adminid: string ) {
    try {
        const res = await axios.get(`/api/project/analatics/admin/${adminid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

