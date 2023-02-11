import * as React from 'react';
import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import appConstant from "config/constants";
import Loader from "components/Loader";

export default function InstamojoWebView(props) {

  const { uri } = props.route.params;
  const [loading, setLoading] = React.useState(false);

  const handleWebViewNavigationStateChange = (newNavState) => {
    const { url } = newNavState;
    if (!url) return;

    if (url.includes(appConstant.appUrl)) {
      if (url.includes('status=Credit')) {
        if (url.includes('course=')) {
          let id = url.split("course=").pop().split("&expires=")[0];
          setTimeout(() => {
            props.navigation.navigate('Training', { screen: 'TrainingDetail',params:{ id, success: true } });
            // props.navigation.navigate('CourseDetail', { id, success: true })
          }, 3000);

        }
      } else {
        props.navigation.navigate('Training', { screen: 'TrainingDetail',params:{ error: true } });
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