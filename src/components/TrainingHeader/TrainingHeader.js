import * as React from 'react';
import { StyleSheet, View, } from "react-native";
import { Appbar} from 'react-native-paper';
import { useSelector } from "react-redux";
import { translate } from '../../languageFeature'


export default function Header(props) {

    const { appLanguage } = useSelector(state => state.auth)
    const { scene, navigation, previous } = props;
    const showMenu = props.showMenu === undefined ? true : props.showMenu;

    const headerTitle = scene?.descriptor?.options?.headerTitle
    return (
        <View style={styles.headerView}>
            {previous ? <Appbar.BackAction onPress={navigation.goBack} /> : (showMenu && <Appbar.Action icon="menu" onPress={() => navigation.toggleDrawer()} />)}
            <Appbar.Content title={headerTitle ? translate(appLanguage, `${headerTitle}`) : ""} />
        </View>
    )
}

const styles = StyleSheet.create({
    badgeIconWrapper: {
        width: 40,
    },
    headerView: {
        padding: 0
    },
    badgeIcon: {
        backgroundColor: "white",
    },
    badgeCount: {
        position: "absolute",
        right: 0,
        top: -5
    },
    noShadow: {
        elevation: 0,
    },
});