import { useMutation } from "react-query";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import appConstant from "config/constants";
import { useToast } from "react-native-toast-notifications";


function resendOtp() {
    const toast = useToast();
    return useMutation(async (data) => {
        let token = await SecureStore.getItemAsync('userToken');
        return await axios({
            method: 'post',
            url: `${appConstant.apiUrl}/resend_otp`,
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
                        toast.show(data.message, { type: "success", duration: 2000 });
                    }
                }
            }
        });
}

export { resendOtp }