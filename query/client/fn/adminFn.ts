import axios from "axios";

export async function addNewRegion(name: string){
    try {
        const res = await axios.post('/api/region/add-region', { name });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getAllRegions(adminid: string){
    try {
        const res = await axios.get(`/api/region/get-all/${adminid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getRegionById(regid: string){
    try {
        const res = await axios.get(`/api/region/get-id/${regid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function addNewArea(name: string, regionId: string){
    try {
        const res = await axios.post('/api/area/add-area', { name, regionId });
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export async function getAllAreas(regionId: string){
    try {
        const res = await axios.get(`/api/area/get-all/${regionId}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getAllAdminAreas (userid: string) {
    try {
        const res = await axios.get(`/api/area/get-all/admin/${userid}`);
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export async function editRegionName(name: string, regionId: string){
    try {
        const res = await axios.post('/api/region/edit-name', { name, regionId });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteRegion(regionId: string){
    try {
        const res = await axios.post('/api/region/delete', { regionId });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getAreaById(areaid: string){
    try {
        const res = await axios.get(`/api/area/get-id/${areaid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function editAreaName(name: string, areaid: string){
    try {
        const res = await axios.post('/api/area/edit-name', { name, areaid });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteArea(areaid: string){
    try {
        const res = await axios.post('/api/area/delete', { areaid });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getAllStaffs(adminid: string){
    try {
        const res = await axios.get(`/api/staff/of-admin/${adminid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function addNewStaff(formData: FormData){
    try {
        const res = await axios.post('/api/staff/add', formData);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getOneStaff(staffid: string){
    try {
        const res = await axios.get(`/api/staff/get-staff/${staffid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function addStaffSkill(staffId: string, skill: string){
    try {
        const res = await axios.post(`/api/staff/add-skill`, { staffId, skill });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function removeStaffSkill(staffId: string, skill: string){
    try {
        const res = await axios.post(`/api/staff/delete-skill`, { staffId, skill });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function addStaffDocument(formData: FormData){
    try {
        const res = await axios.post('/api/staff/add-doc', formData);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteStaffDocument(staffid: string, docid: string){
    try {
        const res = await axios.post('/api/staff/delete-doc', { staffid, docid });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteStaff(staffid: string){
    try {
        const res = await axios.post('/api/staff/delete', { staffid });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function updateStaff(formData: FormData){
    try {
        const res = await axios.post('/api/staff/edit-staff', formData);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function updateStaffStatus(staffid: string, status: StaffStatus){
    try {
        const res = await axios.post('/api/staff/status', { staffid, status });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

// ######### DEPARTMENT ROUTES ########

export async function getAllDepartments(adminid: string){
    try {
        const res = await axios.get(`/api/department/get-all/${adminid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getDepartmentById(departmentid: string){
    try {
        const res = await axios.get(`/api/department/get-id/${departmentid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function addDepartmentHead(depid: string, staffid: string){
    try {
        const res = await axios.post('/api/department/add-head', { depid, staffid });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function addDepartmentRegion(depid: string, regionid: string){
    try {
        const res = await axios.post('/api/department/add-region', { depid, regionid });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getDepartmentRegion(depid: string, regionid: string){
    try {
        const res = await axios.get(`/api/department/get-id/${depid}/${regionid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function addDepartmentArea(depid: string, regionid: string, areaid: string){
    try {
        const res = await axios.post('/api/department/add-area', { depid, regionid, areaid });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteDepartmentRegion(depid: string, regionid: string){
    try {
        const res = await axios.post('/api/department/delete-region', { depid, regionid });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteDepartmentArea(depid: string, regionid: string, areaid: string){
    try {
        const res = await axios.post('/api/department/delete-area', { depid, regionid, areaid });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getStaffsRegionAndArea(adminid: string){
    try {
        const res = await axios.get(`/api/staff/get-staffs-region-area/${adminid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getSelectableRegionalHeads(userid: string) {
    try {
        const res = await axios.get(`/api/staff/select/regionalhead/${userid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getSelectableAreaHead(userid: string) {
    try {
        const res = await axios.get(`/api/staff/select/areahead/${userid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function addStaffToDepartment(depid: string, staffid: string, areaid?: string){
    try {
        const res = await axios.post('/api/department/add-staff', { depid, staffid, areaid });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function addRegionalHead(regionid: string, staffid: string){
    try {
        const res = await axios.post('/api/region/add-head', { regionid, staffid });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function addAreaHead(areaid: string, staffid: string){
    try {
        const res = await axios.post('/api/area/add-head', { areaid, staffid });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function editProfileInfo( userid: string, email: string, name: string ){
    try {
        const res = await axios.post('/api/admin/edit-info', { userid, email, name });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function changeProfilePic( formData: FormData ){
    try {
        const res = await axios.post('/api/users/change-pfp', formData );
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function removeDepartmentStaff(depid: string, staffid: string){
    try {
        const res = await axios.post('/api/department/remove-staff', { depid, staffid });
        return res.data;
    } catch (error) {
        console.log(error)
    }
}

export async function getAllSkills(adminId: string){
    try {
        const res = await axios.get(`/api/skills/get-all/${adminId}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function addNewSkill(adminId: string, skill: string){
    try {
        const res = await axios.post('/api/skills/add', { adminId, skill });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function editSkills(adminId: string, skill: string, correctedSkill: string){
    try {
        const res = await axios.post('/api/skills/edit', { adminId, skill, correctedSkill });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteSkill(adminId: string, skill: string){
    try {
        const res = await axios.post('/api/skills/delete', { adminId, skill });
        return res.data;
    } catch (error) {
        console.log(error);
    }
}
