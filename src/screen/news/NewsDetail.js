import * as React from 'react';
import { SafeAreaView, View, StyleSheet, Image, Text, ScrollView, RefreshControl, useWindowDimensions } from "react-native";
import appConstant from "config/constants";
import { StatusBar } from "expo-status-bar";
import { fetchNewsById } from 'services/news';
import Loader from "components/Loader";
import { useToast } from "react-native-toast-notifications";
import { AntDesign } from "@expo/vector-icons";
import moment from 'moment';
import AdminIcon from 'assets/icon.png';
import HTMLText from 'components/Text/HTMLText';


export default function CourseList(props) {

    const [news, setNews] = React.useState([]);
    const toast = useToast();
    const { id } = props.route.params;
    const { navigation } = props;


    //fetch news
    const { isLoading: loading, error, data, isFetching, refetch } = fetchNewsById(id);
    if (error) toast.show(error.message, { type: "danger", duration: 10000 });

    React.useEffect(() => {
        setNews(data?.data[0]);
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



    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
            <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}
                refreshControl={
                    <RefreshControl
                        refreshing={isFetching}
                        onRefresh={refetch}
                    />
                }>
                <View style={styles.card}>
                    <Image style={styles.cardImg} source={{ uri: news?.featured_image_url }} />
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{news?.title}</Text>
                        <View style={styles.cardExtra}>
                            <View style={styles.cardExtraItem}>
                                <Image style={styles.cardExtraItemImg} source={AdminIcon} />
                                <Text style={styles.cardExtraItemTxt}>Farmpreneur</Text>
                            </View>
                            <View style={[styles.cardExtraItem, { justifyContent: "flex-end" }]}>
                                <AntDesign name="calendar" size={20} color={appConstant.themeSecondaryColor} />
                                <Text style={styles.cardExtraItemTxt}>{formatDate(news?.created_at)}</Text>
                            </View>
                        </View>
                        <HTMLText description={news?.description} />
                        {/* <Text style={styles.cardDesc}>{news?.description}</Text> */}
                    </View>
                </View>
            </ScrollView>
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
        backgroundColor: "#f2f2f2",
    },
    mainContent: {
        flexGrow: 1,
        alignItems: "center"
    },
    card: {
        backgroundColor: "#fff",
        paddingBottom: 20,
        borderRadius: 8,
    },
    cardImg: {
        height: 190,
        resizeMode: "cover",
    },
    cardContent: {
        flex: 1,
        padding: 20,
        paddingHorizontal: 40
    },
    cardTitle: {
        fontSize: 20,
        color: appConstant.themeSecondaryColor,
        marginBottom: 10,
        fontFamily: appConstant.baseFontFamily,
    },
    cardDesc: {
        fontSize: 14,
        color: appConstant.textSecondaryColor,
        fontFamily: appConstant.baseFontFamily,
        marginVertical: 10,
        lineHeight: 20,
    },
    cardExtra: {
        marginVertical: 10,
        flexDirection: "row",
        width: "100%",
    },
    cardExtraItem: {
        width: "50%",
        flexDirection: "row",
        alignItems: "center",
    },
    cardExtraItemImg: {
        width: 25,
        height: 25,
        borderRadius: 50,
        resizeMode: "cover"
    },
    cardExtraItemTxt: {
        marginHorizontal: 5,
        fontSize: 13,
        color: appConstant.themeSecondaryColor,
    }
});


