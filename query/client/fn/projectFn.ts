import axios from "axios";

export async function getAllProjectsAdmin(adminid: string, filter: string){
    try {
        const res = await axios.get(`/api/project/get-all?adminid=${adminid}&filter=${filter}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function addNewProject(formData:FormData){
    try {
        const res = await axios.post('/api/project/add-project', formData);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getAllUserProjects(userid: string, filter: ProjectGetFilters){
    try {
        const res = await axios.get(`/api/project/get-projects?userid=${userid}&filter=${filter}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function searchProjects(userid: string, search: string){
    try {
        const res = await axios.get(`/api/project/search?userid=${userid}&search=${search}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getProjectById(projectid: string){
    try {
        const res = await axios.get(`/api/project/get-id/${projectid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function addProjectDoc (formData: FormData){
    try {
        const res = await axios.post('/api/project/add-doc', formData);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteProjectDoc( projectid: string, docid: string ){
    try {
        const res = await axios.post('/api/project/delete-doc', { projectid, docid });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getProjectFlows( projectid: string ){
    try {
        const res = await axios.get(`/api/project/get-flows/${projectid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function addProjectFlow(formData: FormData){
    try {
        const res = await axios.post(`/api/project/add-flow`, formData);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteProjectFlow(projectid: string, flowid: string){
    try {
        const res = await axios.post('/api/project/remove-flow', { projectid, flowid });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getProjectComments(projectid: string){
    try {
        const res = await axios.get(`/api/project/get-comments/${projectid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function addProjectComment(formData: FormData){
    try {
        const res = await axios.post('/api/project/add-comment', formData);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteProjectComment(projectid: string, commentid: string){
    try {
        const res = await axios.post('/api/project/delete-comment', { projectid, commentid });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function changeProjectDeadline(projectid: string, deadline: string){
    try {
        const res = await axios.post('/api/project/actions/change-deadline', { projectid, deadline });
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export async function getAllProjectAnalytics(userid: string, filter: ProjectGetFilters){
    try {
        const res = await axios.get(`/api/project/analatics/all-projects?userid=${userid}&filter=${filter}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function projectOnView(projectid: string){
    try {
        const res = await axios.post(`/api/project/actions/on-view`, { projectid });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function approveProject(projectid: string){
    try {
        const res = await axios.post(`/api/project/actions/approve`, { projectid });
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export async function updateProjectDetails(formData: FormData){
    try {
        const res = await axios.post(`/api/project/actions/update-details`, formData);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function changeDocumentAccess(formData: FormData){
    try {
        const res = await axios.post(`/api/project/actions/change-doc-access`, formData);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function completeOrForwardProject(formData: FormData){
    try {
        
    } catch (error) {
        console.log(error);
    }
}