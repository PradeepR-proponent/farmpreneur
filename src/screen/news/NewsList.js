import * as React from 'react';
import { FlatList, SafeAreaView, View, StyleSheet, Pressable, Image, Text } from "react-native";
import appConstant from "config/constants";
import { StatusBar } from "expo-status-bar";
import { fetchAllNews } from 'services/news';
import Loader from "components/Loader";
import { useToast } from "react-native-toast-notifications";
import moment from 'moment';
import InfoCard from "components/Card/InfoCard";
import { AntDesign } from "@expo/vector-icons";

export default function CourseList(props) {

    const [news, setNews] = React.useState([]);
    const toast = useToast();
    const { navigation } = props;

    function handleProductClick(id) {
        if (id)
        props.navigation.navigate('NewsDetail', { id });
    }

    //fetch all news
    const { isLoading: loading, error, data, isFetching ,refetch} = fetchAllNews();
    if (error) toast.show(error.message, { type: "danger", duration: 2000 });

    React.useEffect(() => {
        setNews(data?.data);
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

    const Item = ({ title, description, image, readTime, date, handleClick }) => {
        return (
            <Pressable style={styles.itemWrapper} onPress={() => {
                handleClick();
            }}>
                <View style={styles.itemImgWrapper}>
                    <Image source={image} style={styles.itemImg} />
                </View>
                <View style={styles.itemDetails}>
                    <Text style={styles.itemTitle} numberOfLines={2}>{title}</Text>
                    <Text style={styles.itemDesc} numberOfLines={3} >{description}</Text>
                    
                    <View style={styles.itemInfo}>
                        <View style={styles.cardCoursePill}>
                            <AntDesign name="calendar" size={12} color={appConstant.themeSecondaryColor} />
                            <Text style={styles.cardCoursePillTxt}>{formatDate(date)}</Text>
                        </View>
                        <View style={[styles.cardCoursePill, { width: "35%" }]}>
                            <AntDesign name="clockcircleo" size={12} color={appConstant.themeSecondaryColor} />
                            <Text style={styles.cardCoursePillTxt}>{readTime} min read</Text>
                        </View>
                    </View>
                </View>

            </Pressable>
        );
    }


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
            <View style={styles.main}>
                {news?.length != 0 && <FlatList
                    keyExtractor={(item) => item.id}
                    data={news}
                    onRefresh={refetch}
                    refreshing={loading}
                    renderItem={({ item }) => {
                        return (
                            <Item title={item?.title} description={item?.excerpt} date={item?.created_at} readTime={item?.read_time}
                                image={{ uri: item?.featured_image_url }} handleClick={() => { handleProductClick(item?.id) }} />
                        );
                    }}
                />}
                {news?.length == 0 && <InfoCard type={"notFound"} message={"No news found. Please check later"} />}
            </View>
            {(loading || isFetching ) && (<Loader visible={true} />)}
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
    },
    itemWrapper: {
        flex: 1,
        flexDirection: "row",
        margin: 20,
        marginBottom: 10,
        borderRadius: 8
    },
    itemImgWrapper: {
        width: "40%",
    },
    itemImg: {
        width: 120,
        height: 100,
        resizeMode: "cover",
        borderRadius: 8
    },
    itemDetails: {
        width: "50%",
        flexGrow: 1
    },

    itemInfo: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },

    itemTitle: {
        fontFamily: appConstant.productBoldFamily,
        fontSize: 12,
        marginBottom: 5,
        color: appConstant.themeSecondaryColor
    },
    itemDesc: {
        fontFamily: appConstant.baseFontFamily,
        fontSize: 10,
        color: appConstant.textSecondaryColor
    },
    itemCount: {
        fontSize: 16,
        color: appConstant.themePrimaryColor
    },
    cardCoursePill: {
        width: "45%",
        marginTop: 5,
        alignItems: "center",
        // justifyContent: "space-between",
        paddingVertical: 5,
        borderRadius: 20,
        flexDirection: "row",
    },
    cardCoursePillTxt: {
        marginLeft:8,
        color: appConstant.themeSecondaryColor,
        fontWeight: "700",
        fontSize: 10
    }
});
