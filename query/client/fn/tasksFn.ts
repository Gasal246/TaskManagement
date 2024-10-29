import axios from "axios";

export async function getAllTaskAnalytics (userid: string) {
    try {
        const res = await axios.get(`/api/task/analytics/${userid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function addNewActivity(formData: FormData){
    try {
        const res = await axios.post(`/api/task/action/add-activity`, formData);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function checkingActivity(formData: FormData){
    try {
        const res = await axios.post(`/api/task/action/activity-check`, formData);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function removeTaskActivity(taskid: string, activityid: string){
    try {
        const res = await axios.post(`/api/task/action/delete-activity`, { taskid, activityid });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function completeTask(formData: FormData){
    try {
        const res = await axios.post(`/api/task/action/complete-task`, formData);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function changeTaskTitle(taskid: string, title: string){
    try {
        const res = await axios.post(`/api/task/action/change-title`, { taskid, title });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function editTask(formData: FormData){
    try {
        const res = await axios.post('/api/task/edit-task', formData );
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function inviewTask(taskid: string){
    try {
        const res = await axios.post(`/api/task/action/view-task`, { taskid });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getProjectTasks (projectid: string) {
    try {
        const res = await axios.get(`/api/task/project-task/${projectid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getTaskForwardable ( userid: string ) {
    try {
        const res = await axios.get(`/api/task/forwardto?userid=${userid}`);
        return res.data;
    } catch ( error ) {
        console.log(error);
    }
}

