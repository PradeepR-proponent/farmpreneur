import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import ProductAdd from "screen/product/ProductAdd";
import Header from 'components/Header/Header';

const ProductAddStack = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            screenOptions={{
                headerMode: 'float',
                header:(props) => <Header {...props}/>,
            }}
        >
            <Stack.Screen name="AddUserProduct" options={{ headerShown: true, headerTitle: "Add Product" }} component={ProductAdd} />
        </Stack.Navigator>
    );
}

export default ProductAddStack;
