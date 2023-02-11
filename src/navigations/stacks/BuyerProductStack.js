import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import ProductDetail from "screen/user/buyer/product/ProductDetail";
import Cart from "screen/user/buyer/product/Cart";
import Checkout from "screen/user/buyer/product/Checkout";
import Header from 'components/Header/Header';

const BuyerProductStack = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            screenOptions={{
                headerMode: 'float',
                header:(props) => <Header {...props}/>,
            }}
        >
            <Stack.Screen name="ProductDetail" options={{ headerShown: true, headerTitle: "Products Details" }} component={ProductDetail} />
            <Stack.Screen name="Cart" options={{ headerShown: true, headerTitle: "Cart" }} component={Cart} />
            <Stack.Screen name="Checkout" options={{ headerShown: true, headerTitle: "Checkout" }} component={Checkout} />
        </Stack.Navigator>
    );
}

export default BuyerProductStack;
