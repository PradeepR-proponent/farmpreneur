import React from 'react';
import { AntDesign } from "@expo/vector-icons";
import appConstant from "../../config/constants";
import { Pressable, View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import Rating from "../Rating/Rating";
const Item = (props) => {

    const fetchRatings = (rating) => {
        let ratingView = [];
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
                ratingView.push(<Rating name="star" key={i} />);
            }
            else {
                ratingView.push(<Rating name="staro" key={i} />);
            }
        }
        return ratingView;
    }

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
                        <Text style={styles.itemPriceTxt}>₹ <Text style={styles.itemPrice}>{props.price}</Text></Text>
                    </View>
                    
                    {props.quantity !== undefined && (<View style={styles.itemAddCartWrapper}>
                        <Text style={styles.itemCount}>{props.quantity}{props.unit}</Text>
                    </View>)}

                </View>
            </View>
        </Pressable >
    );
}

const styles = StyleSheet.create({
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
        width: "40%"
    },
    itemPriceTxt: {
        fontFamily: appConstant.baseFontFamily,
        fontSize: 16
    },
    itemPrice: {
        fontFamily: appConstant.productBoldFamily,
        fontSize: 16
    },
    itemAddCartWrapper: {
        flexDirection: "row",
        width: "60%",
        justifyContent: "space-evenly"
    },
    itemTitle: {
        fontFamily: appConstant.productBoldFamily,
        fontSize: 20,
        marginBottom: 7
    },
    itemTags: {
        fontFamily: appConstant.baseFontFamily,
        fontSize: 12
    },
    itemCount: {
        fontSize: 18
    }
});

export default Item;
