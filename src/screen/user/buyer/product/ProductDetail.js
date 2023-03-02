import * as React from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import appConstant from "config/constants";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { useState } from "react";
import { useToast } from "react-native-toast-notifications";
import { fetchProductById } from 'services/product';
import Loader from "components/Loader";
import { ADD_CART, items } from "slice/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { translate } from '../../../../languageFeature'

export default function ProductDetail(props) {

    const { appLanguage } = useSelector(state => state.auth)
    const [activeSlide, setActiveSlide] = useState(0);
    const windowWidth = useWindowDimensions().width;
    const [product, setProduct] = React.useState([]);
    const toast = useToast();
    const { id } = props.route.params;
    const { navigation } = props;
    const dispatch = useDispatch();
    const cartItems = useSelector(items);

    //fetch products
    const { isLoading: loading, error, data: productData, isFetching, refetch } = fetchProductById(id);
    if (error) toast.show(error.message, { type: "danger", duration: 2000 });

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            refetch()
        });
        return unsubscribe;
    }, [navigation]);

    React.useEffect(() => {
        setProduct(productData?.data[0]);
    }, [productData]);

    const addToCart = () => {
        dispatch(ADD_CART({ id: product?.id, name: product?.name, image: product?.default_image?.image_url, price: product?.price, unit: product?.unit }));
        toast.show('Item added to cart successfully', { type: "success", duration: 2000 });
    }

    const goToCart = () => {
        props.navigation.navigate('Cart');
    }

    function pagination() {
        return (
            <Pagination
                dotsLength={product?.images?.length}
                activeDotIndex={activeSlide}
                containerStyle={{ backgroundColor: 'transparent', paddingVertical: 20, }}
                dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 8,
                    backgroundColor: appConstant.themePrimaryColor
                }}
                inactiveDotStyle={{
                    // Define styles for inactive dots here
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.6}
            />
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
            <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
                <View style={styles.proDetailsWrapper}>
                    <View style={styles.imageWrapper}>
                        <Carousel
                            data={product?.images}
                            renderItem={({ item, index }) => <Image source={{ uri: item?.image_url }} style={styles.productImg} />}
                            sliderWidth={windowWidth}
                            itemWidth={windowWidth}
                            onSnapToItem={(index) => setActiveSlide(index)}
                        />
                        {pagination()}
                    </View>
                    <View style={styles.detailsWrapper}>

                        <View style={styles.priceWrapper}>
                            <Text style={styles.productTitle}>{product?.name}</Text>
                            <Text style={styles.priceTxt}>₹{product?.price} /{product?.unit}</Text>
                        </View>

                        <Text style={styles.productDesc}>{product?.description}</Text>
                        <View style={styles.addCartWrapper}>

                            <TouchableOpacity style={styles.addCartBtn} onPress={addToCart}>
                                <Text style={styles.addCartBtnTxt}>{translate(appLanguage, "Add to Cart")}</Text>
                            </TouchableOpacity>
                            {cartItems.length > 0 && (
                                <TouchableOpacity style={[styles.addCartBtn, styles.goToCartBtn]} onPress={goToCart}>
                                    <Text style={styles.addCartBtnTxt}>{translate(appLanguage, "Go to Cart")}</Text>
                                </TouchableOpacity>
                            )}
                        </View>

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
        alignItems: "center"
    },
    proDetailsWrapper: {
        flex: 1,
        backgroundColor: "#f2f2f2"
    },
    productImg: {
        width: "100%",
        height: 225,
        resizeMode: "cover"
    },
    detailsWrapper: {
        flexGrow: 1,
        backgroundColor: "#fff",
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        padding: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.48,
        shadowRadius: 11.95,

        elevation: 18,
    },
    productTitle: {
        width: "70%",
        fontSize: 20,
        fontFamily: appConstant.productBoldFamily,
    },
    priceWrapper: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 10,
    },
    productCounter: {
        flexDirection: "row",
        backgroundColor: "#F6F4F5",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 15,
        padding: 10,
        paddingHorizontal: 15,
        width: "38%"
    },
    itemCount: {
        fontFamily: appConstant.productBoldFamily
    },
    priceTxt: {
        width: "30%",
        fontSize: 20,
        fontFamily: appConstant.productBoldFamily,
    },
    productDescHead: {
        fontSize: 20,
        marginVertical: 10,
        fontFamily: appConstant.productBoldFamily,
    },
    productDesc: {
        fontSize: 16,
        marginVertical: 10,
        fontFamily: appConstant.baseFontFamily,
    },
    addCartWrapper: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 15
    },
    favouriteWrapper: {
        borderWidth: 1,
        borderColor: appConstant.themePrimaryColor,
        padding: 15,
        borderRadius: 20,
        alignItems: "center",
        width: 65
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
        height: 60,
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
    }
});
