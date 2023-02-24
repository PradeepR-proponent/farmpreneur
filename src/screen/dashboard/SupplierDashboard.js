import * as React from 'react';
import { useEffect, useState } from 'react';
import {
    Button,
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    Pressable,
    Linking,
    View
} from "react-native";
import { StatusBar } from "expo-status-bar";
import appConstant from "config/constants";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { AntDesign, Feather } from "@expo/vector-icons";
import { fetchSupplierStats } from 'services/user';
import { fetchAllHomeScreenNews } from 'services/news';
import { fetchAllBanner, getBanner } from 'services/banner';
import Loader from "components/Loader";
import { useToast } from "react-native-toast-notifications";
import { formatDate } from 'helper';
import InfoCard from "components/Card/InfoCard";
import { translate } from '../../languageFeature';
import { useSelector } from 'react-redux';



export default function SupplierDashboard(props) {



    const { appLanguage } = useSelector(state => state.auth)
    const [activeSlide, setActiveSlide] = useState(0);
    const [news, setNews] = useState([]);
    const [banner, setBanner] = useState([]);
    const [activeBannerSlide, setActiveBannerSlide] = useState(0);
    const windowWidth = useWindowDimensions().width;
    const sliderData = banner?.length != 0 ? banner : [
        {
            id: 1,
            image: require('assets/home/banner-1.jpg')
        },
        {
            id: 2,
            image: require('assets/home/banner-2.jpg')
        },
        {
            id: 3,
            image: require('assets/home/banner-3.jpg')
        }
    ];

    const IconSize = 30;
    const IconColor = "#fff";
    const toast = useToast();
    const { navigation } = props;

    //fetch all banners
    const { isLoading: bannerLoading, error: bannerError, data: bannerData, isFetching: bannerIsFetching, refetch: bannerRefetch } = fetchAllBanner();
    if (bannerError) toast.show(bannerError.message, { type: "danger", duration: 10000 });

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

    useEffect(() => {
        getBanner().then((res) => setBanner(res.data)).catch((error) => {
            toast.show(error.message, { type: "danger", duration: 10000 })
        })
    }, [])

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            refetch();
            bannerRefetch();
            newsRefetch();
        });
        return unsubscribe;
    }, [navigation]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
          
            <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
                <View style={styles.mainWrapper}>
                    <View style={styles.sliderWrapper}>
                        <Carousel
                            data={sliderData}
                            renderItem={({ item, index }) => (<Pressable onPress={() => openLink(banner?.length > 0 ? item?.url : appConstant?.appUrl)}>
                                <Image source={banner?.length > 0 ? { uri: item?.image } : item?.image} style={styles.productImg} />
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
                    <Text style={styles.heading} >{translate(appLanguage, "Total Buyers")}: {data?.data?.buyer} </Text>
                    <View style={styles.statsWrapper}>
                        <Pressable style={styles.statItem} onPress={() => props.navigation.navigate('UserProductStack')}>
                            <View >
                                <AntDesign name="shoppingcart" size={IconSize} color={IconColor} />
                                <Text style={styles.statTxt}><Text style={styles.statCount}>{data?.data?.products} </Text>{translate(appLanguage, "Products")}</Text>
                            </View>
                        </Pressable>
                        <Pressable style={styles.statItem} onPress={() => props.navigation.navigate('Order')} >
                            <View >
                                <Feather name="box" size={IconSize} color={IconColor} />
                                <Text style={styles.statTxt}><Text style={styles.statCount}>{data?.data?.orders}</Text> {translate(appLanguage, "Orders")}</Text>
                            </View>
                        </Pressable>
                    </View>
                    <View style={styles.middleBanner}>
                        <View style={styles.bannerTxtWrapper}>
                            <Text style={styles.middleBannerTitle}>{translate(appLanguage, "What's New")}</Text>
                            <Text style={styles.middleBannerSubTitle}>{translate(appLanguage, "Explore daily")}<Text style={{ color: appConstant.themePrimaryColor }}>{` ${translate(appLanguage, "Farmpreneur Mushroom")}`}</Text> </Text>
                        </View>
                        {news?.length != 0 && <Carousel
                            data={news}
                            renderItem={({ item, activeBannerSlide }) => {
                                return (
                                    <TouchableOpacity style={styles.newsWrapper} onPress={() => props.navigation.navigate('News', { screen: "NewsDetail", params: { id: item.id } })}>
                                        <Image source={{ uri: item.featured_image_url }} key={item.id} style={styles.whatNewImg} />
                                        <View style={styles.newsContent}>
                                            <Text style={styles.newsTitle}>{item.title}</Text>
                                            <View style={styles.cardCoursePill}>
                                                <AntDesign name="calendar" size={12} color={"#fff"} />
                                                <Text style={styles.cardCoursePillTxt}>{formatDate(item.created_at)}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                            sliderWidth={windowWidth}
                            itemWidth={windowWidth}
                            onSnapToItem={(index) => setActiveBannerSlide(index)}

                        />}
                        {news?.length == 0 && <InfoCard pb={30} type={"notFound"} message={"No news found."} imgSize={70} />}


                        <View style={{ position: "absolute", bottom: -10, width: "100%" }}>
                            <Pagination
                                dotsLength={news?.length}
                                activeDotIndex={activeBannerSlide}
                                containerStyle={{ backgroundColor: 'transparent', paddingVertical: 20, }}
                                dotStyle={{
                                    width: 8,
                                    height: 8,
                                    borderRadius: 5,
                                    marginHorizontal: 8,
                                    backgroundColor: appConstant.themePrimaryColor
                                }}
                                inactiveDotStyle={{
                                    // Define styles for inactive dots here
                                }}
                                inactiveDotOpacity={0.4}
                                inactiveDotScale={0.6}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
            {(loading || isFetching || newsLoading || newsIsFetching) && (<Loader visible={true} />)}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    heading: {
        color: "#333",
        fontWeight: "700",
        fontSize: 19,
        padding:20,
        backgroundColor:appConstant.themePrimaryLightColor,
    },
    main: {
        flex: 1,
        backgroundColor: "#fff",
    },
    sliderWrapper: {

    },
    productImg: {
        height: 115,
        width: "100%",
        resizeMode: "cover"
    },
    statsWrapper: {

        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        backgroundColor: "#fbfbfb",
        // borderTopRightRadius:50,
        // borderTopLeftRadius:50,
        padding: 10
    },
    statItem: {
        backgroundColor: appConstant.themeSecondaryColor,
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
        height:200,
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
        backgroundColor: "#0000009C",
        width: "100%",
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
