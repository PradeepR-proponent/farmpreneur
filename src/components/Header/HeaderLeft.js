import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {SimpleLineIcons} from "@expo/vector-icons";
import appConstant from "../../config/constants";

const HeaderLeft = ({scene}) =>{
    return(
        <TouchableOpacity onPress={()=> scene.descriptor.navigation.toggleDrawer} style={{marginLeft:10}}>
            <SimpleLineIcons name="menu" size={20} color={appConstant.themePrimaryColor}/>
        </TouchableOpacity>
    );
}

export default HeaderLeft;
