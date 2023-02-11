import React from 'react';
import { Text } from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import Enquiry from "screen/enquiry";
import Header from 'components/Header/Header';

const EnquiryStack = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            screenOptions={{
                headerMode: 'float',
                header: (props) => <Header {...props} />,
            }}
        >
            <Stack.Screen name="Enquiry" options={{ headerShown: true, headerTitle: "Material Enquiry" }} component={Enquiry} />
        </Stack.Navigator>
    );
}

export default EnquiryStack;
