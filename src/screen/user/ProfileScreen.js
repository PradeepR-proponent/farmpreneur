import * as React from 'react';
import {
    Image,
    ImageBackground, Platform,
    Pressable,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet, Text,
    ToastAndroid,
    View
} from "react-native";
import { StatusBar } from "expo-status-bar";
import appConstant from "config/constants";
import { Button } from "react-native-paper";
import TextInput from "components/Text/TextInput";
import MButton from "components/Button/Button";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Loader from "components/Loader";
import ModalMessage from "components/Modal/ModalMessage";
import ImagePickerOptions from "components/ImageUpload/ImagePickerOptions";
import * as ImagePicker from 'expo-image-picker';
import { UPDATE_USER, userData } from "slice/userSlice";
import { userType } from "slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { translate } from '../../languageFeature';

export default function ProfileScreen(props) {



    const { appLanguage } = useSelector(state => state.auth)
    const [name, setName] = React.useState("");
    const [company, setCompany] = React.useState("");
    const [primaryMobile, setPrimaryMobile] = React.useState("");
    const [alternateMobile, setAlternateMobile] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [IDNo, setIDNo] = React.useState("");
    const [approved, setApproved] = React.useState("");
    const [profile, setProfile] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [isError, setIsError] = React.useState("");
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [showImageOptions, setShowImageOptions] = React.useState(false);
    const dispatch = useDispatch();
    const userdata = useSelector(userData);
    const [address, setAddress] = React.useState("");
    const [country, setCountry] = React.useState("India");
    const [state, setState] = React.useState("");
    const [city, setCity] = React.useState("");
    const [pin, setpin] = React.useState("");
    const [err, setError] = React.useState("");





    const handleError = () => {
        setIsError("");
    }


    const handleRefresh = React.useCallback(() => {
        setIsRefreshing(true);
        fetchUser().then(r => setIsRefreshing(false));
    });

    const fetchUser = async () => {
        try {
            let user = await SecureStore.getItemAsync('user');
            let token = await SecureStore.getItemAsync('userToken');
            let uid = JSON.parse(user).id;
            const response = await axios({
                method: 'get',
                url: `${appConstant.apiUrl}/user/${uid}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response) {
                let result = response.data.data;
                setName(result.name ?? "");
                setAddress(result.address ?? "");
                setCompany(result.company_name ?? "");
                setPrimaryMobile(result.primary_phone ?? "");
                setAlternateMobile(result.alternate_phone ?? "");
                setEmail(result.email ?? "");
                setIDNo(result.id_no ?? "");
                setApproved(result.is_approved ?? "");
                setProfile(result.profile_photo_url ?? "");
                setIsLoading(false);
                setCountry(result?.country)
                setCity(result?.city)
                setState(result?.state)
                setpin(result?.pin_code)
            }
        } catch (error) {
            setIsLoading(false);
            setIsError(error);
        }
    }


    const updateUserProfile = async () => {
        setError("")
        setIsLoading(true);
        let user = await SecureStore.getItemAsync('user');
        let token = await SecureStore.getItemAsync('userToken');
        let uid = JSON.parse(user).id;


        const updateData = JSON.stringify({
            "name": name,
            "alternate_phone": alternateMobile,
            "address": address,
            "company_name": company,
            "email": email,
            "id_no": IDNo,
            "city": city,
            "state": state,
            "country": country,
            "pin_code": pin,
        })

        await axios({
            method: 'put',
            url: `${appConstant.apiUrl}/user/${uid}`,
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            data: updateData
        })
            .then(function (response) {
                response = response.data;
                if (response.error === undefined) {
                    fetchUser();
                    dispatch(UPDATE_USER({ user: response.data }));
                    SecureStore.setItemAsync('user', JSON.stringify(response.data))
                    ToastAndroid.showWithGravityAndOffset(
                        "Profile updated successfully",
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50
                    );
                }
                else {
                    let errorTxt = '';
                    let j = 1;
                    for (let i in response.error) {
                        errorTxt += `${j}. ${response.error[i]}\n`;
                        j++;
                    }
                    setIsError(errorTxt);
                }

                setIsLoading(false);
            })
            .catch(function (error) {
                setIsError(error);
                setIsLoading(false);
            });

    }

    React.useEffect(() => {
        setIsLoading(true);
        fetchUser()
    }, []);

    /**
     * Handle image picker options
     */
    const handlePickerOptions = (type, options) => {
        openImagePicker(type, options).then(async (r) => {
            let user = await SecureStore.getItemAsync('user');
            user = JSON.parse(user);
            let token = await SecureStore.getItemAsync('userToken');
            let data = new FormData();

            data.append('profile', {
                uri: Platform.OS === 'android' ? r.uri : r.uri.replace('file://', ''),
                name: "profile.jpg",
                type: "image/jpeg"
            });
            axios({
                method: 'post',
                url: `${appConstant.apiUrl}/update_profile/${user.id}`,
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                data: data
            })
                .then(function (response) {
                    setIsLoading(false);
                    dispatch(UPDATE_USER({ user: response.data.data }));
                    ToastAndroid.showWithGravityAndOffset(
                        "Profile image updated successfully",
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50
                    );
                })
                .catch(function (error) {
                    setIsLoading(false);
                });

        });
    }

    /**
     * Get Image from library or from camera and process to server
     */
    const openImagePicker = async (type, options) => {
        let result;
        if (type === 'capture')
            result = await ImagePicker.launchCameraAsync(options);
        else
            result = await ImagePicker.launchImageLibraryAsync(options);

        if (!result.cancelled) {
            setProfile(result.uri);
            setIsLoading(true);
            setShowImageOptions(false);
            return result;
        } else {
            setShowImageOptions(false);
        }
    }

    const goToMembership = () => {
        // alert('Go to membership')
        // props.navigation.navigate("Membership");
    }




    const handlePhoneNumber = (number) => {
        setError("")
        if (number?.includes(".") || number?.includes(",")) {
            return
        }
        setAlternateMobile(number)
    }

    React.useEffect(() => {
        const matchNumber = (number) => {
            var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
            const test = re.test(number);
            if (!test) {
                setError("Invalid Number")
            }
        }
        if (alternateMobile.length >= 10) {
            matchNumber(alternateMobile)
        }

    }, [alternateMobile])



    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
            <ImageBackground source={require('assets/images/profile_bg2.jpg')} style={styles.topProfileBg}
                imageStyle={styles.topProfileBgImg}>
            </ImageBackground>
            <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        colors={[appConstant.themePrimaryColor]}
                    />
                }>

                <View style={styles.imgWrapper}>
                    <Pressable onPress={() => { setShowImageOptions(!showImageOptions) }}>
                        <Image source={{ uri: profile }} style={styles.profileImg} />
                    </Pressable>
                    {userdata?.role == "supplier" && (
                        <Pressable onPress={goToMembership} style={styles.memberBtn}>
                            <MaterialIcons name='stars' size={20} color={"#fff"} />
                            <Text style={styles.memberBtnTxt}>{translate(appLanguage, "Paid Member")}</Text>
                        </Pressable>
                    )}

                </View>
                <View style={styles.formWrapper}>
                    <TextInput
                        label={translate(appLanguage, "Name *")}
                        value={name}
                        onChangeText={(t) => setName(t)}
                    />
                    <TextInput
                        label={translate(appLanguage, "Primary Mobile *")}
                        value={primaryMobile}
                        dataDetectorTypes={"phoneNumber"}
                        keyboardType={"numeric"}
                        disabled={true}
                        onChangeText={(t) => setPrimaryMobile(t)}
                    />
                    <TextInput
                        label={translate(appLanguage, "Alternative Mobile")}
                        value={alternateMobile}
                        dataDetectorTypes={"phoneNumber"}
                        keyboardType={"numeric"}
                        onChangeText={handlePhoneNumber}
                    />
                    <Text style={{ color: "red" }} >{err}</Text>

                    <TextInput
                        label={translate(appLanguage, "Email *")}
                        value={email}
                        onChangeText={(t) => setEmail(t)}
                    />
                    {userdata?.role === "supplier" && (
                        <>
                            <TextInput
                                label={translate(appLanguage, "Company Name *")}
                                value={company}
                                onChangeText={(t) => setCompany(t)}
                            />
                            <TextInput
                                label={translate(appLanguage, "ID No")}
                                value={IDNo}
                                onChangeText={(t) => setIDNo(t)}
                            />
                            <TextInput
                                label={translate(appLanguage, "Approved")}
                                value={approved === 1 ? "Yes" : "No"}
                                disabled
                            />
                        </>
                    )}
                    <TextInput
                        label={`${translate(appLanguage, "Country")} *`}
                        value={country}
                        numberOfLine={3}
                        onChangeText={(t) => setCountry(t)}
                    />

                    <TextInput
                        label={`${translate(appLanguage, "State")} *`}
                        value={state}
                        numberOfLine={3}
                        onChangeText={(t) => setState(t)}
                    />

                    <TextInput
                        label={`${translate(appLanguage, "City")} *`}
                        value={city}
                        numberOfLine={3}
                        onChangeText={(t) => setCity(t)}
                    />

                    <TextInput
                        label={`${translate(appLanguage, "Address")} *`}
                        value={address}
                        numberOfLine={3}
                        onChangeText={(t) => setAddress(t)}
                    />

                    <TextInput
                        label={`${translate(appLanguage, "Pin Code")} *`}
                        value={pin}
                        numberOfLine={3}
                        onChangeText={(t) => setpin(t)}
                    />



                    <MButton title={translate(appLanguage, "Save")} mode="contained" onPress={updateUserProfile} />
                </View>

            </ScrollView>
            {isLoading && (<Loader visible={isLoading} />)}
            {isError !== "" && (<ModalMessage visible={true} handleClick={handleError} error={true} errorMsg={isError} />)}
            {showImageOptions && (<ImagePickerOptions handlePickerOptions={handlePickerOptions} />)}
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
    imgWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    profileImg: {
        width: 70,
        height: 70,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: appConstant.themeSecondaryColor
    },
    txtBtn: {
        backgroundColor: "#fff"
    },
    txtBtnText: {
        color: appConstant.themePrimaryColor
    },
    formWrapper: {
        paddingHorizontal: 40
    },
    memberBtn: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: appConstant.themePrimaryColor,
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginTop: 5
    },
    memberBtnTxt: {
        color: "#fff",
        marginLeft: 5
    },
});
