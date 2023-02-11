import * as React from 'react';
import { useState } from 'react';
import {
    Image,
    ImageBackground,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    ToastAndroid,
    Pressable,
    View
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import appConstant from 'config/constants';
import MButton from "components/Button/Button";
// import Picker from "components/Picker/Picker";
// import ImagePicker from "components/ImageUpload/ImagePicker";
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import Loader from "components/Loader";
import ModalMessage from "components/Modal/ModalMessage";
import { translate } from '../../../languageFeature';
import { useSelector } from 'react-redux';

export default function UserDocScreen(props) {

    const { appLanguage } = useSelector(state => state.auth)
    const [aadhar, setAadhar] = useState(null);
    const [pan, setPan] = useState(null);
    const [chequeFile, setChequeFile] = useState(null);
    const [uploadData, setUploadData] = useState({});
    const [isLoading, setIsLoading] = React.useState(false);
    const [isError, setIsError] = React.useState("");
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [isUpdate, setIsUpdate] = React.useState(false);
    const { navigation } = props;


    /**
     * Handle user document submitting
     * @returns {Promise<void>}
     */

    const submitUserDocs = async () => {
        if (isUpdate) {
            setIsUpdate(false);
            setIsLoading(true);
            let user = await SecureStore.getItemAsync('user');
            user = JSON.parse(user);
            let token = await SecureStore.getItemAsync('userToken');
            let data = new FormData();
            for (let i in uploadData) {
                data.append(i, uploadData[i]);
            }
            axios({
                method: 'post',
                url: `${appConstant.apiUrl}/update_user_doc/${user.id}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                data: data
            })
                .then(function (response) {
                    response = response.data;
                    if (response.error === undefined) {
                        ToastAndroid.showWithGravityAndOffset(
                            "User Document updated successfully",
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            25,
                            50
                        );
                    } else {
                        setIsError(response.message);
                    }
                    setIsLoading(false);
                })
                .catch(function (error) {
                    console.log(error);
                    setIsError(error);
                    setIsLoading(false);
                });
        } else {
            setIsError('Address Proof,Photo proof,GST/PAN proof and Cancel Cheque are required');
        }
    };

    /**
     * Handling error modal
     */
    const handleError = () => {
        setIsError("");
    }

    /**
     * Fetch suppliers details
     */
    const fetchUserDetails = async () => {
        let uid = JSON.parse(await SecureStore.getItemAsync('user'))?.id;
        let token = await SecureStore.getItemAsync('userToken');
        // let uid = JSON.parse(user).id;
        setIsLoading(true);
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
                    //console.log(result);
                    setAadhar(result.aadhar_card ?? null);
                    setPan(result.pan_card ?? null);
                    setChequeFile(result.cancel_cheque_link ?? null);
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
     * Refresh user profile
     */
    const handleRefresh = React.useCallback(() => {
        setIsRefreshing(true);
        fetchUserDetails().then(r => setIsRefreshing(false));
    });

    const pickImage = async (setImage, name) => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 1,
        });
        if (!result.cancelled) {
            setIsUpdate(true);
            setImage(result.uri);
            let data = {};
            data[name] = { "uri": (Platform.OS === 'android' ? result.uri : result.uri.replace('file://', '')), "name": `${name}.jpg`, "type": "image/jpeg" };
            setUploadData({
                ...uploadData,
                ...data
            });
        }
    };


    React.useEffect(() => {
        fetchUserDetails();
    }, []);


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
                {/*Aadhar card*/}
                <View style={styles.itemWrapper}>
                    <View style={styles.docLabelWrapper}>
                        <Text style={styles.docLabelTxt}>
                            <Text style={styles.boldTxt}>1.</Text> {translate(appLanguage, "Upload")} <Text style={styles.boldTxt}>{translate(appLanguage, "Aadhar Card")}</Text>
                            :{translate(appLanguage, "upload aadhar")}
                            <Text style={styles.docRequired}>*</Text>
                        </Text>

                    </View>
                    <View>
                        <View style={styles.btnWrapper}>
                            {aadhar != null && (
                                <View style={styles.uploadedImageWrapper}>
                                    <Image source={{ uri: aadhar }} style={styles.uploadedImage} />
                                    <View style={styles.uploadedImageDoc}>
                                        <Text>{translate(appLanguage, "Aadhar Card")}</Text>
                                        <Pressable onPress={() => setAadhar(null)}>
                                            <AntDesign name="edit" size={24} color={appConstant.themePrimaryColor} />
                                        </Pressable>
                                    </View>
                                </View>
                            )
                            }

                            {aadhar == null && (<MButton style={styles.uploadBtn} textStyle={styles.uploadBtnTxt} title={translate(appLanguage, "Upload")} mode="contained"
                                onPress={() => pickImage(setAadhar, "aadhar_card")} />)}
                        </View>

                    </View>
                </View>

                {/*Pan Card*/}
                <View style={styles.itemWrapper}>
                    <View style={styles.docLabelWrapper}>
                        <Text style={styles.docLabelTxt}>
                            <Text style={styles.boldTxt}>2.</Text> {translate(appLanguage, "Upload")}
                            <Text style={styles.boldTxt}>{translate(appLanguage, "Pan Card")}</Text> {translate(appLanguage, "upload pan")}
                            <Text style={styles.docRequired}>*</Text>
                        </Text>

                    </View>

                    <View>
                        <View style={styles.btnWrapper}>
                            {pan != null && (
                                <View style={styles.uploadedImageWrapper}>
                                    <Image source={{ uri: pan }} style={styles.uploadedImage} />
                                    <View style={styles.uploadedImageDoc}>
                                        <Text>{translate(appLanguage, "Pan Card")}</Text>
                                        <Pressable onPress={() => setPan(null)}>
                                            <AntDesign name="edit" size={24} color={appConstant.themePrimaryColor} />
                                        </Pressable>
                                    </View>
                                </View>
                            )
                            }

                            {pan == null && (<MButton style={styles.uploadBtn} textStyle={styles.uploadBtnTxt} title={translate(appLanguage, "Upload")} mode="contained"
                                onPress={() => pickImage(setPan, "pan_card")} />)}
                        </View>

                    </View>
                </View>

                {/*Cancel Cheque*/}
                <View style={styles.itemWrapper}>
                    <View style={styles.docLabelWrapper}>
                        <Text style={styles.docLabelTxt}>
                            <Text style={styles.boldTxt}>3.</Text> {translate(appLanguage, "Upload")} <Text style={styles.boldTxt}>
                                {translate(appLanguage, "Cancel Cheque")}
                            </Text> {""}
                            <Text style={styles.docRequired}>*</Text>
                        </Text>
                    </View>

                    <View>
                        <View style={styles.btnWrapper}>
                            {chequeFile != null && (
                                <View style={styles.uploadedImageWrapper}>
                                    <Image source={{ uri: chequeFile }} style={styles.uploadedImage} />
                                    <View style={styles.uploadedImageDoc}>
                                        <Text> {translate(appLanguage, "Cancel Cheque")}</Text>
                                        <Pressable onPress={() => setChequeFile(null)}>
                                            <AntDesign name="edit" size={24} color={appConstant.themePrimaryColor} />
                                        </Pressable>
                                    </View>
                                </View>
                            )
                            }

                            {chequeFile == null && (<MButton style={styles.uploadBtn} textStyle={styles.uploadBtnTxt} title={translate(appLanguage, "Upload")} mode="contained"
                                onPress={() => pickImage(setChequeFile, "cancel_cheque_file")} />)}
                        </View>
                    </View>
                </View>

                <MButton title={translate(appLanguage, "Save")} mode="contained" onPress={() => {
                    submitUserDocs();
                }} />
            </ScrollView>
            {isLoading && (<Loader visible={isLoading} />)}
            {isError !== "" && (
                <ModalMessage visible={true} handleClick={handleError} error={true} errorMsg={isError} />)}
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
        flexGrow: 1
    },
    itemWrapper: {
        marginBottom: 50
    },
    boldTxt: {
        fontFamily: "Montserrat_700Bold"
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
        paddingTop: 30
    },
    docLabelWrapper: {
        marginBottom: 10,
    },
    docLabelTxt: {
        lineHeight: 20
    },
    docRequired: {
        position: "absolute",
        right: 10,
        bottom: 0,
        top: -5,
        color: "red"
    },
    btnWrapper: {
        flex: 1,
    },
    uploadedImageWrapper: {
        height: 200,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,

        elevation: 10,
        borderWidth: 0,
        marginTop: 10,
    },
    uploadedImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover"
    },
    uploadedImageDoc: {
        flex: 1,
        flexDirection: "row",
        position: "absolute",
        justifyContent: "space-between",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#ffffff",
        padding: 10
    },
    uploadBtn: {
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        width: 150
    },
    uploadBtnTxt: {
        color: "black"
    }
});
