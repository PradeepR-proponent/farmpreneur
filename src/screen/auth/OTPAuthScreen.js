import React, { useRef } from 'react';
import { Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import constants from "config/constants";
import appConstant from "config/constants";
import fontsLoaded from "config/fonts";
import { Button, TextInput } from 'react-native-paper';
import OTPTextInput from 'react-native-otp-textinput';
import AppLoading from 'expo-app-loading';
import { AuthContext } from "components/Auth/AuthContext";
import axios from "axios";
import Loader from "components/Loader";
import ModalMessage from "components/Modal/ModalMessage";
import DashedLine from 'react-native-dashed-line';
import { resendOtp } from 'services/otp';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { translate } from '../../languageFeature/index'


const SignUpScreen = (props) => {

    const { appLanguage } = useSelector(state => state.auth)
    const { actionType, mobile, userType } = props.route.params;
    const [isLoading, setIsLoading] = React.useState(false);
    const [otpId, setOtpId] = React.useState(null);
    const [OTP, setOTP] = React.useState("");
    const [isError, setIsError] = React.useState("");
    const [resendCounter, setResentCounter] = React.useState(59);
    const toast = useToast();
    const { signIn, signUp, signOut } = React.useContext(AuthContext); //TODO: remove this
    let otpInput = useRef(null);
    let name;
    if (actionType === 'register') {
        name = props.route.params.name;
    }


    //resend otp mutation
    const otpMutation = resendOtp();
    const { isLoading: postLoading, isError: postError, data: otpData, mutate: resendotp } = otpMutation;
    if (postError) toast.show(otpMutation.error.message, { type: "danger", duration: 2000 });

    const handleOtpVerification = () => {
        if (OTP !== "") {
            setIsLoading(true);
            verifyOTP();
        }
    }

    const verifyOTP = () => {
        console.log('this is otp id ', otpId);
        let data = {
            "otpId": otpId,
            "otp": OTP,
            "primary_phone": mobile,
            "role": userType,
            "type": actionType
        };

        if (actionType === 'register')
            data['name'] = name ?? "";

        axios({
            method: 'post',
            url: `${appConstant.apiUrl}/verify_otp`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify(data)
        })
            .then(function (response) {
                if (response.data.error === undefined) {
                    if (actionType === 'login' && response?.data?.user?.status == "active") {
                        signIn({ "token": response.data.access_token, "user": response.data.user, 'userType': userType });
                        ToastAndroid.showWithGravityAndOffset(
                            "Login successful",
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            25,
                            50
                        );
                    }
                    else if (actionType === 'login' && response?.data?.user?.status == "inactive") {
                        signOut("Unable to Login. Account inactive");
                        setIsLoading(false);
                        props.navigation.navigate("Welcome");
                    }
                    else {
                        signUp({ "token": response.data.access_token, "user": response.data.user, 'userType': userType });
                        ToastAndroid.showWithGravityAndOffset(
                            "Registration successful",
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            25,
                            50
                        );
                    }
                    // setTimeout(()=>{ setIsLoading(false); },1000);
                } else {
                    setTimeout(() => { setIsLoading(false); }, 1000);
                    setIsError(response.data.message);
                }
            })
            .catch(function (error) {
                setIsLoading(false);
                setIsError(error);
            });

    }

    React.useEffect(() => {
        const timer = resendCounter > 0 && setInterval(() => setResentCounter(resendCounter - 1), 1000)
        return () => clearInterval(timer);
    }, [resendCounter]);

    React.useEffect(() => {
        setOtpId(otpData?.otpId);
    }, [otpData]);

    React.useEffect(() => {
        setOtpId(props?.route?.params?.otpId);
    }, []);

    if (!fontsLoaded()) {
        return <AppLoading />;
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar style="light" backgroundColor={constants.statusBarColor} />
                <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
                    <View style={styles.logoWrapper}>
                        <Image style={styles.logo} source={require('../../assets/logo/Mobile/Logo_PNG.png')} />
                    </View>
                    <View style={styles.textWrapper}>
                        <Text style={[styles.textItem, styles.textItemBold]}>
                            {translate(appLanguage, "Please ENTER OTP")}
                        </Text>
                        <Text style={styles.textItem}>{translate(appLanguage, "validation code")}</Text>
                    </View>
                    <View style={styles.formWrapper}>
                        <View>
                            <OTPTextInput handleTextChange={(item) => setOTP(item)} ref={e => (otpInput = e)} textInputStyle={styles.OTPInput}
                                offTintColor={appConstant.themeSecondaryColor} inputCount={6} containerStyle={styles.OTPContainer} />
                        </View>

                        <Button mode="contained" style={styles.btnItem} labelStyle={styles.btnText}
                            onPress={handleOtpVerification}>
                            {translate(appLanguage, "Continue")}
                        </Button>
                    </View>
                    <DashedLine dashLength={4} dashColor={appConstant.themeSecondaryColor} />
                    <View style={styles.formFooterWrapper}>
                        <View style={styles.rowWrapper}>
                            <Text style={styles.loginTxt}>
                                {translate(appLanguage, "Didn't get code")}

                                ? </Text>
                            <Pressable disabled={resendCounter > 0} onPress={() => { otpInput.clear(); resendotp({ primary_phone: mobile }); setResentCounter(59); }}>
                                <Text style={[styles.txtBtnTxt, { color: resendCounter > 0 ? "gray" : appConstant.themeSecondaryColor }]} >
                                    {translate(appLanguage, "Resend")}

                                </Text>
                            </Pressable>
                        </View>
                        {resendCounter > 0 && (
                            <Text style={styles.resendTimer}>
                                <Text style={styles.resendTimerTxt}>{translate(appLanguage, "Resend OTP in")}</Text>00:{resendCounter}</Text>
                        )}
                    </View>
                </ScrollView>
                {(isLoading || postLoading) && (<Loader visible={isLoading} />)}
                {isError !== "" && (<ModalMessage visible={isError !== ""} handleClick={() => { setIsError("") }} error={true} errorMsg={isError} />)}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    main: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 30
    },
    mainContent: {
        flexGrow: 1
    },
    textWrapper: {
        marginBottom: 10,
    },
    formWrapper: {
        marginVertical: 30
    },
    txtInput: {
        backgroundColor: "#fff",
        marginBottom: 10,

    },
    textItem: {
        color: appConstant.themeSecondaryColor,
        fontFamily: appConstant.baseFontFamily,
        fontSize: 16,
        marginVertical: 0,
    },
    textItemBold: {
        fontFamily: "Montserrat_600SemiBold",
        marginVertical: 15,
        color: appConstant.themeSecondaryColor
    },
    logoWrapper: {
        alignItems: 'flex-start',
    },
    logo: {
        marginRight: 10,
        width: "40%",
        height: 100,
        resizeMode: "contain"
    },
    btnItem: {
        width: "50%",
        marginVertical: 20,
        backgroundColor: appConstant.themeSecondaryColor,
        alignSelf: "center",
        borderRadius: 0
    },
    btnText: {
        fontSize: 15,
        color: "#fff",
        fontFamily: appConstant.baseFontFamily,
    },
    formFooterWrapper: {
    },
    rowWrapper: {
        flexWrap: "wrap",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    loginTxt: {
        fontSize: 16,
        marginTop: 15,
        fontWeight: "700",
        color: appConstant.themeSecondaryColor
    },
    txtBtnTxt: {
        color: appConstant.themeSecondaryColor,
        fontFamily: "Montserrat_500Medium",
        fontSize: 16,
        fontWeight: "700",
    },
    OTPInput: {
        borderRadius: 8,
        borderBottomWidth: 1,
        borderWidth: 1,
        backgroundColor: "#fff",
        fontSize: 14,
        width: 40,
        height: 40,
        color: "#000"
    },
    resendTimer: {
        color: appConstant.themeSecondaryColor,
        fontFamily: "Montserrat_500Medium",
        textAlign:"center"
    },
    resendTimerTxt: {
        color: appConstant.themePrimaryColor,
        fontFamily: "Montserrat_500Medium",
        fontWeight: "700",
    }
});


export default SignUpScreen;
