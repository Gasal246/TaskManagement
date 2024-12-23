import axios from "axios"

export async function findByMail(email: string){
    try {
        const res = await axios.get(`/api/users/get-email/${email}`);
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export async function sendEmailVerificationOtp(email: string){
    try {
        const res = await axios.post(`/api/auth/send-email-vcode/${email}`);
        return res;
    } catch (error) {
        console.log(error)
    }
}

export async function verifyOTP(email: string, otp: string){
    try {
        const res = await axios.post(`/api/auth/verifyotp`, { email, otp });
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export async function setupNewPassword(email: string, password: string, pin: string){
    try {
        const res = await axios.post('/api/users/setup-pass', { email, password, pin });
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export async function findUserById(id: string){
    try {
        const res = await axios.get(`/api/users/get-id/${id}`);
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export async function findHeadByUserid( userid: string ) {
    try {
        const res = await axios.get(`/api/users/get-head/${userid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function sendMagicLink(email: string){
    try {
        const res = await axios.get(`/api/auth/send-magic-link/${email}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

// TASKS OF STAFF

export async function getTaskById(taskid: string){
    try {
        const res = await axios.get(`/api/task/getid/${taskid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getAllTasks(userid: string, filter: TaskTypes){
    try {
        const res = await axios.get(`/api/task/all-tasks/${userid}?filter=${filter}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function addNewTask(formData: FormData){
    try {
        const res = await axios.post('/api/task/add-task', formData );
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteTask(taskid: string){
    try {
        const res = await axios.post('/api/task/delete-task', { taskid });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getTaskComments(taskid: string){
    try {
        const res = await axios.get(`/api/task/get-comments/${taskid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function addTaskComment(formData: FormData){
    try {
        const res = await axios.post('/api/task/add-comment', formData );
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function removeTaskComment(taskid: string, commentid: string){
    try {
        const res = await axios.post('/api/task/remove-comment', { taskid, commentid });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getChoosableStaffs(userid: string){
    try {
        const res = await axios.get(`/api/staff/choosable-staffs/${userid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getAllNotifications(userid: string){
    try {
        const res = await axios.get(`/api/notifications/get-all/${userid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function notificationInview (notificationid: string){
    try {
        const res = await axios.get(`/api/notifications/inview/${notificationid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function resetPassword (formData: FormData){
    try {
        const res = await axios.post(`/api/users/update-password`, formData);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getUserRole ( userid: string ) {
    try {
        const res = await axios.get(`/api/users/get-role/${userid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getUserUnderUserid ( userid: string ) {
    try {
        const res = await axios.get(`/api/users/staffs-under/${userid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getAllTodos ( userid: string ) {
    try {
        const res = await axios.get(`/api/todo/get-all/${userid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function checkTodoHandler ( todoid: string, check: 'completed' | 'pending' ) {
    try {
        const res = await axios.post(`/api/todo/check/${todoid}`, { check });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteTodo ( todoid: string ) {
    try {
        const res = await axios.post(`/api/todo/delete/${todoid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function addTodo ( formData: FormData ) {
    try {
        const res = await axios.post(`/api/todo/add`, formData );
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

