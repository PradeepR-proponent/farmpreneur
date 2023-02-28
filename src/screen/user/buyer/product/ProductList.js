import * as React from 'react';
import { FlatList, SafeAreaView, View, StyleSheet } from "react-native";
import appConstant from "config/constants";
import { StatusBar } from "expo-status-bar";
import Item from "components/Product/Item";
import { fetchAllProducts } from 'services/product';
import Loader from "components/Loader";
import { useToast } from "react-native-toast-notifications";
import { Picker } from "@react-native-picker/picker";
import { AntDesign } from "@expo/vector-icons";



export default function ProductList({ navigation }) {

    const [products, setProducts] = React.useState([]);
    const [categories, setCategories] = React.useState([]);
    const [selectedCategories, setSelectedCategories] = React.useState("All");
    const toast = useToast();

    function handleProductClick(id) {
        if (id)
            navigation.navigate('BuyerProductStack', { screen: 'ProductDetail', params: { id }, });
    }


    //fetch prodcuts
    const { isLoading: loading, error, data, isFetching, refetch } = fetchAllProducts();
    if (error) toast.show(error.message, { type: "danger", duration: 10000 });

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            refetch()
        });
        return unsubscribe;
    }, [navigation]);

    React.useEffect(() => {
        setProducts(data?.data);
        if (data?.data) {
            setCategories(["All",...new Set(data?.data.map((p) => p.category_name))])
        }
    }, [data]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
            <View style={[styles.pickerWrapper]}>
                <Picker
                    selectedValue={selectedCategories}
                    style={[styles.picker]}
                    itemStyle={styles.pickerItem}
                    dropdownIconColor="#ffffff"
                    onValueChange={(itemValue) =>
                        setSelectedCategories(itemValue)
                    }
                    mode="dropdown"
                >
                    {categories.map((c) => <Picker.Item label={c} value={c} />)}
                </Picker>
                <View style={styles.pickerIcon}>
                    <AntDesign name="downcircleo" size={24} color={appConstant.themePrimaryColor} />
                </View>
            </View>
            <View style={styles.main}>

                <FlatList
                    keyExtractor={(item) => item.name}
                    data={products}
                    onRefresh={refetch}
                    refreshing={loading}
                    renderItem={({ item }) => {
                        if (selectedCategories === item.category_name) {
                            return (
                                <Item name={item?.name} description={item?.description} price={item?.price}
                                    image={{ uri: item?.default_image?.image_url }} handleClick={() => { handleProductClick(item?.id) }} unit={item?.unit} />
                            );
                        } else return null
                    }}
                />
                {selectedCategories === "All" && <FlatList
                    keyExtractor={(item) => item.name}
                    data={products}
                    onRefresh={refetch}
                    refreshing={loading}
                    renderItem={({ item }) => {
                        return (
                            <Item name={item?.name} description={item?.description} price={item?.price}
                                image={{ uri: item?.default_image?.image_url }} handleClick={() => { handleProductClick(item?.id) }} unit={item?.unit} />
                        );

                    }}
                />}
            </View>
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
    pickerWrapper: {
        margin: 20,
        overflow: 'hidden',
        backgroundColor: appConstant.themePrimaryLightColor,
        borderRadius: 10,
        padding: 0
    },
    pickerIcon: {
        position: "absolute",
        top: 13,
        right: 12,
        bottom: 0
    },
    picker: {

    },
    pickerItem: {
        fontWeight: "700",
    }
});
