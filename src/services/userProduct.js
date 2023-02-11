import { useQuery, useMutation } from "react-query";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import appConstant from "config/constants";
import { useToast } from "react-native-toast-notifications";


function fetchAllProducts() {
    return useQuery("allUserProducts", async () => {
        let token = await SecureStore.getItemAsync('userToken');
        return await axios({
            method: 'get',
            url: `${appConstant.apiUrl}/user_product/`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => res.data);
    });
}

function fetchUserProduct(id) {
    return useQuery("products", async () => {
        let token = await SecureStore.getItemAsync('userToken');
        return await axios({
            method: 'get',
            url: `${appConstant.apiUrl}/user_product/${id}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => res.data);
    });
}

function updateUserProduct(id){
    const toast = useToast();
    return useMutation(async (data) => {
        let token = await SecureStore.getItemAsync('userToken');
        return await axios({
            method: 'put',
            url: `${appConstant.apiUrl}/user_product/${id}`,
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
                        toast.show(data.message, { type: "danger", duration: 10000 });
                    else
                        toast.show(data.message, { type: "success", duration: 10000 });
                }
            }
        });
}

function createUserProduct() {
    const toast = useToast();
    return useMutation(async (data) => {
        let token = await SecureStore.getItemAsync('userToken');
        return await axios({
            method: 'post',
            url: `${appConstant.apiUrl}/user_product/`,
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
                        toast.show(data.message, { type: "danger", duration: 10000 });
                    else
                        toast.show(data.message, { type: "success", duration: 10000 });
                }
            }
        });
}

export { fetchAllProducts,fetchUserProduct,createUserProduct,updateUserProduct };