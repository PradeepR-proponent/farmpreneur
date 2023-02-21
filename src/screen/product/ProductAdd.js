import React, { useState, useEffect } from 'react';
import { ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import appConstant from "config/constants";
import TextInput from "components/Text/TextInput";
import MButton from "components/Button/Button";
import InfoCard from "components/Card/InfoCard";
import Autocomplete from 'react-native-autocomplete-input';
import Loader from "components/Loader";
import ModalMessage from "components/Modal/ModalMessage";
import { ReactQueryDevtools } from "react-query/devtools";
import { useToast } from "react-native-toast-notifications";
import { fetchAllProducts } from 'services/product';
import { createUserProduct } from 'services/userProduct';
import { fetchUserById } from 'services/user';
import {
    userData
} from "slice/userSlice";
import { useSelector } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import Mpicker from 'components/Picker/Picker';
import { translate } from '../../languageFeature'

export default function ProductAdd(props) {

    const { appLanguage } = useSelector(state => state.auth)
    const [priceLow, setPriceLow] = React.useState("");
    const [priceHigh, setPriceHigh] = React.useState("");
    const [unit, setUnit] = React.useState("");
    const [stock, setStock] = React.useState("");
    const [categories, setCategories] = React.useState([]);
    const [selectedCategories, setselectedCategories] = React.useState("");
    const [productList, setProductList] = React.useState("");


    // const [hideResult, setHideResult] = React.useState(false);
    // const [products, setProducts] = React.useState([]);
    // const [query, setQuery] = React.useState(null);
    const [isError, setIsError] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const toast = useToast();
    const userdata = useSelector(userData);
    const { navigation } = props;
    const [product, setProduct] = useState();
    const [category, setCategory] = useState();

    /**
     * Handling error modal
     */
    const handleError = () => {
        setIsError("");
    }

    //fetch prodcuts
    const { isLoading: loading, error, data, isFetching, refetch: productRefetch } = fetchAllProducts();
    //fetch user
    const { isLoading: userLoading, error: userError, data: userProfileData, isFetching: userIsFetching, refetch } = fetchUserById(userdata?.id);
    //add product mutation
    const productMutation = createUserProduct();
    const { isLoading: postLoading, isError: postError, mutate: addProduct } = productMutation;

    //show fetch and create status
    if (error) toast.show(error.message, { type: "danger", duration: 10000 });
    if (userError) toast.show(userError.message, { type: "danger", duration: 10000 });
    if (postError) toast.show(productMutation.error.message, { type: "danger", duration: 10000 });

    const getItem = () => {
        let itemArr = [<Picker.Item label={translate(appLanguage, `Select`)} value={""} />];
        productList.forEach((ele) => {
            itemArr.push(<Picker.Item label={translate(appLanguage, `${ele?.name}`)} value={ele?.id} />)
        });
        return itemArr;
    }

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            productRefetch()
            refetch()
        });
        return unsubscribe;
    }, [navigation]);


    useEffect(() => {
        if (data?.data?.length) {
            setCategories([...new Set(data.data.map((c) => c.category_name))])
        }
    }, [data]);

    useEffect(() => {
        if (selectedCategories != "") {
            setProductList(data.data.filter((p) => p.category_name === selectedCategories))
        }
    }, [selectedCategories]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
            <ImageBackground source={require('assets/images/profile_bg2.jpg')} style={styles.topProfileBg}
                imageStyle={styles.topProfileBgImg}>
            </ImageBackground>
            <ScrollView style={styles.main} contentContainerStyle={styles.mainContent}>
                {userProfileData?.data?.is_approved == 1 && (
                    <View style={styles.formWrapper}>
                        {/* <Autocomplete
                        listContainerStyle={styles.selectList}
                        inputContainerStyle={styles.selectInput}
                        renderTextInput={(props) => <TextInput
                            {...props}
                            label="Select Product"
                        />}
                        data={(products.length === 1 && products[0].name === query) ? [] : products}
                        value={query ?? ""}
                        onChangeText={(t) => { setHideResult(false); setQuery(t); }}
                        hideResults={hideResult}
                        flatListProps={{
                            style: styles.selectListItems,
                            keyExtractor: (_, idx) => idx,
                            renderItem: ({ item }) => <TouchableOpacity onPress={() => {
                                setProductId(item.id);
                                setQuery(item.name);
                                setHideResult(true);
                            }}>
                                <Text style={styles.selectItemTxt} >{item.name}</Text>
                            </TouchableOpacity>,
                        }}
                    /> */}
                        <Text style={styles.heading}>{translate(appLanguage, `Select Categories`)}</Text>

                        <Mpicker
                            selectedValue={selectedCategories}
                            onValueChange={(val, idx) => {
                                setselectedCategories(val)
                                if(idx===0)return
                                setProductList([])
                            }}
                            mode="dropdown"
                        >
                            <Picker.Item label={translate(appLanguage, `Select`)} value={""} />
                            {categories?.map((c) => <Picker.Item label={c} value={c} />)}
                        </Mpicker>
                        <Text style={[styles.heading,{marginTop:20}]}> {translate(appLanguage, `Select Product`)}</Text>
                        <Mpicker
                            selectedValue={product}
                            onValueChange={(val, idx) => {
                                setProduct(val)
                                if(idx===0)return
                                setUnit(productList[idx-1]?.unit)
                                setCategory(productList[idx-1]?.category_name)
                            }}
                            mode="dropdown"
                        >
                            {productList.length != 0 && getItem()}
                        </Mpicker>
                        <TextInput
                            label={`${translate(appLanguage, "Minimum Price")} (₹100)`}
                            value={priceLow}
                            dataDetectorTypes={"phoneNumber"}
                            keyboardType={"numeric"}
                            onChangeText={(t) => setPriceLow(t)}
                        />
                        <TextInput
                            label={`${translate(appLanguage, "Maximum Price")}  (₹10000)`}
                            value={priceHigh}
                            dataDetectorTypes={"phoneNumber"}
                            keyboardType={"numeric"}
                            onChangeText={(t) => setPriceHigh(t)}
                        />
                        <TextInput
                            label={translate(appLanguage, "Stock")}
                            value={stock}
                            dataDetectorTypes={"phoneNumber"}
                            keyboardType={"numeric"}
                            onChangeText={(t) => setStock(t)}
                        />
                        <TextInput
                            label={`${translate(appLanguage, "Unit")} (kg,gm,litre,etc)`}
                            value={unit}
                            disabled={true}
                            onChangeText={(t) => setUnit(t)}
                        />
                   { category &&    <TextInput
                            label={`${translate(appLanguage, "Category")}`}
                            value={category}
                            disabled={true}
                            onChangeText={(t) => setCategory(t)}
                        />}

                        {/* <Picker
                        selectedValue={status}
                        onValueChange={(itemValue, itemIndex) =>
                            setStatus(itemValue)
                        }
                        wrapperStyle={
                            styles.pickerWrapper
                        }
                        pickerStyle={styles.picker}
                    >
                        <Picker.Item label="Select Status" value=""
                            enabled={false} />
                        <Picker.Item label="Active" value="Active" />
                        <Picker.Item label="Inactive" value="Inactive" />
                    </Picker> */}
                        <MButton title={translate(appLanguage, "Save")} mode="contained" onPress={() => {
                            addProduct({ product_id: product, quantity: stock, unit, low_price: priceLow, high_price: priceHigh });
                            setProduct(""); setUnit(""); setStock(""); setPriceLow(""); setPriceHigh("");
                        }} />
                    </View>
                )}
                {userProfileData?.data?.is_approved == 0 && <InfoCard message={"Dear user, your account is not approved yet. You can add products after account approval. Please try later."} />}
            </ScrollView>
            {(isLoading || loading || isFetching || postLoading || userLoading || userIsFetching) && (<Loader visible={true} />)}
            {isError !== "" && (<ModalMessage visible={true} handleClick={handleError} error={true} errorMsg={isError} />)}
            <ReactQueryDevtools initialIsOpen />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    heading: {
        color: appConstant.themeSecondaryColor,
        fontWeight: "700",
        fontSize: 19
    },
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
    }
});
