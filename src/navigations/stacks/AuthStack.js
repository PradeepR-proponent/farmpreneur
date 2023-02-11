import React from 'react';

import WelcomeScreen from "screen/auth/WelcomeScreen";
import BeforeUserAction from "screen/auth/BeforeUserAction";
import SignUpScreen from "screen/auth/SignUpScreen";
import OTPAuthScreen from "screen/auth/OTPAuthScreen";
import SignInScreen from "screen/auth/SignInScreen";
import { createStackNavigator } from "@react-navigation/stack";

const AuthStack = () => {
    const Stack = createStackNavigator();
    return (
        <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="BeforeUserAction" component={BeforeUserAction} options={{ headerShown: false }} />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="OTPAuth" component={OTPAuthScreen} options={{ headerTitle: "Enter OTP", headerShown: false }} />
            <Stack.Screen name="SignIn" component={SignInScreen} options={{ headerShown: false }} />
        </>
    );
}

export default AuthStack;
