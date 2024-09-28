import axios from "axios"
import { DateRange } from "react-day-picker";

export async function getSuperUserById(id: string){
    try {
        const res = await axios.get(`/api/superadmin/get-id/${id}`);
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export async function addNewAdmin(data: FormData) {
    try {
        const res = await axios.post('/api/admin/create', data);
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export async function addDemoDep(data: FormData){
    try {
        const res = await axios.post('/api/superadmin/add-demo-dep', data);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getDemoDeparments(){
    try {
        const res = await axios.get('/api/superadmin/get-demo-deps');
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteDemoDepartment(departmentid: string){
    try {
        const res = await axios.post('/api/department/delete', { departmentid });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteAdminDoc(formData: FormData){
    try {
        const res = await axios.post('/api/superadmin/delete-admin-doc', formData );
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteAdminDep(formData: FormData){
    try {
        const res = await axios.post('/api/admin/delete-dep', formData );
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getAdmins(filter: string){
    try {
        const res = await axios.get(`/api/admin/getadmins?filter=${filter}`);
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export async function getAdminsWithin(days: DateRange  | undefined){
    try {
        const res = await axios.get(`/api/admin/getadmins?filter=days&from=${days?.from}&to=${days?.to}`);
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export async function searchAdmins(search: string){
    try {
        const res = await axios.get(`/api/admin/search?search=${search}`);
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export async function findAdminByAdminid(adminid: string){
    try {
        const res = await axios.get(`/api/admin/getby-adminid/${adminid}`);
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export async function changeAdminStatus(adminid: string, status: string){
    try {
        const res = await axios.post('/api/admin/edit-status', { adminid, status });
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export async function deleteAdminData(adminid: string){
    try {
        const res = await axios.post('/api/admin/delete', { adminid });
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export async function getDepartmentById(departmentid: string){
    try {
        const res = await axios.get(`/api/department/get-id/${departmentid}`);
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export async function editDepartment(departmentid: string, DepartmentName: string, MaximumStaffs: string, AllowProjects: boolean, AllowTasks: boolean){
    try {
        const res = await axios.post('/api/department/edit', { departmentid, DepartmentName, MaximumStaffs, AllowProjects, AllowTasks });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function editAdmin(adminId: string, name: string, email: string){
    try {
        const res = await axios.post('/api/admin/editdata', { adminId, name, email });
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export async function getAllAdminUsers(adminId: string){
    try {
        const res = await axios.get(`/api/superadmin/get-admin-users/${adminId}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function addMoreDep(formData: FormData){
    try {
        const res = await axios.post(`/api/admin/add-dep`, formData);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function addAdminDoc(formData: FormData){
    try {
        const res = await axios.post('/api/superadmin/upload-admin-doc', formData);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}