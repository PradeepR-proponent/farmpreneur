import * as React from 'react';
import { useEffect, useState } from 'react';
import { View, StyleSheet, Pressable, Text } from "react-native";
import { Appbar, Badge } from 'react-native-paper';
import { userType } from 'slice/authSlice';
import { userData } from 'slice/userSlice';
import { total } from 'slice/cartSlice';
import { useSelector } from "react-redux";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import appConstant from "config/constants";
import { AuthContext } from "components/Auth/AuthContext";
import { translate } from '../../languageFeature'


export default function Header(props) {

    const { appLanguage } = useSelector(state => state.auth)
    const { scene, navigation, previous } = props;
    const usertype = useSelector(userType);
    const userdata = useSelector(userData);
    const cartTotal = useSelector(total);
    const [showCart, setShowCart] = useState(true);
    const [showMyCourse, setShowMyCourse] = useState(false);
    const showMenu = props.showMenu === undefined ? true : props.showMenu;
    const { signOut } = React.useContext(AuthContext);

    const openCart = () => {
        navigation.navigate("BuyerProductStack", { screen: "Cart" });
    };

    const openEnrolledCourses = () => {
        navigation.navigate("EnrolledCourses");
    };

    useEffect(() => {
        if (scene?.route?.name == "Cart" || scene?.route?.name == "Checkout")
            setShowCart(false);
        else
            setShowCart(true);
    }, [scene]);
    useEffect(() => {
        if (scene?.route?.name == "CourseList" || scene?.route?.name == "CourseDetail")
            setShowMyCourse(true);
        else
            setShowMyCourse(false);
    }, [scene]);

    const headerTitle = scene?.descriptor?.options?.headerTitle
    return (
        <Appbar.Header dark={true} style={[{ backgroundColor: props.bgColor ?? "" }, styles.noShadow]}>
            {previous ? <Appbar.BackAction onPress={navigation.goBack} /> : (showMenu && <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />)}
            <Appbar.Content title={headerTitle ? translate(appLanguage, `${headerTitle}`) : ""} />
            <View style={[styles.badgeIconWrapper, { width: props.showUser ? "40%" : 40 }]}>
                {(usertype === "buyer" && showCart) && (
                    <Pressable onPress={openCart}>
                        <AntDesign name="shoppingcart" size={30} color={"white"} />
                    </Pressable>
                )}
                {(usertype === "buyer" && cartTotal > 0 && showCart) && <Badge style={styles.badgeCount}>{cartTotal}</Badge>}
                {props.showUser && (
                    <View style={[styles.userInfo, { marginTop: 15 }]}>
                        <Text style={styles.userInfoTxt}>Hii, {userdata?.name?.split(" ")[0] ?? userdata?.name}</Text>
                        <Pressable onPress={() => { signOut("User logged out") }}>
                            <MaterialIcons name="logout" size={20} color={"#000"} />
                        </Pressable>
                    </View>
                )}

                {usertype === "supplier" && (
                    <View style={[styles.name, { marginLeft: -35 }]}>
                        {/* <Text style={{ color: "#ffffff", }}>,</Text> */}
                        <Text style={{ color: "#ffffff", }}>{translate(appLanguage, "Hi")}, {userdata?.name?.split(" ")[0] ?? userdata?.name}</Text>
                    </View>


                )}
            </View>
        </Appbar.Header>
    )
}

const styles = StyleSheet.create({
    badgeIconWrapper: {
        width: 40
    },
    name: {
        display: "flex",

    },
    badgeIcon: {
        backgroundColor: "white"
    },
    badgeCount: {
        position: "absolute",
        right: 0,
        top: -5
    },
    noShadow: {
        elevation: 0,
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },
    userInfoTxt: {
        color: "#fff",
        fontSize: 15,
        fontFamily: appConstant.baseFontFamily,
        backgroundColor: appConstant.themePrimaryColor,
        padding: 4,
        paddingHorizontal: 12,
        borderRadius: 20
    }
});