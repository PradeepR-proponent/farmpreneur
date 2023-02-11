import { useQuery } from "react-query";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import appConstant from "config/constants";

function fetchAllProducts() {
    return useQuery("allProducts", async() => {
        let token = await SecureStore.getItemAsync('userToken');
        return await axios({
            method: 'get',
            url: `${appConstant.apiUrl}/products`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => res.data);
    });
}

function fetchProductById(id) {
    return useQuery("oneProduct", async () => {
        let token = await SecureStore.getItemAsync('userToken');
        return await axios({
            method: 'get',
            url: `${appConstant.apiUrl}/products/${id}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => res.data);
    });
}

export {fetchAllProducts,fetchProductById}