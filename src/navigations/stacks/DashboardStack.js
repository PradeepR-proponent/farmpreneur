import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import SupplierDashboard from "screen/dashboard/SupplierDashboard";
import BuyerDashboard from "screen/dashboard/BuyerDashboard";
import { userType } from 'slice/authSlice';
import { useSelector } from "react-redux";
import Header from 'components/Header/Header';

const DashboardStack = () => {
    const Stack = createStackNavigator();
    const usertype = useSelector(userType);

    return (
        <Stack.Navigator
            screenOptions={{
                headerMode: 'float',
                header: (props) => <Header {...props} />,
            }}
        >
            {usertype === 'buyer' && (
                <Stack.Screen name="BuyerDashboard" options={{ headerShown: true, headerTitle: "Home" }} component={BuyerDashboard} />
            )}
            {usertype === 'supplier' && (
                <Stack.Screen name="SupplierDashboard" options={{ headerShown: true, headerTitle: "Home" }} component={SupplierDashboard} />
            )}
        </Stack.Navigator>
    );
}

export default DashboardStack;
