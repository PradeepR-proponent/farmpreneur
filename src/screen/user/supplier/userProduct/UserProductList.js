import * as React from 'react';
import { FlatList, SafeAreaView, View, StyleSheet,Pressable,Image,Text } from "react-native";
import appConstant from "config/constants";
import { StatusBar } from "expo-status-bar";
// import Item from "components/Product/Item";
import { fetchAllProducts } from 'services/userProduct';
import Loader from "components/Loader";
import { useToast } from "react-native-toast-notifications";
import InfoCard from "components/Card/InfoCard";

export default function ProductList(props) {
    const [products, setProducts] = React.useState([]);
    const toast = useToast();
    const { navigation } = props;

    function handleProductClick(id) {
        if (id)
            props.navigation.navigate('UserProductEdit', { id });
    }

    //fetch prodcuts
    const { isLoading: loading, error, data, isFetching, refetch } = fetchAllProducts();
    //show fetch and create status
    if (error) toast.show(error.message, { type: "danger", duration: 2000 });

    React.useEffect(() => {
        setProducts(data?.data);
    }, [data]);

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            refetch()
        });
        return unsubscribe;
    }, [navigation]);

    const Item = (props) => {
        return (
            <Pressable style={styles.itemWrapper} onPress={() => {
                props.handleClick();
            }}>
                <View style={styles.itemImgWrapper}>
                    <Image source={props.image} style={styles.itemImg} />
                </View>
                <View style={styles.itemDetails}>
                    <Text style={styles.itemTitle}>{props.name}</Text>
                    {props.tags !== undefined && (<Text style={styles.itemTags} numberOfLines={3} >{props.tags}</Text>)}
                    {props.description !== undefined && (<Text style={styles.itemTags} numberOfLines={3} >{props.description}</Text>)}
                    {props.rating !== undefined && (<View style={styles.itemRating}>
                        {fetchRatings(props.rating)}
                    </View>)}
                    <View style={styles.itemInfo}>
                        <View style={styles.itemPriceWrapper}>
                            <Text style={styles.itemPriceTxt}><Text style={styles.itemPrice}>{props.price}</Text></Text>
                        </View>
                        {props.quantity === undefined && (<View style={styles.itemAddCartWrapper}>
                        </View>)}
                        {props.quantity !== undefined && (<View style={styles.itemAddCartWrapper}>
                            <Text style={styles.itemCount}>{props.quantity}{props.unit}</Text>
                        </View>)}

                    </View>
                </View>
            </Pressable >
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor={appConstant.statusBarColor} />
            <View style={styles.main}>
                {data?.data?.length != 0 && <FlatList
                    keyExtractor={(item) => item.id}
                    data={products}
                    onRefresh={refetch}
                    refreshing={loading}
                    renderItem={({ item }) => {
                        return (
                            <Item name={item?.product?.name} description={item?.product?.description} price={`₹ ${item?.low_price} - ₹ ${item?.high_price}`}
                                image={{ uri: item?.product?.default_image?.image_url }} handleClick={() => { handleProductClick(item.id) }} quantity={item?.quantity} />
                        );
                    }}
                />}
                {data?.data?.length == 0 && <InfoCard type={"notFound"} message={"No products found. Please check later"} />}
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
    itemWrapper: {
        flexDirection: "row",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
        backgroundColor: "#ffffff",
        margin: 20,
        marginBottom: 10,
        borderRadius:10,
        overflow:"hidden"
    },
    itemImgWrapper: {
        width: "40%",
    },
    itemImg: {
        width: 130,
        height: 140,
        resizeMode:"cover"
    },
    itemDetails: {
        width: "50%",
        flexGrow: 1,
        padding: 10
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
        width: "60%"
    },
    itemPriceTxt: {
        fontFamily: appConstant.baseFontFamily,
        fontSize: 14
    },
    itemPrice: {
        fontFamily: appConstant.productBoldFamily,
        fontSize: 14
    },
    itemAddCartWrapper: {
        flexDirection: "row",
        width: "60%",
        justifyContent: "space-evenly"
    },
    itemTitle: {
        fontFamily: appConstant.productBoldFamily,
        fontSize: 16,
        marginBottom: 7
    },
    itemTags: {
        fontFamily: appConstant.baseFontFamily,
        fontSize: 12
    },
    itemCount: {
        fontSize: 14
    }
});
