import React from 'react';
import { Text } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import OrderList from "screen/user/buyer/order/OrderList";
import OrderDetails from "screen/user/buyer/order/OrderDetails";
import Header from 'components/Header/Header';

const BuyerOrderStack = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            screenOptions={{
                headerMode: 'float',
                header: (props) => <Header {...props} />,
            }}
        >
            <Stack.Screen name="OrderListing" options={{ headerShown: true, headerTitle: "Orders" }} component={OrderList} />
            <Stack.Screen name="OrderDetails" options={{ headerShown: true, headerTitle: "Order Details" }} component={OrderDetails} />
        </Stack.Navigator>
    );
}

export default BuyerOrderStack;
