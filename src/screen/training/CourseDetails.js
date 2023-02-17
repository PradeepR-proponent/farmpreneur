import * as React from 'react';
import { SafeAreaView, View, StyleSheet, Image, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import appConstant from "config/constants";
import { StatusBar } from "expo-status-bar";
import { fetchCourseById } from 'services/course';
import { getPayLink } from 'services/payment';
import Loader from "components/Loader";
import { useToast } from "react-native-toast-notifications";
import { AntDesign } from "@expo/vector-icons";
import { formatDate } from "helper";
import { userData } from 'slice/userSlice';
import { useSelector } from "react-redux";
import ModalMessage from "components/Modal/ModalMessage";
import HTMLText from 'components/Text/HTMLText';
import { translateAPI, translate } from '../../languageFeature'

export default function CourseList(props) {

    const { appLanguage } = useSelector(state => state.auth)
    const [course, setCourse] = React.useState([]);
    const [paysuccess, setSuccess] = React.useState(false);
    const [payerror, setError] = React.useState(false);
    // const [payData, setPayData] = React.useState({});
    const toast = useToast();
    // const user = useSelector(userData);
    const { id, success, error: error_status } = props.route.params;
    // const { navigation } = props;

    //fetch prodcuts
    const { isLoading: loading, error, data, isFetching, refetch } = fetchCourseById(id);
    if (error) toast.show(error.message, { type: "danger", duration: 10000 });

    //get pay link
    // const paymentMutation = getPayLink();
    // const { isLoading, isError, data: responseData, mutate: getLink } = paymentMutation;
    // if (isError) toast.show(paymentMutation.error.message, { type: "danger", duration: 10000 });

    const enrollCourse = () => {
        props.navigation.navigate('Training', { screen: 'TrainingConfirm', params: { id } });
        // getLink({
        //     "purpose": course?.title + "-" + course?.id + "-" + new Date().getTime(),
        //     "amount": course?.price,
        //     "buyer_name": user?.name,
        //     "send_email": true,
        //     "email": user?.email,
        //     "phone": user?.primary_phone,
        //     "course_id": id
        // });
    }

    React.useEffect(() => {
        setCourse(data?.data[0]);
    }, [data]);

    React.useEffect(() => {
        if (success != undefined) {
            setTimeout(() => {
                setSuccess(success);
                refetch();
            }, 2000);
        }
    }, [success]);
    React.useEffect(() => {
        if (error_status != undefined) {
            setTimeout(() => {
                setError(error_status);
                refetch();
            }, 2000);
        }
    }, [error_status]);

    // React.useEffect(() => {
    //     setPayData(responseData?.data);
    // }, [responseData]);

    // React.useEffect(() => {
    //     const unsubscribe = navigation.addListener('focus', () => {
    //         refetch()
    //     });
    //     return unsubscribe;
    // }, [navigation]);

    // React.useEffect(() => {
    //     if (payData?.longurl)
    //         props.navigation.navigate('Training', { screen: 'TrainingPayment', params: { uri: payData?.longurl } });
    // }, [payData]);


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
                    <Image style={styles.cardImg} source={{ uri: course?.course_image_url }} />
                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{translateAPI(appLanguage, course?.title, course?.title_hi)}</Text>
                        <Text style={styles.bracket}>( {translateAPI(appLanguage, course?.excerpt, course?.excerpt_hi)} )</Text>
                        <Text style={styles.cardPriceBtn}>₹ {course?.price}</Text>
                        <HTMLText style={styles.cardDesc} description={translateAPI(appLanguage, course?.description, course?.description_hi)} />
                        <View style={styles.cardExtra}>
                            <View style={styles.cardExtraItem}>
                                <AntDesign name="calendar" size={30} color={appConstant.themeSecondaryColor} />
                                <Text style={styles.cardExtraItemTxt}>{formatDate(course?.start_date)}</Text>
                            </View>
                            <View style={styles.cardExtraItem}>
                                <AntDesign name="clockcircleo" size={30} color={appConstant.themeSecondaryColor} />
                                <Text style={styles.cardExtraItemTxt}>{course?.duration}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.cardBtnWrapper}>
                        {course?.seat_left > 0 && (<TouchableOpacity style={[styles.addCartBtn, styles.goToCartBtn]} onPress={enrollCourse}>
                            <Text style={styles.addCartBtnTxt}>{translate(appLanguage, "Enroll Now")}</Text>
                        </TouchableOpacity>)
                        }

                    </View>
                    {course?.purchased && (<View style={styles.topDate}>
                        <Text style={styles.topDateTxt}>Enrolled on: {formatDate(course?.course_order?.created_at)}</Text>
                    </View>)}
                </View>
            </ScrollView>
            {(loading || isFetching) && (<Loader visible={true} />)}
            {paysuccess && (<ModalMessage visible={true} handleClick={() => { setSuccess(false) }} error={false} errorMsg={"Payment success ! Thankyou for enrolling in our course."} />)}
            {payerror && (<ModalMessage visible={true} handleClick={() => { setError(false) }} error={true} errorMsg={"Payment failed ! Unable to complete payment. Please try later."} />)}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    bracket: {
        color: "#333"
    },
    main: {
        flex: 1,
        // backgroundColor: "#f2f2f2",
        backgroundColor: "#fff",

    },
    mainContent: {
        flexGrow: 1,
        alignItems: "center"
    },
    card: {
        backgroundColor: "#fff",
        width: "100%",
        // marginVertical: 20,
        marginBottom: 80,
        paddingBottom: 20,
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 3,
        // },
        // shadowOpacity: 0.27,
        // shadowRadius: 4.65,
        // elevation: 6,
        // borderRadius: 8
    },
    cardImg: {
        width: "100%",
        height: 190,
        resizeMode: "cover",
        // borderTopLeftRadius: 8,
        // borderTopRightRadius: 8
    },
    cardContent: {
        padding: 20,
        alignItems: "flex-start"
    },
    cardTitle: {
        fontSize: 20,
        color: "#000",
        textAlign: "left"
    },
    cardPriceBtn: {
        backgroundColor: appConstant.themeSecondaryColor,
        color: "#fff",
        padding: 8,
        paddingHorizontal: 15,
        marginVertical: 10,
        borderRadius: 20,
        fontSize: 14,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        elevation: 6,
    },
    cardDesc: {
        fontSize: 13,
        color: "#000",
        textAlign: "center",
        marginVertical: 10,
        lineHeight: 20,
    },
    cardExtra: {
        // marginTop: 20,
        flexDirection: "row",
    },
    cardExtraItem: {
        width: "50%",
        alignItems: "center"
    },
    cardExtraItemImg: {
        width: 35,
        height: 35,
        resizeMode: "contain"
    },
    cardExtraItemTxt: {
        marginVertical: 5,
        fontSize: 12,
        fontWeight: "700",
        color: appConstant.themeSecondaryColor
    },
    cardBtnWrapper: {
        position: "absolute",
        bottom: -12,
        width: "100%",
        alignItems: "center",
    },
    addCartBtn: {
        shadowColor: "#6DBA48",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11,
        backgroundColor: appConstant.themePrimaryColor,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        width: "40%",
        height: 40,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        borderRadius: 20
    },
    addCartBtnTxt: {
        fontSize: 14,
        fontFamily: "Montserrat_700Bold",
        color: "#fff"
    },
    goToCartBtn: {
        backgroundColor: appConstant.themeSecondaryColor,
    },
    enrolled: {
        backgroundColor: appConstant.themeSecondaryColor,
        width: "60%",
    },
    topDate: {
        position: "absolute",
        top: 0,
        backgroundColor: appConstant.themeSecondaryColor,
        padding: 8,
        left: 0,
        borderTopLeftRadius: 8,
        borderBottomRightRadius: 8
    },
    topDateTxt: {
        fontSize: 12,
        fontFamily: "Montserrat_700Bold",
        color: "#fff"
    },
});
