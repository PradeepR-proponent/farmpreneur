import React from 'react';
import appConstant from "../../config/constants";
import {Button, TextInput} from 'react-native-paper';
import {StyleSheet} from "react-native";

const CustomButton = (props) =>{
    return(
        <Button {...props} style={[styles.btnItem, {...props.style}]} labelStyle={[styles.btnText,{...props.textStyle}]}>
            {props.title}
        </Button>
    );
}

const styles = StyleSheet.create({
    btnItem: {
        width: "50%",
        marginVertical: 20,
        backgroundColor: appConstant.themeSecondaryColor,
        alignSelf: "center",
        borderRadius:0
    },
    btnText: {
        fontSize: 15,
        color: "#fff",
        fontFamily: appConstant.baseFontFamily,
    },
});

export default CustomButton;
