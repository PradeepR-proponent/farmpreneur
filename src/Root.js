import React from 'react';
import * as SecureStore from 'expo-secure-store';

import SignInScreen from "screen/auth/SignInScreen";
import WelcomeScreen from "screen/auth/WelcomeScreen";
import SignUpScreen from "screen/auth/SignUpScreen";
import DrawerNavigator from "navigation/drawer/DrawerNavigator";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext } from "components/Auth/AuthContext";
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import appConstant from "config/constants";
import OTPAuthScreen from "screen/auth/OTPAuthScreen";
import BeforeUserAction from "screen/auth/BeforeUserAction";
import { LogBox, ToastAndroid } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import SubsStack from "navigation/stacks/SubsStack";
import TrainingStack from "navigation/stacks/TrainingStack";
import axios from "axios";
import {
    RESTORE_TOKEN,
    SIGN_IN,
    SIGN_OUT,
    userToken,
    userType
} from 'slice/authSlice';
import {
    userData,
    UPDATE_USER,
    DELETE_USER
} from "slice/userSlice";
import {
    QueryClient,
    QueryClientProvider,
} from 'react-query';
import { ToastProvider } from 'react-native-toast-notifications'
import Loader from "components/Loader";
import { useToast } from "react-native-toast-notifications";
import ServiceScreen from './screen/auth/ServiceScreen';
import Consultancy from './screen/auth/Consultancy';
import ConsultancyExperts from './screen/consultancyExperts/ConsultancyExperts';
import WeatherForcast from './screen/services/weatherForcast';
import HygridModel from './screen/services/hygridModel';
import InsurancePolicy from './screen/services/insurancePolicy';
import SolarTechnology from './screen/services/solarTechnology';
import AgroEquipment from './screen/services/agroEquipment';
import OtherWebView from './screen/other/OtherWebView';
import ContactUs from './screen/auth/ContactUS'


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: true,
        },
    },
});

function Root({ navigation }) {
    LogBox.ignoreAllLogs(true);
    LogBox.ignoreLogs(['Setting a timer']);

    const Stack = createStackNavigator();
    const usertoken = useSelector(userToken);
    const usertype = useSelector(userType);
    const userdata = useSelector(userData);
    const [userprofile, setUserProfile] = React.useState({});
    const [loading, setLoading] = React.useState(false);
    const dispatch = useDispatch();
    const toast = useToast();

    const logoutInvalid = async () => {
        ToastAndroid.showWithGravityAndOffset(
            msg ?? "User logged out",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
        );
        await SecureStore.deleteItemAsync('userToken');
        await SecureStore.deleteItemAsync('user');
        await SecureStore.deleteItemAsync('userType');
        setTimeout(() => {
            dispatch(SIGN_OUT());
            dispatch(DELETE_USER());
        }, 500);
    }


    React.useEffect(() => {
        const bootstrapAsync = async () => {
            let userToken;
            let userType;
            let user;
            let error = false;
            try {
                userToken = await SecureStore.getItemAsync('userToken');
                userType = await SecureStore.getItemAsync('userType');
                user = await SecureStore.getItemAsync('user');
                user = JSON.parse(user);
                if (userToken != null && user) {
                    setLoading(true);
                    await axios({
                        method: 'get',
                        url: `${appConstant.apiUrl}/user/${user?.id}`,
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${userToken}`
                        }
                    })
                        .then(async function (response) {
                            if (response?.data?.data?.id != undefined) {
                                await SecureStore.setItemAsync('user', JSON.stringify(response?.data?.data));
                            }
                            setLoading(false);
                        })
                        .catch(async function (error) {
                            error = true;
                            alert('Startup error ', error);
                            setLoading(false);
                        });
                }

                user = await SecureStore.getItemAsync('user');
            } catch (e) {
                error = true;
                dispatch(RESTORE_TOKEN({ token: null, userType: null }));
                dispatch(DELETE_USER());
            }
            if (!error) {
                dispatch(RESTORE_TOKEN({ token: userToken, userType }));
                user = JSON.parse(user);
                dispatch(UPDATE_USER({ user }));
            } else {
                logoutInvalid();
            }

        };
        bootstrapAsync().then(r => { });
    }, []);

    const authContext = React.useMemo(
        () => ({
            signIn: async data => {
                if (data.token !== undefined) {
                    await SecureStore.setItemAsync('userToken', data.token);
                    await SecureStore.setItemAsync('user', JSON.stringify(data.user));
                    await SecureStore.setItemAsync('userType', data?.userType?.toLowerCase());
                    dispatch(SIGN_IN({ token: data.token, userType: data?.userType?.toLowerCase() }));
                    dispatch(UPDATE_USER({ user: data.user }));
                }
            },
            signOut: async (msg = undefined) => {
                ToastAndroid.showWithGravityAndOffset(
                    msg ?? "User logged out",
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    25,
                    50
                );
                await SecureStore.deleteItemAsync('userToken');
                await SecureStore.deleteItemAsync('user');
                await SecureStore.deleteItemAsync('userType');
                setTimeout(() => {
                    dispatch(SIGN_OUT());
                    dispatch(DELETE_USER());
                }, 500);
            },
            signUp: async data => {
                if (data.token !== undefined) {
                    await SecureStore.setItemAsync('userToken', data.token);
                    await SecureStore.setItemAsync('user', JSON.stringify(data.user));
                    await SecureStore.setItemAsync('userType', data?.userType?.toLowerCase());
                    dispatch(SIGN_IN({ token: data.token, userType: data?.userType?.toLowerCase() }));
                    dispatch(UPDATE_USER({ user: data.user }));
                }
            },
            usertype
        }),
        []
    );

    const theme = {
        ...DefaultTheme,
        roundness: 2,
        colors: {
            ...DefaultTheme.colors,
            primary: appConstant.themeSecondaryColor,
            accent: '#f1c40f',
            text: appConstant.themeSecondaryColor
        },
    };

    return (
        <AuthContext.Provider value={authContext}>
            <SafeAreaProvider>
                <QueryClientProvider client={queryClient}>
                    <ToastProvider placement="top" offsetTop={80}>
                        <PaperProvider theme={theme}>
                            <NavigationContainer>
                                {usertoken == null || userdata?.status == "inactive" ? (
                                    <Stack.Navigator
                                        screenOptions={{
                                            headerStyle: {
                                                backgroundColor: appConstant.headerBackground,
                                            },
                                            headerTintColor: '#fff',
                                            headerTitleStyle: {
                                                fontWeight: 'bold',
                                            },
                                            gestureDirection: "horizontal-inverted"
                                        }}
                                    >
                                        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
                                        <Stack.Screen name="Training" component={TrainingStack} options={{ headerShown: true,headerTitle:"" }} />
                                        {/* <Stack.Screen name="BeforeUserAction" component={BeforeUserAction} options={{ headerShown: false }} /> */}
                                        <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerTitle: "" }} />
                                        <Stack.Screen name="OTPAuth" component={OTPAuthScreen} options={{ headerTitle: "" }} />
                                        <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerTitle: "" }} />


                                        <Stack.Screen name="contactus" component={ContactUs} options={{ headerTitle: "" }} />
                                        <Stack.Screen name="Services" component={ServiceScreen} options={{ headerTitle: "" }} />
                                        <Stack.Screen name="Consultancy" component={Consultancy} options={{ headerTitle: "" }} />
                                        <Stack.Screen name="Consultant" component={ConsultancyExperts} options={{ headerTitle: "" }} />
                                        <Stack.Screen name="WeatherForcast" component={WeatherForcast} options={{ headerTitle: "" }} />
                                        <Stack.Screen name="HygridModel" component={HygridModel} options={{ headerTitle: "" }} />
                                        <Stack.Screen name="SolarTechnology" component={SolarTechnology} options={{ headerTitle: "" }} />
                                        <Stack.Screen name="AgroEquipment" component={AgroEquipment} options={{ headerTitle: "" }} />
                                        <Stack.Screen name="InsurancePolicies" component={InsurancePolicy} options={{ headerTitle: "" }} />
                                        <Stack.Screen name="OtherWebView" component={OtherWebView} options={{
                                            headerShown: true,
                                            title: "",
                                        }} />

                                    </Stack.Navigator>
                                ) : (usertype == "supplier" && userdata?.is_subscribed && userdata?.is_subscription_valid) || (usertype == "buyer") ?
                                    (<DrawerNavigator />) : (<SubsStack />)
                                }

                                {loading && (<Loader visible={true} loaderColor={"#fff"} />)}
                            </NavigationContainer>
                        </PaperProvider>
                    </ToastProvider>
                </QueryClientProvider>
            </SafeAreaProvider>
        </AuthContext.Provider>
    );
}

export default Root;
