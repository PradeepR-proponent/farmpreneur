import React, { useEffect, useState } from 'react';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Image, Linking, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Divider } from 'react-native-paper';
import fontsLoaded from "config/fonts";
import AppLoading from "expo-app-loading";
import appConstant from "config/constants";
import { AntDesign, Feather, Octicons, FontAwesome, FontAwesome5, MaterialIcons, Entypo } from "@expo/vector-icons";
import { AuthContext } from "components/Auth/AuthContext";
import * as SecureStore from 'expo-secure-store';
import { useSelector } from "react-redux";
import { userType } from "slice/authSlice";
import { userData } from "slice/userSlice";
import { translate } from '../../languageFeature';


function DrawerContent(props) {
  const { signOut } = React.useContext(AuthContext);
  const { appLanguage } = useSelector(state => state.auth)
  const user = useSelector(userData) ?? {};
  const usertypeTwo = useSelector(userType);
  const [showIcon, setShowIcon] = useState(false)

  const click = () => {
    console.log(usertypeTwo);
  };

  const DrawerContentLink = [

    {
      id: 4,
      role: ["supplier"],
      mainLable: translate(appLanguage, "MY Account"),
      subLable: [
        {
          id: 0,
          label: translate(appLanguage, "Home"),
          onClick: () => props.navigation.navigate('Home'),
        },
        {
          id: 1,
          label: translate(appLanguage, "Personal Information"),
          onClick: () => props.navigation.navigate('ProfileStack', { screen: 'ProfileScreen' }),
          icon: ({ focused, size }) => <Entypo name='dot-single' size={20} color={"red"} />

        },
        {
          id: 4,
          label: translate(appLanguage, "Bank Details"),
          onClick: () => props.navigation.navigate('BankInfoScreen'),
        },
        {
          id: 5,
          label: translate(appLanguage, "Legal Document"),
          onClick: () => props.navigation.navigate('UserDocScreen'),
        },
      ],
    },



    {
      id: 10,
      role: ["buyer"],
      mainLable: translate(appLanguage, "MY Account"),
      subLable: [
        {
          id: 0,
          label: translate(appLanguage, "Home"),
          onClick: () => props.navigation.navigate('Home'),
        },
        {
          id: 1,
          label: translate(appLanguage, "Personal Information"),
          onClick: () => props.navigation.navigate('ProfileStack', { screen: 'ProfileScreen' }),
          icon: ({ focused, size }) => <Entypo name='dot-single' size={20} color={"red"} />

        },

      ],
    },
    // {
    //   id: 1,
    //   role: ["buyer"],
    //   mainLable: translate(appLanguage, "Shop"),
    //   subLable: [
    //     {
    //       id: 1,
    //       label: translate(appLanguage, "Shop By Category"),
    //       onClick: () => {
    //         console.log("clicked ");
    //       },
    //     },
    //     {
    //       id: 2,
    //       label: translate(appLanguage, "My Business"),
    //       onClick: click,
    //     },
    //     {
    //       id: 3,
    //       label: translate(appLanguage, "Promotions"),
    //       onClick: click,
    //     },
    //     {
    //       id: 4,
    //       label: translate(appLanguage, "Recently Launched"),
    //       onClick: click,
    //     },
    //   ],
    // },
    {
      id: 2,
      role: ["supplier","buyer"],
      mainLable: translate(appLanguage, "Sections"),
      subLable: [

        {
          id: 1,
          label: translate(appLanguage, "Training"),
          onClick: () => props.navigation.navigate('Training'),

        },
        // {
        //   id: 2,
        //   label: "Buyers",
        //   onClick: click,
        // },
        {
          id: 3,
          label: translate(appLanguage, "Services"),
          onClick: () => props.navigation.navigate('ServiceScreen'),

        },
        {
          id: 4,
          label: translate(appLanguage, "Consultancy"),
          onClick: () => props.navigation.navigate('consultancy'),

        },
      ],
    },
    {
      id: 3,
      role: [],
      mainLable: translate(appLanguage, "Properties"),
      subLable: [
        {
          id: 1,
          label: translate(appLanguage, "Training"),
          onClick: click,
        },
        {
          id: 2,
          label: translate(appLanguage, "Farmers"),
          onClick: click,
        },
        {
          id: 3,
          label: translate(appLanguage, "Buyers"),
          onClick: click,
        },
        {
          id: 4,
          label: translate(appLanguage, "Services"),
          onClick: click,
        },
        {
          id: 5,
          label: translate(appLanguage, "Consultancy"),
          onClick: () => props.navigation.navigate('consultancy', { screen: 'ProfileScreen' }),
        },
      ],
    },

    {
      id: 5,
      role: ["supplier", "buyer"],
      mainLable: translate(appLanguage, "Other"),
      subLable: [
        {
          id: 1,
          label: translate(appLanguage, "About Farmpreneur"),
          // onClick: ()=> Linking.openURL('https://grow4himalayas.com/our-farm/'),
          onClick: () => props.navigation.navigate('OtherWebView', { uri: appConstant.aboutUrl })

        },
        {
          id: 2,
          label: translate(appLanguage, "Privacy Policy"),
          // onClick: ()=> Linking.openURL('https://grow4himalayas.com/privacy-policy/'),
          onClick: () => props.navigation.navigate('OtherWebView', { uri: appConstant.privacyUrl })

        },
        {
          id: 3,
          label: translate(appLanguage, "Term & Conditions"),
          onClick: () => props.navigation.navigate('OtherWebView', { uri: appConstant.termUrl })

        },
        {
          id: 4,
          label: translate(appLanguage, "Contact Us"),
          onClick: () => props.navigation.navigate('contactus')
        },
        {
          id: 6,
          label: translate(appLanguage, "Rate Us"),
          onClick: () => props.navigation.navigate('OtherWebView', { uri: appConstant.rateUs }),

        },
        {
          id: 5,
          label: translate(appLanguage, "Settings"),
          onClick: () => props.navigation.navigate('UserSetting'),
        },

      ],
    },
  ];



  useEffect(() => {

    if (user.role === "buyer") {
      if (!user.address || !user.alternate_phone || !user.city
        || !user.country || !user.email ||
        !user.name || !user.state) {
        setShowIcon(true)
      } else setShowIcon(false)
    }

    if (user.role === 'supplier') {
      if (!user.address || !user.alternate_phone || !user.city
        || !user.company_name || !user.country || !user.email ||
        !user.name || !user.state) {
        setShowIcon(true)
      } else setShowIcon(false)
    }


  }, [user, props])

  if (!fontsLoaded()) {
    return <AppLoading />;
  } else {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <DrawerContentScrollView {...props} style={{ marginTop: 20, paddingTop: 0 }}>
          <View style={styles.topProfileBg}>
            <View style={styles.topProfileWrapper}>
              <Image source={{ uri: user?.profile_photo_url }} style={styles.topProfileImg} />
              <View style={styles.topProfileTxtWrapper}>
                <Text style={styles.topProfileTxt} numberOfLines={2}>
                  {user?.name}{" "}
                  {user?.is_approved == 1 && (
                    <Octicons
                      name="verified"
                      color={"#fff700"}
                      size={18}
                    />
                  )}

                </Text>
                <Text style={styles.topProfileSubTxt}>{user.role == "supplier" ? translate(appLanguage, "Farmer") : user?.role?.toUpperCase()}</Text>
              </View>
            </View>
          </View>

          {DrawerContentLink.map((menu) => {
            if (menu.role.includes(user.role)) {
              return (
                <>
                  <DrawerItem
                    style={styles.navTop}
                    labelStyle={styles.navLabelTop}
                    label={menu.mainLable}
                  />
                  {menu.subLable.map((label) => (
                    <DrawerItem
                      style={styles.navItem}
                      labelStyle={{ ...styles.navLabel, paddingLeft: label?.icon && showIcon ? 0 : 50, }}
                      label={label.label}
                      onPress={label.onClick}
                      icon={showIcon ? label?.icon : ""}
                    />
                  ))}
                </>
              );
            } else return null;
          })}


          <DrawerItem
            icon={({ color, size }) => (
              <AntDesign name="logout" color={color} size={size} style={{ margin: 0, padding: 0 }} />
            )}
            style={styles.navItem}
            labelStyle={styles.logoutLabel}
            label={translate(appLanguage, "Logout")}
            onPress={() => {
              signOut();
            }}
          />



        </DrawerContentScrollView>
        <View style={styles.drawerFooter}>
          <Divider style={styles.divider} />
          <Text style={styles.drawerTxt}>@Copyright Reserved</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://grow4himalayas.com')}>
            <Text style={[styles.drawerTxt, { fontFamily: "Montserrat_500Medium" }]}>Farmpreneur INDIA</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  topProfileWrapper: {
    flex: 1,
    flexDirection: "row",
    height: 120,
    alignItems: "center",
    justifyContent: "space-around",
    padding: 10,
  },
  topProfileBg: {
    backgroundColor: appConstant.themeSecondaryColor,
  },
  topProfileBgImg: {
    resizeMode: "cover",
  },
  topProfileImg: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#fff",
  },
  topProfileTxtWrapper: {
    width: "70%",
  },
  topProfileTxt: {
    color: "#fff",
    fontSize: appConstant.basePrimaryFontSize,
    fontFamily: "Montserrat_600SemiBold",

  },
  topProfileSubTxt: {
    color: "#fff",
    fontSize: appConstant.baseSecondaryFontSize,
    fontFamily: "Montserrat_500Medium",
  },
  navItem: {
    width: "100%",
    alignSelf: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e7e7e7",
    marginTop: 0,
    marginBottom: 0,
    paddingBottom: 0,
    paddingTop: 0,
  },
  navTop: {
    width: "100%",
    alignSelf: "center",
    // borderBottomColor: "#e7e7e7",
    backgroundColor: "#e7e7e7",
    marginBottom: 0,
    paddingBottom: 0,
    paddingTop: 0,
    padding: 0,
    margin: 0,
  },
  navLabel: {
    fontSize: 12,
    fontFamily: "Montserrat_600SemiBold",
    color: "#0B5B80",

  },
  logoutLabel: {
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
    color: "#0B5B80",
    marginLeft: -20
  },
  navLabelTop: {
    fontSize: 14,
    fontFamily: "Montserrat_600SemiBold",
    color: "#0B5B80",
    fontWeight: "bold",
    paddingLeft: 15,
  },
  drawerSection: {
    borderBottomWidth: 0,
  },
  drawerFooter: {
    paddingBottom: 10,
  },
  divider: {
    backgroundColor: "#e7e7e7",
    height: 1,
    width: "100%",
    alignSelf: "center",
  },
  drawerTxt: {
    textAlign: "center",
    fontFamily: appConstant.baseFontFamily,
    fontSize: 12,
    color: "#9a9a9a",
  },
});
export default DrawerContent;


