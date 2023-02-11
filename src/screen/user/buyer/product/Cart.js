import * as React from 'react';
import { FlatList, SafeAreaView, View, StyleSheet, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import appConstant from "config/constants";
import { StatusBar } from "expo-status-bar";
import { useSelector } from "react-redux";
import {
    total,
    items,
    INCREASE_QUANTITY,
    DECREASE_QUANTITY,
    DELETE_CART
} from "slice/cartSlice";
import { useDispatch } from "react-redux";
import { AntDesign } from "@expo/vector-icons";
import EmptyCart from 'assets/cart/empty_cart.png';
import { translate } from '../../../../languageFeature';

export default function Cart(props) {

    const { appLanguage } = useSelector(state => state.auth)
    const cartItems = useSelector(items);
    const cartTotal = useSelector(total);
    const dispatch = useDispatch();
    const totalAmount = () => {
        let total = 0;
        cartItems.map((ele) => {
            total += ele.quantity * ele.price;
        });
        return total;
    }

    const goToCheckout = () => {
        props.navigation.navigate('Checkout')
    }

    const goToHome = () => {
        props.navigation.navigate('BuyerDashboard');
    }

    const Item = ({ name, image, quantity, price, unit, decrease, increase, remove }) => {
        return (
            <View style={styles.itemWrapper}>
                <View style={styles.topWrapper}>
                    <View style={styles.itemImgWrapper}>
                        <Image source={{ uri: image }} style={styles.itemImg} />
                    </View>
                    <View style={styles.itemTitleWrapper}>
                        <View style={styles.itemDetails}>
                            <Text style={styles.itemTitle}>{name}</Text>
                            <Text style={styles.itemPriceTxt}>₹ <Text style={styles.itemPrice}>{price * quantity}</Text></Text>
                        </View>
                        <View style={styles.itemQuantity}>
                            <Text style={styles.itemTitle}>{quantity} {unit}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.bottomWrapper}>
                    <View style={styles.itemAddCartWrapper}>
                        <TouchableOpacity onPress={() => decrease()}>
                            <AntDesign name="minuscircleo" size={21} color={appConstant.themePrimaryColor} />
                        </TouchableOpacity>
                        <Text style={styles.itemCount}>{quantity}</Text>
                        <TouchableOpacity onPress={() => increase()}>
                            <AntDesign name="pluscircleo" size={21} color={appConstant.themePrimaryColor} />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => remove()}>
                        <AntDesign name="closecircleo" size={21} color={appConstant.themePrimaryColor} />
                    </TouchableOpacity>
                </View>
            </View >
        )
    }


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
            {/* <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}> */}
            <View style={styles.main}>
                <FlatList
                    keyExtractor={(item) => item.id}
                    data={cartItems}
                    renderItem={({ item, index }) => {
                        return (
                            <Item id={item?.id}
                                name={item?.name}
                                image={item?.image}
                                quantity={item?.quantity}
                                unit={item?.unit}
                                price={item?.price}
                                decrease={() => { dispatch(DECREASE_QUANTITY(index)) }}
                                increase={() => { dispatch(INCREASE_QUANTITY(index)) }}
                                remove={() => { dispatch(DELETE_CART(index)) }} />

                        );
                    }}
                />
                {cartItems.length != 0 && <View style={styles.cartFianlWrapper}>
                    <View style={styles.cartFinalItem}>
                        <Text style={styles.cartFinalTxt}>{translate(appLanguage, "Total Items")}</Text>
                        <Text style={styles.cartFinalVal}>{cartTotal}</Text>
                    </View>
                    <View style={styles.cartFinalItem}>
                        <Text style={styles.cartFinalTxt}>{translate(appLanguage, "Total Amount")}</Text>
                        <Text style={styles.cartFinalVal}>₹ {totalAmount()}</Text>
                    </View>
                    <View style={[styles.cartFinalItem, { borderBottomWidth: 0 }]}>
                        <TouchableOpacity style={[styles.addCartBtn, styles.goToCartBtn, styles.addCartBtnWide]} onPress={goToHome}>
                            <Text style={styles.addCartBtnTxt}>{translate(appLanguage, "Continue shopping")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.addCartBtn, styles.goToCartBtn]} onPress={goToCheckout}>
                            <Text style={styles.addCartBtnTxt}>{translate(appLanguage, "Checkout")}</Text>
                        </TouchableOpacity>

                    </View>
                </View>}
                {cartItems.length == 0 && (
                    <View style={styles.emptyCartWrapper}>
                        <Image source={EmptyCart} style={styles.emptyCartImg} />
                        <Text style={styles.emptyCartTxt} >{translate(appLanguage, "No items")}</Text>
                    </View>
                )}
            </View>
            {/* </ScrollView> */}
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
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
        padding: 10,
        elevation: 6,
        backgroundColor: "#ffffff",
        margin: 18,
        marginBottom: 10,
        borderRadius: 20
    },
    itemImgWrapper: {
        width: "25%",
    },
    itemImg: {
        width: "100%",
        height: 60,
        resizeMode: "contain"
    },
    itemTitleWrapper: {
        width: "75%"
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
        fontSize: 20,
        width: "30%",
        fontWeight: "700",
        color: appConstant.themePrimaryColor
    },
    itemPrice: {
        fontFamily: appConstant.productBoldFamily,
        fontSize: 20,
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
        width: "70%",
        fontFamily: appConstant.productBoldFamily,
        fontSize: 18,
        marginBottom: 7,
        color: appConstant.textSecondaryColor
    },
    itemCount: {
        fontSize: 18
    },
    emptyCartWrapper: {
        flexGrow: 1,
        alignItems: "center"
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
        width: "35%",
        height: 40,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        borderRadius: 20,
    },
    addCartBtnWide: {
        width: "55%",
        backgroundColor: appConstant.themePrimaryColor
    },
    addCartBtnTxt: {
        fontSize: 14,
        fontFamily: "Montserrat_700Bold",
        color: "#fff"
    },
    goToCartBtn: {
        backgroundColor: appConstant.themeSecondaryColor,
    },
    cartFianlWrapper: {
        shadowColor: "#6DBA48",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11,
        backgroundColor: "#fff",
        padding: 20
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
    }
});
