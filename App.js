import React from 'react';
import { LogBox } from "react-native";
import { Provider } from 'react-redux';
import store from 'store';
import Root from "srcroot/Root";
import { NetworkProvider } from 'react-native-offline';
import { connectToDevTools } from "react-devtools-core";
import appConstant from 'config/constants';

if (appConstant.environment == "development") {
  connectToDevTools({
    host: "localhost",
    port: 8097,
  });
}

export default function App({ navigation }) {
        LogBox.ignoreAllLogs(true);
        return (
                <NetworkProvider>
                        <Provider store={store}>
                                <Root/>
                        </Provider>
                </NetworkProvider>

        );
}
