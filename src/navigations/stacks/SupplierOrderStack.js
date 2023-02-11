import React from 'react';

import { createStackNavigator } from "@react-navigation/stack";
import OrderList from "screen/user/supplier/order/OrderList";
import OrderDetails from "screen/user/supplier/order/OrderDetails";
import Header from 'components/Header/Header';

const SupplierOrderStack = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            screenOptions={{
                headerMode: 'float',
                header: (props) => <Header {...props} />,
            }}>
            <Stack.Screen name="OrderList" options={{ headerShown: true, headerTitle: "Orders" }} component={OrderList} />
            <Stack.Screen name="OrderDetails" options={{ headerShown: true, headerTitle: "Order Details" }} component={OrderDetails} />
        </Stack.Navigator>
    );
}

export default SupplierOrderStack;
