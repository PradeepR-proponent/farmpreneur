import React, { useState, useEffect } from 'react';
import {
    Image, SafeAreaView,
    StyleSheet, Text, Linking, View, TouchableOpacity, useWindowDimensions, Pressable, ScrollView
} from "react-native";
import {
    responsiveHeight,
    responsiveWidth,
    responsiveScreenHeight,
    responsiveScreenWidth,
    responsiveFontSize,
} from "react-native-responsive-dimensions";
import { StatusBar } from "expo-status-bar";
import fontsLoaded from "config/fonts";
import { Button } from 'react-native-paper';
import AppLoading from 'expo-app-loading';
import appConstant from "config/constants";
import { useSelector, useDispatch } from 'react-redux';
import { userData } from "slice/userSlice";
import { userToken } from 'slice/authSlice';
import { AuthContext } from "components/Auth/AuthContext";
import { LinearGradient } from 'expo-linear-gradient';
import { translate } from '../../languageFeature/index'
import { LANGUAGE } from '../../_slice/authSlice';
import * as SecureStore from 'expo-secure-store';
import Loader from '../../components/Loader/'



const WelcomeScreen = (props) => {

    const dispatch = useDispatch()
    const { appLanguage } = useSelector(state => state.auth)
    const userdata = useSelector(userData);
    const usertoken = useSelector(userToken);
    const { width, height } = useWindowDimensions();
    const { signOut } = React.useContext(AuthContext);
    const [selectLang, setSelectLang] = useState("English")
    const [loading, setLoading] = React.useState(false);

    const getLang = async () => {
        const lang = await SecureStore.getItemAsync('appLang');
        if (lang != null) {
            setSelectLang(lang)
        }
    }

    const checkToken = async () => {
        const userToken = await SecureStore.getItemAsync('userToken');
        if (userToken) {
            setLoading(true)
        } else setLoading(false)
    }

    useEffect(() => {
        getLang()
        checkToken()
    }, []);

    useEffect(() => {
        if (userdata && userdata?.status == "inactive" && usertoken != null)
            signOut("Unable to login. Account inactive");
    }, [userdata]);


    useEffect(() => {
        if (selectLang != "") {
            dispatch(LANGUAGE({ language: selectLang }));
        }
    }, [selectLang])

    const flateListData = [

        {
            id: "1",
            btnName: translate(appLanguage, "Farmer"),
            btnClick: () => {
                props.navigation.navigate("SignUp", { userType: "Supplier" })
            },
        },
        {
            id: "2",
            btnName: translate(appLanguage, "Buyer"),
            btnClick: () => {
                props.navigation.navigate("SignUp", { userType: "Buyer" })
            },
        },
        {
            id: "3",
            btnName: translate(appLanguage, "Services"),
            btnClick: () => {
                props.navigation.navigate("Services")
            },
        },
        {
            id: "4",
            btnName: translate(appLanguage, "Training"),
            btnClick: () => {
                props.navigation.navigate("Training")
            },
        },
        {
            id: "5",
            btnName: translate(appLanguage, "Consultancy"),
            btnClick: () => {
                props.navigation.navigate("Consultancy")

            },
        },
    ];

    const handleEnglish = async () => {
        try {
            setSelectLang("English")
            await SecureStore.setItemAsync('appLang', "English");
        } catch (error) {
            console.log(error)
        }
    }


    const handleHindi = async () => {
        try {
            setSelectLang("Hindi")
            await SecureStore.setItemAsync('appLang', "Hindi");
        } catch (error) {
            console.log(error)
        }
    }


    if (!fontsLoaded()) {
        return <AppLoading />;
    } else if (loading) {
        return <Loader />
    } else {
        return (
            <SafeAreaView style={[styles.container, { width: width, height: height }]}>
                <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
                <LinearGradient
                    colors={['#0b5a7f', '#0d6999']}
                    style={styles.gradient}
                    start={{ x: 0.1, y: 0.4 }}
                    end={{ x: 0.1, y: 0.6 }}
                >
                    <SafeAreaView style={styles.safeArea} >
                        <View style={[styles.viewArea, { width: responsiveWidth(100), height: responsiveHeight(100) }]} >
                            <View style={styles.logoWrapper}>
                                <Image style={styles.logo} source={require('../../assets/logo/Mobile/Logo_W_PNG.png')} />
                                <View style={styles.btns} >
                                    <Pressable onPress={handleEnglish} style={[styles.btn, { backgroundColor: selectLang === "English" ? "green" : "#ffffff", }]}  ><Text style={{ color: selectLang === "English" ? "#ffffff" : "#0B5B80" }} >Eng</Text></Pressable>
                                    <Pressable onPress={handleHindi} style={[styles.btn, { backgroundColor: selectLang === "Hindi" ? "green" : "#ffffff", }]}  ><Text style={{ color: selectLang === "Hindi" ? "#ffffff" : "#0B5B80" }} >हिंदी</Text></Pressable>
                                </View>
                            </View>
                            <View style={styles.textArea}>
                                <View >
                                    <Text style={[styles.textItemMain, { fontSize: responsiveFontSize(3), fontWeight: "700" }]}>{translate(appLanguage, "Welcome to")}</Text>
                                    <Text style={[styles.textItemMain, { fontSize: responsiveFontSize(4), }]}>{translate(appLanguage, "FARMPRENEUR Club")} </Text>
                                </View>
                                <View style={styles.textWrapper}>
                                    <Text style={styles.textItem}>{translate(appLanguage, "Register")}</Text>
                                </View>
                                <View style={styles.btnWrapper}>
                                    {
                                        flateListData.map((btnList) => (
                                            <Button
                                                key={btnList.id}
                                                mode="contained"
                                                uppercase={false}
                                                style={{ ...styles.btnItem, backgroundColor: btnList.id === "1" || btnList.id === "2" ? "green" : "#fff", }}
                                                labelStyle={{ ...styles.btnText, color: btnList.id === "1" || btnList.id === "2" ? "#fff" : appConstant.themeSecondaryColor, }}
                                                onPress={btnList.btnClick}
                                            >
                                                <Text style={styles.btnText}>
                                                    {btnList.btnName}
                                                </Text>
                                            </Button>
                                        ))
                                    }
                                    <TouchableOpacity style={styles.loginBtnWrapper} onPress={() => props.navigation.navigate('SignIn')}>
                                        <Image style={styles.loginBtnImg} source={require('../../assets/icon/login-button.png')} />
                                        <Text style={styles.loginBtnText}>{translate(appLanguage, "Login")}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Image style={styles.overlayImg} resizeMethod={"resize"} source={require('../../assets/icon/footer-img3.png')} />
                            <Text style={styles.contactBtn} onPress={() =>props.navigation.navigate('contactus')}  > {translate(appLanguage, "Contact Us")}</Text>
                        </View>
                    </SafeAreaView>
                </LinearGradient>
            </SafeAreaView >
        )
    }
}

const styles = StyleSheet.create({
    safeArea: {
        marginTop: 10,
    },
    contactBtn: {
        width:110,
        position: "absolute",
        right: -43,
        bottom: 150,
        zIndex: 50,
        backgroundColor: "#ffffff",
        color: "#0e5d82",
        fontWeight: "bold",
        fontSize: 14,
        textAlign:"center",
        paddingVertical: responsiveHeight(1),
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        transform: [{ rotate: '-90deg' }],
    },
    container: {
        flex: 1,
    },
    textArea: {
        paddingHorizontal: responsiveWidth(5),
    },
    gradient: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: responsiveScreenWidth(100),
        height: responsiveScreenHeight(100)
    },
    btns: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start"
    },
    btn: {
        padding: 10,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#ffffff",
        marginRight: 10,
    },
    viewArea: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
    },

    logoWrapper: {
        width: responsiveWidth(100),
        // position: "absolute",
        // top: responsiveHeight(1),
        // left: 0,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: responsiveWidth(5),
    },
    logo: {
        width: "25%",
        height: responsiveHeight(10),
        resizeMode: "contain",
    },
    textWrapper: {
        marginTop: responsiveHeight(2),
        marginBottom: responsiveHeight(1)
    },
    textItem: {
        color: "white",
        textAlign: "center",
        fontFamily: appConstant.baseFontFamily,
        fontSize: 16,
    },
    btnItem: {
        paddingHorizontal: 10,
        width: "50%",
        marginBottom: responsiveHeight(1),
        borderRadius: 0,
        alignSelf: "center",
        borderRadius: 5
    },
    btnText: {
        fontSize: responsiveFontSize(2),
        fontWeight: "700",
        fontFamily: appConstant.baseFontFamily,
        textAlign: "center"
    },
    btnTrainer: {
        backgroundColor: appConstant.themePrimaryColor
    },
    btnTrainerText: {
        color: "#fff"
    },
    textItemMain: {
        color: "white",
        textAlign: "left",
        fontFamily: appConstant.baseFontFamily,
    },
    loginBtnWrapper: {
        alignItems: "center",
        marginBottom: responsiveHeight(1)
    },
    loginBtnImg: {
        marginTop: responsiveHeight(2),
        width: responsiveHeight(7),
        height: responsiveHeight(7),
        resizeMode: "contain",
    },
    loginBtnText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "bold"
    },
    overlayImg: {
        width: "100%",
        height:"20%",
        resizeMode: "cover",
        backgroundColor: "#0d6999",
    },

});


export default WelcomeScreen;