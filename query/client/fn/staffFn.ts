import axios from "axios";

export async function getDepartmentByUserid ( userid: string ) {
    try {
        const res = await axios.get(`/api/staff/department/user/${userid}`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
}