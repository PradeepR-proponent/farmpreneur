import React from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import fontsLoaded from "config/fonts";
import { Button } from 'react-native-paper';
import AppLoading from 'expo-app-loading';
import appConstant from "config/constants";

const BeforeUserAction = (props) => {
    const {userType} = props.route.params;
    if (!fontsLoaded()) {
        return <AppLoading/>;
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar style="light" backgroundColor={appConstant.statusBarColor}/>
                <View style={styles.main}>
                    <View style={styles.logoWrapper}>
                        <Image style={styles.logo} source={require('../../assets/logo/logo-white.png')}/>
                    </View>
                    <View style={styles.textWrapper}>
                        <Text style={styles.textItem}>Welcome</Text>
                        <Text style={styles.textItem}>{userType}</Text>

                    </View>
                    <View style={styles.btnWrapper}>
                        <Button  mode="contained" style={styles.btnItem} labelStyle={styles.btnText} onPress={() => props.navigation.navigate('SignIn',{'userType':userType})}>
                            Sign In
                        </Button>
                        <Button  mode="contained" style={styles.btnItem} labelStyle={styles.btnText} onPress={() => props.navigation.navigate('SignUp',{'userType':userType})}>
                            Sign Up
                        </Button>
                    </View>
                </View>
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
        backgroundColor: appConstant.themeSecondaryColor
    },
    logoWrapper: {
        marginTop: 80,
        flexGrow: 2,
        alignItems: 'center',
    },
    logo: {},
    textWrapper: {
        flexGrow: 1,
    },
    textItem: {
        color: "white",
        textAlign: "center",
        fontFamily: appConstant.baseFontFamily,
        fontSize: 25,
        marginVertical: 0
    },
    btnWrapper: {
        flexGrow: 2,
        alignItems: "center"
    },
    btnItem: {
        width:"50%",
        marginBottom:20,
        backgroundColor: appConstant.themePrimaryColor,
    },
    btnText:{
        fontSize: 15,
        color:"#fff",
        fontFamily: appConstant.baseFontFamily,
    }
});


export default BeforeUserAction;
