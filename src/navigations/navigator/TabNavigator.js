import * as React from 'react';
import { Text } from 'react-native';
import appConstant from "config/constants";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CustomTab from "components/Tab/CustomTab";
import { FontAwesome, AntDesign, Feather, Entypo } from "@expo/vector-icons";
import BuyerOrderStack from "navigation/stacks/BuyerOrderStack";
import SupplierOrderStack from "navigation/stacks/SupplierOrderStack";
import ProfileStack from "navigation/stacks/ProfileStack";
import ProductAddStack from "navigation/stacks/ProductAddStack";
import DashboardStack from "navigation/stacks/DashboardStack";
import NewsStack from "navigation/stacks/NewsStack";
import EnquiryStack from "navigation/stacks/EnquiryStack";
import { userType } from 'slice/authSlice';
import { userData } from 'slice/userSlice';
import { useSelector } from "react-redux";
import Header from 'components/Header/Header';




export default function TabNavigator() {
    const Tab = createBottomTabNavigator();
    const usertype = useSelector(userType);
    const userdata = useSelector(userData);
    return (
        <Tab.Navigator
            initialRouteName={"Home"}
            tabBarOptions={{
                activeTintColor: appConstant.themePrimaryColor,
                inActiveTintColor: appConstant.themeSecondaryColor,
                showLabel: false,
            }}
            sceneContainerStyle={{
            }}
            tabBar={props => <CustomTab {...props} />}
        >


            {usertype === 'buyer' && (
                <>
                    <Tab.Screen name="Home" component={DashboardStack} options={{
                        tabBarTestID: 1,
                        headerShown: true,
                        header: (props) => <Header {...props} />,
                        tabBarIcon: ({ focused, color, size }) => <AntDesign name="home" size={appConstant.drawerItemIconSize}
                            color={focused ? appConstant.drawerItemTextColor : appConstant.themeSecondaryColor} />
                    }} />
                    <Tab.Screen name="News" component={NewsStack} options={{
                        tabBarTestID: 2,
                        tabBarIcon: ({ focused, color, size }) => <FontAwesome name="newspaper-o" size={appConstant.drawerItemIconSize}
                            color={focused ? appConstant.drawerItemTextColor : appConstant.themeSecondaryColor} />
                    }} />
                    <Tab.Screen name="Order" component={BuyerOrderStack} options={{
                        tabBarTestID: 3,
                        tabBarIcon: ({ focused, color, size }) => <Feather name="package" size={appConstant.drawerItemIconSize}
                            color={focused ? appConstant.drawerItemTextColor : appConstant.themeSecondaryColor} />
                    }} />
                    {/* <Tab.Screen name="Profile" component={ProfileStack} options={{
                        tabBarTestID: 4,
                        tabBarIcon: ({ focused, color, size }) => <AntDesign name="user" size={appConstant.drawerItemIconSize}
                            color={focused ? appConstant.drawerItemTextColor : appConstant.themeSecondaryColor} />
                    }} /> */}
                </>
            )}
            
            {usertype === 'supplier' && userdata?.is_subscribed && userdata?.is_subscription_valid && (
                <>
                    <Tab.Screen name="Home" component={DashboardStack} options={{
                        tabBarTestID: 1,
                        tabBarIcon: ({ focused, color, size }) => <AntDesign name="home" size={appConstant.drawerItemIconSize}
                            color={focused ? appConstant.drawerItemTextColor : appConstant.themeSecondaryColor} />
                    }} />
                    <Tab.Screen name="News" component={NewsStack} options={{
                        tabBarTestID: 2,
                        tabBarIcon: ({ focused, color, size }) => <FontAwesome name="newspaper-o" size={appConstant.drawerItemIconSize}
                            color={focused ? appConstant.drawerItemTextColor : appConstant.themeSecondaryColor} />
                    }} />
                    <Tab.Screen name="AddProduct" component={ProductAddStack} options={{
                        headerMode: 'float',
                        header: (props) => <Header {...props} />,
                        tabBarTestID: 3,
                        tabBarIcon: ({ focused, color, size }) => <AntDesign name="plus" size={appConstant.drawerItemIconSize}
                            color={"#fff"} />
                    }} />
                    <Tab.Screen name="Order" component={SupplierOrderStack} options={{
                        tabBarTestID: 4,
                        tabBarIcon: ({ focused, color, size }) => <Entypo name="shopping-bag" size={appConstant.drawerItemIconSize}
                            color={focused ? appConstant.drawerItemTextColor : appConstant.themeSecondaryColor} />
                    }} />
                    <Tab.Screen name="RequestRaw" component={EnquiryStack} options={{
                        tabBarTestID: 5,
                        tabBarIcon: ({ focused, color, size }) => <Feather name="mail" size={appConstant.drawerItemIconSize}
                            color={focused ? appConstant.drawerItemTextColor : appConstant.themeSecondaryColor} />
                    }} />
                    {/* <Tab.Screen name="Profile" component={ProfileStack} options={{
                        tabBarTestID: 6,
                        tabBarIcon: ({ focused, color, size }) => <AntDesign name="user" size={appConstant.drawerItemIconSize}
                            color={focused ? appConstant.drawerItemTextColor : appConstant.themeSecondaryColor} />
                    }} /> */}

                </>
            )
            }


        </Tab.Navigator>
    );
}
