import * as React from 'react';
import { useEffect, useState } from 'react';
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
    Linking
} from "react-native";
import { StatusBar } from "expo-status-bar";
import appConstant from "config/constants";
import Carousel, { Pagination } from "react-native-snap-carousel";
import ProductList from "screen/user/buyer/product/ProductList";
import { AntDesign, Feather } from "@expo/vector-icons";
import { fetchAllHomeScreenNews } from 'services/news';
import { fetchSupplierStats } from 'services/user';
import { fetchAllBanner, getBanner } from 'services/banner';
import Loader from "components/Loader";
import { useToast } from "react-native-toast-notifications";
import { formatDate } from 'helper';
import InfoCard from "components/Card/InfoCard";
import Dummy from "assets/icon/dummy.png";
import { translate } from '../../languageFeature'
import { useSelector } from 'react-redux';
import iconsImage from "assets/icon/icons.png"
import {
    responsiveHeight,
} from "react-native-responsive-dimensions";
export default function BuyerDashboard(props) {

    const { appLanguage } = useSelector(state => state.auth)
    const [activeSlide, setActiveSlide] = useState(0);
    const [activeBannerSlide, setActiveBannerSlide] = useState(0);
    const [news, setNews] = useState([]);
    const [banner, setBanner] = useState([]);
    const windowWidth = useWindowDimensions().width;
    const { navigation } = props;
    const sliderData = banner?.length !== 0 ? banner : [
        {
            image: require('assets/home/banner-1.jpg')
        },
        {
            image: require('assets/home/banner-2.jpg')
        },
        {
            image: require('assets/home/banner-3.jpg')
        }
    ];

    const toast = useToast();


    //fetch all banners
    const { isLoading: bannerLoading, error: bannerError, bannerData, isFetching: bannerIsFetching, refetch: bannerRefetch } = fetchAllBanner();
    if (bannerError);

   //fetch member data
   const { isLoading: loading, error, data, isFetching, refetch } = fetchSupplierStats();
   if (error) toast.show(error.message, { type: "danger", duration: 10000 });

    //fetch all news
    const { isLoading: newsLoading, error: newsError, data: newsData, isFetching: newsIsFetching, refetch: newsRefetch } = fetchAllHomeScreenNews();
    if (newsError) toast.show(newsError.message, { type: "danger", duration: 10000 });

    const openLink = async (url) => {
        await Linking.openURL(url);
    }

    React.useEffect(() => {
        setNews(newsData?.data);
    }, [newsData]);



    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            bannerRefetch();
            newsRefetch();
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        getBanner().then((res) => setBanner(res.data)).catch((error) => {
            toast.show(error.message, { type: "danger", duration: 10000 })
        })
    }, [])
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
            <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
                <View style={styles.mainWrapper}>
                    <View style={styles.sliderWrapper}>
                        <Carousel
                            data={banner?.length > 0 ? banner : sliderData}
                            renderItem={({ item, index }) => (<Pressable key={index} onPress={() => openLink(banner?.length > 0 ? item?.url : appConstant?.appUrl)}>
                                <Image defaultSource={Dummy} source={banner?.length > 0 ? { uri: item?.image } : item?.image} style={styles.productImg} />
                            </Pressable>)}
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
                    <Text style={styles.heading} >{translate(appLanguage, "Total Supplier")}: {data?.data?.supplier} </Text>

                    <View style={styles.iconsWrapper}>
                        <Image
                            source={iconsImage}
                            style={styles.iconImage}
                        />
                    </View>

                    <View>
                        <ProductList navigation={props.navigation} />
                    </View>
                   
                </View>
            </ScrollView>
            {(newsLoading || newsIsFetching || bannerLoading || bannerIsFetching) && (<Loader visible={true} />)}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    iconImage: {
        marginTop: 20
    },
    iconsWrapper: {
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
    },
    heading: {
        color: appConstant.themeSecondaryColor,
        fontWeight: "700",
        fontSize: 19,
        backgroundColor:appConstant.themePrimaryLightColor,
        paddingLeft:20,
        paddingVertical:8
    },
    main: {
        flex: 1,
        backgroundColor: "#fff",
    },
    topProfileBg: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1
    },
    topProfileBgImg: {
        resizeMode: "stretch",
        opacity: 1
    },
    sliderWrapper: {
    },
    productImg: {
        height: responsiveHeight(15),
        width: "100%",
        resizeMode: "cover"
    },
    statsWrapper: {

        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        backgroundColor: "#fff",
        // borderTopRightRadius:50,
        // borderTopLeftRadius:50,
        padding: 10
    },
    statItem: {
        backgroundColor: "#00C18C",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        padding: 10,
        width: "43%",
        height: 150,
        margin: 10,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    statTxt: {
        marginTop: 20,
        fontFamily: appConstant.baseFontFamily,
        fontSize: 16,
        color: "#fff"
    },
    middleBanner: {
        backgroundColor: "#fff",
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 3,
        // },
        // shadowOpacity: 0.29,
        // shadowRadius: 4.65,
        //
        // elevation: 7,
    },
    bannerTxtWrapper: {
        padding: 10
    },
    middleBannerImg: {
        resizeMode: "cover",
        width: "100%",
        height: 150
    },
    middleBannerTitle: {
        fontSize: 20,
        color: appConstant.themeSecondaryColor,
        fontFamily: "Montserrat_700Bold"
    },
    middleBannerSubTitle: {
        marginVertical: 8,
        fontSize: 16,
        color: appConstant.themeSecondaryColor,
        fontFamily: appConstant.baseFontFamily
    },
    whatNewImg: {
        height: 250,
        width: "100%",
        resizeMode: "cover"
    },
    newsWrapper: {
        position: "relative"
    },
    newsContent: {
        position: "absolute",
        bottom: 0,
        padding: 20,
        paddingVertical: 10,
        width: "100%",
        backgroundColor: "#0000009C"
    },
    newsTitle: {
        color: "#fff",
        fontWeight: "700",
        fontFamily: appConstant.baseFontFamily
    },
    newsDate: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 12,
        fontFamily: appConstant.baseFontFamily
    },
    cardCoursePill: {
        width: "45%",
        alignItems: "center",
        marginTop: 5,
        borderRadius: 20,
        flexDirection: "row",
    },
    cardCoursePillTxt: {
        marginLeft: 8,
        color: "#fff",
        fontWeight: "700",
        fontSize: 12
    }
});
