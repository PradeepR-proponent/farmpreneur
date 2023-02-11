import * as React from 'react';
import { SafeAreaView, View, StyleSheet, Image, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import appConstant from "config/constants";
import { StatusBar } from "expo-status-bar";
import { getSubPayLink } from 'services/payment';
import { fetchUserById } from 'services/user';
import Loader from "components/Loader";
import { useToast } from "react-native-toast-notifications";
import { userData, UPDATE_USER } from 'slice/userSlice';
import { useSelector, useDispatch } from "react-redux";
import ModalMessage from "components/Modal/ModalMessage";
import NotApproved from 'assets/card/info.jpg';
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { AuthContext } from "components/Auth/AuthContext";


export default function Membership(props) {

    // const user = useSelector(userData);
    const [paysuccess, setSuccess] = React.useState(false);
    const [payData, setPayData] = React.useState({});
    const [data, setData] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const toast = useToast();
    const success = props?.route?.params?.success;
    const dispatch = useDispatch();
    const { navigation } = props;
    const { signOut } = React.useContext(AuthContext);

    //fetch user
    // const { isLoading: loading, error, data, isFetching, refetch } = fetchUserById(user?.id);
    // if (error) toast.show(error.message, { type: "danger", duration: 10000 });

    //get pay link
    const paymentMutation = getSubPayLink();
    const { isLoading, isError, data: responseData, mutate: getLink } = paymentMutation;
    if (isError) toast.show(paymentMutation.error.message, { type: "danger", duration: 10000 });

    const getMembership = () => {
        getLink({
            "purpose": "MEMBERSHIP-" + data?.data?.id + "-" + new Date().getTime(),
            "amount": 10,
            "buyer_name": data?.data?.name,
            "phone": data?.data?.primary_phone,
            "user_id": data?.data?.id
        });
    }

    const getUser = async () => {
        let token = await SecureStore.getItemAsync('userToken');
        let user = await SecureStore.getItemAsync('user');
        user = JSON.parse(user);
        setLoading(true);
        if (user)
            return await axios({
                method: 'get',
                url: `${appConstant.apiUrl}/user/${user?.id}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then((res) => res.data)
                .then(r => { setLoading(false); setData(r); })
                .catch(e => {
                    setLoading(false); toast.show(e.message, { type: "danger", duration: 10000 });
                    console.log('error fetching user in membership', e);
                });

    }

    //get and set pay url
    React.useEffect(() => {
        setPayData(responseData?.data);
    }, [responseData]);

    React.useEffect(() => {
        if (payData?.longurl)
            props.navigation.navigate('MembershipPaymentWebview', { uri: payData?.longurl });
    }, [payData]);

    //process pay success
    React.useEffect(() => {
        if (success != undefined) {
            setTimeout(() => {
                setSuccess(success);
            }, 2000);
        }
    }, [success]);

    //update user with pay success
    React.useEffect(() => {
        if (data?.data?.id != undefined) {
            setTimeout(() => {
                dispatch(UPDATE_USER({ user: data?.data }));
            }, 2000);
        }
    }, [data]);

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getUser()
        });
        return unsubscribe;
    }, [navigation]);

    React.useEffect(() => {
        getUser()
    }, []);


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
            <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
                <View style={styles.card}>
                    <Image style={styles.cardImg} source={NotApproved} />
                    <Text style={styles.cardPriceTxt}>Membership @ ₹10</Text>
                    <Text style={styles.cardTxt}>Dear User, Please complete your payment to become a member.</Text>
                    <TouchableOpacity style={styles.addCartBtn} onPress={getMembership}>
                        <Text style={styles.addCartBtnTxt}>Pay ₹10</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            {(isLoading || loading) && (<Loader visible={true} />)}
            {paysuccess && (<ModalMessage visible={true} handleClick={() => { setSuccess(false) }} error={false} errorMsg={"Payment success ! You are now an elite member of Oyester Group."} />)}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    main: {
        flex: 1,
        backgroundColor: "#fff",
    },
    mainContent: {
        flexGrow: 1
    },
    card: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    cardImg: {
        width: 110,
        height: 110,
        resizeMode: "cover"
    },
    cardPriceTxt: {
        color: appConstant.themeSecondaryColor,
        fontSize: 20,
        fontFamily: appConstant.baseFontFamily,
        fontWeight: "700",
        marginVertical: 10
    },
    cardTxt: {
        width: "70%",
        textAlign: "center",
        fontSize: 16,
        fontFamily: appConstant.baseFontFamily,
        lineHeight: 20
    },
    addCartBtn: {
        shadowColor: "#6DBA48",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11,
        backgroundColor: appConstant.themeSecondaryColor,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "35%",
        height: 40,
        marginHorizontal: 10,
        marginVertical: 20,
        paddingHorizontal: 5,
        borderRadius: 0,
    },
    addCartBtnTxt: {
        fontSize: 16,
        fontFamily: appConstant.baseFontFamily,
        color: "#fff"
    },
    goToCartBtn: {
        backgroundColor: appConstant.themeSecondaryColor,
    }
});
