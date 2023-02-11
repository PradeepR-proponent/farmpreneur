import { useQuery } from "react-query";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import appConstant from "config/constants";


const getBanner = async () => {
    let token = await SecureStore.getItemAsync('userToken');
    try {
        const { data } = await axios({
            method: 'get',
            url: `${appConstant.apiUrl}/banner`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        return data
    } catch (error) {
        return error
    }
}

function fetchAllBanner() {
    return useQuery("allBanner", async () => {
        let token = await SecureStore.getItemAsync('userToken');
        return await axios({
            method: 'get',
            url: `${appConstant.apiUrl}/banner`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => {

            console.log(res)

            res.data
        });
    });
}



export { fetchAllBanner, getBanner }