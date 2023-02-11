import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';
import { StyleSheet, View, Text } from "react-native";
import appConstant from '../../config/constants';
import DashedLine from 'react-native-dashed-line';

const TxtInput = (props) => {
    const [focus, setFocus] = useState(false);
    return (
        <View style={styles.textWrapper}>
            <TextInput
                {...props}
                label={<Text style={[styles.textLabel, { color: (focus || props.value != "") ? appConstant.themePrimaryColor : appConstant.themeSecondaryColor }]}>{props.label}</Text>}
                underlineColor={appConstant.themeSecondaryColor}
                activeUnderlineColor={appConstant.themeSecondaryColor}
                style={styles.textInput}
                onFocus={() => { setFocus(true) }}
                onBlur={() => { setFocus(false) }}
                theme={{ colors: { primary: appConstant.themeSecondaryColor } }}
            />
            {/* <DashedLine dashLength={4} dashColor={appConstant.themeSecondaryColor} /> */}
        </View>
    );
}

const styles = StyleSheet.create({
    textInput: {
        backgroundColor: "transparent",
        marginBottom: 0,
        paddingHorizontal: -1,
        borderWidth: 0,
        color: "red"
    },
    textLabel: {
        fontWeight: "700",
        fontSize: 19
    }
});

export default TxtInput;
