import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import appConstant from "../../config/constants";
import {useSelector} from "react-redux";
import {userType} from "../../_slice/authSlice";

function CustomTab(props) {
    const { state, descriptors, navigation} = props;
    const focusedOptions = descriptors[state.routes[state.index].key].options;
    if (focusedOptions.tabBarVisible === false) {
        return null;
    }
    const usertype = useSelector(userType);
    return (
        <View style={styles.tabWrapper}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                        ? options.title
                        : route.name;
                const Icon = options.tabBarIcon;
                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}

                        onPress={onPress}
                        key={options.tabBarTestID}
                        onLongPress={onLongPress}
                        style={[styles.tabItemWrapper, usertype === "supplier"?(index === 2 ? styles.centerItem:""):styles.tabBlock]}
                    >
                        {Icon({focused:isFocused, color:"#fff", size:10})}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

export default CustomTab;

const styles = StyleSheet.create({
    tabWrapper:{
        flexDirection: 'row',
        justifyContent: "space-around",
        backgroundColor:"#fff",
        padding: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.39,
        shadowRadius: 8.30,
        elevation: 13,
    },
    tabItemWrapper:{
        alignSelf:"center",
    },
    tabItemIcon:{

    },
    centerItem:{
        // position:"absolute",
        justifyContent: "center",
        alignItems:"center",
        // top:-10,
        // bottom:0,
        // right:0,
        // left:0,
        backgroundColor: appConstant.themePrimaryColor,
        width: 50,
        height:50,
        borderRadius:50,
    },
    tabBlock:{
        width: 50,
        height:50,
        alignItems: "center",
        justifyContent:"center"
    }
});
