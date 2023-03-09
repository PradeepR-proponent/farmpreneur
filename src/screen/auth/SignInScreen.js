import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, Linking, TouchableOpacity, View, Image } from "react-native";
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
import { Picker } from "@react-native-picker/picker";
import { AntDesign } from '@expo/vector-icons';
import { Pressable } from 'react-native';


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
    const [selecteProfile, setSelectProfile] = React.useState(false);
    const [selectProfileType, setselectProfileType] = React.useState('')
    const ProfileType = ["Buyer", "Farmer"]

    const goback = (t) => {
        setselectProfileType(t)
        setSelectProfile(false)
        props.navigation.navigate("SignUp", { userType: t })
    }


    React.useEffect(() => {
        mobile !== "" ? checkExistingUser() : setIsUser("");
    }, [mobile]);


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
                        <Text style={[styles.textItemFooter, styles.goBack]}>
                            {translate(appLanguage, "Don't Have Account")} ?
                            <Text style={[styles.textItemLink, styles.goBack]} onPress={() => setSelectProfile(true)}> {translate(appLanguage, "Regi")} </Text>
                        </Text>

                        <Text style={styles.textItemFooter}>{`${translate(appLanguage, "By continuing you agree to")} `}
                            <Text style={styles.textItemLink} onPress={() => Linking.openURL(appConstant.termUrl)}> {translate(appLanguage, "terms & conditions")}</Text> {translate(appLanguage, "and")}
                            <Text style={styles.textItemLink} onPress={() => Linking.openURL(appConstant.privacyUrl)}> {translate(appLanguage, "privacy policy")}</Text></Text>
                    </View>
                </ScrollView>

                {selecteProfile && <View style={styles.overlay}>
                    <View style={styles.selectArea} >
                        <Text style={styles.selectProfile} > {translate(appLanguage, "Select Profile")}</Text>
                        {
                            ProfileType.map((t, idx) => <Pressable onPress={() => goback(t)} key={`${idx}`} style={styles.box}><Text style={styles.selectFont} >{translate(appLanguage, t)}</Text></Pressable>)
                        }
                    </View>
                </View>}
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
    selectProfile: {
        fontSize: 18,
        fontWeight: 'bold',
        color: appConstant.themeSecondaryColor,
        marginBottom: 20,
        borderBottomColor: appConstant.themeSecondaryColor,
        borderBottomWidth: 1
    },
    selectArea: {
        backgroundColor: "#ffffff",
        padding: 20,
        width: 200,
        height: 200,
        borderRadius: 5,
        display: 'flex',
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",

    },
    box: {
        width: '100%',
        marginBottom: 20
    },
    selectFont: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
        textAlign: "center",
        borderWidth: 1,
        borderColor: "green",
        padding: 10,
        backgroundColor: "green",

    },

    overlay: {
        position: "absolute",
        top: 0,
        right: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
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
    }, pickerWrapper: {
        margin: 20,
        overflow: 'hidden',
        backgroundColor: appConstant.themePrimaryLightColor,
        borderRadius: 10,
        padding: 0
    },
    pickerIcon: {
        position: "absolute",
        top: 13,
        right: 12,
        bottom: 0
    },
    picker: {

    },
    pickerItem: {
        fontWeight: "700",
    },
    goBack: {
        fontSize: 16,
        color: appConstant.themeSecondaryColor,
        fontWeight: "700",
        marginBottom: 10
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
