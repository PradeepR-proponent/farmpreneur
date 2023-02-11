import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  Pressable,
  Linking,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import appConstant from "config/constants";
import {
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons,
  Entypo,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";
import { translate } from '../../languageFeature'
import { useSelector } from "react-redux";


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
        Linking.openURL("https://www.facebook.com/OysterGano.Trout.Club"),
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
        Linking.openURL("https://www.instagram.com/Oystergano.Trout.Club/"),
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
        Linking.openURL("https://in.pinterest.com/iGROWkamal/_created/"),
    },
  ];

  return (
    <SafeAreaView
      style={{ ...styles.container, width: windowWidth, height: windowHeight }}
    >
      <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
      <View style={styles.textArea}>
        <Text style={styles.headingStyle}>
          {translate(appLanguage, "Green Revolution 4 Organic World - Farmpreneur")}
        </Text>
      </View>

      <View style={styles.textArea}>
        <View style={styles.flexSection}>
          <Text style={styles.text}>{translate(appLanguage, "Web")}-</Text>
          <View>
            <Pressable onPress={() => Linking.openURL("https://grow4himalayas.com/")}>
              <Text style={styles.text}> www.grow4himalayas.com</Text>
            </Pressable>
            <Pressable onPress={() => Linking.openURL("https://www.grow4himalayas.co.in")} >
              <Text style={styles.text}>www.grow4himalayas.co.in</Text>
            </Pressable>
          </View>
        </View>

        <Pressable onPress={() => Linking.openURL("mailto:grow4himalayas@gmail.com")}>
          <Text style={styles.text}>
            {translate(appLanguage, "Mail")}- grow4himalayas@gmail.com
          </Text>
        </Pressable>

      </View>
      <View style={styles.textArea}>
        <Text style={styles.headingStyle}>{translate(appLanguage, "Contact Number")} </Text>
        <Pressable>
          <Text style={styles.text} onPress={() => Linking.openURL("tel:+918265999909")} >{translate(appLanguage, "Business help")}: +91 8265999909 </Text>
        </Pressable>

        <View style={{ display: "flex", flexDirection: "row" }}>
          <Pressable style={styles.btn} onPress={() => props.navigation.navigate('Training')} >
            <Text style={[styles.text, styles.whiteText]}>{translate(appLanguage, "Training")}</Text>
          </Pressable>
          <Pressable style={styles.btn} onPress={() => props.navigation.navigate('consultancy')} >
            <Text style={[styles.text, styles.whiteText]}>{translate(appLanguage, "Consultancy")}</Text>
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

        <Text style={styles.headingStyle}>{translate(appLanguage, "OysterGano Trout Club")}</Text>
      </View>
    </SafeAreaView>
  );
};

export default ContactUS;

const styles = StyleSheet.create({
  btn: {
    width: 120,
    backgroundColor: "green",
    marginBottom: 10,
    marginRight: 20,
    padding: 5,
    borderRadius: 5
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
    marginBottom: 20,
    marginTop: 20,
  },
  headingStyle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#0b5b80",
  },

  textStyle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "green",
  },
  text: {
    fontSize: 14,
    color: "#0b5b80",
    marginBottom: 5,
  },
  icon: {
    marginRight: 15,
    marginTop: 10,
    marginBottom: 10,
  },
});
