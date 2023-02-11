import { useQuery } from "react-query";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import appConstant from "config/constants";

function fetchAllCourses() {
    return useQuery("allCourses", async() => {
        let token = await SecureStore.getItemAsync('userToken');
        return await axios({
            method: 'get',
            url: `${appConstant.apiUrl}/courses`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => res.data);
    });
}

function fetchCourseById(id) {
    return useQuery("oneProduct", async () => {
        let token = await SecureStore.getItemAsync('userToken');
        return await axios({
            method: 'get',
            url: `${appConstant.apiUrl}/courses/${id}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => res.data);
    });
}

function fetchEnrolledCourses() {
    return useQuery("enrolledCourses", async() => {
        let token = await SecureStore.getItemAsync('userToken');
        return await axios({
            method: 'get',
            url: `${appConstant.apiUrl}/courses_enrolled`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => res.data);
    });
}

export {fetchAllCourses,fetchCourseById,fetchEnrolledCourses}