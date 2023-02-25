import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  Linking, Image,ScrollView
} from "react-native";
import { StatusBar } from "expo-status-bar";
import appConstant from "config/constants";
import {
  AntDesign,
  Entypo,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";
import { translate } from '../../languageFeature'
import { useSelector } from "react-redux";
import s1 from '../../assets/icon/Govt-Sector01.png'
import s2 from '../../assets/icon/Pvt-Sector01.png'
import s3 from '../../assets/icon/Pvt-Sector02.png'


const ContactUS = (props) => {
  const { appLanguage } = useSelector(state => state.auth)
  const windowHeight = useWindowDimensions().height;
  const windowWidth = useWindowDimensions().width;

  const linkData = [
    {
      id: "1",
      icon: (
        <Entypo name="facebook" size={30} color="#0b5b80" style={styles.icon} />
      ),
      onclick: () =>
        Linking.openURL("https://www.facebook.com/clubfarmpreneur"),
    },
    {
      id: "2",
      icon: (
        <FontAwesome5
          name="instagram-square"
          size={30}
          color="#0b5b80"
          style={styles.icon}
        />
      ),
      onclick: () =>
        Linking.openURL("https://www.instagram.com/farmpreneur.club/"),
    },
    // {
    //   id: "3",
    //   icon: (
    //     <MaterialCommunityIcons
    //       name="google-my-business"
    //       size={30}
    //       color="#0b5b80"
    //       style={styles.icon}
    //     />
    //   ),
    //   onclick: () => Linking.openURL('https://www.linkedin.com/in/kamal-sharma-7b635a18/'),
    // },
    {
      id: "4",
      icon: (
        <AntDesign
          name="linkedin-square"
          size={30}
          color="#0b5b80"
          style={styles.icon}
        />
      ),
      onclick: () =>
        Linking.openURL("https://www.linkedin.com/in/kamal-sharma-7b635a18/"),
    },
    {
      id: "5",
      icon: (
        <FontAwesome
          name="pinterest-square"
          size={30}
          color="#0b5b80"
          style={styles.icon}
        />
      ),
      onclick: () =>
        Linking.openURL("https://in.pinterest.com/Farmpreneurclub/"),
    },
    {
      id: "6",
      icon: (
        <AntDesign
          name="youtube"
          size={30}
          color="#0b5b80"
          style={styles.icon}
        />
      ),
      onclick: () => Linking.openURL("https://www.youtube.com/@farmpreneur"),
    },
  ];

  return (
    
    <SafeAreaView style={{ ...styles.container, width: windowWidth, height: windowHeight }} >
      <ScrollView>


      <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
      <View style={styles.textArea}>
        <Text style={styles.mainheadingStyle}>Agro Farmpreneur Solution Pvt Ltd</Text>
      </View>
      <View style={styles.textArea}>
        <View style={styles.flexSection}>
          <Text style={[styles.text, { fontWeight: "bold" }]}>{translate(appLanguage, "Web")}: </Text>
          <View>
            <Pressable onPress={() => Linking.openURL("https://farmpreneur.in/")}>
              <Text style={styles.text}>www.farmpreneur.in</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.flexSection}>
          <Text style={[styles.text, { fontWeight: "bold" }]}>{translate(appLanguage, "Mail")}: </Text>
          <Pressable onPress={() => Linking.openURL("mailto:farmpreneur.club@gmail.com")}>
            <Text style={styles.text}>
              farmpreneur.club@gmail.com
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.textArea}>
        <Text style={styles.headingStyle}>{translate(appLanguage, "Contact Number")}</Text>
        <View style={styles.flexSection}>
          <Text style={[styles.text, { fontWeight: "bold" }]}>{translate(appLanguage, "Business help")}: </Text>
          <Pressable onPress={() => Linking.openURL("tel:+918265999909")} >
            <Text style={styles.text}>+91 8265999909</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.textArea}>
        <Text style={styles.headingStyle}>{translate(appLanguage, "Social Platform")}:</Text>
        <View style={styles.flexSection}>
          {linkData.map((data) => (
            <Pressable key={data.id} onPress={data.onclick}>
              {data.icon}
            </Pressable>
          ))}
        </View>

        <Text style={styles.headingStyle}>{translate(appLanguage, "Farmpreneur Club")}</Text>
      </View>
      <View style={styles.view}>
        <Text style={styles.mainHeadingStyle}>{translate(appLanguage,"ASSOCIATED WITH")}:</Text>
        <Text style={[styles.headingStyle,{ marginTop:10,}]} >{translate(appLanguage, "Govt. Sector")}:</Text>
        <Image style={styles.sector} source={s1} />
        <Text style={[styles.headingStyle,{ marginTop:10,}]}>{translate(appLanguage, "Private Sector")}:</Text>
        <Image style={styles.sector} source={s2} />
        <Image style={styles.sector} source={s3} />
      </View>
      </ScrollView>

    </SafeAreaView>
  );
};

export default ContactUS;

const styles = StyleSheet.create({
view:{
  marginTop:10,
borderTopWidth:1,
borderTopColor: "#0b5b80",
},
  sector: {
    width: '100%',
    height: 80,
    marginTop:10
  },
  mainHeadingStyle: {
    color: "#519f2e",
    fontWeight: "700",
    fontSize: 19,
    marginTop: 10,
  },

  whiteText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"

  },
  container: {
    padding: 20,
  },
  flexSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  textArea: {
    marginTop: 10
  },
  headingStyle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#0b5b80",
  },
  mainheadingStyle: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#0b5b80",
    borderBottomWidth: 1,
    borderBottomColor: "#0b5b80",
    paddingBottom:10,
  },
  textStyle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
  },
  text: {
    fontSize: 16,
    color: "#0b5b80",
    marginBottom: 5,
  },
  icon: {
    marginRight: 15,
    marginTop: 10,
    marginBottom: 10,
  },
});
