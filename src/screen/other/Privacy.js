import * as React from 'react';
import { StyleSheet } from "react-native";
import { WebView } from 'react-native-webview';
import Loader from "components/Loader";
import appConstant from 'config/constants';

export default function Privacy(props) {

    const uri = appConstant.privacyUrl;
    const [loading, setLoading] = React.useState(false);

    const handleWebViewNavigationStateChange = (newNavState) => {
        const { url } = newNavState;
        if (!url) return;
    };

    return (
        <>
            <WebView
                style={styles.container}
                source={{ uri }}
                javaScriptEnabled
                domStorageEnabled
                allowFileAccessFromFileURLs
                startInLoadingState
                originWhitelist={['*']}
                mixedContentMode="compatibility"
                onNavigationStateChange={handleWebViewNavigationStateChange}
                onLoadEnd={() => {
                    setLoading(false);
                }}
                onLoadStart={() => {
                    setLoading(true);
                }}
            />
            {loading && (<Loader visible={true} />)}
        </>
    );
}
const styles = StyleSheet.create({
    container: {}
});


