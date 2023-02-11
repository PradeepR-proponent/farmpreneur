import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import TrainingList from "screen/training/CourseList";
import TrainingDetail from "screen/training/CourseDetails";
import TrainingConfirm from "screen/training/CourseConfirm";
import InstaWebview from "screen/payment/InstamojoWebView";
import Header from 'components/Header/Header';
import { translate } from '../../languageFeature'

const DwaerTraningStack = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
        // screenOptions={{
        //     headerMode: 'float',
        //     header: (props) => <Header {...props} />,
        // }}
        >
            <Stack.Screen name="TrainignList" options={{ headerShown: true, headerTitle: "" }} component={TrainingList} />
            <Stack.Screen name="TrainingDetail" options={{ headerShown: true, headerTitle: "" }} component={TrainingDetail} />
            <Stack.Screen name="TrainingConfirm" options={{ headerShown: true, headerTitle: "" }} component={TrainingConfirm} />
            <Stack.Screen name="TrainingPayment" options={{ headerShown: true, headerTitle: "" }} component={InstaWebview} />
        </Stack.Navigator>
    );
}

export default DwaerTraningStack;
