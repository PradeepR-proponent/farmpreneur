import * as React from 'react';
import { ImageBackground, RefreshControl, SafeAreaView, ScrollView, StyleSheet, ToastAndroid, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import appConstant from "config/constants";
import TextInput from "components/Text/TextInput";
import MButton from "components/Button/Button";
import Loader from "components/Loader";
import ModalMessage from "components/Modal/ModalMessage";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { translate } from '../../../languageFeature'
import { useSelector } from 'react-redux';

export default function BankInfoScreen(props) {


    const { appLanguage } = useSelector(state => state.auth)
    const [accHolderName, setAccHolderName] = React.useState("");
    const [accNo, setAccNo] = React.useState("");
    const [ifscCode, setIfscCode] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [isError, setIsError] = React.useState("");
    const [isRefreshing, setIsRefreshing] = React.useState(false);

    /**
     * Fetch user bank details
     */
    const fetchBankDetails = async () => {
        let user = await SecureStore.getItemAsync('user');
        let token = await SecureStore.getItemAsync('userToken');
        let uid = JSON.parse(user).id;

        await axios({
            method: 'get',
            url: `${appConstant.apiUrl}/fetch_supplier_details/${uid}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(function (response) {
                if (response.data.isData === undefined) {
                    let result = response.data.data;
                    setAccHolderName(result.account_holder ?? "");
                    setAccNo(result.account_no ?? "");
                    setIfscCode(result.ifsc ?? "");
                }
                setIsLoading(false);
            })
            .catch(function (error) {
                console.log('user profile fetch error ', error);
                setIsLoading(false);
                setIsError(error);
            });
    }

    /**
     * Handle details submisssion
     */
    const handleSaveData = async () => {
        if (accHolderName && accNo && ifscCode) {
            setIsLoading(true);
            let user = await SecureStore.getItemAsync('user');
            let token = await SecureStore.getItemAsync('userToken');
            let uid = JSON.parse(user).id;

            axios({
                method: 'post',
                url: `${appConstant.apiUrl}/update_bank/${uid}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    "account_holder": accHolderName,
                    "account_no": accNo,
                    "ifsc": ifscCode
                })
            })
                .then(function (response) {
                    response = response.data;
                    if (response.error === undefined) {
                        ToastAndroid.showWithGravityAndOffset(
                            "Bank details updated successfully",
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            25,
                            50
                        );
                    }
                    else {
                        setIsError(response.message);
                    }
                    setIsLoading(false);
                })
                .catch(function (error) {
                    console.log(error);
                    setIsError(error);
                    setIsLoading(false);
                });

        }
        else {
            setIsError('All fields are required');
        }
    }

    React.useEffect(() => {
        setIsLoading(true);
        fetchBankDetails().then(() => { });
    }, []);

    /**
     * Handling error modal
     */
    const handleError = () => {
        setIsError("");
    }

    /**
     * Refresh user profile
     */
    const handleRefresh = React.useCallback(() => {
        setIsRefreshing(true);
        fetchBankDetails().then(() => setIsRefreshing(false));
    });

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
            <ImageBackground source={require('assets/images/profile_bg2.jpg')} style={styles.topProfileBg}
                imageStyle={styles.topProfileBgImg}>
            </ImageBackground>
            <ScrollView style={styles.main} contentContainerStyle={[styles.mainContent, styles.formWrapper]}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        colors={[appConstant.themePrimaryColor]}
                    />
                }>
                <TextInput
                    label={translate(appLanguage, "Account Holder Name")}
                    value={accHolderName}
                    onChangeText={(t) => setAccHolderName(t)}
                />
                <TextInput
                    label={translate(appLanguage, "Account Number")}
                    value={accNo}
                    dataDetectorTypes={"phoneNumber"}
                    keyboardType={"numeric"}
                    onChangeText={(t) => setAccNo(t)}
                />

                <TextInput
                    label={translate(appLanguage, "IFSC Code")}
                    value={ifscCode}
                    onChangeText={(t) => setIfscCode(t)}
                />
                <MButton title={translate(appLanguage, "Save")} mode="contained" onPress={() => { handleSaveData() }} />
            </ScrollView>
            {isLoading && (<Loader visible={isLoading} />)}
            {isError !== "" && (<ModalMessage visible={true} handleClick={handleError} error={true} errorMsg={isError} />)}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    main: {
        flex: 1,
        backgroundColor: "transparent",
    },
    mainContent: {
        flexGrow: 1,
        justifyContent: "center"
    },
    topProfileBg: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1
    },
    topProfileBgImg: {
        resizeMode: "stretch",
        opacity: 1
    },
    formWrapper: {
        paddingHorizontal: 40,
    }
});
