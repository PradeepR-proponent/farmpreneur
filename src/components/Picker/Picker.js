import React from 'react';
import {Picker} from "@react-native-picker/picker";
import {View,StyleSheet} from "react-native";
import {AntDesign} from "@expo/vector-icons";
import appConstant from "../../config/constants";

const Mpicker  = (props) =>{
    return(
        <View style={[styles.pickerWrapper,props.wrapperStyle]}>
            <Picker
                {...props}
                style={[styles.picker,props.pickerStyle]}
                itemStyle={styles.pickerItem}
                dropdownIconColor="#ffffff"
            >
                {props.children}
            </Picker>
            <View style={styles.pickerIcon}>
                <AntDesign name="downcircleo" size={24} color={appConstant.themePrimaryColor} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    pickerWrapper:{
        overflow: 'hidden',
        backgroundColor:appConstant.themePrimaryLightColor,
        borderRadius:10,
        padding:0
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 3,
        // },
        // shadowOpacity: 0.29,
        // shadowRadius: 4.65,

        // elevation: 7,
    },
    pickerIcon:{
        position: "absolute",
        top:13,
        right:12,
        bottom:0
    },
    picker: {

    },
    pickerItem: {
        fontWeight:"700",
    }
});

export default Mpicker;

Mpicker.defaultProps = {
    wrapperStyle:{},
    pickerStyle:{}
}
