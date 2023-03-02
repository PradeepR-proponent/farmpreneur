import * as React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import appConstant from "config/constants";
import { StatusBar } from "expo-status-bar";
import Loader from "components/Loader";
import { useToast } from "react-native-toast-notifications";
import { fetchSupplierOrderById } from 'services/supplierOrder';
import moment from 'moment';
import { translate } from '../../../../languageFeature';
import { useSelector } from 'react-redux';


export default function OrderDetails(props) {

    const { appLanguage } = useSelector(state => state.auth)
    const toast = useToast();
    const { id } = props.route.params;
    const [order, setOrder] = React.useState({});
    //fetch prodcuts
    const { isLoading: loading, error, data, isFetching, refetch } = fetchSupplierOrderById(id);
    if (error) toast.show(error.message, { type: "danger", duration: 2000 });

    React.useEffect(() => {
        if (data)
            setOrder(data?.data[0]);
    }, [data]);

    const formatDate = (date) => {
        let newDate = new Date(date);
        return moment(newDate).format('DD MMMM YYYY');
    }
    console.log(order?.product?.default_image?.image_url)

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
            <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
                <View style={styles.proDetailsWrapper}>
                    <View style={styles.imageWrapper}>{console.log(order?.product?.default_image?.image_url)}
                        <Image source={{ uri: order?.product?.default_image?.image_url }} style={styles.productImg} />
                    </View>
                    <View style={styles.detailsWrapper}>
                        <Text style={styles.productTitle}>{order?.product?.name}</Text>
                        <View style={styles.extraDetailsWrapper}>
                            <View style={styles.priceWrapper}>
                                <Text style={styles.priceTxt}>{order?.quantity} {data?.data[0]?.unit}</Text>
                                <Text style={styles.priceTxt}>₹ {order?.price}</Text>
                            </View>

                            <View style={styles.dateWrapper}>
                                <Text style={styles.dateTitle}>{translate(appLanguage, "Order Date")}</Text>
                                <Text style={styles.dateTxt}>{formatDate(order?.created_at)}</Text>
                            </View>

                            <View style={styles.dateWrapper}>
                                <Text style={styles.dateTitle}>{translate(appLanguage, "Status")}</Text>
                                <Text style={styles.boldTxt}>{order?.status?.toUpperCase()}</Text>
                            </View>

                            <View style={styles.dateWrapper}>
                                <Text style={styles.dateTitle}>{translate(appLanguage, "Payment Status")}</Text>
                                <Text style={styles.boldTxt}>{order?.payment_status?.toUpperCase()}</Text>
                            </View>

                            <View style={styles.dateWrapper}>
                                <Text style={styles.dateTitle}>{translate(appLanguage, "Order ID")}</Text>
                                <Text style={[styles.dateTxt, styles.orderId]}># {order?.order_id}</Text>
                            </View>

                        </View>




                    </View>
                    <View style={styles.ovalShape}>
                        <Text>{""}</Text>
                    </View>
                    <View style={[styles.ovalShape, styles.ovalShape2]}>
                        <Text>{""}</Text>
                    </View>
                    <View style={[styles.ovalShape, styles.ovalShape3]}>
                        <Text>{""}</Text>
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
        backgroundColor: "#fff",
    },
    mainContent: {
        flexGrow: 1,
    },
    imageWrapper: {
        alignItems: "center",
        // marginTop: 20
    },
    proDetailsWrapper: {
        flex: 1,
        backgroundColor: "#fff"
    },
    productImg: {
        width: "100%",
        height: 200,
        resizeMode: "cover"
    },
    detailsWrapper: {
        flexGrow: 1,
        padding: 30,
        paddingTop: 5
    },
    productTitle: {
        fontSize: 24,
        marginVertical: 10,
        fontFamily: appConstant.productBoldFamily,
    },
    extraDetailsWrapper: {
        marginVertical: 10,
        backgroundColor: "#fff",
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
    },
    priceWrapper: {
        marginVertical: 15,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    priceTxt: {
        fontSize: 18,
        fontFamily: appConstant.productBoldFamily,
    },
    dateWrapper: {
        marginVertical: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    dateTitle: {
        fontSize: 16,
        fontFamily: appConstant.productBoldFamily,
    },
    dateTxt: {
        fontSize: 14,
        fontFamily: appConstant.baseFontFamily,
    },
    orderId: {
        color: appConstant.themePrimaryColor
    },
    ovalShape: {
        backgroundColor: "#f2f2f2",
        position: "absolute",
        width: 300,
        height: 300,
        borderRadius: 300 / 2,
        top: -70,
        bottom: 0,
        right: -70,
        zIndex: -1
    },
    ovalShape2: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
        top: 10,
        left: 10,
    },
    ovalShape3: {
        width: 150,
        height: 150,
        borderRadius: 150 / 2,
        top: 70,
        left: -80,
    },
    boldTxt: {
        fontWeight: "700"
    }
});
