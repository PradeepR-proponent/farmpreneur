import * as React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import appConstant from "config/constants";
import Loader from "components/Loader";

export default function SubsWebview(props) {
  const { uri } = props.route.params;
  const [loading, setLoading] = React.useState(false);

  const handleWebViewNavigationStateChange = (newNavState) => {
    const { url } = newNavState;
    if (!url) return;

    if (url.includes(appConstant.appUrl)) {
      if (url.includes('status=Credit')) {
        setTimeout(() => {
          props.navigation.navigate('MembershipScreen', { success: true });
        }, 3000);
      } else {
        props.navigation.navigate('MembershipScreen', { success: false });
      }
    }
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