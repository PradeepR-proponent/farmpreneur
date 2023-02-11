import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import ProductList from "screen/user/supplier/userProduct/UserProductList";
import ProductEdit from "screen/user/supplier/userProduct/UserProductEdit";
import Header from 'components/Header/Header';

const UserProductStack = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            screenOptions={{
                headerMode: 'float',
                header: (props) => <Header {...props} />,
            }}
        >
            <Stack.Screen name="UserProductList" options={{ headerShown: true, headerTitle: "Products" }} component={ProductList} />
            <Stack.Screen name="UserProductEdit" options={{ headerShown: true, headerTitle: "Product Edit" }} component={ProductEdit} />
        </Stack.Navigator>
    );
}

export default UserProductStack;
