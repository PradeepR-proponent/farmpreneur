import { useQuery } from "react-query";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import appConstant from "config/constants";

function fetchAllSupplierOrders() {
    return useQuery("allSupplierOrders", async() => {
        let token = await SecureStore.getItemAsync('userToken');
        return await axios({
            method: 'get',
            url: `${appConstant.apiUrl}/supplier_order`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => res.data);
    });
}

function fetchSupplierOrderById(id) {
    return useQuery("oneSupplierOrder", async() => {
        let token = await SecureStore.getItemAsync('userToken');
        return await axios({
            method: 'get',
            url: `${appConstant.apiUrl}/supplier_order/${id}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => res.data);
    });
}

export {fetchAllSupplierOrders,fetchSupplierOrderById}