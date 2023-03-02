import React, { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Carousel from "react-native-snap-carousel";
import { useToast } from "react-native-toast-notifications";
import hybrid from "../../assets/images/hybrid.png";
import insuranc from "../../assets/images/insuranc.png";
import solar from "../../assets/images/solar.png";
import weather from "../../assets/images/weather.png";
import agro from "../../assets/images/agro.png";
import more from "../../assets/images/more.png";
import { translate } from '../../languageFeature'
import { useSelector } from "react-redux";
import { getBanner } from '../../services/banner'
import { responsiveHeight } from 'react-native-responsive-dimensions';

const ServiceScreen = (props) => {
  const { appLanguage } = useSelector(state => state.auth)

  const toast = useToast();
  const [activeSlide, setActiveSlide] = useState(0);
  const [banner, setBanner] = useState([]);
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  const btnData = [
    {
      id: "1",
      icon: weather,
      btnName: translate(appLanguage, "Weather Forcast"),
      onClick: () => props.navigation.navigate("WeatherForcast"),
    },
    {
      id: "5",
      icon: insuranc,
      btnName: translate(appLanguage, "Insurance / Policies"),
      onClick: () => props.navigation.navigate('OtherWebView', { uri: 'https://pmfby.gov.in/' })
    },
    {
      id: "4",
      icon: agro,
      btnName: translate(appLanguage, "Agro Equipment"),
      onClick: () => props.navigation.navigate('OtherWebView', { uri: 'https://agrimachinery.nic.in/' })
    },
    {
      id: "2",
      icon: hybrid,
      btnName: translate(appLanguage, "Hybrid Model"),
      onClick: () => props.navigation.navigate('OtherWebView', { uri: 'https://mnre.gov.in/' })
    },
    {
      id: "3",
      icon: solar,
      btnName: translate(appLanguage, "Solar Technology"),
      onClick: () => props.navigation.navigate('OtherWebView', { uri: 'https://mnre.gov.in/' })
    },
    {
      id: "6",
      icon: more,
      btnName: translate(appLanguage, "Comming Soon"),
      onClick: () => { return },
    }

  ];


  const sliderData = banner?.length === 0 || banner == undefined ? [

    {
      image: require("assets/slider/agro.jpg"),
    },
    {
      image: require("assets/slider/report.jpg"),
    },
    {
      image: require("assets/slider/solar.jpg"),
    },
    {
      image: require("assets/slider/mashroom.png"),
    },

  ] : banner


  useEffect(() => {
    getBanner().then((res) => {
      setBanner(res.data)
    }).catch((error) => {
      toast.show(error.message, { type: "danger", duration: 2000 })
    })
  }, [])

  return (
    <ScrollView>
      <SafeAreaView>
        <View style={styles.sliderWrapper}>
          <Carousel
            data={sliderData}
            renderItem={({ item, index }) => (<Image key={index} source={banner?.length === 0 || banner == undefined ? item?.image : { uri: item?.image }} style={styles.productImg} />)}
            sliderWidth={windowWidth}
            itemWidth={windowWidth}
            onSnapToItem={(index) => setActiveSlide(index)}
            autoplay={true}
            autoplayInterval={4000}
            autoplayDelay={4000}
            enableMomentum={false}
            lockScrollWhileSnapping={true}
            loop={true}
          />
        </View>
      </SafeAreaView>
      <View style={{ ...styles.cardConainer }}>
        {btnData.map((data) => (
          <Pressable onPress={data.onClick} key={data.id}>
            <View style={styles.iconContainer}>
              <Image source={data.icon} style={styles.icons} />
              <Text style={styles.text}>{data.btnName}</Text>
            </View>
          </Pressable>
        ))}

      </View>

    </ScrollView>
  );
};

export default ServiceScreen;

const styles = StyleSheet.create({
  sliderWrapper: {
    zIndex: 2,
  },
  productImg: {
     height: responsiveHeight(15),
    width: "100%",
    resizeMode: "cover",
  },
  iconContainer: {
    width: 150,
    height: 150,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    margin: 15,
    padding: 5
  },
  icons: {
    width: 50,
    height: 50,
    resizeMode: "cover",
    marginBottom: 10,
  },
  cardConainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 10
  },
  text: {
    color: "black",
    fontSize: 16,
    fontWeight: "700",
  },
});

