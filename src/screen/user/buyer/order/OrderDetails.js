import * as React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View, SectionList } from "react-native";
import appConstant from "config/constants";
import { StatusBar } from "expo-status-bar";
import Loader from "components/Loader";
import { useToast } from "react-native-toast-notifications";
import { fetchBuyerOrderById } from 'services/buyerOrder';
import moment from 'moment';
import EmptyCart from 'assets/cart/empty_cart.png';
import { capitalize } from "helper";
import { translate } from '../../../../languageFeature';
import { useSelector } from 'react-redux';

export default function OrderDetails(props) {

    const { appLanguage } = useSelector(state => state.auth)
    const toast = useToast();
    const { id } = props.route.params;
    const [order, setOrder] = React.useState({});
    const [orderItems, setOrderItems] = React.useState([]);
    //fetch prodcuts
    const { isLoading, error, data, isFetching, refetch } = fetchBuyerOrderById(id);
    if (error) toast.show(error.message, { type: "danger", duration: 10000 });

    React.useEffect(() => {
        if (data) {
            console.log(data);
            setOrder(data?.data[0]);
            setOrderItems(data?.data[0]?.buyer_order_item);
        }
    }, [data]);

    const formatDate = (date) => {
        let newDate = new Date(date);
        return moment(newDate).format('DD MMMM YYYY');
    }

    const Item = ({ image, name, quantity, price, unit }) => {
        return (
            <View style={styles.itemWrapper}>
                {/* <View style={styles.itemTitleWrapper}>
                    <View style={styles.itemDetails}>
                        <Text style={styles.itemTitle}>{name}</Text>
                        <Text style={styles.itemPriceTxt}>₹ <Text style={styles.itemPrice}>{price * quantity}</Text></Text>
                    </View>
                    <View style={styles.itemQuantity}>
                        <Text style={styles.itemTitle}>{quantity} {unit}</Text>
                    </View>
                </View> */}
                <View style={styles.topWrapper}>
                    <View style={styles.itemImgWrapper}>
                        <Image source={{ uri: image }} style={styles.itemImg} />
                    </View>
                    <View style={styles.itemTitleWrapper}>
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemTitle} numberOfLines={2}  >{name}</Text>
                            <Text style={styles.itemPriceTxt}>₹ <Text style={styles.itemPrice}>{price * quantity}</Text></Text>
                        </View>
                        <View style={styles.itemQuantity}>
                            <Text style={styles.itemTitle}>{quantity} {unit}</Text>
                        </View>
                    </View>
                </View>
            </View >
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
            <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
                {orderItems?.length !== 0 && (<>
                    <View style={styles.cartItemsList}>
                        <SectionList
                            sections={[
                                { title: translate(appLanguage, 'Order Items'), data: orderItems },
                            ]}
                            renderItem={({ item }) => {
                                return (<Item
                                    name={item?.product?.name}
                                    quantity={item?.quantity}
                                    unit={item?.unit}
                                    price={item?.price}
                                    image={item?.product?.default_image?.image_url}
                                />
                                )
                            }}
                            renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
                            keyExtractor={(item, index) => index}
                        />
                    </View>
                    <View style={styles.cartFinalWrapper}>
                        <View style={styles.cartFinalItem}>
                            <Text style={styles.cartFinalTxt}>{translate(appLanguage, "Total Items")}</Text>
                            <Text style={styles.cartFinalVal}>{order?.total_items}</Text>
                        </View>
                        <View style={styles.cartFinalItem}>
                            <Text style={styles.cartFinalTxt}>{translate(appLanguage, "Total Amount")}</Text>
                            <Text style={styles.cartFinalVal}>₹ {order?.total_price}</Text>
                        </View>
                        <View style={styles.cartFinalItem}>
                            <Text style={styles.cartFinalTxt}>{translate(appLanguage, "Order ID")}</Text>
                            <Text style={styles.cartFinalVal}>#{order?.order_id}</Text>
                        </View>
                        <View style={styles.cartFinalItem}>
                            <Text style={styles.cartFinalTxt}>{translate(appLanguage, "Order Date")}</Text>
                            <Text style={styles.cartFinalVal}>{formatDate(order?.created_at)}</Text>
                        </View>
                        <View style={styles.cartFinalItem}>
                            <Text style={styles.cartFinalTxt}>{translate(appLanguage, "Status")}</Text>
                            <Text style={styles.cartFinalVal}>{capitalize(order?.status)}</Text>
                        </View>
                        <View style={[styles.cartFinalItem, styles.noBorderBottom]}>
                            <Text style={styles.cartFinalTxt}>{translate(appLanguage, "Payment Status")}</Text>
                            <Text style={styles.cartFinalVal}>{capitalize(order?.payment_status)}</Text>
                        </View>
                    </View>
                </>)}
                {orderItems?.length == 0 && (
                    <View style={styles.emptyCartWrapper}>
                        <Image source={EmptyCart} style={styles.emptyCartImg} />
                        <Text style={styles.emptyCartTxt} >Unable to load order details.Please try later</Text>
                    </View>
                )}

            </ScrollView>
            {(isLoading || isFetching) && (<Loader visible={true} />)}
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
        flexGrow: 1
    },
    topWrapper: {
        flex: 1,
        flexDirection: "row"
    },
    itemWrapper: {
        backgroundColor: "#ffffff",
        marginHorizontal: 20,
        marginBottom: 10,
        borderRadius: 20
    },

    itemTitleWrapper: {
        width: "75%",
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2"
    },
    itemImgWrapper: {
        width: "25%",
    },
    itemImg: {
        width: "100%",
        height: 60,
        resizeMode: "cover",
        borderRadius: 8,
        shadowColor: "#6DBA48",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11
    },
    itemDetails: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10
    },
    itemQuantity: {
        paddingHorizontal: 10
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
        width: "30%"
    },
    itemPriceTxt: {
        fontFamily: appConstant.baseFontFamily,
        fontSize: 16,
        fontWeight: "700",
        color: appConstant.themePrimaryColor
    },
    itemPrice: {
        fontFamily: appConstant.productBoldFamily,
        fontSize: 16,
        fontWeight: "700",
        color: appConstant.themePrimaryColor
    },
    bottomWrapper: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        paddingBottom: 5,
        marginTop: 10,
        borderTopColor: appConstant.themePrimaryLightColor,
        borderTopWidth: 0.2
    },
    itemAddCartWrapper: {
        flexDirection: "row",
        width: "30%",
        justifyContent: "space-between",
        alignItems: "center"
    },
    itemTitle: {
        width: 155,
        fontFamily: appConstant.productBoldFamily,
        fontSize: 16,
        marginBottom: 7,
        color: appConstant.textSecondaryColor
    },
    itemCount: {
        fontSize: 16
    },
    emptyCartWrapper: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    emptyCartImg: {
        height: 170,
        resizeMode: "cover"
    },
    emptyCartTxt: {
        fontSize: 16,
        color: appConstant.themeSecondaryColor
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
        width: "55%",
        height: 40,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        borderRadius: 20,
    },
    addCartBtnTxt: {
        fontSize: 14,
        fontFamily: "Montserrat_700Bold",
        color: "#fff"
    },
    goToCartBtn: {
        backgroundColor: appConstant.themeSecondaryColor,
    },
    cartFinalWrapper: {
        padding: 20,
        width: "100%"
    },
    cartFinalItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        borderColor: "#f2f2f2",
        borderBottomWidth: 1
    },
    cartFinalTxt: {
        fontSize: 16,
        fontWeight: "700"
    },
    cartFinalVal: {
        fontSize: 16,
        color: appConstant.themePrimaryColor,
    },
    sectionHeader: {
        padding: 10,
        paddingHorizontal: 20,
        margin: 20,
        color: "#000",
        borderRadius: 8,
        backgroundColor: "#f2f2f2"
    },
    noBorderBottom: {
        borderBottomWidth: 0
    }
});
