import * as React from 'react';
import { View, StyleSheet, Image, Text } from "react-native";
import NotApproved from 'assets/card/info.jpg';
import NotFound from 'assets/card/empty.jpg';
import appConstant from "config/constants";

export default function Header(props) {
    const image = props.type==="notFound"?NotFound:NotApproved;
    return (
        <View style={[styles.card,{paddingBottom:props?.pb}]}>
            <Image style={[styles.cardImg,{width:props?.imgSize??100,height:props?.imgSize??100}]} source={image} />
            <Text style={styles.cardTxt}>{props.message}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        flex:1,
        alignItems:"center",
        justifyContent:"center",
    },
    cardImg: {
        width:100,
        height:100,
        resizeMode:"cover"
    },
    cardTxt: {
        width:"70%",
        textAlign:"center",
        fontFamily:appConstant.baseFontFamily,
        lineHeight:20
    },
});