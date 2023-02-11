import React from 'react';
import {AntDesign} from "@expo/vector-icons";
import appConstant from "../../config/constants";
import {View,StyleSheet} from "react-native";
const Rating = (props) =>{
    return(
        <View style={styles.rating}>
            <AntDesign size={7} color={appConstant.themePrimaryColor} {...props}/>
        </View>
    );
}

const styles = StyleSheet.create({
    rating:{
        marginRight:4
    }
});

export default Rating;
