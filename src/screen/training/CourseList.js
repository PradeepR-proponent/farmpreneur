import * as React from 'react';
import {
    FlatList, SafeAreaView, View,
    useWindowDimensions,
    StyleSheet, Pressable, Image, Text
} from "react-native";
import appConstant from "config/constants";
import { StatusBar } from "expo-status-bar";
import { fetchAllCourses } from 'services/course';
import Loader from "components/Loader";
import { useToast } from "react-native-toast-notifications";
import moment from 'moment';
import InfoCard from "components/Card/InfoCard";
import { translate, translateAPI } from '../../languageFeature'
import { useSelector } from 'react-redux';
import { getBanner } from "../../services/banner"
import Carousel from "react-native-snap-carousel";
import { responsiveHeight } from 'react-native-responsive-dimensions';


export default function CourseList(props) {

    const { appLanguage } = useSelector(state => state.auth)
    const [courses, setCourses] = React.useState([]);
    const [banner, setBanner] = React.useState([]);
    const windowWidth = useWindowDimensions().width;

    const toast = useToast();
    const { navigation } = props;
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
    function handleProductClick(id) {
        if (id)
            props.navigation.navigate('Training', { screen: 'TrainingDetail', params: { id } });
    }

    //fetch prodcuts
    const { isLoading: loading, error, data, isFetching, refetch } = fetchAllCourses();
    if (error) toast.show(error.message, { type: "danger", duration: 2000 });

    React.useEffect(() => {
        setCourses(data?.data);
    }, [data]);

    const formatDate = (date) => {
        let newDate = new Date(date);
        return moment(newDate).format('DD MMMM YYYY');
    }

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            refetch()
        });
        return unsubscribe;
    }, [navigation]);


    React.useEffect(() => {
        getBanner().then((res) => setBanner(res.data)).catch((error) => {
            toast.show(error.message, { type: "danger", duration: 2000 })
        })
    }, [])


    const Item = ({ title, description, title_hi, description_hi, image, duration, price, startDate, handleClick, seatNum }) => {
        return (
            <Pressable style={styles.itemWrapper} onPress={() => {
                handleClick();
            }}>
                <View style={styles.itemImgWrapper}>
                    <Image source={image} style={styles.itemImg} />
                </View>
                <View style={styles.itemDetails}>
                    <Text style={styles.itemTitle} numberOfLines={2}>{translateAPI(appLanguage, `${title}`, title_hi)}</Text>
                    <Text style={styles.itemTags} numberOfLines={3} > {translateAPI(appLanguage, `${description}`, `${description_hi}`)}</Text>
                    {props.rating !== undefined && (<View style={styles.itemRating}>
                        {fetchRatings(props.rating)}
                    </View>)}
                    <View style={styles.itemInfo}>
                        <View style={styles.itemPriceWrapper}>
                            <Text style={styles.itemPriceTxt}>₹ <Text style={styles.itemPrice}>{price}</Text></Text>
                        </View>
                        <View style={styles.itemAddCartWrapper}>
                            <Text style={styles.itemCount}>{duration}</Text>
                        </View>
                    </View>
                    {seatNum == 0 && (<View style={styles.noSeat}>
                        <Text style={styles.noSeatTxt}>{translate(appLanguage, "No seats left")}</Text>
                    </View>)}
                </View>
                <View style={styles.dateWrapper}>
                    <Text style={styles.dateTxt} >{formatDate(startDate)}</Text>
                </View>
            </Pressable>
        );
    }


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
            <View style={styles.sliderWrapper}>
                <Carousel
                    data={sliderData}
                    renderItem={({ item, index }) => (<Pressable onPress={() => openLink(banner?.length > 0 ? item?.url : appConstant?.appUrl)}>
                        <Image source={banner?.length > 0 ? { uri: item?.image } : item?.image} style={styles.productImg} />
                    </Pressable>)}
                    sliderWidth={windowWidth}
                    itemWidth={windowWidth}
                    autoplay={true}
                    autoplayInterval={4000}
                    autoplayDelay={4000}
                    enableMomentum={false}
                    lockScrollWhileSnapping={true}
                    loop={true}
                />
            </View>



            <View style={styles.main}>
                {courses?.length != 0 && <FlatList
                    keyExtractor={(item) => item.id}
                    data={courses}
                    onRefresh={refetch}
                    refreshing={loading}
                    renderItem={({ item }) => {
                        return (
                            <Item seatNum={item?.seat_left}
                                title_hi={item?.title_hi}
                                title={item?.title}
                                description_hi={item?.excerpt_hi}
                                description={item?.excerpt}
                                price={item?.price} startDate={item?.start_date}
                                image={{ uri: item?.course_image_url }} duration={item?.duration} handleClick={() => { handleProductClick(item?.id) }} />
                        );
                    }}
                />}
                {courses?.length == 0 && <InfoCard type={"notFound"} message={"No courses found. Please check later"} />}
            </View>
            {(loading || isFetching) && (<Loader visible={true} />)}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    main: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop:20
    },
    productImg: {
         height: responsiveHeight(15),
        width: "100%",
        resizeMode: "cover"
    },
    sliderWrapper: {
    },
    itemWrapper: {
        flex: 1,
        flexDirection: "row",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
        backgroundColor: "#ffffff",
        margin: 20,
        marginBottom: 10,
        borderRadius: 8
    },
    itemImgWrapper: {
        width: "40%"
    },
    itemImg: {
        width: 120,
        height: "100%",
        resizeMode: "cover",
        borderBottomLeftRadius: 8,
        borderTopLeftRadius: 8
    },
    itemDetails: {
        width: "50%",
        flexGrow: 1,
        padding: 15,
        paddingHorizontal: 5
    },
    itemRating: {
        flexDirection: "row"
    },
    itemInfo: {
        flexDirection: "row",
        marginTop: 10,
        alignItems: "center",
        justifyContent: "space-between"
    },
    itemPriceWrapper: {
        width: "50%"
    },
    itemPriceTxt: {
        fontFamily: appConstant.baseFontFamily,
        fontSize: 16,
        color: appConstant.themePrimaryColor
    },
    itemPrice: {
        fontFamily: appConstant.productBoldFamily,
        fontSize: 16
    },
    itemAddCartWrapper: {
        flexDirection: "row",
        width: "50%",
        justifyContent: "space-evenly"
    },
    itemTitle: {
        fontFamily: appConstant.productBoldFamily,
        fontSize: 18,
        marginBottom: 5,
        marginTop: 5,
        color: appConstant.themeSecondaryColor
    },
    itemTags: {
        fontFamily: appConstant.baseFontFamily,
        fontSize: 12,
        color: appConstant.themeSecondaryColor
    },
    itemCount: {
        fontSize: 16,
        color: appConstant.themePrimaryColor
    },
    dateWrapper: {
        position: "absolute",
        top: -12,
        right: -5,
        backgroundColor: appConstant.themeSecondaryColor,
        padding: 5,
        paddingHorizontal: 10,
        borderRadius: 8
    },
    dateTxt: {
        fontFamily: appConstant.baseFontFamily,
        fontSize: 12,
        color: "#fff"
    }, noSeat: {
        backgroundColor: "#ff3535",
        marginTop: 10,
        borderRadius: 4,
        width: "100%"
    },
    noSeatTxt: {
        textAlign: "center",
        color: "#fff"
    }
});
