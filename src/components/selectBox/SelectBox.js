import React, { useState } from 'react'
import {
    Button,
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    Pressable,
    Linking,
    View
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import appConstant from '../../config/constants';
import SelectDropdown from 'react-native-select-dropdown'


const SelectBox = ({ options, setSelected, defaultvalue }) => {


    return (
        <View style={styles.selectBox} >
            <SelectDropdown
                data={options}
                defaultValue={defaultvalue}
                onSelect={(selectedItem, index) => {
                    setSelected(selectedItem)
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                    // text represented after item is selected
                    // if data array is an array of objects then return selectedItem.property to render after item is selected
                    return selectedItem
                }}
                rowTextForSelection={(item, index) => {
                    // text represented for each item in dropdown
                    // if data array is an array of objects then return item.property to represent item in dropdown
                    return item
                }}
                searchInputStyle={styles.inputs}
                rowTextStyle={{ fontSize: 12 }}
                buttonTextStyle={{ fontSize: 12, margin: 0, padding: 0 }}
                buttonStyle={{ padding: 0, height: 30, borderWidth: 1, borderRadius: 5, borderColor: "lightgray" }}
                renderDropdownIcon={() => <AntDesign name='down' />}
                dropdownStyle={{ top: 0, margin: 0, padding: 0 }}
            />

        </View>
    )
}

export default SelectBox


const styles = StyleSheet.create({
    selectBox: {
    },
    inputs: {
        borderWidth: 1
    }

})