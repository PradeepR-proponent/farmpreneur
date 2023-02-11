import * as React from 'react';
import { SafeAreaView, View, StyleSheet, ScrollView, Image, Text } from "react-native";
import appConstant from "config/constants";
import { StatusBar } from "expo-status-bar";
import { useToast } from "react-native-toast-notifications";
import TextInput from "components/Text/TextInput";
import MButton from "components/Button/Button";
import Loader from "components/Loader";
import { fetchCourseById } from 'services/course';
import { getPayLink } from 'services/payment';
import { AntDesign } from "@expo/vector-icons";
import { translate, translateAPI } from '../../languageFeature'
import { useSelector } from 'react-redux';

export default function CourseConfirm(props) {

    const { appLanguage } = useSelector(state => state.auth)
    const [course, setCourse] = React.useState([]);
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [city, setCity] = React.useState("");
    const [address, setAddress] = React.useState("");
    const [payData, setPayData] = React.useState({});
    const toast = useToast();
    const { id, success } = props.route.params;
    const { navigation } = props;

    //fetch prodcuts
    const { isLoading: loading, error, data, isFetching, refetch } = fetchCourseById(id);
    if (error) toast.show(error.message, { type: "danger", duration: 10000 });

    //get pay link
    const paymentMutation = getPayLink();
    const { isLoading, isError, data: responseData, mutate: getLink } = paymentMutation;
    if (isError) toast.show(paymentMutation.error.message, { type: "danger", duration: 10000 });

    const enrollCourse = () => {
        if (name != "" && email != "" && phone != "" && city != "" && address != "") {
            getLink({
                "purpose": course?.title + "-" + course?.id + "-" + new Date().getTime(),
                "amount": course?.price,
                "buyer_name": name,
                "send_email": true,
                "email": email,
                "phone": phone,
                "city": city,
                "address": address,
                "course_id": id
            });
            setName(""); setEmail(""); setPhone(""); setCity(""); setAddress("");
        }
        else {
            toast.show("All fields are required.Please fill all the fields and try again.", { type: "danger", duration: 10000 });
        }

    }

    React.useEffect(() => {
        setCourse(data?.data[0]);
    }, [data]);

    React.useEffect(() => {
        setPayData(responseData?.data);
    }, [responseData]);

    React.useEffect(() => {
        if (payData?.longurl)
            props.navigation.navigate('Training', { screen: 'TrainingPayment', params: { uri: payData?.longurl } });
    }, [payData]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
            <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
                <View style={styles.cardCourse}>
                    <Image style={styles.cardCourseImg} source={{ uri: course?.course_image_url }} />
                    <View style={styles.cardCourseInfo}>
                        <Text style={styles.cardCourseTitle} numberOfLines={1}>{translateAPI(appLanguage, course?.title, course?.title_hi)}</Text>
                        <Text style={styles.cardCoursePrice}>₹ {course?.price}</Text>
                        <View style={styles.cardCoursePill}>
                            <AntDesign name="clockcircleo" size={12} color={"#fff"} />
                            <Text style={styles.cardCoursePillTxt}>{course?.duration}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.card}>
                    <TextInput
                        label={translate(appLanguage, "Name *")}
                        style={styles.cardInput}
                        value={name}
                        onChangeText={(t) => setName(t)} />
                    <TextInput
                        label={translate(appLanguage, "Email *")}
                        style={styles.cardInput}
                        textContentType="emailAddress"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={(t) => setEmail(t)}
                    />
                    <TextInput
                        label={translate(appLanguage, "Phone *")}
                        style={styles.cardInput}
                        textContentType="telephoneNumber"
                        value={phone}
                        onChangeText={(t) => setPhone(t)}
                    />
                    <TextInput
                        label={`${translate(appLanguage, "City")} *`}
                        style={styles.cardInput}
                        value={city}
                        onChangeText={(t) => setCity(t)} />

                    <TextInput
                        label={`${translate(appLanguage, "Address")} *`}
                        style={[styles.cardInput, styles.cardTextarea]}
                        multiline={true}
                        numberOfLines={3}
                        value={address}
                        onChangeText={(t) => setAddress(t)}
                    />
                    <MButton title={translate(appLanguage, "PAY NOW")} mode="contained" onPress={enrollCourse} />
                </View>
            </ScrollView>
            {(isLoading || loading) && (<Loader visible={true} />)}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    main: {
        flex: 1,
    },
    mainContent: {
        flexGrow: 1,
        // justifyContent: "center",
        alignItems: "center",
    },
    card: {
        marginTop: -40,
        padding: 40,
        paddingTop: 20,
        width: "90%",
        borderRadius: 10,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,

        elevation: 7,
    },
    cardInput: {
        backgroundColor: "#fff",
        marginVertical: 5,
        paddingHorizontal: -1,
    },
    cardCourse: {
        paddingVertical: 40,
        paddingHorizontal: 20,
        paddingBottom: 80,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "#fff"
    },
    cardCourseImg: {
        width: "30%",
        height: 80,
        borderRadius: 10,
        resizeMode: "cover",
    },
    cardCourseInfo: {
        width: "70%",
        paddingHorizontal: 20
    },
    cardCourseTitle: {
        fontSize: 18,
        fontFamily: appConstant.baseFontFamily,
        color: appConstant.themeSecondaryColor,

    },
    cardCoursePrice: {
        fontSize: 18,
        fontFamily: appConstant.baseFontFamily,
        color: appConstant.themeSecondaryColor,
        fontWeight: "700"
    },
    cardCoursePill: {
        width: "55%",
        marginTop: 5,
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 5,
        paddingLeft: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        flexDirection: "row",
        backgroundColor: appConstant.themeSecondaryColor,
    },
    cardCoursePillTxt: {
        marginLeft: 10,
        color: "#fff",
        fontWeight: "700",
        fontSize: 12
    }
});
