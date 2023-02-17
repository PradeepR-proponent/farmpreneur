import * as React from 'react';
import { useWindowDimensions } from "react-native";
import RenderHtml from 'react-native-render-html';
import appConstant from "config/constants";

const HTMLText = (props) => {
    const { width } = useWindowDimensions();
    return (
        <RenderHtml
            contentWidth={width}
            source={{ html: props?.description }}
            tagsStyles={tagStyles}
        />
    );
}

const tagStyles = {
    p: {
        fontSize: 16,
        color: appConstant.textSecondaryColor,
        marginVertical: 10,
        lineHeight: 20,
    },
    a:{
        fontSize: 18,
        color: appConstant.themeSecondaryColor,
        textDecorationLine:"none",
        marginVertical: 10,
        lineHeight: 22,
    }
}

export default HTMLText;