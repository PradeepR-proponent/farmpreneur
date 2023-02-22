import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text,Linking, TouchableOpacity, View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import appConstant from "config/constants";
import fontsLoaded from "config/fonts";
import AppLoading from 'expo-app-loading';
import TextInput from "components/Text/TextInput";
import Button from "components/Button/Button";
import Loader from "components/Loader";
import axios from "axios";
import ModalMessage from "components/Modal/ModalMessage";
import { useDispatch, useSelector } from 'react-redux';
import { translate } from '../../languageFeature/index'


const SignInScreen = (props) => {

    const dispatch = useDispatch()
    const { appLanguage } = useSelector(state => state.auth)
    const actionType = 'login';
    const [mobile, setMobile] = React.useState("");
    const [isUser, setIsUser] = React.useState("");
    const [userData, setUserData] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [isError, setIsError] = React.useState("");
    // const { userType } = props.route.params;

    React.useEffect(() => {
        mobile !== "" ? checkExistingUser() : setIsUser("");
    }, [mobile]);

    //TODO: move existing function to sign up
    /**
     * Check existing user with phone number
     */
    const checkExistingUser = () => {
        axios({
            method: 'post',
            url: `${appConstant.apiUrl}/check_existing_user`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "primary_phone": mobile,
                // "userType": userType
            })
        })
            .then(function (response) {
                if (response.data.error) {
                    setUserData(response.data);
                    setIsUser("");
                } else {
                    setIsUser("No user exists");
                }
            })
            .catch(function (error) {
                console.log(error.response)
                console.log('error', error);
            });
    }




    /**
     * Send OTP to respective mobile
     */
    const handleLoginBtn = () => {
        if (mobile !== "" && isUser === "") {
            if (userData?.userType) {
                setIsLoading(true);
                sentOTP();
            } else {
                setIsError(`This user is already registered as a ${userData?.userType}. Please login as a ${userData.userType}`);
            }
        }
    }

    /**
     * Api to send otp
     */
    const sentOTP = () => {

        axios({
            method: 'post',
            url: `${appConstant.apiUrl}/login`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "primary_phone": mobile,
                "type": actionType
            })
        })
            .then(function (response) {
                // console.log(response.data)
                if (response.data.error === undefined) {
                    setIsLoading(false);
                    props.navigation.navigate('OTPAuth', {
                        'mobile': mobile,
                        'actionType': actionType,
                        'userType': userData?.userType,
                        'otpId': response.data.otpId
                    });
                } else {
                    setIsLoading(false);
                    setIsError(response.data.message);
                }

            })
            .catch(function (error) {
                console.log('send otp error', error);
                setIsLoading(false);
                setIsError(error);
            });
    }

    /**
     * handling error modal
     */
    const handleError = () => {
        setIsError("");
    }

    if (!fontsLoaded()) {
        return <AppLoading />;
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
                <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
                    <View style={styles.logoWrapper}>
                        <Image style={styles.logo} source={require('../../assets/logo/Mobile/Logo_PNG.png')} />
                    </View>
                    <View style={styles.textWrapper}>
                        <Text style={[styles.textItem, {
                            fontFamily: "Montserrat_600SemiBold",
                            fontWeight: "700",
                            marginVertical: 15,
                            color: appConstant.themeSecondaryColor,
                            fontSize: 26
                        }]}>
                            {translate(appLanguage, "Club")}
                        </Text>
                        <Text style={styles.textItem}>
                            {translate(appLanguage, "fill up")}
                        </Text>
                    </View>
                    <View style={styles.formWrapper}>
                        <TextInput
                            label={translate(appLanguage, "Mobile Number")}
                            value={mobile}
                            dataDetectorTypes={"phoneNumber"}
                            keyboardType={"numeric"}
                            onChangeText={(t) => setMobile(t)}
                        />
                        {isUser !== "" && (<Text style={styles.errorTxt}>{isUser}</Text>)}
                        <Button style={styles.loginBtn} title={translate(appLanguage, "Continue")} mode="contained" onPress={() => handleLoginBtn()} />
                    </View>
                    <View style={styles.formFooterWrapper}>
                        <View style={styles.rowWrapper}>
                            <Text style={styles.textItemFooter}>{`${translate(appLanguage, "By continuing you agree to")} `}
                                <Text style={styles.textItemLink} onPress={() => Linking.openURL(appConstant.termUrl )}> {translate(appLanguage, "terms & conditions")}</Text>  {translate(appLanguage, "and")}
                                <Text style={styles.textItemLink} onPress={ ()=> Linking.openURL(appConstant.privacyUrl ) }> {translate(appLanguage, "privacy policy")}</Text></Text>
                        </View>
                    </View>
                </ScrollView>
                {isLoading && (<Loader visible={isLoading} />)}
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
    logoWrapper: {
        alignItems: 'flex-start',
    },
    logo: {
        marginRight: 10,
        width: "40%",
        height: 100,
        resizeMode: "contain"
    },
    textWrapper: {
        flexGrow: 0.5,
        marginBottom: 10
    },
    formWrapper: {
        flexGrow: 1,
        marginBottom: 20
    },
    txtInput: {
        backgroundColor: "#fff",
        fontSize: 19,
        marginBottom: 10,
    },
    textItem: {
        color: appConstant.themeSecondaryColor,
        fontFamily: appConstant.baseFontFamily,
        fontSize: 16,
        marginVertical: 0,
    },
    formFooterWrapper: {
        flexGrow: 1,
    },
    rowWrapper: {
        flexWrap: "wrap",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    loginBtn: {
        marginTop: 40
    },
    textItemLogin: {
        fontSize: 19,
        fontWeight: "700"
    },
    textItemFooter: {
        color: appConstant.themeSecondaryColor,
        fontFamily: appConstant.baseFontFamily,
        fontSize: 16,
    },
    textItemLink: {
        color: appConstant.themeSecondaryColor,
        fontFamily: "Montserrat_500Medium",
        lineHeight: 25,
        fontSize: 16,
    },
    errorTxt: {
        color: "#fc6666",
        marginTop: 0,
        fontSize: appConstant.basePrimaryFontSize - 3,
        fontFamily: appConstant.baseFontFamily,
    }
});


export default SignInScreen;
