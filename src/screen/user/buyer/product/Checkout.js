import * as React from 'react';
import { SectionList, SafeAreaView, View, StyleSheet, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import appConstant from "config/constants";
import { StatusBar } from "expo-status-bar";
import {
    total,
    items,
    CLEAR_CART
} from "slice/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import EmptyCart from 'assets/cart/empty_cart.png';
import { createOrder } from 'services/buyerOrder';
import { useToast } from "react-native-toast-notifications";
import Loader from "components/Loader";
import { Fontisto } from "@expo/vector-icons";
import { translate } from '../../../../languageFeature';

export default function Checkout(props) {

    const { appLanguage } = useSelector(state => state.auth)
    const cartItems = useSelector(items);
    const cartTotal = useSelector(total);
    const dispatch = useDispatch();
    const toast = useToast();
    const totalAmount = () => {
        let total = 0;
        cartItems.map((ele) => {
            total += ele.quantity * ele.price;
        });
        return total;
    }


    //add order
    const orderMutation = createOrder();
    const { isLoading, isError, mutate: addOrder } = orderMutation;
    if (isError) toast.show(orderMutation.error.message, { type: "danger", duration: 10000 });

    const enquireNow = () => {
        addOrder({
            "products": cartItems,
            "total_price": totalAmount(),
            "total_items": cartTotal
        });
    }

    const Item = ({ name, quantity, price, unit }) => {
        return (
            <View style={styles.itemWrapper}>
                <View style={styles.itemTitleWrapper}>
                    <View style={styles.itemDetails}>
                        <Text style={[styles.itemTitle, { width: 250 }]} numberOfLines={2} >{name}</Text>
                        <Text style={styles.itemPriceTxt}>₹ <Text style={styles.itemPrice}>{price * quantity}</Text></Text>
                    </View>
                    <View style={styles.itemQuantity}>
                        <Text style={styles.itemTitle}>{quantity} {unit}</Text>
                    </View>
                </View>
            </View >
        )
    }




    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
            <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>

                {cartItems.length !== 0 && (<>
                    <View style={styles.cartItemsList}>
                        <SectionList
                            sections={[
                                { title: 'Cart Items', data: cartItems },
                            ]}
                            renderItem={({ item }) => {
                                return (<Item
                                    name={item?.name}
                                    quantity={item?.quantity}
                                    unit={item?.unit}
                                    price={item?.price}
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
                            <Text style={styles.cartFinalVal}>{cartTotal}</Text>
                        </View>
                        <View style={styles.cartFinalItem}>
                            <Text style={styles.cartFinalTxt}>{translate(appLanguage, "Total Amount")}</Text>
                            <Text style={styles.cartFinalVal}>₹ {totalAmount()}</Text>
                        </View>
                        <View style={[styles.cartFinalItem, { alignItems: "flex-start" }]}>
                            <Text style={styles.cartFinalTxt}>
                                {translate(appLanguage, "Note")} :
                            </Text>
                            <Text style={[styles.cartFinalVal, { marginLeft: 10, marginRight: 30, color: appConstant.themeSecondaryColor }]}>{translate(appLanguage, "checkoutNote")}</Text>
                        </View>
                        <View style={[styles.cartFinalItem, { borderBottomWidth: 0, flex: 1, flexDirection: "column", marginTop: 10 }]}>
                            <TouchableOpacity style={[styles.addCartBtn, styles.goToCartBtn]} onPress={enquireNow}>
                                <Text style={styles.addCartBtnTxt}>{translate(appLanguage, "Submit Enquiry")}</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </>)}
                {cartItems.length == 0 && (
                    <View style={styles.emptyCartWrapper}>
                        <Image source={EmptyCart} style={styles.emptyCartImg} />
                        <Text style={styles.emptyCartTxt} >No items</Text>
                    </View>
                )}

            </ScrollView>
            {(isLoading) && (<Loader visible={true} />)}
            {/* {isError !== "" && (<ModalMessage visible={true} handleClick={handleError} error={true} errorMsg={isError} />)} */}
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
        width: "100%",
        borderBottomWidth: 1,
        borderBottomColor: "#f2f2f2"
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
        position: "absolute",
        bottom: 0,
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
        color: "#fff",
        borderRadius: 8,
        backgroundColor: appConstant.themeSecondaryColor
    }
});
