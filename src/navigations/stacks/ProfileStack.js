import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "screen/user/ProfileScreen";
import BankInfoScreen from "screen/user/supplier/BankInfoScreen";
import UserDocScreen from "screen/user/supplier/UserDocScreen";
import Membership from "screen/member/Membership";
import Header from 'components/Header/Header';

const ProfileStack = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            screenOptions={{
                headerMode: 'float',
                header: (props) => <Header {...props} />,
            }}
        >
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: true, headerTitle: "Profile" }} />
            <Stack.Screen name="Membership" component={Membership} options={{ headerShown: true, headerTitle: "Membership" }} />
            {/* <Stack.Screen name="BankInfoScreen" component={BankInfoScreen} options={{ headerShown: true, headerTitle: "Bank Details" }} />
            <Stack.Screen name="UserDocScreen" component={UserDocScreen} options={{ headerShown: true, headerTitle: "User Documents" }} /> */}
        </Stack.Navigator>
    );
}

export default ProfileStack;
