import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import MembershipScreen from "screen/subs/Membership";
import SubsWebview from "screen/payment/SubsWebview";
import Header from 'components/Header/Header';

const SubsStack = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            screenOptions={{
                headerMode: 'float',
                header: (props) => <Header {...props} showMenu={false} bgColor={"#fff"} showUser={true}/>,
            }}
        >
            <Stack.Screen name="MembershipScreen" component={MembershipScreen} options={{ headerShown: true, headerTitle: "Membership" }} />
            <Stack.Screen name="MembershipPaymentWebview" component={SubsWebview} options={{ headerShown: false, headerTitle: "Payment" }} />
        </Stack.Navigator>
    );
}

export default SubsStack;
