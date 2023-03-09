import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import appConstant from "config/constants";
import fontsLoaded from "config/fonts";
import AppLoading from 'expo-app-loading';
import TextInput from "components/Text/TextInput";
import Button from "components/Button/Button";
import axios from "axios";
import Loader from "components/Loader";
import ModalMessage from "components/Modal/ModalMessage";
import { Entypo,AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { translate } from '../../languageFeature/index'


const SignUpScreen = (props) => {

    const dispatch = useDispatch()
    const { appLanguage } = useSelector(state => state.auth)
    const actionType = 'register';
    const [isUser, setIsUser] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [isError, setIsError] = React.useState("");
    const { userType } = props.route.params;
    const [mobile, setMobile] = React.useState("");
    const [name, setName] = React.useState("");
    const [selecteProfile, setSelectProfile] = React.useState(false);



    React.useEffect(() => {
        mobile !== "" ? checkExistingUser() : setIsUser("");
    }, [mobile]);

    /**
     * Check if user exists with the concerned phone number
     */
    const checkExistingUser = () => {
        axios({
            method: 'post',
            url: `${appConstant.apiUrl}/check_existing_user`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "primary_phone": mobile
            })
        })
            .then(function (response) {
                if (response.data.error) {
                    setIsUser(response.data.message);
                } else {
                    setIsUser("");
                }
            })
            .catch(function (error) {
                console.log('error', error);
            });
    }

    /**
     * Send OTP to respective mobile
     */
    const handleSignupBtn = () => {
        if (mobile !== "" && name !== "" && isUser === "") {
            setIsLoading(true);
            sentOTP();
        }
    }

    /**
     * handling error modal
     */
    const handleError = () => {
        setIsError("");
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
                if (response.data.error === undefined) {
                    setIsLoading(false);
                    props.navigation.navigate('OTPAuth', {
                        'name': name,
                        'mobile': mobile,
                        'actionType': actionType,
                        'userType': userType?.toLowerCase(),
                        'otpId': response.data.otpId
                    });
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
                            fontSize: 26,
                        }]}>
                            {translate(appLanguage, "Club")}
                        </Text>
                        <Text style={styles.textItem}>
                            {translate(appLanguage, "fill up")}
                        </Text>
                    </View>
                    <View style={styles.flexDisplay}>
                        <Entypo
                            name="add-user"
                            size={25}
                            color="green"
                            style={styles.userIcon}
                        />
                        <Text style={styles.newRegistration}>{translate(appLanguage, "NEW")}</Text>
                        <Text style={{ ...styles.newRegistration, fontWeight: "bold" }}>
                            {userType === "Supplier" ? translate(appLanguage, "Farmer") : translate(appLanguage, userType)}
                        </Text>
                        <Text style={styles.newRegistration}>{translate(appLanguage, "REGISTRATION")}</Text>
                    </View>
                    <View style={styles.formWrapper}>
                        <TextInput
                            label={translate(appLanguage, "Name")}
                            value={name}
                            onChangeText={(t) => setName(t)}
                        />
                        <TextInput
                            label={translate(appLanguage, "Mobile Number")}
                            value={mobile}
                            dataDetectorTypes={"phoneNumber"}
                            keyboardType={"numeric"}
                            onChangeText={(t) => setMobile(t)}
                        />
                        {isUser !== "" && (<Text style={styles.errorTxt}>{isUser}</Text>)}
                        <Button style={styles.loginBtn} title={translate(appLanguage, "Continue")} mode="contained" onPress={() => handleSignupBtn()} />
                    </View>

                    <View style={styles.formFooterWrapper}>
                        <View style={[styles.rowWrapper, { marginBottom: 10 }]}>
                            <Text style={styles.loginTxt}>{translate(appLanguage, "Have an account")} ?
                                <Text style={styles.loginTxt}
                                    onPress={() => { props.navigation.navigate('SignIn', { 'userType': userType }) }}>{` ${translate(appLanguage, "Login")}`}</Text>
                            </Text>
                        </View>
                        <View style={styles.rowWrapper}>
                            <Text style={styles.textItemFooter}>{`${translate(appLanguage, "By continuing you agree to")} `}
                                <Text style={styles.textItemLink} onPress={() => { alert('clicked') }}>{translate(appLanguage, "terms & conditions")}</Text> {translate(appLanguage, "and")}
                                <Text style={styles.textItemLink} onPress={() => { alert('clicked') }}> {translate(appLanguage, "privacy policy")}</Text></Text>
                        </View>
                    </View>

                </ScrollView>
                {isLoading && (<Loader visible={isLoading} />)}
                {isError !== "" && (<ModalMessage visible={isError !== ""} handleClick={handleError} error={false} errorMsg={isError} />)}
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }, flexDisplay: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    userIcon: {
        marginRight: 10,
    },
   
    newRegistration: {
        color: appConstant.themeSecondaryColor,
        fontFamily: appConstant.baseFontFamily,
        fontSize: 16,
        color: "green",
        textTransform: "uppercase",
        marginRight: 5,
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
        justifyContent: "flex-start"
    },
    loginBtn: {
        marginTop: 40
    },
    loginTxt: {
        fontSize: 16,
        color: appConstant.themeSecondaryColor,
        fontWeight: "700"
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


export default SignUpScreen;
