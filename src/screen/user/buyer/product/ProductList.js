import * as React from 'react';
import { FlatList, SafeAreaView, View, StyleSheet } from "react-native";
import appConstant from "config/constants";
import { StatusBar } from "expo-status-bar";
import Item from "components/Product/Item";
import { fetchAllProducts } from 'services/product';
import Loader from "components/Loader";
import { useToast } from "react-native-toast-notifications";

export default function ProductList({ navigation }) {

    const [products, setProducts] = React.useState([]);
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
    }, [data]);


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
            <View style={styles.main}>
                <FlatList
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
                />
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
});
