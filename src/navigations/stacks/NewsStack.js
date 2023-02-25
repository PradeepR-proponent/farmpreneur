import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import NewsList from "screen/news/NewsList";
import NewsDetail from "screen/news/NewsDetail";
import Header from 'components/Header/Header';

const NewsStack = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
        initialRouteName='NewsList'
            screenOptions={{
                headerMode: 'float',
                header:(props) => <Header {...props}/>,
            }}
        >
            <Stack.Screen name="NewsList" options={{ headerShown: true, headerTitle: "All News" }} component={NewsList} />
            <Stack.Screen name="NewsDetail" options={{ headerShown: true, headerTitle: "" }} component={NewsDetail} />
        </Stack.Navigator>
    );
}

export default NewsStack;
