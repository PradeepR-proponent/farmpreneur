import { useQuery, useMutation } from "react-query";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import appConstant from "config/constants";
import { useToast } from "react-native-toast-notifications";
import {
    CLEAR_CART
} from "slice/cartSlice";
import { useDispatch } from "react-redux";

function fetchAllBuyerOrders() {
    return useQuery("allSupplierOrders", async () => {
        let token = await SecureStore.getItemAsync('userToken');
        return await axios({
            method: 'get',
            url: `${appConstant.apiUrl}/buyer_order`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => res.data);
    });
}

function fetchBuyerOrderById(id) {
    return useQuery("oneSupplierOrder", async () => {
        let token = await SecureStore.getItemAsync('userToken');
        return await axios({
            method: 'get',
            url: `${appConstant.apiUrl}/buyer_order/${id}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => res.data);
    });
}

function createOrder() {
    const toast = useToast();
    const dispatch = useDispatch();
    return useMutation(async (data) => {
        let token = await SecureStore.getItemAsync('userToken');
        return await axios({
            method: 'post',
            url: `${appConstant.apiUrl}/buyer_order/`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            data: data
        }).then((res) => res.data);
    },
        {
            onSuccess: (data) => {
                if (data != undefined) {
                    if (data.error != undefined)
                        toast.show(data.message, { type: "danger", duration: 2000 });
                    else {
                        dispatch(CLEAR_CART());
                        toast.show(data.message, { type: "success", duration: 2000 });
                    }
                }
            }
        });
}

export { fetchAllBuyerOrders, fetchBuyerOrderById, createOrder }