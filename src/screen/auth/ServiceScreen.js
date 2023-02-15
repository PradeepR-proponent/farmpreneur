import React, { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Linking,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import Loader from "components/Loader";
import { StatusBar } from "expo-status-bar";
import appConstant from "config/constants";
import ProductList from "screen/user/buyer/product/ProductList";
import { AntDesign, Feather } from "@expo/vector-icons";
import { fetchAllHomeScreenNews } from "services/news";
import { useToast } from "react-native-toast-notifications";
import { formatDate } from "helper";
import InfoCard from "components/Card/InfoCard";
import image from "../../assets/images/weatherImage.jpg";
import hybrid from "../../assets/images/hybrid.png";
import insuranc from "../../assets/images/insuranc.png";
import solar from "../../assets/images/solar.png";
import weather from "../../assets/images/weather.png";
import agro from "../../assets/images/agro.png";
import { translate } from '../../languageFeature'
import { useSelector } from "react-redux";
import { getBanner } from '../../services/banner'


import { ALWAYS } from "expo-secure-store";



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
    getBanner().then((res) => setBanner(res.data)).catch((error) => {
      toast.show(error.message, { type: "danger", duration: 10000 })
    })
  }, [])

  return (
    <>
      <SafeAreaView>
        <View style={styles.sliderWrapper}>
          <Carousel
            data={sliderData}
            renderItem={({ item, index }) => (<Image key={index} source={banner?.length === 0 || banner == undefined ? item?.image : { uri: item?.image }} style={styles.productImg} />)}
            sliderWidth={windowWidth}
            itemWidth={windowWidth}
            onSnapToItem={(index) => setActiveSlide(index)}
            autoplay={true}
            autoplayInterval={2000}
            autoplayDelay={2000}
            enableMomentum={false}
            lockScrollWhileSnapping={true}
            loop={true}
          />
        </View>
      </SafeAreaView>
      <View style={styles.container}>
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>
          <View
            style={{
              ...styles.overlay,
              width: windowWidth,
              height: windowHeight,
            }}
          >
            <View style={{ ...styles.cardConainer, width: windowWidth }}>
              {btnData.map((data) => (
                <Pressable onPress={data.onClick} key={data.id}>
                  <View style={styles.iconContainer}>
                    <Image source={data.icon} style={styles.icons} />
                    <Text style={styles.text}>{data.btnName}</Text>
                  </View>
                </Pressable>
              ))}

            </View>
          </View>
        </ImageBackground>
      </View>
    </>
  );
};

export default ServiceScreen;

const styles = StyleSheet.create({
  sliderWrapper: {
    zIndex: 2,
    paddingBottom: 4,
  },
  productImg: {
    height: 150,
    width: "100%",
    resizeMode: "cover",
  },
  iconContainer: {
    width: 300,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  icons: {
    width: 30,
    height: 30,
    resizeMode: "cover",
    marginRight: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(11,91,128,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(11,91,128,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },
  cardConainer: {
    height: 450,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    color: "black",
    fontSize: 14,
    fontWeight: "700",
  },
});

// dark="#052b40"
// circle="#0b5b80"
// light=""
