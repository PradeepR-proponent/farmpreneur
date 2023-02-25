import * as React from 'react';
import { FlatList, SafeAreaView, View, StyleSheet, Text, TouchableOpacity } from "react-native";
import appConstant from "config/constants";
import { StatusBar } from "expo-status-bar";
import Loader from "components/Loader";
import { useToast } from "react-native-toast-notifications";
import { fetchAllSupplierOrders } from 'services/supplierOrder';
import InfoCard from "components/Card/InfoCard";
import { useSelector } from 'react-redux';
import { translate } from '../../../../languageFeature'
import moment from 'moment';

export default function OrderList(props) {

    const { appLanguage } = useSelector(state => state.auth)
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"];
    const toast = useToast();
    const { navigation } = props;

    //fetch prodcuts
    const { isLoading: loading, error, data, isFetching, refetch } = fetchAllSupplierOrders();
    if (error) toast.show(error.message, { type: "danger", duration: 10000 });

    const handleOrderClick = (id) => {
        if (id)
            props.navigation.navigate("OrderDetails", { id });
    }

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            refetch()
        });
        return unsubscribe;
    }, [navigation]);


    const Item = ({ date, orderId, userName, userEmail, total, status, handleClick }) => {
        return (
            <TouchableOpacity style={styles.itemWrapper} onPress={handleClick}>
                <View style={styles.dateWrapper}>

                    <Text style={styles.dateYear}> {moment(date).format('YYYY')} </Text>
                    <Text style={styles.dateNum}> {moment(date).format('DD')} </Text>
                    <Text style={styles.dateMonth}> {moment(date).format('MMM')}</Text>
                </View>
                <View style={styles.orderDetailsWrapper}>
                    <Text style={styles.orderTxt}>{translate(appLanguage, "Order")}:<Text style={styles.orderNum}> #{orderId}</Text></Text>
                    <Text style={styles.orderUser} numberOfLines={2} >{translate(appLanguage, `${userName}`)}</Text>
                    <Text style={styles.orderEmail}>{userEmail}</Text>
                </View>
                <View style={styles.orderPriceWrapper}>
                    <Text style={styles.orderPriceTxt}>{translate(appLanguage, "Total")}</Text>
                    <Text style={styles.orderPrice}>₹ {total}</Text>
                </View>
                <Text style={[styles.status, { color: status == "PROCESSING" || status == "DELIVERED" ||status == "COMPLETED"  ? "green" : "red", }]}>{status}</Text>
            </TouchableOpacity>
        )
    };

    function handleProductClick() {
        props.navigation.navigate('OrderDetails');
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
            <View style={styles.main}>
                {data?.data?.length != 0 && <FlatList
                    onRefresh={refetch}
                    refreshing={loading}
                    keyExtractor={(item) => item?.id}
                    data={data?.data}
                    renderItem={({ item }) => {
                        return (
                            <Item date={item?.created_at} orderId={item?.order_id} userName={item?.product?.name} userEmail={item?.user?.email}
                                total={item?.price} status={item?.status?.toUpperCase()} handleClick={() => handleOrderClick(item?.id)} />
                        );
                    }} />}
                {data?.data?.length == 0 && <InfoCard type={"notFound"} message={"No orders found. Please check later"} />}
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
    orderDetailsWrapper: {
        flexGrow: 1
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
        width: 155,
        fontSize: itemBaseFontSize,
        fontFamily: "Montserrat_600SemiBold"
    },
    orderEmail: {
        fontSize: itemBaseFontSize,
        fontFamily: appConstant.baseFontFamily
    },
    orderPriceWrapper: {
        flexGrow: 1,
        alignSelf: "baseline"
    },
    orderPriceTxt: {
        fontSize: itemBaseFontSize + 5,
        fontFamily: appConstant.baseFontFamily
    },
    orderPrice: {
        fontFamily: "Montserrat_500Medium",
    },
    status: {
        backgroundColor:"#ffffff",
        position:"absolute",
        right:0,
        bottom:1,
        right:1,
        padding:5,
        borderRadius:5,
        borderWidth:1,
        borderColor:"lightgray",
        flexGrow: 0,
        fontWeight:"bold",
        fontSize: 11,
        fontFamily: appConstant.baseFontFamily
    },
});
