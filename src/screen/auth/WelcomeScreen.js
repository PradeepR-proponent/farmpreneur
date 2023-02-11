import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View, TouchableOpacity, useWindowDimensions, Pressable } from "react-native";
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

            <SafeAreaView style={styles.container}>
                <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
                <LinearGradient
                    colors={['#0b5a7f', '#0d6999']}
                    style={[styles.linearGradient,]}
                    start={{ x: 0.1, y: 0.4 }}
                    end={{ x: 0.1, y: 0.6 }}
                >
                    <View style={[styles.viewArea, { width: "100%", height: "100%" }]} >
                        <View style={styles.logoWrapper}>
                            <Image style={styles.logo} source={require('../../assets/logo/Mobile/Logo_W_PNG.png')} />
                            <View style={styles.btns} >
                                <Pressable onPress={handleEnglish} style={[styles.btn, { backgroundColor: selectLang === "English" ? "green" : "#ffffff", }]}  ><Text style={{ color: selectLang === "English" ? "#ffffff" : "#0B5B80" }} >Eng</Text></Pressable>
                                <Pressable onPress={handleHindi} style={[styles.btn, { backgroundColor: selectLang === "Hindi" ? "green" : "#ffffff", }]}  ><Text style={{ color: selectLang === "Hindi" ? "#ffffff" : "#0B5B80" }} >हिंदी</Text></Pressable>
                            </View>
                        </View>
                        <View style={styles.contentWrapper}>
                            <View style={styles.textWrapperMain}>
                                <Text style={[styles.textItemMain, { fontSize:22,fontWeight:"700"}]}>{translate(appLanguage, "Welcome to")}</Text>
                                <Text style={[styles.textItemMain, { fontSize:26,}]}> {translate(appLanguage, "FARMPRENEUR Club")} </Text>
                            </View>
                            <View style={styles.textWrapper}>
                                <Text style={styles.textItem}> {translate(appLanguage, "Register")}</Text>
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
                                    <Text style={styles.loginBtnText}> {translate(appLanguage, "Login")}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.imageWrapper}>
                            <Image style={styles.overlayImg} resizeMethod={"resize"} source={require('../../assets/icon/footer-img2.png')} />
                        </View>
                    </View>
                </LinearGradient>
            </SafeAreaView >
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    btns: {
        marginTop: 20,
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
        marginRight: 10
    },
    viewArea: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between"
    },
    main: {
        flex: 1,
        backgroundColor: "#0B5B80"
    },
    linearGradient: {
        width: "100%",
        height: "100%"
    },
    logoWrapper: {
        marginTop: 35,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start"
    },
    logo: {
        marginLeft: 40,
        width: "25%",
        height: 80,
        resizeMode: "contain",
        marginTop: 40,
    },
    textWrapperMain: {
        width: "80%",
        marginHorizontal: 40,
        marginBottom: 15
    },
    textWrapper: {
        marginTop: 20,
        marginBottom: 15
    },
    textItem: {
        color: "white",
        textAlign: "center",
        fontFamily: appConstant.baseFontFamily,
        fontSize: 16
    },
    btnItem: {
        paddingHorizontal: 10,
        width: "50%",
        marginBottom: 10,
        borderRadius: 0,
        alignSelf: "center",
        borderRadius: 5
    },
    btnText: {
        fontSize: 16,
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
        marginTop: 10,
    },
    loginBtnImg: {
        width: 50,
        height: 50,
        resizeMode: "contain",

    },
    loginBtnText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "bold"
    },
    overlayImg: {
        width: "100%",
        height: '100%',
        resizeMode: "cover",
        backgroundColor: "#0d6999"
    },
    imageWrapper: {
        height:140,
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#0d6999",
    }
});


export default WelcomeScreen;