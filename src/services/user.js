import { useQuery } from "react-query";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import appConstant from "config/constants";

function fetchUserById(id) {
    return useQuery("getUser", async() => {
        let token = await SecureStore.getItemAsync('userToken');
        return await axios({
            method: 'get',
            url: `${appConstant.apiUrl}/user/${id}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => res.data);
    });
}

function fetchUserMembership(){
    return useQuery("getUserMembership", async() => {
        let token = await SecureStore.getItemAsync('userToken');
        return await axios({
            method: 'get',
            url: `${appConstant.apiUrl}/user_subs`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => res.data);
    });
}

function fetchSupplierStats(){
    return useQuery("getSupplierStats", async() => {
        let token = await SecureStore.getItemAsync('userToken');
        return await axios({
            method: 'get',
            url: `${appConstant.apiUrl}/fetch_stats`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => res.data);
    });
}

export {fetchUserById,fetchUserMembership,fetchSupplierStats}