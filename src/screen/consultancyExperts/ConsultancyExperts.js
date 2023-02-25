import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useSelector } from "react-redux";
import { translate } from '../../languageFeature'

const ConsultancyExperts = ({ route }) => {


  const { appLanguage } = useSelector(state => state.auth)
  const data = route.params.data;
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  return (
    <SafeAreaView>
      <View
        style={{
          ...styles.container,
          width: windowWidth,
          height: windowHeight,
        }}
      >
        <View style={styles.userProfileSection}>
          <Image source={data.image} style={styles.userImage} />
          <View>
            <Text style={styles.textStyle}>{data.name}</Text>
            <Text style={styles.textStyle} numberOfLines={2} >{data.title}</Text>
          </View>
        </View>

        <View style={{ marginTop: 30 }} >
          <Text style={styles.text} >{data.description}</Text>
        </View>


        <View style={{ marginTop: 30 }} >
          <Text style={styles.text} >{translate(appLanguage, "Sector:")} {data.sector}</Text>
          <Text style={styles.text} >{translate(appLanguage, "Mail Id:")}</Text>
          <Text style={styles.text} >{translate(appLanguage, "Contact Number:")}</Text>
          <Text style={styles.text} >{translate(appLanguage, "Timming For discussion:")}</Text>
        </View>

      </View>
    </SafeAreaView>
  );
};

export default ConsultancyExperts;
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  userProfileSection: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },

  headingStyle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    borderWidth: 1
  },

  textStyle: {
    width:220,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0b5b80",
  },
  text: {
    fontSize: 14,
    color: "#0b5b80",
    marginBottom: 5,
  },
  userImage: {
    borderWidth: 1,
    height: 80,
    width: 80,
    borderRadius: 50,
    marginRight:10
  },
});
