import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import TrainingList from "screen/training/CourseList";
import TrainingDetail from "screen/training/CourseDetails";
import TrainingConfirm from "screen/training/CourseConfirm";
import InstaWebview from "screen/payment/InstamojoWebView";
import Header from 'components/Header/Header';

const CourseStack = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
        // screenOptions={{
        //     headerMode: 'float',
        //     header: (props) => <Header {...props} />,
        // }}
        >
            <Stack.Screen name="TrainignList" options={{ headerShown: false, headerTitle: "" }} component={TrainingList} />
            <Stack.Screen name="TrainingDetail" options={{ headerShown: false, headerTitle: "" }} component={TrainingDetail} />
            <Stack.Screen name="TrainingConfirm" options={{ headerShown: false, headerTitle: "" }} component={TrainingConfirm} />
            <Stack.Screen name="TrainingPayment" options={{ headerShown: false, headerTitle: "" }} component={InstaWebview} />
        </Stack.Navigator>
    );
}

export default CourseStack;
