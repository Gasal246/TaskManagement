import axios from "axios";

// ADMIN SIDE
export async function getAvailableStaffs(adminId: string, roles?: userTypes[]){
    try {
        const query = roles ? `?roles=${encodeURIComponent(roles.join(','))}` : '';
        const res = await axios.get(`/api/admin/get-available-staffs/${adminId}${query}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function editDepName(depId: string, newName:string){
    try {
        const res = await axios.post(`/api/department/change-name`, { depId, newName });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function addDepStaff(depId: string, staffid: string){
    try {
        const res = await axios.post('/api/department/add-staff', { depId, staffid });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function removeDepStaff(depId: string, staffid: string){
    try {
        const res = await axios.post('/api/department/remove-staff', { depId, staffid });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getRegionalStaffs(depid: string, regid: string){
    try {
        const res = await axios.get(`/api/region/get-dep-staffs?depid=${depid}&regid=${regid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getAreaStaffs(depid: string, regid: string, areaid: string){
    try {
        const res = await axios.get(`/api/area/get-dep-staffs?depid=${depid}&regid=${regid}&areaid=${areaid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function addRegionalStaff(depId: string, staffId: string, regId: string){
    try {
        const res = await axios.post(`/api/region/add-dep-staff`, { depId, staffId, regId });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function addAreaStaff(depId: string, regId: string, areaId: string, staffId: string){
    try {
        const res = await axios.post('/api/area/add-dep-staff', { depId,  regId, areaId, staffId });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getDepartmentsByHeadId(userid: string){
    try {
        const res = await axios.get(`/api/department/get-all/headid/${userid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}