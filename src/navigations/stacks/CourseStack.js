import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import CourseList from "screen/user/supplier/courses/CourseList";
import CourseDetail from "screen/user/supplier/courses/CourseDetails";
import EnrolledCourses from "screen/user/supplier/courses/EnrolledCourses";
import InstaWebview from "screen/payment/InstamojoWebView";
import Header from 'components/Header/Header';

const CourseStack = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            screenOptions={{
                headerMode: 'float',
                header:(props) => <Header {...props}/>,
            }}
        >
            <Stack.Screen name="CourseList" options={{ headerShown: true, headerTitle: "All Courses" }} component={CourseList} />
            <Stack.Screen name="EnrolledCourses" options={{ headerShown: true, headerTitle: "All enrolled Courses" }} component={EnrolledCourses} />
            <Stack.Screen name="CourseDetail" options={{ headerShown: true, headerTitle: "Course Details" }} component={CourseDetail} />
            <Stack.Screen name="CoursePayment" options={{ headerShown: true, headerTitle: "Payment" }} component={InstaWebview} />
        </Stack.Navigator>
    );
}

export default CourseStack;
