import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import appConstant from "../../config/constants";
import {AntDesign} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function ImagePickerOptions(props) {
    const options = [
        {
            title: 'Take Photo',
            type: 'capture',
            options: {
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                quality: 1,
            },
        },
        {
            title: 'Choose Photo',
            type: 'library',
            options: {
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                quality: 1,
            },
        },
    ]
    return (
        <View style={styles.btnWrapper}>
            {options.map(({title,type,options})=>{
                return (<TouchableOpacity style={[styles.btnItem,type !== 'capture' ?styles.borderLeft:'']} onPress={()=>{props.handlePickerOptions(type,options)}}>
                    {type === 'capture' ? (<AntDesign name="camera" size={24} color="white"/>):(<AntDesign name="picture" size={24} color="white" />)}
                    <Text style={styles.btnTxt}>{title}</Text>
                </TouchableOpacity>)
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    btnWrapper:{
        position:"absolute",
        bottom:0,
        backgroundColor:appConstant.themeSecondaryColor,
        width:"100%",
        flex:1,
        flexDirection:"row",
        justifyContent:"space-evenly"
    },
    btnItem:{
        padding:20,
        flexDirection: "row",
        alignItems:"center",
        justifyContent: "center"
    },
    btnTxt:{
        marginLeft:5,
        color:"#ffffff"
    },
    borderLeft:{
        borderLeftWidth:1,
        borderLeftColor:"#ffffff"
    }
});

