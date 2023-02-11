import React, { useState, useEffect } from 'react';
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import appConstant from "config/constants";
import TextInput from "components/Text/TextInput";
import MButton from "components/Button/Button";
import Loader from "components/Loader";
import ModalMessage from "components/Modal/ModalMessage";
import { ReactQueryDevtools } from "react-query/devtools";
import { useToast } from "react-native-toast-notifications";
import { fetchUserProduct, updateUserProduct } from 'services/userProduct';


export default function ProductAdd(props) {
    const [priceLow, setPriceLow] = React.useState("");
    const [priceHigh, setPriceHigh] = React.useState("");
    const [unit, setUnit] = React.useState("");
    const [stock, setStock] = React.useState("");
    const [isError, setIsError] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [isDisabled,setIsDisabled] = React.useState(true);
    const toast = useToast();
    /**
     * Handling error modal
     */
    const handleError = () => {
        setIsError("");
    }

    const { id } = props.route.params;
    //fetch prodcut
    const { isLoading: loading, error, data:product, isFetching } = fetchUserProduct(id);
    //add product mutation
    const productMutation = updateUserProduct(id);
    const { isLoading: postLoading, isError: postError, mutate: updateProduct } = productMutation;

    //show fetch and create status
    if (error) toast.show(error.message, { type: "danger", duration: 10000 });
    if (postError) toast.show(productMutation.error.message, { type: "danger", duration: 10000 });
    React.useEffect(() => {
        setPriceHigh(product?.data[0]?.high_price?.toString());
        setPriceLow(product?.data[0]?.low_price?.toString());
        setUnit(product?.data[0]?.unit);
        setStock(product?.data[0]?.quantity?.toString());
    }, [product]);


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
            <ImageBackground source={require('assets/images/profile_bg2.jpg')} style={styles.topProfileBg}
                imageStyle={styles.topProfileBgImg}>
            </ImageBackground>
            <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
                <View style={styles.formWrapper}>
                    <TextInput
                        label="Product"
                        value={product?.data[0]?.product?.name}
                        disabled={true}
                        onChangeText={(t) => console.log(t)}
                    />
                    <TextInput
                        label="Price (Lower Value)"
                        value={priceLow}
                        onChangeText={(t) => setPriceLow(t)}
                        disabled={isDisabled}
                    />
                    <TextInput
                        label="Price (Higher Value)"
                        value={priceHigh}
                        onChangeText={(t) => setPriceHigh(t)}
                        disabled={isDisabled}
                    />

                    <TextInput
                        label="Unit (KG,GM,Litre,etc)"
                        value={unit}
                        onChangeText={(t) => setUnit(t)}
                        disabled={isDisabled}
                    />
                    <TextInput
                        label="Stock"
                        value={stock}
                        onChangeText={(t) => setStock(t)}
                        disabled={isDisabled}
                    />
                    {isDisabled && (
                        <MButton title="Edit" mode="contained" onPress={() => {
                            setIsDisabled(false);
                        }} />
                    )}
                    
                    {!isDisabled && (
                        <View style={styles.cancelBtnWrap}>
                            <MButton title="Update" mode="contained" onPress={() => {
                                updateProduct({ quantity: parseInt(stock), unit, low_price: parseInt(priceLow), high_price: parseInt(priceHigh) });
                                setIsDisabled(true);
                            }} />
                            <MButton title="Cancel" style={styles.cancelBtn} mode="contained" onPress={() => {
                                setIsDisabled(true);
                            }} />
                        </View>
                    )}
                    
                </View>
            </ScrollView>
            {(isLoading || loading || isFetching || postLoading) && (<Loader visible={true} />)}
            {isError !== "" && (<ModalMessage visible={true} handleClick={handleError} error={true} errorMsg={isError} />)}
            <ReactQueryDevtools initialIsOpen />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    main: {
        flex: 1,
        backgroundColor: "transparent",
    },
    mainContent: {
        flexGrow: 1
    },
    topProfileBg: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1
    },
    topProfileBgImg: {
        resizeMode: "stretch",
        opacity: 1
    },
    txtBtn: {
        backgroundColor: "#fff"
    },
    txtBtnText: {
        color: appConstant.themePrimaryColor
    },
    formWrapper: {
        paddingHorizontal: 40,
        marginTop: 80
    },
    pickerWrapper: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0,
        shadowRadius: 0,

        elevation: 0,
        borderRadius: 0,
        borderBottomWidth: 1,
        borderColor: "#CECECE",
        backgroundColor: "transparent"
    },
    picker: { marginLeft: -17 },
    selectList: {
        flex: 1,
        position: "absolute",
        top: 65,
        left: 0,
        right: 0,
        zIndex: 1,
        borderWidth: 0
    },
    selectInput: {
        borderWidth: 0,
        position: "relative"
    },
    selectListItems: {
        borderWidth: 0,
        width: "100%",
        margin: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,

    },
    selectItemTxt: {
        padding: 10
    },
    cancelBtnWrap:{
        flex:1,
        flexDirection:"row"
    },
    cancelBtn:{
        backgroundColor:"tomato",
        marginLeft:10
    }
});
