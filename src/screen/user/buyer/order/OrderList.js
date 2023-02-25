import * as React from 'react';
import { FlatList, SafeAreaView, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import appConstant from "config/constants";
import { StatusBar } from "expo-status-bar";
import Loader from "components/Loader";
import { useToast } from "react-native-toast-notifications";
import { fetchAllBuyerOrders } from 'services/buyerOrder';
import InfoCard from "components/Card/InfoCard";
import { translate } from '../../../../languageFeature'
import { useSelector } from 'react-redux';
import moment from 'moment';

export default function OrderList({ navigation }) {

    const { appLanguage } = useSelector(state => state.auth)
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"];
    const toast = useToast();

    //fetch prodcuts
    const { isLoading: loading, error, data, isFetching, refetch } = fetchAllBuyerOrders();
    if (error) toast.show(error.message, { type: "danger", duration: 10000 });

    const handleOrderClick = (id) => {
        if (id)
            navigation.navigate("OrderDetails", { id });
    }

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            refetch()
        });
        return unsubscribe;
    }, [navigation]);


    const Item = ({ date, orderId, items, userEmail, total, status, handleClick }) => {

        return (
            <TouchableOpacity  onPress={handleClick}>
                <View style={styles.itemWrapper} >
                <View style={styles.dateWrapper}>
                    <Text style={styles.dateYear}> {moment(date).format('YYYY')} </Text>
                    <Text style={styles.dateNum}> {moment(date).format('DD')} </Text>
                    <Text style={styles.dateMonth}> {moment(date).format('MMM')}</Text>
                </View>
                <View style={styles.orderDetailsWrapper}>
                    <Text style={styles.orderTxt}>{translate(appLanguage, "Order")}:<Text style={styles.orderNum}> #{orderId}</Text></Text>
                    <Text style={styles.orderUser} numberOfLines={2} >
                        {items} {translate(appLanguage, `Items`)}
                    </Text>
                    <Text style={styles.orderEmail}>{userEmail}</Text>
                </View>
                <View style={styles.orderPriceWrapper}>
                    <Text style={styles.orderPriceTxt}>{translate(appLanguage, "Total")}</Text>
                    <Text style={styles.orderPrice}>₹ {total}</Text>
                </View>
                <Text style={[styles.status, { color: status == "PROCESSING" || status == "DELIVERED" ||status == "COMPLETED"  ? "green" : "red", }]}>{status}</Text>
                </View>
            </TouchableOpacity>
        )
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
            <View style={styles.main}>
                {data?.data?.length > 0 && <FlatList keyExtractor={(item) => item?.id} data={data?.data} renderItem={({ item }) => {
                    return (
                        <Item date={item?.created_at} orderId={item?.order_id} items={item?.total_items} userEmail={item?.user?.email}
                            total={item?.total_price} status={item?.status?.toUpperCase()} handleClick={() => handleOrderClick(item?.id)} />
                    );
                }} />}
                {data?.data?.length == 0 && <InfoCard type={"notFound"} message={"No order found. Please check later"} />}
            </View>

            {(loading || isFetching) && (<Loader visible={true} />)}
        </SafeAreaView>
    );
}
const itemBaseFontSize = 11;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    main: {
        flex: 1,
        backgroundColor: "#fff",
    },
    itemWrapper: {
        position:"relative",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent:"flex-start",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        backgroundColor: "#ffffff",
        margin: 15,
        marginVertical: 20,
        padding: 10
    },
    dateWrapper: {
        width: 40,
    },
    dateYear: {
        fontSize: itemBaseFontSize,
        fontFamily: appConstant.baseFontFamily
    },
    dateNum: {
        fontSize: itemBaseFontSize + 9,
        fontFamily: "Montserrat_800ExtraBold_Italic",
        color: appConstant.themePrimaryColor
    },
    dateMonth: {
        fontSize: itemBaseFontSize,
        fontFamily: appConstant.baseFontFamily
    },
    orderTxt: {
        fontSize: itemBaseFontSize,
        fontFamily: appConstant.baseFontFamily
    },
    orderNum: {
        fontSize: itemBaseFontSize,
        fontFamily: appConstant.baseFontFamily,
        color: appConstant.themePrimaryColor
    },
    orderUser: {
        fontSize: itemBaseFontSize + 5,
        width: 175,
        fontFamily: "Montserrat_600SemiBold",
    },
    orderEmail: {
        fontSize: itemBaseFontSize,
        width: 175,
        fontFamily: appConstant.baseFontFamily
    },
    orderPriceTxt: {
        fontSize: itemBaseFontSize + 5,
        fontFamily: appConstant.baseFontFamily
    },
    orderPrice: {
        fontFamily: "Montserrat_500Medium",
        width: 55,
    },
    status: {
        backgroundColor:"#ffffff",
        position:"absolute",
        right:0,
        bottom:1,
        right:1,
        padding:5,
        flexGrow: 0,
        fontWeight:"bold",
        fontSize: 11,
        fontFamily: appConstant.baseFontFamily
    },
});
